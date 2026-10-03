import { GoogleGenAI, Type } from "@google/genai";
import { ResearchParameter, Paper, MappingResult, ReviewSummary } from "../src/types";

function getGeminiClient(customApiKey?: string) {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing on server.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

function isTruncationError(err: any): boolean {
  const msg = (err?.message || '').toLowerCase();
  return (
    msg.includes('cannot truncate') ||
    msg.includes('required') ||
    msg.includes('89998') ||
    msg.includes('too large') ||
    (msg.includes('invalid_argument') && msg.includes('truncate'))
  );
}

const analyzeSchema = {
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
  required: [
    "isRelevant",
    "relevanceReason",
    "markdownContent",
    "keyFindings",
    "findings",
    "result",
    "graphId",
    "title"
  ]
};

async function executeWithModelFallback<T>(
  preferredModel: string,
  fn: (model: string) => Promise<T>
): Promise<T> {
  const normalized = preferredModel === 'gemini-3-flash-preview' ? 'gemini-flash-latest' : (preferredModel || 'gemini-flash-latest');
  const modelsToTry = [
    normalized,
    'gemini-3.1-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-flash-latest',
    'gemini-3.6-flash',
    'gemini-3.8-flash',
    'gemini-pro-latest'
  ].filter((m, i, arr) => m && arr.indexOf(m) === i);

  let lastError: any = null;
  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i];
    try {
      return await fn(model);
    } catch (err: any) {
      lastError = err;
      const msg = (err?.message || '').toLowerCase();
      const isRetryable =
        msg.includes('503') ||
        msg.includes('unavailable') ||
        msg.includes('high demand') ||
        msg.includes('429') ||
        msg.includes('rate limit') ||
        isTruncationError(err);

      if (isRetryable && i < modelsToTry.length - 1) {
        console.warn(`[Gemini Server] Model ${model} encountered issue (${err.message.slice(0, 80)}). Trying fallback ${modelsToTry[i + 1]}...`);
        await new Promise(res => setTimeout(res, 600));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

export async function serverAnalyzePaper(
  paper: Paper,
  parameters: ResearchParameter[],
  requestedModel: string = 'gemini-flash-latest',
  customApiKey?: string
) {
  const ai = getGeminiClient(customApiKey);

  const extractionPrompt = `
    You are an expert scientific literature analyst for Systematic Literature Reviews (SLR).
    Your task is to analyze this document, extract key metadata, synthesize it into clean Markdown, extract core findings, and map it against target parameters.

    Document Title/Filename: ${paper.title}

    CRITICAL INSTRUCTIONS:
    1. RELEVANCE CHECK: Determine if this paper is relevant to "Construction Methods in Extraterrestrial Environments" (e.g., lunar/martian habitats, ISRU, regolith construction, automated manufacturing in space).
       - Set 'isRelevant' to true if it discusses construction, habitats, ISRU, materials, or structural design for Moon/Mars/Space.
       - If completely unrelated, set 'isRelevant' to false and explain why in 'relevanceReason'.
    2. MARKDOWN EXTRACTION: Convert the document content into clean, structured Markdown (including Title, Abstract, Key Sections, and Conclusion).
    3. CORE FINDINGS EXTRACTION:
       - 'keyFindings': 2-3 sentence executive summary of the paper's core contribution.
       - 'findings': Comprehensive paragraph detailing scientific findings, experimental data, or design innovations.
       - 'result': Precise outcome, conclusions, and quantitative performance metrics.
       - 'graphId': A clean identifier for knowledge graph indexing (e.g., "Paper_Year_Author").
    4. PARAMETER MAPPING: Map the document against each parameter:
       ${parameters.map(p => `- Parameter ID: "${p.id}", Name: "${p.name}"\n  Description & Guidelines:\n  ${p.description}`).join('\n')}

    For each mapped parameter, provide:
    - parameterId: Exact ID from the list above.
    - value: The extracted value or classification matching the guidelines. If truly not mentioned, output "Not specified".
    - evidence: Concise exact excerpt from the text justifying this mapping (max 200 words).
    - confidence: Score between 0.0 and 1.0.
  `;

  const cleanBase64 = (paper.content || '').replace(/^data:.*,/, '').replace(/[^A-Za-z0-9+/=]/g, '');
  const isTextFile = (paper.mimeType || '').startsWith('text/') || paper.mimeType === 'application/json';

  const parts: any[] = [{ text: extractionPrompt }];

  if (isTextFile) {
    let decodedText = '';
    try {
      decodedText = Buffer.from(cleanBase64, 'base64').toString('utf-8');
    } catch (_) {
      decodedText = paper.content || '';
    }

    // Guard against excessive text size (safe ceiling: 150,000 characters)
    if (decodedText.length > 150000) {
      const head = decodedText.slice(0, 110000);
      const tail = decodedText.slice(-40000);
      decodedText = `${head}\n\n[... content truncated for processing efficiency ...]\n\n${tail}`;
    }
    parts.push({ text: `Document Content:\n\n${decodedText}` });
  } else {
    parts.push({
      inlineData: {
        mimeType: paper.mimeType || 'application/pdf',
        data: cleanBase64
      }
    });
  }

  const runCall = async (modelToUse: string) => {
    try {
      return await ai.models.generateContent({
        model: modelToUse,
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: analyzeSchema as any
        }
      });
    } catch (err: any) {
      const msg = (err?.message || '').toLowerCase();
      if (msg.includes('503') || msg.includes('unavailable') || msg.includes('high demand')) {
        console.warn(`[Gemini Server] Schema constraint busy for ${modelToUse}, falling back to prompt JSON...`);
        return await ai.models.generateContent({
          model: modelToUse,
          contents: { parts },
          config: {
            responseMimeType: "application/json"
          }
        });
      }
      throw err;
    }
  };

  const response = await executeWithModelFallback(requestedModel, runCall);

  const usage = response.usageMetadata || { promptTokenCount: 0, candidatesTokenCount: 0, totalTokenCount: 0 };
  let extracted: any = {};
  try {
    extracted = JSON.parse(response.text || "{}");
  } catch (parseErr) {
    console.error("[Gemini Server] Failed to parse JSON from model output:", response.text);
    extracted = {};
  }

  return {
    ...extracted,
    tokenUsage: {
      promptTokens: usage.promptTokenCount || 0,
      candidatesTokens: usage.candidatesTokenCount || 0,
      totalTokens: usage.totalTokenCount || 0
    }
  };
}

const synthesizeSchema = {
  type: Type.OBJECT,
  properties: {
    overview: { type: Type.STRING },
    keyFindings: { type: Type.STRING },
    methodologyTrends: { type: Type.STRING },
    technologyClass3: { type: Type.STRING },
    chartData: {
      type: Type.OBJECT,
      properties: {
        distributions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              parameterId: { type: Type.STRING },
              parameterName: { type: Type.STRING },
              chartType: { type: Type.STRING },
              data: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    count: { type: Type.NUMBER },
                    percentage: { type: Type.NUMBER },
                    details: { type: Type.STRING },
                    paperIds: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["name", "count", "percentage"]
                }
              }
            },
            required: ["parameterId", "parameterName", "chartType", "data"]
          }
        },
        crossTabulations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              param1: { type: Type.STRING },
              param2: { type: Type.STRING },
              matrix: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    row: { type: Type.STRING },
                    col: { type: Type.STRING },
                    count: { type: Type.NUMBER }
                  },
                  required: ["row", "col", "count"]
                }
              }
            },
            required: ["param1", "param2", "matrix"]
          }
        }
      },
      required: ["distributions", "crossTabulations"]
    }
  },
  required: ["overview", "keyFindings", "methodologyTrends", "technologyClass3", "chartData"]
};

