import { GoogleGenAI, Type } from "@google/genai";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { Paper, ResearchParameter, MappingResult, ReviewSummary, ChatMessage, MappingModel } from "../types";

async function getCache(id: string, paramsHash?: string) {
  try {
    const queryParams = new URLSearchParams({ id });
    if (paramsHash) queryParams.append('paramsHash', paramsHash);
    const res = await fetch(`/api/cache/item?${queryParams.toString()}`);
    if (res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await res.json();
      }
    }
  } catch (e) {
    // Silent catch for network/cache fetch errors during startup or transient states
  }
  return null;
}

async function saveCache(data: any) {
  try {
    const res = await fetch("/api/cache", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const err = await res.json();
        console.warn("Cache save failed:", err.error || res.statusText);
      }
    }
  } catch (e) {
    console.warn("Cache save network error:", e);
  }
}

function getParametersHash(parameters: ResearchParameter[]) {
  return btoa(parameters.map(p => `${p.id}:${p.name}`).sort().join('|'));
}

function getApiKey() {
  // Check if process is defined (it won't be in the browser without a polyfill)
  // We use specific string literals so Vite's 'define' can replace them if configured.
  const envKey = process.env.GEMINI_API_KEY;
  const fallbackKey = process.env.API_KEY;
  
  const key = envKey || fallbackKey || "";
  return key.trim();
}

