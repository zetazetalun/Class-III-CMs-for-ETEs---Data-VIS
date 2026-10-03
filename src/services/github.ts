import { Paper } from "../types";
import { convertDocxToText, isWordDocument } from "../lib/documentProcessor";

async function parseError(response: Response): Promise<string> {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      const errorData = await response.json();
      return errorData.error || response.statusText;
    } catch {
      return response.statusText;
    }
  } else {
    try {
      const text = await response.text();
      return text.substring(0, 150) || response.statusText;
    } catch {
      return response.statusText;
    }
  }
}

export async function fetchRepoContent(owner: string, repo: string, path: string = "", ref?: string): Promise<Paper[]> {
  const queryParams = new URLSearchParams({ owner, repo, path, t: Date.now().toString() });
  if (ref) {
    queryParams.append('ref', ref);
  }

  const response = await fetch(`/api/github/fetch?${queryParams.toString()}`);
  if (!response.ok) {
    const errorMsg = await parseError(response);
    throw new Error(errorMsg || `Failed to fetch repository content: ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error(`Expected JSON response from GitHub fetch, got ${contentType || 'unknown'}`);
  }

  const data = await response.json();
  // If it's a single file, wrap it in an array
  const files = Array.isArray(data) ? data : [data];
  
  const results: Paper[] = [];
  const CONCURRENCY_LIMIT = 5;

  const processFile = async (file: any): Promise<Paper | null> => {
    if (file.type !== 'file') return null;
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    const supportedExtensions = ['pdf', 'md', 'txt', 'docx', 'doc', 'html', 'htm'];
    if (!supportedExtensions.includes(ext || '')) return null;

    try {
      if (file.size > 20 * 1024 * 1024) {
        throw new Error(`File ${file.name} is too large (${(file.size / 1024 / 1024).toFixed(2)} MB). GitHub/Gemini may have trouble processing files > 20MB via this route.`);
      }

      const blobParams = new URLSearchParams({ owner, repo, sha: file.sha, t: Date.now().toString() });
      const blobResponse = await fetch(`/api/github/blob?${blobParams.toString()}`);
      
      if (!blobResponse.ok) {
        throw new Error(`Blob fetch failed (Status ${blobResponse.status}) for ${file.path}`);
      }
      
      const blobData = await blobResponse.json();
      const rawContent = blobData.content;
      
      if (!rawContent || rawContent.trim() === '') {
        throw new Error(`Fetched content is empty for ${file.path}. Please verify the file in GitHub.`);
      }

      let mimeType = 'text/plain';
      let content = rawContent;

      if (ext === 'pdf') {
        mimeType = 'application/pdf';
      } else if (isWordDocument(file.name)) {
        try {
          const text = await convertDocxToText(rawContent);
          if (!text || text.trim() === '') {
            throw new Error(`DOCX conversion resulted in empty text for ${file.name}`);
          }
          content = btoa(unescape(encodeURIComponent(text)));
          mimeType = 'text/plain';
        } catch (e) {
          throw new Error(`Conversion failed for ${file.name}: ${e instanceof Error ? e.message : 'Unknown error'}`);
        }
      } else if (ext === 'doc') {
        throw new Error(`Unsupported format (.doc) for ${file.name}. Please convert to .docx.`);
      } else if (ext === 'html' || ext === 'htm') {
        mimeType = 'text/html';
      }
      
      return {
        id: file.path, // Use path as unique ID to prevent duplicate key issues with identical content
        title: file.name,
        content: content,
        url: file.html_url,
        path: file.path,
        mimeType: mimeType
      };
    } catch (e) {
      if (e instanceof Error) {
        console.warn(`Skipping file ${file.path}: ${e.message}`);
      } else {
        console.error(`GITHUB_FETCH_ERROR: File ${file.path} failed:`, e);
      }
      // Skip the file and return null for any error, preventing the entire batch from failing
      return null;
    }
  };

  // Process in batches
  for (let i = 0; i < files.length; i += CONCURRENCY_LIMIT) {
    const batch = files.slice(i, i + CONCURRENCY_LIMIT);
    const batchResults = await Promise.all(batch.map(file => processFile(file)));
    batchResults.forEach(res => {
      if (res) results.push(res);
    });
  }
  
  return results;
}

export async function saveMarkdownToRepo(owner: string, repo: string, path: string, content: string, branch?: string): Promise<void> {
  try {
    // First, check if the file exists to get its SHA
    const queryParams = new URLSearchParams({ owner, repo, path });
    if (branch) queryParams.append('ref', branch);
    
    let sha: string | undefined;
    try {
      const checkRes = await fetch(`/api/github/fetch?${queryParams.toString()}`);
      if (checkRes.ok) {
        const data = await checkRes.json();
        if (!Array.isArray(data)) {
          sha = data.sha;
        }
      }
    } catch (e) {
      // File probably doesn't exist yet, which is fine
    }

    const bytes = new TextEncoder().encode(content);
    const base64Content = btoa(Array.from(bytes).map(b => String.fromCharCode(b)).join(''));

    const response = await fetch('/api/github/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        owner,
        repo,
        path,
        message: `Archive markdown for ${path.split('/').pop()}`,
        content: base64Content,
        sha,
        branch
      })
    });

    if (!response.ok) {
      const errorMsg = await parseError(response);
      throw new Error(errorMsg || response.statusText);
    }
  } catch (error) {
    console.error(`Error saving markdown to GitHub for ${path}:`, error);
    throw error;
  }
}

export async function saveAnalysisStateToRepo(
  owner: string, 
  repo: string, 
  papers: Paper[], 
  mappings: any[], 
  summary: any,
  branch?: string
): Promise<void> {
  const state = {
    papers: papers.map(p => ({ ...p, content: '' })), // Strip content for state file
    mappings,
    summary,
    updatedAt: new Date().toISOString()
  };
  
  const content = JSON.stringify(state, null, 2);
  const path = 'analysis_state.json';
  
  try {
    // Check if exists
    const queryParams = new URLSearchParams({ owner, repo, path });
    if (branch) queryParams.append('ref', branch);
    
    let sha: string | undefined;
    try {
      const checkRes = await fetch(`/api/github/fetch?${queryParams.toString()}`);
      if (checkRes.ok) {
        const data = await checkRes.json();
        if (!Array.isArray(data)) sha = data.sha;
      }
    } catch (e) {}

    const bytes = new TextEncoder().encode(content);
    const base64Content = btoa(Array.from(bytes).map(b => String.fromCharCode(b)).join(''));

    const response = await fetch('/api/github/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        owner,
        repo,
        path,
        message: 'Update SLR analysis state archive',
        content: base64Content,
        sha,
        branch
      })
    });

    if (!response.ok) {
      const errorMsg = await parseError(response);
      throw new Error(errorMsg || response.statusText);
    }
  } catch (error) {
    console.warn("Error saving state to GitHub (non-fatal):", error);
  }
}

export async function fetchAnalysisStateFromRepo(owner: string, repo: string, branch?: string): Promise<any> {
  const path = 'analysis_state.json';
  const queryParams = new URLSearchParams({ owner, repo, path });
  if (branch) queryParams.append('ref', branch);

  const response = await fetch(`/api/github/fetch?${queryParams.toString()}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    const errorMsg = await parseError(response);
    throw new Error(errorMsg || `Failed to fetch state: ${response.statusText}`);
  }

  const fileData = await response.json();
  const blobParams = new URLSearchParams({ owner, repo, sha: fileData.sha });
  const blobResponse = await fetch(`/api/github/blob?${blobParams.toString()}`);
  if (!blobResponse.ok) throw new Error("Failed to fetch state blob");
  
  const blobData = await blobResponse.json();
  // Safe decode base64 - remove potential whitespace/newlines from GitHub's response
  const decoded = atob(blobData.content.replace(/\s/g, ''));
  // Handle UTF-8
  const bytes = new Uint8Array(decoded.length);
  for (let i = 0; i < decoded.length; i++) bytes[i] = decoded.charCodeAt(i);
  const text = new TextDecoder().decode(bytes);
  
  return JSON.parse(text);
}