export async function serverSynthesizeReview(
  papers: Paper[],
  mappings: MappingResult[],
  parameters: ResearchParameter[],
  requestedModel: string = 'gemini-flash-latest',
  customApiKey?: string
) {
  const ai = getGeminiClient(customApiKey);

  const relevantPapers = papers.filter(p => p.isRelevant !== false && p.status !== 'failed');
  const failedCount = papers.filter(p => p.status === 'failed').length;

  // COMPACT mappings to prevent blowing up the context window!
  // We only send the essential mapping tuple: paperId, parameterId, value, and at most 100 chars of evidence snippet.
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

  const runCall = async (modelToUse: string) => {
    try {
      return await ai.models.generateContent({
        model: modelToUse,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: synthesizeSchema as any
        }
      });
    } catch (err: any) {
      const msg = (err?.message || '').toLowerCase();
      if (msg.includes('503') || msg.includes('unavailable') || msg.includes('high demand')) {
        console.warn(`[Gemini Server] Synthesis schema busy for ${modelToUse}, falling back to prompt JSON...`);
        return await ai.models.generateContent({
          model: modelToUse,
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });
      }
      throw err;
    }
  };

  const response = await executeWithModelFallback(requestedModel, runCall);

  const usage = response.usageMetadata || { promptTokenCount: 0, candidatesTokenCount: 0, totalTokenCount: 0 };
  let parsed: any = {};
  try {
    parsed = JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("[Gemini Server] Failed to parse synthesis JSON:", e);
    throw new Error("Failed to parse synthesized summary from model.");
  }

  return {
    ...parsed,
    tokenUsage: {
      promptTokens: usage.promptTokenCount || 0,
      candidatesTokens: usage.candidatesTokenCount || 0,
      totalTokens: usage.totalTokenCount || 0
    }
  };
}

