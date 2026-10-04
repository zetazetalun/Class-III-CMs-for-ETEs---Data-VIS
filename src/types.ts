export type MappingModel = 'gemini-flash-latest' | 'gemini-3.6-flash' | 'gemini-3.8-flash' | 'gemini-3.1-pro-preview' | 'gemini-3-flash-preview' | 'gpt-4o' | 'claude-3-5-sonnet-latest';

export interface ResearchParameter {
  id: string;
  name: string;
  description: string;
}

export interface Paper {
  id: string;
  title: string;
  content: string;
  url: string;
  path: string;
  mimeType: string;
  doi?: string;
  bibtex?: string;
  isRelevant?: boolean;
  relevanceReason?: string;
  markdownContent?: string;
  keyFindings?: string;
  findings?: string;
  result?: string;
  graphId?: string;
  status?: 'success' | 'failed' | 'pending' | 'fetching';
}

export interface MappingResult {
  paperId: string;
  parameterId: string;
  value: any;
  evidence: string;
  confidence?: number;
  verified?: boolean;
}

export interface GraphNode {
  id: string;
  name: string;
  type: 'publication' | 'parameter' | 'value' | 'findings' | 'result';
  category: string;
  group: number;
  details?: string;
  paperId?: string;
  paramId?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  paperId?: string;
  weight?: number;
}

export interface GraphDatabaseState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodesCount?: number;
  edgesCount?: number;
  lastUpdated?: string;
}

export interface AgentState {
  status: 'idle' | 'fetching' | 'mapping' | 'synthesizing' | 'error' | 'restoring';
  message: string;
  progress: number;
}

export interface HeatmapData {
  parameterName: string; // The parameter being compared with Habitat Class
  data: { x: string; y: string; value: number }[];
}

export interface ReviewSummary {
  overview: string;
  keyFindings: string;
  methodologyTrends: string;
  technologyClass3?: string;
  chartAnalysis?: string;
  mappingModel?: MappingModel;
  chartData: {
    distributions: {
      parameterName: string;
      data: { name: string; value: number }[];
      type: 'pie' | 'bar' | 'radar' | 'treemap';
    }[];
    heatmaps?: HeatmapData[];
    relevance?: {
      relevant: number;
      irrelevant: number;
      failed?: number;
    };
  };
  metadata?: {
    appVersion: string;
    generationDate: string;
    sourceUrl?: string;
    sourceRef?: string;
  };
  performance?: {
    totalTimeMs: number;
    mappingTimeMs: number;
    synthesisTimeMs: number;
    paperCount: number;
    tokenUsage?: {
      promptTokens: number;
      candidatesTokens: number;
      totalTokens: number;
    };
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  performance?: {
    executionTimeMs: number;
    tokens?: number;
    tokenUsage?: {
      promptTokens: number;
      candidatesTokens: number;
      totalTokens: number;
    };
  };
}

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey?: () => Promise<boolean>;
      openSelectKey?: () => Promise<void>;
    };
    process: {
      env: {
        GEMINI_API_KEY?: string;
        API_KEY?: string;
        [key: string]: string | undefined;
      };
    };
  }
}
