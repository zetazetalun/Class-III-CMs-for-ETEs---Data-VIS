import { Paper } from "../types";
import { convertDocxToText, isWordDocument } from "../lib/documentProcessor";

export async function fetchLocalFiles(folderPath: string): Promise<Paper[]> {
  const CONCURRENCY_LIMIT = 5;
  
  try {
    const queryParams = new URLSearchParams({ folderPath });
    const response = await fetch(`/api/files/list?${queryParams.toString()}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to fetch local files: ${response.statusText}`);
    }
    
    const files = await response.json();
    const results: Paper[] = [];

    const processFile = async (file: any): Promise<Paper | null> => {
      try {
        const contentResponse = await fetch(`/api/files/content?filePath=${encodeURIComponent(file.path)}`);
        if (!contentResponse.ok) throw new Error(`Content fetch failed for ${file.path}`);
        
        const contentData = await contentResponse.json();
        const rawContent = contentData.content;
        const ext = file.name.split('.').pop()?.toLowerCase();
        
        let mimeType = 'text/plain';
        let content = rawContent;

        if (ext === 'pdf') {
          mimeType = 'application/pdf';
        } else if (isWordDocument(file.name)) {
          try {
            const text = await convertDocxToText(rawContent);
            content = btoa(unescape(encodeURIComponent(text)));
            mimeType = 'text/plain';
          } catch (e) {
            console.error(`Failed to convert ${file.name}`, e);
          }
        } else if (ext === 'doc') {
          mimeType = 'application/msword';
        } else if (ext === 'html' || ext === 'htm') {
          mimeType = 'text/html';
        }
        
        return {
          id: file.path,
          title: file.name,
          content: content,
          url: `file://${file.path}`,
          path: file.path,
          mimeType: mimeType
        };
      } catch (e) {
        console.warn(`Failed to fetch content for ${file.path}, skipping.`, e);
        return null;
      }
    };

    for (let i = 0; i < files.length; i += CONCURRENCY_LIMIT) {
      const batch = files.slice(i, i + CONCURRENCY_LIMIT);
      const batchResults = await Promise.all(batch.map(file => processFile(file)));
      batchResults.forEach(res => {
        if (res) results.push(res);
      });
    }
    
    return results;
  } catch (error) {
    console.error("Error fetching local files:", error);
    throw error;
  }
}

export async function saveMarkdownToLocal(folderPath: string, fileName: string, content: string): Promise<void> {
  try {
    const response = await fetch('/api/files/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        folderPath,
        fileName,
        content
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || response.statusText);
    }
  } catch (error) {
    console.error(`Error saving markdown to local for ${fileName}:`, error);
    throw error;
  }
}

export async function uploadFile(fileName: string, content: string): Promise<void> {
  try {
    const response = await fetch('/api/files/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName, content })
    });
    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.error || response.statusText);
      } else {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response (${response.status}): ${text.substring(0, 100)}...`);
      }
    }
  } catch (error) {
    console.error(`Error uploading file ${fileName}:`, error);
    throw error;
  }
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    const response = await fetch('/api/files/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || response.statusText);
    }
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
    throw error;
  }
}