export async function serverChatWithReview(
  question: string,
  context: {
    papers: Paper[];
    mappings: MappingResult[];
    summary: ReviewSummary;
  },
  requestedModel: string = 'gemini-flash-latest',
  customApiKey?: string
) {
  const ai = getGeminiClient(customApiKey);

  const relevantPapers = (context.papers || []).filter(p => p.isRelevant !== false && p.status !== 'failed');

  // Compact knowledge base: do not include 100,000s of characters of raw evidence
  const compactPaperLookup = relevantPapers.map(p => {
    const paperMappings = (context.mappings || [])
      .filter(m => m.paperId === p.id)
      .map(m => {
        const valStr = Array.isArray(m.value) ? m.value.join(', ') : String(m.value || '');
        return `${m.parameterId}: ${valStr}`;
      });

    return {
      title: p.title,
      doi: p.doi || 'N/A',
      keyFindings: typeof p.keyFindings === 'string' ? p.keyFindings.slice(0, 200) : '',
      parameters: paperMappings
    };
  });

  const systemInstruction = `
You are an expert scientific research assistant for a Systematic Literature Review on Construction Methods in Extraterrestrial Environments.
Your role is to answer questions strictly grounded in the synthesized review findings and the mapped paper database.

Academic Citation Guidelines:
1. Whenever you reference findings, concepts, or statistics, explicitly cite the relevant paper in this exact format:
   "[Paper Title] (DOI: [DOI Number])"
   If DOI is not available, cite as "[Paper Title]".
2. Only make claims that are supported by the provided knowledge base context.
3. Be direct, authoritative, and scientifically rigorous.
  `;

  const contextMessage = `
Literature Review Context:
- Overview: ${context.summary?.overview || 'N/A'}
- Synthesis Key Findings: ${context.summary?.keyFindings || 'N/A'}
- Methodology Trends: ${context.summary?.methodologyTrends || 'N/A'}
- Class III Habitat Technology: ${context.summary?.technologyClass3 || 'N/A'}

Analyzed Papers & Mappings (${relevantPapers.length} papers):
${JSON.stringify(compactPaperLookup, null, 2)}

User Question: ${question}
  `;

  const runCall = async (modelToUse: string) => {
    return await ai.models.generateContent({
      model: modelToUse,
      contents: contextMessage,
      config: {
        systemInstruction
      }
    });
  };

  const response = await executeWithModelFallback(requestedModel, runCall);

  return {
    role: 'assistant' as const,
    content: response.text || "No response generated."
  };
}