async function withRetry<T>(fn: () => Promise<T>, maxRetries: number = 7): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const errorMessage = (error?.message || '').toLowerCase();
      
      // Handle 401 specifically to provide a better message
      if (error?.status === 401 || errorMessage.includes('401') || errorMessage.includes('unauthenticated') || errorMessage.includes('invalid authentication')) {
        throw new Error("Gemini API Authentication Failed (401). Please ensure your API key is valid and has access to the model. If you are using a restricted model, you may need to select a paid API key in the settings.");
      }

      // Handle 400 specifically
      if (error?.status === 400 || errorMessage.includes('400') || errorMessage.includes('invalid argument')) {
        // Special case: If Gemini says "no pages", it might be a transient ingestion corruption or a specific file structure issue
        if (errorMessage.includes('no pages') && i < maxRetries - 1) {
          const delay = Math.pow(2, i) * 3000 + Math.random() * 1000;
          console.warn(`Gemini reported "no pages", possibly corrupted stream. Retrying in ${Math.round(delay)}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw new Error(`Gemini API Invalid Argument (400). This often happens if the file is too large, corrupted, or the model doesn't support the format. Details: ${error.message}`);
      }

      const isRateLimit = 
        error?.status === 429 || 
        errorMessage.includes('429') || 
        errorMessage.includes('rate limit') ||
        errorMessage.includes('quota exceeded') ||
        errorMessage.includes('exceeded quota') ||
        errorMessage.includes('too many requests') ||
        errorMessage.includes('resource_exhausted') ||
        errorMessage.includes('resource exhausted');

      const isTransientError = 
        error?.status === 500 || 
        error?.status === 502 || 
        error?.status === 503 || 
        error?.status === 504 ||
        errorMessage.includes('rpc failed') ||
        errorMessage.includes('xhr error') ||
        errorMessage.includes('proxy error') ||
        errorMessage.includes('internal error') ||
        errorMessage.includes('deadline exceeded');
      
      if ((isRateLimit || isTransientError) && i < maxRetries - 1) {
        // Exponential backoff with jitter: 5s, 10s, 20s, 40s, 80s...
        const delay = Math.pow(2, i) * 5000 + Math.random() * 2000;
        const apiName = errorMessage.includes('github') ? 'GitHub' : 'AI';
        const errorType = isRateLimit ? 'rate limit or quota hit' : 'transient RPC/network error';
        console.warn(`${apiName} ${errorType}, retrying in ${Math.round(delay)}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

function safeJsonParse(text: string): any {
  try {
    // Clean the text: remove potential markdown code blocks and leading/trailing whitespace
    const cleanedText = text.replace(/^```json\s*/, '').replace(/```$/, '').trim();
    
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : cleanedText;
    
    try {
      return JSON.parse(jsonString);
    } catch (parseError) {
      // If it's a truncation error, we might be able to partially fix it by adding missing braces
      console.warn("JSON parse failed, attempting to clean string...", parseError);
      
      // Simple fix for common truncation: ensure it ends with }
      if (!jsonString.endsWith('}')) {
        const fixedJson = jsonString + '}';
        try {
          return JSON.parse(fixedJson);
        } catch (e2) {
          // If it still fails, try to close an array if it looks like it's inside one
          if (!jsonString.endsWith(']}')) {
            const fixedJsonArray = jsonString + ']}';
            try {
              return JSON.parse(fixedJsonArray);
            } catch (e3) {
              throw parseError; // Rethrow original error if fix failed
            }
          }
          throw parseError;
        }
      } else {
        throw parseError;
      }
    }
  } catch (e) {
    console.error("Failed to parse JSON response", e);
    return {};
  }
}

export async function mapPaperToParameters(
  paper: Paper, 
  parameters: ResearchParameter[],
  model: MappingModel = 'gemini-3.8-flash',
  apiKeys: { openai?: string, anthropic?: string } = {}
): Promise<{ 
  paperId: string, 
  mappings: MappingResult[], 
  doi?: string, 
  bibtex?: string, 
  title?: string,
  findings?: string,
  result?: string,
  graphId?: string,
  isRelevant: boolean,
  relevanceReason?: string,
  markdownContent?: string,
  keyFindings?: string,
  tokenUsage: { promptTokens: number, candidatesTokens: number, totalTokens: number }
}> {
  const effectiveModel = (model === 'gemini-3-flash-preview' || !model) ? 'gemini-3.8-flash' : model;
  const paramsHash = getParametersHash(parameters);
  const cached = await getCache(paper.id, paramsHash);
  
  let existingMappings: MappingResult[] = [];
  let cachedMarkdown = "";
  let cachedIsRelevant = true;
  let cachedRelevanceReason = "";
  let cachedTitle = paper.title;
  let cachedDoi = "";
  let cachedBibtex = "";
  let cachedKeyFindings = "";
  let cachedFindings = "";
  let cachedResult = "";
  let cachedGraphId = "";

  if (cached) {
    try {
      existingMappings = typeof cached.mappings === 'string' ? JSON.parse(cached.mappings) : (cached.mappings || []);
      cachedMarkdown = cached.markdown_content || "";
      cachedIsRelevant = cached.is_relevant === 1 || cached.is_relevant === true;
      cachedRelevanceReason = cached.relevance_reason || "";
      cachedTitle = cached.title || paper.title;
      cachedDoi = cached.doi || "";
      cachedBibtex = cached.bibtex || "";
      cachedKeyFindings = cached.key_findings || "";
      cachedFindings = cached.findings || "";
      cachedResult = cached.result || "";
      cachedGraphId = cached.graph_id || "";
    } catch (e) {
      console.error("Failed to parse cached data", e);
    }
    
    // Check if all requested parameters are already in the cache
    const missingParameters = parameters.filter(p => !existingMappings.some(m => m.parameterId === p.id));
    
    if (missingParameters.length === 0) {
      return {
        paperId: paper.id,
        mappings: existingMappings.filter(m => parameters.some(p => p.id === m.parameterId)),
        doi: cachedDoi,
        bibtex: cachedBibtex,
        title: cachedTitle,
        findings: cachedFindings,
        result: cachedResult,
        graphId: cachedGraphId,
        isRelevant: cachedIsRelevant,
        relevanceReason: cachedRelevanceReason,
        markdownContent: cachedMarkdown,
        keyFindings: cachedKeyFindings,
        tokenUsage: { promptTokens: 0, candidatesTokens: 0, totalTokens: 0 }
      };
    }
    
    // If we have some mappings but not all, we continue with only the missing ones
    parameters = missingParameters;
  }

  let tokenUsage = { promptTokens: 0, candidatesTokens: 0, totalTokens: 0 };
  let initialData: any = {
    isRelevant: cachedIsRelevant,
    relevanceReason: cachedRelevanceReason,
    markdownContent: cachedMarkdown,
    keyFindings: cachedKeyFindings,
    findings: cachedFindings,
    result: cachedResult,
    graphId: cachedGraphId,
    title: cachedTitle,
    doi: cachedDoi,
    bibtex: cachedBibtex,
    mappings: []
  };

  // STEP 1: Gemini analysis (via server-side proxy route first, fallback to client)
  if (effectiveModel.startsWith('gemini')) {
    let handledByServer = false;
    try {
      const serverRes = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paper,
          parameters,
          model: effectiveModel
        })
      });

      if (serverRes.ok) {
        const serverData = await serverRes.json();
        initialData = { ...initialData, ...serverData };
        if (serverData.tokenUsage) {
          tokenUsage = serverData.tokenUsage;
        }
        handledByServer = true;
      }
    } catch (serverErr) {
      console.warn("[Client] /api/gemini/analyze proxy failed, falling back to direct GenAI call:", serverErr);
    }

    if (!handledByServer) {
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error("Gemini API Key is missing. Please check your environment variables or select an API key.");
      }
      const ai = new GoogleGenAI({ apiKey });
      const extractionPrompt = `
        Analyze the following document for a Systematic Literature Review on Space Architecture.
        TASK 1: RELEVANCE CHECK (space habitat construction, ISRU, space materials, extreme robotics)
        TASK 2: MARKDOWN CONVERSION (clean, structured Markdown)
        TASK 3: KEY FINDINGS SUMMARY (2-3 sentences)
        TASK 4: METADATA (DOI, BibTeX, full Title)
        TASK 5: STRUCTURED FINDINGS (findings, result)
        TASK 6: GRAPH ID (Year_Author_Publisher_Letter)
        TASK 7: PARAMETER MAPPING:
        ${parameters.map(p => `- ID: ${p.id}, Name: ${p.name}, Description: ${p.description}`).join('\n')}
      `;

      const cleanBase64 = paper.content.replace(/^data:.*,/, '').replace(/[^A-Za-z0-9+/=]/g, '');
      const isTextFile = paper.mimeType.startsWith('text/') || paper.mimeType === 'application/json';
      const parts: any[] = [{ text: extractionPrompt }];
      
      if (isTextFile) {
        try {
          let decodedText = decodeURIComponent(escape(atob(cleanBase64)));
          if (decodedText.length > 150000) {
            decodedText = decodedText.slice(0, 110000) + '\n\n[... truncated ...]\n\n' + decodedText.slice(-40000);
          }
          parts.push({ text: `Document Content:\n\n${decodedText}` });
        } catch (e) {
          parts.push({ inlineData: { mimeType: paper.mimeType, data: cleanBase64 } });
        }
      } else {
        parts.push({ inlineData: { mimeType: paper.mimeType, data: cleanBase64 } });
      }

      const response = await withRetry(() => ai.models.generateContent({
        model: effectiveModel,
        contents: { parts },
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isRelevant: { type: Type.BOOLEAN },
              relevanceReason: { type: Type.STRING },
              markdownContent: { type: Type.STRING },
              keyFindings: { type: Type.STRING },
              findings: { type: Type.STRING },
              result: { type: Type.STRING },
              graphId: { type: Type.STRING },
              title: { type: Type.STRING },
              doi: { type: Type.STRING },
              bibtex: { type: Type.STRING },
              mappings: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    parameterId: { type: Type.STRING },
                    value: { type: Type.STRING },
                    evidence: { type: Type.STRING },
                    confidence: { type: Type.NUMBER }
                  },
                  required: ["parameterId", "value", "evidence"]
                }
              }
            },
            required: ["isRelevant", "relevanceReason", "markdownContent", "keyFindings", "findings", "result", "graphId", "title"]
          }
        }
      }));

      const usage = response.usageMetadata || { promptTokenCount: 0, candidatesTokenCount: 0, totalTokenCount: 0 };
      tokenUsage.promptTokens += usage.promptTokenCount;
      tokenUsage.candidatesTokens += usage.candidatesTokenCount;
      tokenUsage.totalTokens += usage.totalTokenCount;

      const extracted = safeJsonParse(response.text || "{}");
      initialData = { ...initialData, ...extracted };
    }
  }

  // STEP 2: If using another model for mapping and paper is relevant, use the Markdown content
  if (!model.startsWith('gemini') && initialData.isRelevant && parameters.length > 0) {
    const mappingPrompt = `
      Map the following research paper (in Markdown) against the provided parameters for a Systematic Literature Review.
      
      Parameters:
      ${parameters.map(p => `- ID: ${p.id}, Name: ${p.name}, Description: ${p.description}`).join('\n')}

      MAPPING RULES:
      1. Multiple Choice: If a paper fits multiple categories for a parameter, provide them as a comma-separated list.
      2. Grouping: Avoid creating new groups. Map to the most relevant existing group provided in the description. Avoid groups with only a few entries by merging them into a more general category if appropriate.
      3. Research & Publication Types: Strictly follow the provided framework where Publication Types are nested under Research Types (Primary, Secondary, Tertiary).
      4. Case-Insensitivity: Treat "Mars" and "mars" as the same.
      5. "Other": Only use "Other" if the paper absolutely does not fit any other category. Prefer merging into a similar existing category if possible.

      Document Content:
      ${initialData.markdownContent}

      RESPONSE FORMAT:
      You MUST return a valid JSON object:
      {
        "mappings": [
          {
            "parameterId": "string",
            "value": "string",
            "evidence": "string",
            "confidence": number
          }
        ]
      }
    `;

    if (model === 'gpt-4o') {
      const openai = new OpenAI({ apiKey: apiKeys.openai, dangerouslyAllowBrowser: true });
      const response = await withRetry(() => openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a research assistant specializing in Space Architecture." },
          { role: "user", content: mappingPrompt }
        ],
        response_format: { type: "json_object" }
      }));

      const mapped = safeJsonParse(response.choices[0].message.content || "{}");
      initialData.mappings = [...(initialData.mappings || []), ...(mapped.mappings || [])];
      tokenUsage.promptTokens += response.usage?.prompt_tokens || 0;
      tokenUsage.candidatesTokens += response.usage?.completion_tokens || 0;
      tokenUsage.totalTokens += response.usage?.total_tokens || 0;
    } else if (model === 'claude-3-5-sonnet-latest') {
      const anthropic = new Anthropic({ apiKey: apiKeys.anthropic, dangerouslyAllowBrowser: true });
      const response = await withRetry(() => anthropic.messages.create({
        model: "claude-3-5-sonnet-latest",
        max_tokens: 4096,
        messages: [{ role: "user", content: mappingPrompt }]
      }));

      const text = response.content[0].type === 'text' ? response.content[0].text : '';
      const mapped = safeJsonParse(text || "{}");
      initialData.mappings = [...(initialData.mappings || []), ...(mapped.mappings || [])];
      tokenUsage.promptTokens += response.usage.input_tokens;
      tokenUsage.candidatesTokens += response.usage.output_tokens;
      tokenUsage.totalTokens += response.usage.input_tokens + response.usage.output_tokens;
    }
  }

  if (Object.keys(initialData).length === 0) {
    throw new Error("Failed to analyze paper: AI response was empty or invalid.");
  }
  
  if (!initialData.isRelevant) {
    await saveCache({
      id: paper.id,
      title: initialData.title || cachedTitle,
      doi: initialData.doi || cachedDoi,
      bibtex: initialData.bibtex || cachedBibtex,
      mappings: existingMappings,
      isRelevant: false,
      relevanceReason: initialData.relevanceReason,
      markdownContent: initialData.markdownContent || cachedMarkdown,
      keyFindings: initialData.keyFindings || cachedKeyFindings,
      findings: initialData.findings || cachedFindings,
      result: initialData.result || cachedResult,
      graphId: initialData.graphId || cachedGraphId,
      paramsHash
    });

    return {
      paperId: paper.id,
      mappings: existingMappings,
      isRelevant: false,
      relevanceReason: initialData.relevanceReason,
      tokenUsage
    };
  }

  const newMappings = (initialData.mappings || []).map((r: any) => ({ ...r, paperId: paper.id, verified: true }));
  
  // Combine existing with new mappings, avoiding duplicates
  const combinedMappings = [...existingMappings];
  newMappings.forEach((nm: any) => {
    const existingIndex = combinedMappings.findIndex(em => em.parameterId === nm.parameterId);
    if (existingIndex >= 0) {
      combinedMappings[existingIndex] = nm;
    } else {
      combinedMappings.push(nm);
    }
  });

  await saveCache({
    id: paper.id,
    title: initialData.title || cachedTitle,
    doi: initialData.doi || cachedDoi,
    bibtex: initialData.bibtex || cachedBibtex,
    mappings: combinedMappings,
    isRelevant: true,
    relevanceReason: initialData.relevanceReason || cachedRelevanceReason,
    markdownContent: initialData.markdownContent || cachedMarkdown,
    keyFindings: initialData.keyFindings || cachedKeyFindings,
    findings: initialData.findings || cachedFindings,
    result: initialData.result || cachedResult,
    graphId: initialData.graphId || cachedGraphId,
    paramsHash
  });

  return { 
    paperId: paper.id, 
    mappings: combinedMappings, 
    doi: initialData.doi || cachedDoi, 
    bibtex: initialData.bibtex || cachedBibtex, 
    title: initialData.title || cachedTitle,
    findings: initialData.findings || cachedFindings,
    result: initialData.result || cachedResult,
    graphId: initialData.graphId || cachedGraphId,
    isRelevant: true,
    relevanceReason: initialData.relevanceReason || cachedRelevanceReason,
    markdownContent: initialData.markdownContent || cachedMarkdown,
    keyFindings: initialData.keyFindings || cachedKeyFindings,
    tokenUsage
  };
}

export async function synthesizeReview(papers: Paper[], mappings: MappingResult[], parameters: ResearchParameter[]): Promise<ReviewSummary> {
  const startTime = performance.now();
  const relevantPapers = papers.filter(p => p.isRelevant !== false && p.status !== 'failed');
  const irrelevantCount = papers.filter(p => p.isRelevant === false && p.status !== 'failed').length;
  const failedCount = papers.filter(p => p.status === 'failed').length;

  // 1. Try server-side synthesis route first
  try {
    const serverRes = await fetch('/api/gemini/synthesize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        papers: relevantPapers,
        mappings,
        parameters,
        model: 'gemini-flash-latest'
      })
    });

    if (serverRes.ok) {
      const serverData = await serverRes.json();
      const endTime = performance.now();
      return {
        ...serverData,
        chartData: {
          ...serverData.chartData,
          relevance: {
            relevant: relevantPapers.length,
            irrelevant: irrelevantCount,
            failed: failedCount
          }
        },
        performance: {
          totalTimeMs: 0,
          mappingTimeMs: 0,
          synthesisTimeMs: Math.round(endTime - startTime),
          paperCount: papers.length,
          tokenUsage: serverData.tokenUsage || { promptTokens: 0, candidatesTokens: 0, totalTokens: 0 }
        }
      };
    }
  } catch (err) {
    console.warn("[Client] /api/gemini/synthesize failed, using client fallback:", err);
  }

  // 2. Client-side fallback with compact payload and gemini-3.8-flash
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please check your environment variables or select an API key.");
  }
  const ai = new GoogleGenAI({ apiKey });

  // Compact mappings: avoid ballooning token count with thousands of lines of raw evidence
  const compactMappings = mappings.map(m => ({
    paperId: m.paperId,
    parameterId: m.parameterId,
    value: m.value,
    evidenceSnippet: typeof m.evidence === 'string' ? m.evidence.slice(0, 100) : ''
  }));

  const compactPapers = relevantPapers.map(p => ({
    id: p.id,
    title: p.title,
    doi: p.doi || '',
    keyFindings: typeof p.keyFindings === 'string' ? p.keyFindings.slice(0, 300) : ''
  }));

  const prompt = `
    You are a research synthesis agent for Systematic Literature Reviews (SLR) on Construction Methods in Extraterrestrial Environments.
    Based on the mapping results of ${relevantPapers.length} relevant papers (out of ${papers.length - failedCount} analyzed papers, total ${papers.length} documents), generate a systematic literature review summary.

    CRITICAL SCIENTIFIC RIGOR GUIDELINES:
    1. ACCURATE COUNT: State clearly that this review synthesizes findings from EXACTLY ${relevantPapers.length} relevant research papers.
    2. EVIDENCE-BASED: Base all distributions and trends strictly on the provided mappings.
    3. DATA STANDARDIZATION & GROUPING:
       - Treat case variations like "Mars" and "mars" as identical.
       - Group values into the categories specified in the parameter definitions.
       - Handle comma-separated values by counting each category.
    4. VISUALIZATIONS:
       Generate chart distributions for:
       - "Year of Publication": type "bar"
       - "Research Type": type "pie"
       - "Publication Type": type "bar"
       - "Research Foci": type "treemap"
       - "Application Scenario": type "bar"
       - "Application Location": type "radar"
       - "Habitat Class": type "pie"
       - "Technology for Class III Habitat": type "bar"

    Paper Metadata: ${JSON.stringify(compactPapers)}
    Mappings: ${JSON.stringify(compactMappings)}
    Parameters: ${JSON.stringify(parameters)}
  `;

  const response = await withRetry(() => ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overview: { type: Type.STRING },
          keyFindings: { type: Type.STRING },
          methodologyTrends: { type: Type.STRING },
          technologyClass3: { type: Type.STRING, description: "Detailed analysis of technologies for Class III habitats based on the mapping data." },
          chartAnalysis: { type: Type.STRING, description: "Detailed analysis and interpretation of the generated charts and trends." },
          chartData: {
            type: Type.OBJECT,
            properties: {
              distributions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    parameterName: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ["pie", "bar", "radar", "treemap"] },
                    data: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          value: { type: Type.NUMBER }
                        },
                        required: ["name", "value"]
                      }
                    }
                  },
                  required: ["parameterName", "type", "data"]
                }
              },
              heatmaps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    parameterName: { type: Type.STRING },
                    data: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          x: { type: Type.STRING },
                          y: { type: Type.STRING },
                          value: { type: Type.NUMBER }
                        },
                        required: ["x", "y", "value"]
                      }
                    }
                  },
                  required: ["parameterName", "data"]
                }
              }
            },
            required: ["distributions", "heatmaps"]
          }
        },
        required: ["overview", "keyFindings", "methodologyTrends", "technologyClass3", "chartAnalysis", "chartData"]
      }
    }
  }));

  const usage = response.usageMetadata || { promptTokenCount: 0, candidatesTokenCount: 0, totalTokenCount: 0 };
  const endTime = performance.now();
  const data = safeJsonParse(response.text || "{}");
  
  if (!data.overview || !data.chartData) {
    console.error("Failed to parse Gemini response for synthesis", response.text);
    throw new Error("The AI generated an incomplete or invalid summary. Please try again.");
  }
  
  return {
    ...data,
    chartData: {
      ...data.chartData,
      relevance: {
        relevant: relevantPapers.length,
        irrelevant: irrelevantCount,
        failed: failedCount
      }
    },
    performance: {
      totalTimeMs: 0,
      mappingTimeMs: 0,
      synthesisTimeMs: Math.round(endTime - startTime),
      paperCount: papers.length,
      tokenUsage: {
        promptTokens: usage.promptTokenCount,
        candidatesTokens: usage.candidatesTokenCount,
        totalTokens: usage.totalTokenCount
      }
    }
  };
}

export async function chatWithReview(question: string, context: { papers: Paper[], mappings: MappingResult[], summary: ReviewSummary }): Promise<ChatMessage> {
  const startTime = performance.now();

  // 1. Try server-side chat route first
  try {
    const serverRes = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        context,
        model: 'gemini-3.8-flash'
      })
    });

    if (serverRes.ok) {
      const serverData = await serverRes.json();
      const endTime = performance.now();
      return {
        role: 'assistant',
        content: serverData.content || "",
        performance: {
          executionTimeMs: Math.round(endTime - startTime),
          tokenUsage: { promptTokens: 0, candidatesTokens: 0, totalTokens: 0 }
        }
      };
    }
  } catch (err) {
    console.warn("[Client] /api/gemini/chat failed, using client fallback:", err);
  }

  // 2. Client-side fallback with compact knowledge base & gemini-3.8-flash
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please check your environment variables or select an API key.");
  }
  const ai = new GoogleGenAI({ apiKey });
  
  const relevantPapers = context.papers.filter(p => p.isRelevant !== false);
  
  const compactPaperLookup = relevantPapers.map(p => {
    const paperMappings = context.mappings
      .filter(m => m.paperId === p.id)
      .map(m => {
        const val = Array.isArray(m.value) ? m.value.join(', ') : String(m.value || '');
        return `${m.parameterId}: ${val}`;
      });

    return {
      title: p.title,
      doi: p.doi || 'N/A',
      keyFindings: typeof p.keyFindings === 'string' ? p.keyFindings.slice(0, 200) : '',
      parameters: paperMappings
    };
  });

  const systemInstruction = `You are a research assistant specializing in Space Architecture and Systematic Literature Reviews. 
Your goal is to provide accurate, evidence-based answers based ONLY on the provided Mapping Data and Review Summary.

CRITICAL GUIDELINES:
1. ONLY use information from the provided Mapping Data (Key Findings, Results, Relationships, and Charts).
2. If the answer is not in the context, explicitly state that the information is not available in the current mapping data.
3. CITATION FORMAT: You MUST cite every claim using the format: "[Paper Title] (DOI: [DOI Number])". If DOI is missing, cite as "[Paper Title]".
4. DO NOT use Paper IDs in your final response.
5. Be precise and academic in your tone.`;

  const contextMessage = `
Literature Review Context:
- Overview: ${context.summary.overview}
- Synthesis Key Findings: ${context.summary.keyFindings}
- Methodology Trends: ${context.summary.methodologyTrends}
- Class III Habitat Technology: ${context.summary.technologyClass3 || 'N/A'}

Analyzed Papers (${relevantPapers.length} papers):
${JSON.stringify(compactPaperLookup, null, 2)}

User Question: ${question}
  `;

  const response = await withRetry(() => ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: contextMessage,
    config: {
      systemInstruction
    }
  }));

  const usage = response.usageMetadata || { promptTokenCount: 0, candidatesTokenCount: 0, totalTokenCount: 0 };
  const endTime = performance.now();
  
  return {
    role: 'assistant',
    content: response.text || "",
    performance: {
      executionTimeMs: Math.round(endTime - startTime),
      tokenUsage: {
        promptTokens: usage.promptTokenCount,
        candidatesTokens: usage.candidatesTokenCount,
        totalTokens: usage.totalTokenCount
      }
    }
  };
}
