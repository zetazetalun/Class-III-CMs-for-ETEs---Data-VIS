import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, 
  Settings, 
  Terminal,
  BarChart3, 
  MessageSquare, 
  Github, 
  Plus, 
  Trash2, 
  Play, 
  Loader2,
  RefreshCw,
  ChevronRight,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  Search,
  X,
  XCircle,
  Copy,
  ExternalLink,
  Share2,
  Cloud,
  Upload,
  Link,
  Layers,
  Globe,
  Sparkles,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResearchParameter, Paper, MappingResult, ReviewSummary, AgentState, ChatMessage, MappingModel } from './types';
import { fetchRepoContent, saveMarkdownToRepo, saveAnalysisStateToRepo, fetchAnalysisStateFromRepo } from './services/github';
import { mapPaperToParameters, synthesizeReview, chatWithReview } from './services/gemini';
import { getDynamicCounts, getDynamicHeatmap, normalizeValue, getPaperMarkdownFilename, getPaperParameterValue } from './lib/normalize';
import ResearchMap from './components/ResearchMap';
import InteractiveChartBuilder from './components/InteractiveChartBuilder';
import KnowledgeGraph from './components/KnowledgeGraph';
import { syncGraphDatabaseToServer, fetchGraphDatabaseFromServer, buildGraphFromAnalysis } from './lib/graphDatabase';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Treemap
} from 'recharts';
import Markdown from 'react-markdown';
import * as XLSX from 'xlsx';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CustomizedTreemapContent = (props: any) => {
  const { root, depth, x, y, width, height, index, colors, name, value } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth < 2 ? colors[index % colors.length] : 'none',
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {depth === 1 ? (
        <text
          x={x + width / 2}
          y={y + height / 2 + 7}
          textAnchor="middle"
          fill="#fff"
          fontSize={10}
          fontWeight="bold"
        >
          {name}
        </text>
      ) : null}
      {depth === 1 ? (
        <text
          x={x + 4}
          y={y + 14}
          fill="#fff"
          fontSize={8}
          fillOpacity={0.6}
        >
          {value}
        </text>
      ) : null}
    </g>
  );
};

const ParameterDefinitions = ({ parameters }: { parameters: ResearchParameter[] }) => {
  return (
    <section className="bg-white p-8 rounded-3xl shadow-sm border border-black/5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
          <FileText size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-black/40">Parameter Definitions</h3>
          <p className="text-xs text-black/60">Reference for research categories and their scope</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-black/5">
              <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-black/40">Parameter</th>
              <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-black/40">Definition / Scope</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {parameters.map(p => (
              <tr key={p.id} className="hover:bg-black/[0.02] transition-colors">
                <td className="py-4 px-4 text-sm font-bold text-black/80 whitespace-nowrap align-top">{p.name}</td>
                <td className="py-4 px-4 text-xs text-black/60 leading-relaxed italic serif prose prose-sm max-w-none prose-p:m-0 prose-ul:my-1 prose-li:m-0">
                  <Markdown>{p.description}</Markdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

// --- Components ---

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const HeatmapChart = ({ parameterName, data }: { parameterName: string, data: { x: string, y: string, value: number }[] }) => {
  const xLabels = Array.from(new Set(data.map(d => d.x))).sort();
  const yLabels = Array.from(new Set(data.map(d => d.y))).sort();
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-black/40">Habitat Class vs {parameterName}</h3>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[400px]">
          <div className="grid" style={{ gridTemplateColumns: `120px repeat(${xLabels.length}, 1fr)` }}>
            <div />
            {xLabels.map(x => (
              <div key={x} className="text-[10px] font-bold text-center py-2 text-black/40 uppercase tracking-tighter">
                {x}
              </div>
            ))}
            {yLabels.map(y => (
              <React.Fragment key={y}>
                <div className="text-[10px] font-bold flex items-center pr-2 text-black/60 leading-tight">
                  {y}
                </div>
                {xLabels.map(x => {
                  const item = data.find(d => d.x === x && d.y === y);
                  const val = item ? item.value : 0;
                  const opacity = val / maxValue;
                  return (
                    <div 
                      key={`${x}-${y}`} 
                      className="aspect-square m-0.5 rounded-md flex items-center justify-center text-[10px] font-bold transition-all hover:scale-105 cursor-default"
                      style={{ 
                        backgroundColor: val > 0 ? `rgba(0, 136, 254, ${0.1 + opacity * 0.9})` : '#f9fafb',
                        color: opacity > 0.5 ? 'white' : 'black'
                      }}
                      title={`${y} in ${x}: ${val} citations`}
                    >
                      {val > 0 ? val : ''}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const APP_VERSION = "1.0.1";

export default function App() {
  const isVisOnly = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.location.pathname === '/vis' || 
           window.location.pathname.startsWith('/vis') || 
           window.location.search.includes('mode=vis');
  }, []);

  const [activeTab, setActiveTab] = useState<'analysis' | 'interactive' | 'graph' | 'chat' | 'source'>('analysis');
  const [repoUrl, setRepoUrl] = useState(() => {
    if (typeof window === 'undefined') return 'https://github.com/zetazetalun/Space-Architecture-Literature/tree/main/Papers';
    return localStorage.getItem('slr_repo_url') || 'https://github.com/zetazetalun/Space-Architecture-Literature/tree/main/Papers';
  });
  const [archiveUrl, setArchiveUrl] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('slr_archive_url') || '';
  });
  const [parameters, setParameters] = useState<ResearchParameter[]>([
    { id: 'year', name: 'Year of Publication', description: 'The year the study was published' },
    { id: 'authors', name: 'Authors', description: 'The research paper authors' },
    { id: 'publisher', name: 'Publisher', description: 'The publishing organization or journal' },
    { id: 'researchType', name: 'Research Type', description: 'Categorize the literature level:\n- **Primary Literature** (original research)\n- **Secondary Literature** (summaries/reviews)\n- **Tertiary Literature** (compilations/reference works)' },
    { id: 'publicationType', name: 'Publication Type', description: 'Specific publication format:\n\n**Primary:**\n- Research/Original Article\n- Short/Brief Communication\n- Case Study/Report\n- Technical Note\n- Patent\n- Conference Paper/Proceedings\n- Thesis/Dissertation\n- Preprint\n\n**Secondary:**\n- Review Article\n- Systematic Review\n- Meta-Analysis\n- Book Review\n- Commentary/Letter to Editor\n- Editorial\n\n**Tertiary:**\n- Encyclopedia/Dictionary\n- Textbook\n- Handbook\n- Manual' },
    { id: 'foci', name: 'Research Foci', description: 'Main focus areas:\n- **ISRU** (In situ resource utilisation, mapping, and extraction)\n- **Sustainability** (Long-term development strategies)\n- **Geotechnical Engineering** (Soil, rock, and groundwater behavior and structural interaction)\n- **Materials Science** (Physical, mechanical, and thermal properties; advanced composites; micro/macro modeling)\n- **Biotechnology & Bio-Inspired Materials** (Biological organisms like fungi/bacteria or organic compounds for construction)\n- **Additive & Automated Construction** (Layer-by-layer building or sintering; machinery and software control)\n- **Specialized Construction Techniques** (Specific joining methods not in additive manufacturing)\n- **Structural Design** (Architectural/structural design, deployable mechanisms, environmental protection)\n- **Life Support & Human Factors** (Life support systems and human-habitat interaction)\n- **Systems Engineering and Design** (Complex project management, Digital Design, optimization, information modeling)\n- **Construction Management & Planning** (Logistics, energy, and workforce in extreme environments)\n- **Media, Politics & Discourse** (Human and social science perspectives)\n- **Transportation/Logistics** (Shipping and moving materials/modules)\n- **Other**' },
    { id: 'scenario', name: 'Application Scenario', description: 'Operational scenario:\n- **Orbital**\n- **Surface**\n- **Underground**' },
    { id: 'location', name: 'Application Location', description: 'Target location:\n- **Mars**\n- **Moon**\n- **Asteroids**\n- **Space**' },
    { id: 'habitatClass', name: 'Habitat Class', description: 'Categorize the habitat type:\n- **Class I** (Pre-fabricated)\n- **Class II** (Deployable/Inflatable)\n- **Class III** (ISRU-based)' },
    { id: 'technologyClass3', name: 'Technology for Class III Habitat', description: 'If the research is for Class III habitat (ISRU-based), map its technology. Examples:\n- Solar and Selective Laser Sintering\n- Microwave Sintering\n- Extrusion Based\n- Binder Jetting\n- Identify and map others if present' }
  ]);
  
  const [papersState, setPapersState] = useState<Paper[]>(() => {
    if (typeof window === 'undefined') return [];
    if (window.location.pathname === '/vis' || window.location.pathname.startsWith('/vis') || window.location.search.includes('mode=vis')) {
      return [];
    }
    try {
      const saved = localStorage.getItem('slr_papers');
      if (!saved) return [];
      const parsed = JSON.parse(saved) as Paper[];
      
      const unique = new Map<string, Paper>();
      parsed.forEach(p => {
        // If ID looks like a SHA, prefer path for uniqueness
        const id = (p.id && p.id.length === 40) ? p.path : (p.id || p.path);
        if (!unique.has(id)) {
          unique.set(id, { ...p, id });
        }
      });
      return Array.from(unique.values());
    } catch (e) {
      console.error('Failed to parse slr_papers', e);
      return [];
    }
  });

  const [mappingsState, setMappingsState] = useState<MappingResult[]>(() => {
    if (typeof window === 'undefined') return [];
    if (window.location.pathname === '/vis' || window.location.pathname.startsWith('/vis') || window.location.search.includes('mode=vis')) {
      return [];
    }
    try {
      const savedMappings = localStorage.getItem('slr_mappings');
      const savedPapers = localStorage.getItem('slr_papers');
      
      if (!savedMappings) return [];
      const mappings = JSON.parse(savedMappings) as MappingResult[];
      
      if (!savedPapers) return mappings;
      const papers = JSON.parse(savedPapers) as Paper[];
      
      // Migration: If papers were migrated to use path as ID, mappings must match
      const shaToPath = new Map<string, string>();
      papers.forEach(p => {
        if (p.id && p.id.length === 40) {
          shaToPath.set(p.id, p.path);
        }
      });
      
      const unique = new Map<string, MappingResult>();
      mappings.forEach(m => {
        let paperId = m.paperId;
        if (paperId && paperId.length === 40 && shaToPath.has(paperId)) {
          paperId = shaToPath.get(paperId)!;
        }
        const key = `${paperId}-${m.parameterId}`;
        unique.set(key, { ...m, paperId });
      });
      return Array.from(unique.values());
    } catch (e) {
      console.error('Failed to parse slr_mappings', e);
      return [];
    }
  });

  const papers = papersState;
  const mappings = mappingsState;

  const [startYear, setStartYear] = useState<string>('');
  const [endYear, setEndYear] = useState<string>('');

  const availableYears = useMemo(() => {
    const years = new Set<string>();
    
    // Collect years from explicit mappings
    mappingsState.forEach(m => {
      if (m.parameterId === 'year' && m.value) {
        const normalized = normalizeValue('year', m.value);
        normalized.forEach(y => {
          if (/^\d{4}$/.test(y)) {
            years.add(y);
          }
        });
      }
    });

    // Fallback to collect from all papers (e.g. from bibtex, title or path) to capture all data entries
    papersState.forEach(paper => {
      if (paper.bibtex) {
        const bibMatch = paper.bibtex.match(/year\s*=\s*[\{\"]?((?:19|20)\d{2})[\}\"]?/i);
        if (bibMatch) {
          years.add(bibMatch[1]);
        }
      }
      const pathMatch = (paper.path || '').match(/(19|20)\d{2}/);
      if (pathMatch) {
        years.add(pathMatch[0]);
      }
      const titleMatch = (paper.title || '').match(/(19|20)\d{2}/);
      if (titleMatch) {
        years.add(titleMatch[0]);
      }
    });

    return Array.from(years).sort((a, b) => parseInt(a) - parseInt(b));
  }, [mappingsState, papersState]);

  useEffect(() => {
    if (availableYears.length > 0) {
      setStartYear(prev => {
        if (prev && availableYears.includes(prev)) return prev;
        return availableYears[0];
      });
      setEndYear(prev => {
        if (prev && availableYears.includes(prev)) return prev;
        return availableYears[availableYears.length - 1];
      });
    }
  }, [availableYears]);

  const filteredPapersAndMappings = useMemo(() => {
    if (!startYear || !endYear || availableYears.length === 0) {
      return { papers, mappings };
    }

    const start = parseInt(startYear);
    const end = parseInt(endYear);

    const papersInYearRange = new Set<string>();
    papers.forEach(paper => {
      let paperYear: string | null = null;
      
      // 1. Check explicit mapping
      const yearMapping = mappings.find(m => m.paperId === paper.id && m.parameterId === 'year');
      if (yearMapping && yearMapping.value) {
        const normalized = normalizeValue('year', yearMapping.value);
        const found = normalized.find(y => /^\d{4}$/.test(y));
        if (found) paperYear = found;
      }
      
      // 2. Check BibTeX
      if (!paperYear && paper.bibtex) {
        const bibMatch = paper.bibtex.match(/year\s*=\s*[\{\"]?((?:19|20)\d{2})[\}\"]?/i);
        if (bibMatch) paperYear = bibMatch[1];
      }
      
      // 3. Check path
      if (!paperYear && paper.path) {
        const pathMatch = paper.path.match(/(19|20)\d{2}/);
        if (pathMatch) paperYear = pathMatch[0];
      }
      
      // 4. Check title
      if (!paperYear && paper.title) {
        const titleMatch = paper.title.match(/(19|20)\d{2}/);
        if (titleMatch) paperYear = titleMatch[0];
      }

      if (paperYear) {
        const yNum = parseInt(paperYear);
        if (yNum >= start && yNum <= end) {
          papersInYearRange.add(paper.id);
        }
      } else {
        // If no year is found, we keep it so it's not silently lost
        papersInYearRange.add(paper.id);
      }
    });

    return {
      papers: papers.filter(p => papersInYearRange.has(p.id)),
      mappings: mappings.filter(m => papersInYearRange.has(m.paperId))
    };
  }, [papers, mappings, startYear, endYear, availableYears]);

  const reviewPapers = filteredPapersAndMappings.papers;
  const reviewMappings = filteredPapersAndMappings.mappings;

  const setPapers = (update: Paper[] | ((prev: Paper[]) => Paper[])) => {
    setPapersState(prev => {
      const next = typeof update === 'function' ? update(prev) : update;
      const unique = new Map<string, Paper>();
      next.forEach(p => {
        const id = (p.id && p.id.length === 40) ? p.path : (p.id || p.path);
        if (id) {
          if (unique.has(id)) {
            unique.set(id, { ...unique.get(id)!, ...p, id });
          } else {
            unique.set(id, { ...p, id });
          }
        }
      });
      const cleaned = Array.from(unique.values());
      if (!isVisOnly) {
        try {
          localStorage.setItem('slr_papers', JSON.stringify(cleaned.map(p => ({ ...p, content: '' }))));
        } catch (e) {
          console.error('Failed to persist papers', e);
        }
      }
      return cleaned;
    });
  };

  const setMappings = (update: MappingResult[] | ((prev: MappingResult[]) => MappingResult[])) => {
    setMappingsState(prev => {
      const next = typeof update === 'function' ? update(prev) : update;
      const unique = new Map<string, MappingResult>();
      
      // Compute shaToPath from current papers for real-time migration during mapping updates
      const shaToPath = new Map<string, string>();
      papersState.forEach(p => {
        if (p.id && p.id.length === 40) {
          shaToPath.set(p.id, p.path);
        }
      });

      next.forEach(m => {
        let paperId = m.paperId;
        if (paperId && paperId.length === 40 && shaToPath.has(paperId)) {
          paperId = shaToPath.get(paperId)!;
        }
        const key = `${paperId}-${m.parameterId}`;
        unique.set(key, { ...m, paperId });
      });
      const cleaned = Array.from(unique.values());
      if (!isVisOnly) {
        try {
          localStorage.setItem('slr_mappings', JSON.stringify(cleaned));
        } catch (e) {
          console.error('Failed to persist mappings', e);
        }
      }
      return cleaned;
    });
  };
  const [rawSummary, setRawSummary] = useState<ReviewSummary | null>(() => {
    if (typeof window === 'undefined') return null;
    if (window.location.pathname === '/vis' || window.location.pathname.startsWith('/vis') || window.location.search.includes('mode=vis')) {
      return null;
    }
    try {
      const saved = localStorage.getItem('slr_summary');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to parse slr_summary', e);
      return null;
    }
  });

  const summary = useMemo<ReviewSummary | null>(() => {
    if (!rawSummary) return null;

    const distributions = [
      { parameterName: 'Year of Publication', type: 'bar' as const, data: getDynamicCounts('year', reviewPapers, reviewMappings) },
      { parameterName: 'Authors', type: 'bar' as const, data: getDynamicCounts('authors', reviewPapers, reviewMappings).sort((a, b) => b.value - a.value).slice(0, 15) },
      { parameterName: 'Publisher', type: 'bar' as const, data: getDynamicCounts('publisher', reviewPapers, reviewMappings).sort((a, b) => b.value - a.value).slice(0, 15) },
      { parameterName: 'Research Type', type: 'pie' as const, data: getDynamicCounts('researchType', reviewPapers, reviewMappings) },
      { parameterName: 'Publication Type', type: 'bar' as const, data: getDynamicCounts('publicationType', reviewPapers, reviewMappings) },
      { parameterName: 'Research Foci', type: 'treemap' as const, data: getDynamicCounts('foci', reviewPapers, reviewMappings) },
      { parameterName: 'Application Scenario', type: 'bar' as const, data: getDynamicCounts('scenario', reviewPapers, reviewMappings) },
      { parameterName: 'Application Location', type: 'radar' as const, data: getDynamicCounts('location', reviewPapers, reviewMappings) },
      { parameterName: 'Habitat Class', type: 'pie' as const, data: getDynamicCounts('habitatClass', reviewPapers, reviewMappings) }
    ];

    const heatmaps = [
      { parameterName: 'Research Foci', data: getDynamicHeatmap('foci', reviewPapers, reviewMappings) },
      { parameterName: 'Application Location', data: getDynamicHeatmap('location', reviewPapers, reviewMappings) },
      { parameterName: 'Technology for Class III Habitat', data: getDynamicHeatmap('technologyClass3', reviewPapers, reviewMappings) },
      { parameterName: 'Research Type', data: getDynamicHeatmap('researchType', reviewPapers, reviewMappings) },
      { parameterName: 'Application Scenario', data: getDynamicHeatmap('scenario', reviewPapers, reviewMappings) }
    ];

    const relevant = reviewPapers.filter(p => p.isRelevant !== false && p.status === 'success').length;
    const irrelevant = reviewPapers.filter(p => p.isRelevant === false && p.status === 'success').length;
    const failed = reviewPapers.filter(p => p.status === 'failed').length;

    return {
      ...rawSummary,
      chartData: {
        distributions,
        heatmaps,
        relevance: {
          relevant,
          irrelevant,
          failed
        }
      }
    };
  }, [rawSummary, reviewPapers, reviewMappings]);
  const [agentState, setAgentState] = useState<AgentState>({ status: 'idle', message: '', progress: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [concurrencyLimit, setConcurrencyLimit] = useState(1);
  const [stats, setStats] = useState({ generations: 0, reports: 0, downloads: 0, vis_accesses: 0 });
  const [mappingModel, setMappingModel] = useState<MappingModel>(() => {
    if (typeof window === 'undefined') return 'gemini-3.1-pro-preview';
    return (localStorage.getItem('slr_mapping_model') as MappingModel) || 'gemini-3.1-pro-preview';
  });
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [paperSearch, setPaperSearch] = useState('');
  const [paperFilter, setPaperFilter] = useState<'all' | 'relevant' | 'irrelevant' | 'failed'>('all');
  const [paperGroupBy, setPaperGroupBy] = useState<string>('none');
  const [openaiKey, setOpenaiKey] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('slr_openai_key') || '';
  });
  const [anthropicKey, setAnthropicKey] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('slr_anthropic_key') || '';
  });
  const [debugLogs, setDebugLogs] = useState<{ time: string, type: 'info' | 'error' | 'success', message: string }[]>([]);

  const addLog = (type: 'info' | 'error' | 'success', message: string) => {
    setDebugLogs(prev => [{ time: new Date().toLocaleTimeString(), type, message }, ...prev].slice(0, 50));
  };

  // --- Visualization Only Mode State & Sync Functions ---
  const [visitorGeo, setVisitorGeo] = useState<{ code: string; name: string }>({ code: 'Unknown', name: 'Unknown Location' });
  const [analyticsSummary, setAnalyticsSummary] = useState<{
    sidebarClicks: { button: string, count: number }[];
    sectionStats: { section: string, clicks: number, avgTime: number }[];
    chartCombinations: { combination: string, count: number }[];
    chartDownloads: number;
    chatQuestions: { question: string, countryCode: string, countryName: string, createdAt: string }[];
    countries: { code: string, name: string, count: number }[];
    rawEvents: { id: number, eventType: string, eventKey: string, eventValue: string, countryCode: string, countryName: string, createdAt: string }[];
  } | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Resolve GeoIP on mount
  useEffect(() => {
    const resolveGeo = async () => {
      try {
        const res = await fetch('https://freeipapi.com/api/json');
        if (res.ok) {
          const data = await res.json();
          if (data.countryCode && data.countryName) {
            setVisitorGeo({
              code: data.countryCode,
              name: data.countryName
            });
          }
        }
      } catch (e) {
        // Fallback silently if API is blocked or offline
      }
    };
    resolveGeo();
  }, []);

  const logAnalyticsEvent = async (eventType: string, eventKey: string, eventValue: string = '') => {
    try {
      await fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          eventKey,
          eventValue,
          countryCode: visitorGeo.code,
          countryName: visitorGeo.name
        })
      });
    } catch (e) {
      console.warn('Failed to log analytics event:', e);
    }
  };

  const fetchAnalyticsSummary = async () => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch('/api/analytics/summary');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAnalyticsSummary(data);
        }
      }
    } catch (e) {
      console.error('Failed to fetch analytics summary', e);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const downloadAnalyticsData = () => {
    if (!analyticsSummary) return;

    const wb = XLSX.utils.book_new();

    // Sheet 1: Raw Events Log
    const rawEventsSheetData = (analyticsSummary.rawEvents || []).map(e => ({
      'ID': e.id,
      'Event Type': e.eventType,
      'Event Category': e.eventKey,
      'Event Value / Detail': e.eventValue,
      'Country Code': e.countryCode,
      'Country Name': e.countryName,
      'Timestamp': new Date(e.createdAt).toLocaleString()
    }));
    const wsRaw = XLSX.utils.json_to_sheet(rawEventsSheetData);
    XLSX.utils.book_append_sheet(wb, wsRaw, "Raw Event Logs");

    // Sheet 2: Country Breakdown
    const countriesSheetData = (analyticsSummary.countries || []).map(c => ({
      'Country Code': c.code,
      'Country Name': c.name,
      'Views': c.count
    }));
    const wsCountries = XLSX.utils.json_to_sheet(countriesSheetData);
    XLSX.utils.book_append_sheet(wb, wsCountries, "Geographic Traffic");

    // Sheet 3: Chatbox Q&A Logs
    const chatSheetData = (analyticsSummary.chatQuestions || []).map(q => ({
      'Question Asked': q.question,
      'Country Code': q.countryCode,
      'Country Name': q.countryName,
      'Date': new Date(q.createdAt).toLocaleString()
    }));
    const wsChat = XLSX.utils.json_to_sheet(chatSheetData);
    XLSX.utils.book_append_sheet(wb, wsChat, "Anonymized Chat Q&A");

    // Sheet 4: Section Views & Average Times
    const sectionsSheetData = (analyticsSummary.sectionStats || []).map(s => ({
      'Section Name': s.section,
      'Clicks / Views': s.clicks,
      'Average Dwell Time (s)': s.avgTime ? parseFloat(s.avgTime.toFixed(1)) : 0
    }));
    const wsSections = XLSX.utils.json_to_sheet(sectionsSheetData);
    XLSX.utils.book_append_sheet(wb, wsSections, "Section Engagement");

    XLSX.writeFile(wb, `SLR_Data_Share_Analytics_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Track tab time spent
  useEffect(() => {
    if (!isVisOnly) return;
    const startTime = Date.now();
    return () => {
      const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
      logAnalyticsEvent('section_time', `${activeTab}_tab`, durationSec);
    };
  }, [activeTab, isVisOnly, visitorGeo]);

  const [visEnabled, setVisEnabled] = useState(true);
  const [visPinProtected, setVisPinProtected] = useState(false);
  const [visPin, setVisPin] = useState("");
  const [showReviewVisualisation, setShowReviewVisualisation] = useState(true);
  const [showReviewResults, setShowReviewResults] = useState(true);
  const [showReviewParameters, setShowReviewParameters] = useState(true);
  const [showReviewInteractive, setShowReviewInteractive] = useState(true);
  const [showReviewDocuments, setShowReviewDocuments] = useState(true);
  const [showGraphSection, setShowGraphSection] = useState(true);
  const [showChatbox, setShowChatbox] = useState(true);

  // local PIN unlock state
  const [visEnteredPin, setVisEnteredPin] = useState("");
  const isVisUnlocked = useMemo(() => {
    if (!visPinProtected) return true;
    return visEnteredPin === visPin;
  }, [visPinProtected, visEnteredPin, visPin]);

  // Snapshots list state (data memory)
  const [visSnapshots, setVisSnapshots] = useState<{ id: number, createdAt: string, paperCount: number, mappingCount: number, chatCount: number }[]>([]);
  const [snapshotsLoading, setSnapshotsLoading] = useState(false);

  const [visPublishing, setVisPublishing] = useState(false);
  const [visLoading, setVisLoading] = useState(false);
  const [visSyncTime, setVisSyncTime] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const getShareableUrl = () => {
    if (typeof window === 'undefined') return '/vis';
    // If running in development preview, convert ais-dev- to ais-pre- for public visitors
    const origin = window.location.origin.replace('ais-dev-', 'ais-pre-');
    return `${origin}/vis`;
  };

  const copyShareUrl = async () => {
    try {
      const url = getShareableUrl();
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const fetchVisualizationState = async (silent = false) => {
    if (!silent) setVisLoading(true);
    try {
      const url = isVisOnly ? `/api/vis-state?visitor=true&countryCode=${encodeURIComponent(visitorGeo.code)}&countryName=${encodeURIComponent(visitorGeo.name)}` : '/api/vis-state';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPapersState(data.papers || []);
          setMappingsState(data.mappings || []);
          setRawSummary(data.summary || null);
          if (!isVisOnly) {
            setChatMessages(data.chatMessages || []);
          }
          if (data.summary) {
            setActiveTab(prev => prev || 'analysis');
          }
          
          const timeStr = data.updatedAt 
            ? new Date(data.updatedAt).toLocaleTimeString() 
            : new Date().toLocaleTimeString();
          setVisSyncTime(timeStr);
          
          if (!silent) addLog('success', `Successfully synchronized visualization data (${data.papers?.length || 0} papers, ${data.mappings?.length || 0} mappings).`);
        }

        if (data.settings) {
          setVisEnabled(data.settings.enabled ?? true);
          setVisPinProtected(data.settings.pinProtected ?? false);
          setVisPin(data.settings.pin ?? "");
          setShowReviewVisualisation(data.settings.showReviewVisualisation ?? true);
          setShowReviewResults(data.settings.showReviewResults ?? true);
          setShowReviewParameters(data.settings.showReviewParameters ?? true);
          setShowReviewInteractive(data.settings.showReviewInteractive ?? true);
          setShowReviewDocuments(data.settings.showReviewDocuments ?? true);
          setShowGraphSection(data.settings.showGraphSection ?? true);
          setShowChatbox(data.settings.showChatbox ?? true);
        }
      } else {
        if (!silent) addLog('error', 'No visualization data available on the server. Please publish first from the main app.');
      }
    } catch (error: any) {
      console.error('Error fetching visualization state:', error);
      if (!silent) addLog('error', `Failed to sync with parent app: ${error.message || error}`);
    } finally {
      if (!silent) setVisLoading(false);
    }
  };

  const publishVisState = async () => {
    setVisPublishing(true);
    addLog('info', 'Publishing analysis to visualization-only view...');
    try {
      let graphNodesList: any[] = [];
      let graphEdgesList: any[] = [];
      try {
        const liveGraph = await fetchGraphDatabaseFromServer();
        if (liveGraph && liveGraph.nodes.length > 0) {
          graphNodesList = liveGraph.nodes;
          graphEdgesList = liveGraph.edges;
        } else {
          const clientGraph = buildGraphFromAnalysis(papersState, mappingsState, parameters);
          graphNodesList = clientGraph.nodes;
          graphEdgesList = clientGraph.edges;
        }
      } catch (e) {
        const clientGraph = buildGraphFromAnalysis(papersState, mappingsState, parameters);
        graphNodesList = clientGraph.nodes;
        graphEdgesList = clientGraph.edges;
      }

      const response = await fetch('/api/vis-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          papers: papersState,
          mappings: mappingsState,
          summary: rawSummary,
          chatMessages: chatMessages,
          graphNodes: graphNodesList,
          graphEdges: graphEdgesList,
          settings: {
            enabled: visEnabled,
            pinProtected: visPinProtected,
            pin: visPin,
            showReviewVisualisation,
            showReviewResults,
            showReviewParameters,
            showReviewInteractive,
            showReviewDocuments,
            showGraphSection,
            showChatbox
          }
        })
      });

      if (response.ok) {
        addLog('success', 'Successfully published state and settings to the shared visualization-only interface!');
        // Refresh snapshots list
        fetchSnapshotsFromServer();
      } else {
        const errorText = await response.text();
        addLog('error', `Failed to publish visualization state: ${errorText}`);
      }
    } catch (error: any) {
      console.error('Error publishing visualization state:', error);
      addLog('error', `Failed to publish: ${error.message}`);
    } finally {
      setVisPublishing(false);
    }
  };

  const saveVisSettings = async (updates: Partial<{
    enabled: boolean;
    pinProtected: boolean;
    pin: string;
    showReviewVisualisation: boolean;
    showReviewResults: boolean;
    showReviewParameters: boolean;
    showReviewInteractive: boolean;
    showReviewDocuments: boolean;
    showGraphSection: boolean;
    showChatbox: boolean;
  }>) => {
    const nextSettings = {
      enabled: updates.enabled !== undefined ? updates.enabled : visEnabled,
      pinProtected: updates.pinProtected !== undefined ? updates.pinProtected : visPinProtected,
      pin: updates.pin !== undefined ? updates.pin : visPin,
      showReviewVisualisation: updates.showReviewVisualisation !== undefined ? updates.showReviewVisualisation : showReviewVisualisation,
      showReviewResults: updates.showReviewResults !== undefined ? updates.showReviewResults : showReviewResults,
      showReviewParameters: updates.showReviewParameters !== undefined ? updates.showReviewParameters : showReviewParameters,
      showReviewInteractive: updates.showReviewInteractive !== undefined ? updates.showReviewInteractive : showReviewInteractive,
      showReviewDocuments: updates.showReviewDocuments !== undefined ? updates.showReviewDocuments : showReviewDocuments,
      showGraphSection: updates.showGraphSection !== undefined ? updates.showGraphSection : showGraphSection,
      showChatbox: updates.showChatbox !== undefined ? updates.showChatbox : showChatbox,
    };

    if (updates.enabled !== undefined) setVisEnabled(updates.enabled);
    if (updates.pinProtected !== undefined) setVisPinProtected(updates.pinProtected);
    if (updates.pin !== undefined) setVisPin(updates.pin);
    if (updates.showReviewVisualisation !== undefined) setShowReviewVisualisation(updates.showReviewVisualisation);
    if (updates.showReviewResults !== undefined) setShowReviewResults(updates.showReviewResults);
    if (updates.showReviewParameters !== undefined) setShowReviewParameters(updates.showReviewParameters);
    if (updates.showReviewInteractive !== undefined) setShowReviewInteractive(updates.showReviewInteractive);
    if (updates.showReviewDocuments !== undefined) setShowReviewDocuments(updates.showReviewDocuments);
    if (updates.showGraphSection !== undefined) setShowGraphSection(updates.showGraphSection);
    if (updates.showChatbox !== undefined) setShowChatbox(updates.showChatbox);

    try {
      const response = await fetch('/api/vis-state/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: nextSettings })
      });
      if (response.ok) {
        addLog('success', 'Visualization share settings updated successfully.');
      } else {
        addLog('error', 'Failed to update visualization share settings.');
      }
    } catch (e: any) {
      addLog('error', `Error updating settings: ${e.message}`);
    }
  };

  const fetchSnapshotsFromServer = async () => {
    setSnapshotsLoading(true);
    try {
      const res = await fetch('/api/vis-state/snapshots');
      if (res.ok) {
        const data = await res.json();
        if (data.snapshots) {
          setVisSnapshots(data.snapshots);
        }
      }
    } catch (e) {
      console.error("Failed to fetch snapshots", e);
    } finally {
      setSnapshotsLoading(false);
    }
  };

  const restoreSnapshot = async (id: number) => {
    try {
      addLog('info', `Restoring active visualization to snapshot #${id}...`);
      const res = await fetch(`/api/vis-state/snapshots/${id}/restore`, { method: 'POST' });
      if (res.ok) {
        addLog('success', `Active visualization state successfully reverted to snapshot #${id}!`);
        fetchVisualizationState(true);
      } else {
        addLog('error', 'Failed to restore snapshot.');
      }
    } catch (e: any) {
      addLog('error', `Failed to restore snapshot: ${e.message}`);
    }
  };

  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [remoteSyncUrl, setRemoteSyncUrl] = useState('https://ais-pre-l2q5w2kqjoythmfxhzacal-384167759363.asia-east1.run.app/vis');
  const [remoteSyncToken, setRemoteSyncToken] = useState('');
  const [isSyncingRemote, setIsSyncingRemote] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const handleDirectRefresh = async () => {
    setIsSyncingRemote(true);
    setSyncStatusMsg({ type: 'info', text: 'Refreshing latest analysis state from parent tool...' });
    try {
      const res = await fetch('/api/sync/refresh', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchVisualizationState(true);
        setSyncStatusMsg({
          type: 'success',
          text: `Refreshed successfully! Loaded ${data.papersCount} papers and ${data.mappingsCount} metadata mappings from parent tool.`
        });
        addLog('success', `Dataset refreshed from parent tool: ${data.papersCount} papers.`);
      } else {
        await handleSyncWithGitHub();
      }
    } catch (err: any) {
      await handleSyncWithGitHub();
    } finally {
      setIsSyncingRemote(false);
    }
  };

  const handleSyncWithGitHub = async () => {
    setIsSyncingRemote(true);
    setSyncStatusMsg({ type: 'info', text: 'Pulling latest analysis dataset from GitHub repository...' });
    try {
      const res = await fetch('/api/sync/github', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchVisualizationState(true);
        setSyncStatusMsg({
          type: 'success',
          text: `Successfully synced ${data.papersCount} papers and ${data.mappingsCount} metadata mappings from GitHub repository!`
        });
        addLog('success', `Dataset updated from GitHub: ${data.papersCount} papers, ${data.mappingsCount} mappings.`);
      } else {
        throw new Error(data.error || 'Failed to sync with GitHub');
      }
    } catch (err: any) {
      setSyncStatusMsg({ type: 'error', text: err.message || 'GitHub sync failed' });
      addLog('error', `GitHub sync failed: ${err.message}`);
    } finally {
      setIsSyncingRemote(false);
    }
  };

  const handleSyncWithRemoteApplet = async () => {
    if (!remoteSyncUrl) return;
    setIsSyncingRemote(true);
    setSyncStatusMsg({ type: 'info', text: 'Connecting to remote AI Studio applet...' });
    try {
      const res = await fetch('/api/sync/remote-applet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: remoteSyncUrl, token: remoteSyncToken })
      });
      const data = await res.json();
      if (data.success) {
        await fetchVisualizationState(true);
        setSyncStatusMsg({
          type: 'success',
          text: `Successfully synced ${data.papersCount} papers from remote applet!`
        });
        addLog('success', `Synced from remote applet: ${data.papersCount} papers.`);
      } else if (data.isAuthProtected) {
        setSyncStatusMsg({
          type: 'info',
          text: data.message
        });
      } else {
        throw new Error(data.error || 'Failed to sync with remote applet');
      }
    } catch (err: any) {
      setSyncStatusMsg({ type: 'error', text: err.message || 'Remote sync failed' });
    } finally {
      setIsSyncingRemote(false);
    }
  };

  const handleImportJsonFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsSyncingRemote(true);
    setSyncStatusMsg({ type: 'info', text: `Importing ${file.name}...` });
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const res = await fetch('/api/sync/import-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchVisualizationState(true);
        setSyncStatusMsg({
          type: 'success',
          text: `Successfully imported ${data.papersCount} papers and ${data.mappingsCount} mappings!`
        });
        addLog('success', `Imported ${data.papersCount} papers from JSON.`);
      } else {
        throw new Error(data.error || 'Import failed');
      }
    } catch (err: any) {
      setSyncStatusMsg({ type: 'error', text: err.message || 'Failed to parse JSON file' });
    } finally {
      setIsSyncingRemote(false);
      e.target.value = '';
    }
  };

  const handleExportJson = () => {
    window.location.href = '/api/sync/export-json';
  };

  const fetchActiveSettings = async () => {
    try {
      const response = await fetch('/api/vis-state');
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setVisEnabled(data.settings.enabled ?? true);
          setVisPinProtected(data.settings.pinProtected ?? false);
          setVisPin(data.settings.pin ?? "");
          setShowReviewVisualisation(data.settings.showReviewVisualisation ?? true);
          setShowReviewResults(data.settings.showReviewResults ?? true);
          setShowReviewParameters(data.settings.showReviewParameters ?? true);
          setShowReviewInteractive(data.settings.showReviewInteractive ?? true);
          setShowReviewDocuments(data.settings.showReviewDocuments ?? true);
          setShowGraphSection(data.settings.showGraphSection ?? true);
          setShowChatbox(data.settings.showChatbox ?? true);
        }
      }
    } catch (e) {
      console.error("Failed to fetch active settings", e);
    }
  };

  useEffect(() => {
    if (isVisOnly) {
      fetchVisualizationState(true); // Auto-sync silently on load
    }
  }, [isVisOnly, visitorGeo]);
  const [hasToken, setHasToken] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('slr_repo_url', repoUrl);
    }
  }, [repoUrl]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('slr_archive_url', archiveUrl);
    }
  }, [archiveUrl]);

  useEffect(() => {
    setIsMounted(true);
    fetchStats();
    fetchGithubConfig();
    checkGeminiKey();
    fetchVisualizationState(true);
    if (!isVisOnly) {
      fetchActiveSettings();
      fetchSnapshotsFromServer();
    }
  }, []);

  const checkGeminiKey = async () => {
    if (window.aistudio?.hasSelectedApiKey) {
      try {
        const has = await window.aistudio.hasSelectedApiKey();
        setHasGeminiKey(has);
      } catch (e) {
        console.error("Failed to check Gemini API key", e);
      }
    }
  };

  const handleOpenKeySelector = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      // Assume success and update state
      setHasGeminiKey(true);
    }
  };

  const fetchGithubConfig = async () => {
    try {
      const res = await fetch('/api/github/config');
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setHasToken(data.hasToken);
        }
      }
    } catch (e) {
      // Transient startup error
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          setStats(await res.json());
        }
      }
    } catch (e) {
      // Transient startup error
    }
  };

  const incrementStat = async (key: 'generations' | 'reports' | 'downloads') => {
    try {
      await fetch(`/api/stats/${key}/increment`, { method: 'POST' });
      fetchStats();
    } catch (e) {
      console.error(`Failed to increment stat ${key}`, e);
    }
  };
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === 'undefined') return [];
    if (window.location.pathname === '/vis' || window.location.pathname.startsWith('/vis') || window.location.search.includes('mode=vis')) {
      return [];
    }
    try {
      const saved = localStorage.getItem('slr_chat');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse slr_chat', e);
      return [];
    }
  });
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('slr_mapping_model', mappingModel);
      localStorage.setItem('slr_openai_key', openaiKey);
      localStorage.setItem('slr_anthropic_key', anthropicKey);
    }
  }, [mappingModel, openaiKey, anthropicKey]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isVisOnly) return;
      if (summary) {
        try {
          localStorage.setItem('slr_summary', JSON.stringify(summary));
        } catch (e) {
          console.error('Failed to save summary to localStorage', e);
        }
      }
      else localStorage.removeItem('slr_summary');
    }
  }, [summary, isVisOnly]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isVisOnly) return;
      if (papers.length > 0) {
        try {
          // Strip content to avoid exceeding localStorage quota
          const strippedPapers = papers.map(p => ({ ...p, content: '' }));
          localStorage.setItem('slr_papers', JSON.stringify(strippedPapers));
        } catch (e) {
          console.error('Failed to save papers to localStorage', e);
        }
      }
      else localStorage.removeItem('slr_papers');
    }
  }, [papers, isVisOnly]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isVisOnly) return;
      if (mappings.length > 0) {
        try {
          localStorage.setItem('slr_mappings', JSON.stringify(mappings));
        } catch (e) {
          console.error('Failed to save mappings to localStorage', e);
        }
      }
      else localStorage.removeItem('slr_mappings');
    }
  }, [mappings, isVisOnly]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isVisOnly) return;
      if (chatMessages.length > 0) {
        try {
          localStorage.setItem('slr_chat', JSON.stringify(chatMessages));
        } catch (e) {
          console.error('Failed to save chat to localStorage', e);
        }
      }
      else localStorage.removeItem('slr_chat');
    }
  }, [chatMessages, isVisOnly]);

  const addParameter = () => {
    const newParam: ResearchParameter = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      description: ''
    };
    setParameters([...parameters, newParam]);
  };

  const updateParameter = (id: string, field: keyof ResearchParameter, value: string) => {
    setParameters(parameters.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removeParameter = (id: string) => {
    setParameters(parameters.filter(p => p.id !== id));
  };

  const togglePaperRelevance = (paperId: string) => {
    setPapers(prev => {
      const newPapers = prev.map(p => {
        if (p.id === paperId) {
          return { ...p, isRelevant: !p.isRelevant };
        }
        return p;
      });
      if (!isVisOnly) {
        localStorage.setItem('slr_papers', JSON.stringify(newPapers));
      }
      return newPapers;
    });
    
    // Update selectedPaper if it's the one being toggled
    if (selectedPaper && selectedPaper.id === paperId) {
      setSelectedPaper(prev => prev ? { ...prev, isRelevant: !prev.isRelevant } : null);
    }
  };

  const copyAllBibtex = () => {
    const relevantPapers = reviewPapers.filter(p => p.isRelevant && p.bibtex);
    const allBibtex = relevantPapers.map(p => p.bibtex).join('\n\n');
    if (allBibtex) {
      navigator.clipboard.writeText(allBibtex);
      addLog('success', `Copied BibTeX for ${relevantPapers.length} relevant papers.`);
    } else {
      addLog('info', 'No relevant papers with BibTeX found.');
    }
  };

  const getGroupedPapers = () => {
    const filteredPapers = reviewPapers.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(paperSearch.toLowerCase()) || 
                          p.path.toLowerCase().includes(paperSearch.toLowerCase());
      const matchesFilter = paperFilter === 'all' || 
                          (paperFilter === 'relevant' && p.isRelevant === true && p.status !== 'failed') ||
                          (paperFilter === 'irrelevant' && p.isRelevant === false && p.status !== 'failed') ||
                          (paperFilter === 'failed' && p.status === 'failed');
      return matchesSearch && matchesFilter;
    });

    if (paperGroupBy === 'none') {
      return { 'All Documents': filteredPapers };
    }

    const groups: Record<string, Paper[]> = {};
    filteredPapers.forEach(paper => {
      const mapping = mappings.find(m => m.paperId === paper.id && m.parameterId === paperGroupBy);
      const groupValue = mapping?.value || 'Uncategorized';
      if (!groups[groupValue]) {
        groups[groupValue] = [];
      }
      groups[groupValue].push(paper);
    });
    return groups;
  };

    const downloadGroupedTable = () => {
    const grouped = getGroupedPapers();
    const wb = XLSX.utils.book_new();
    
    // Filter to only include relevant papers in the export to match the analysis charts
    // Structure: [grouping criteria], year of publication, authors, title
    const data = Object.entries(grouped).flatMap(([groupName, groupPapers]) => 
      groupPapers
        .filter(p => p.isRelevant && p.status !== 'failed')
        .map(paper => {
          const groupParam = parameters.find(p => p.id === paperGroupBy);
          const groupHeader = groupParam ? groupParam.name : 'Grouping';
          
          const yearVal = getPaperParameterValue(paper, 'year', mappings);
          const authorsVal = getPaperParameterValue(paper, 'authors', mappings);
          
          const row: any = {};
          
          // 1. Grouping Criteria
          row[groupHeader] = groupName;
          
          // 2. Year of Publication
          if (groupHeader !== 'Year of Publication') {
            row['Year of Publication'] = yearVal;
          }
          
          // 3. Authors
          if (groupHeader !== 'Authors') {
            row['Authors'] = authorsVal;
          }
          
          // 4. Title
          if (groupHeader !== 'Title') {
            row['Title'] = paper.title || 'Not specified';
          }
          
          return row;
        })
    );

    if (data.length === 0) {
      addLog('info', 'No relevant papers found for the current grouping.');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Grouped Analysis");
    XLSX.writeFile(wb, `SLR_Grouped_Analysis_${new Date().toISOString().split('T')[0]}.xlsx`);
    addLog('success', 'Grouped analysis table downloaded.');
  };

  const clearData = () => {
    // We avoid window.confirm as per instructions, but this is a destructive action.
    // For now, we'll just clear it, or the user can refresh if they made a mistake.
    setPapers([]);
    setMappings([]);
    setRawSummary(null);
    setChatMessages([]);
    setDebugLogs([]);
    setSelectedPaper(null);
    setAgentState({ status: 'idle', message: '', progress: 0 });
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('slr_papers');
      localStorage.removeItem('slr_mappings');
      localStorage.removeItem('slr_summary');
      localStorage.removeItem('slr_chat');
    }
    
    addLog('info', 'All analysis data cleared.');
    setActiveTab('analysis');
  };

  const runAnalysis = async () => {
    if (!repoUrl.trim()) {
      addLog('error', 'Please enter a valid GitHub repository URL for papers.');
      return;
    }

    if (parameters.some(p => !p.name.trim() || !p.description.trim())) {
      addLog('error', 'Please define all parameters with a name and description.');
      return;
    }

    const totalStartTime = performance.now();
    let totalPromptTokens = 0;
    let totalCandidatesTokens = 0;

    try {
      // 1. PHASE ONE: RESTORE EXISTING STATE IF ARCHIVE URL PROVIDED
      let existingPapers = [...papers];
      let existingMappings = [...mappings];
      let owner = "";
      let repo = "";
      let path = "";
      let ref = undefined;
      
      let archiveOwner = "";
      let archiveRepo = "";
      let archiveRef = undefined;

      // Parse Paper Repo URL
      try {
        const cleanUrl = repoUrl.replace('https://github.com/', '').replace('.git', '').replace(/\/$/, '');
        const urlParts = cleanUrl.split('/');
        if (urlParts.length < 2) throw new Error("Invalid Paper Repo URL.");
        owner = urlParts[0];
        repo = urlParts[1];
        if (urlParts.length > 3 && (urlParts[2] === 'tree' || urlParts[2] === 'blob')) {
          ref = urlParts[3];
          path = urlParts.slice(4).join('/');
        }
      } catch (e: any) {
        throw new Error(`Failed to parse Paper Repo URL: ${e.message}`);
      }

      // 2. PHASE TWO: FETCH CURRENT PAPERS TO SYNCHRONIZE
      addLog('info', 'Connecting to Paper Repository...');
      setAgentState({ status: 'fetching', message: 'Fetching documents from GitHub...', progress: 15 });
      
      const fetchedPapers = await fetchRepoContent(owner, repo, path, ref);
      if (fetchedPapers.length === 0) {
        throw new Error("No supported documents found in the specified repository path.");
      }
      addLog('success', `Found ${fetchedPapers.length} documents in repository.`);
      
      const currentFetchedIds = new Set(fetchedPapers.map(p => p.id));
      
      // Perform synchronization
      existingPapers = existingPapers.filter(ep => currentFetchedIds.has(ep.id));
      existingMappings = existingMappings.filter(em => currentFetchedIds.has(em.paperId));

      // Parse Archive Repo URL (defaults to Paper Repo if empty)
      const targetArchiveUrl = archiveUrl.trim() || repoUrl.trim();
      try {
        const cleanUrl = targetArchiveUrl.replace('https://github.com/', '').replace('.git', '').replace(/\/$/, '');
        const urlParts = cleanUrl.split('/');
        if (urlParts.length >= 2) {
          archiveOwner = urlParts[0];
          archiveRepo = urlParts[1];
          if (urlParts.length > 3 && (urlParts[2] === 'tree' || urlParts[2] === 'blob')) {
            archiveRef = urlParts[3];
          }
        }
      } catch (e: any) {
        console.warn("Invalid Archive URL format, using Paper Repo for archiving.", e);
        archiveOwner = owner;
        archiveRepo = repo;
        archiveRef = ref;
      }

      // Try RESTORE first to save tokens
      setAgentState({ status: 'fetching', message: 'Checking for archived state...', progress: 5 });
      try {
        const state = await fetchAnalysisStateFromRepo(archiveOwner, archiveRepo, archiveRef);
        if (state) {
          addLog('info', `Found archived state from ${archiveOwner}/${archiveRepo}. Merging data...`);
          // Merge state, still constrained by synched existingPapers/existingMappings
          const archivedPapers = state.papers || [];
          const archivedMappings = state.mappings || [];
          
          existingPapers = [...existingPapers, ...archivedPapers.filter((ap: Paper) => !existingPapers.some(ep => ep.id === ap.id))];
          existingMappings = [...existingMappings, ...archivedMappings.filter((am: any) => !existingMappings.some(em => em.paperId === am.paperId))];
          
          // Re-sync after merge just in case
          existingPapers = existingPapers.filter(ep => currentFetchedIds.has(ep.id));
          existingMappings = existingMappings.filter(em => currentFetchedIds.has(em.paperId));
        } else {
          addLog('info', 'No relevant archive found. Starting fresh analysis.');
        }
      } catch (e) {
        console.warn("Archive restore skipped or failed during runAnalysis", e);
      }

      // Identify papers that need analysis
      const papersToAnalyze = fetchedPapers.filter(fp => {
        const existing = existingPapers.find(ep => ep.id === fp.id);
        if (!existing || existing.status !== 'success' || !existing.isRelevant) return true;

        // Re-analyze if any mapped parameter is missing or "not specified"
        const paperMappings = existingMappings.filter(m => m.paperId === fp.id);
        const hasNotSpecified = parameters.some(p => {
          const mapping = paperMappings.find(m => m.parameterId === p.id);
          if (!mapping) return true;
          if (mapping.value === undefined || mapping.value === null) return true;
          const raw = Array.isArray(mapping.value) ? mapping.value.join(', ') : (typeof mapping.value === 'object' ? JSON.stringify(mapping.value) : String(mapping.value));
          const lowerRaw = raw.toLowerCase();
          return lowerRaw.includes('not specified') || lowerRaw.includes('not mentioned') || raw.trim() === '' || raw === '[]' || raw === '{}';
        });

        return hasNotSpecified;
      });

      if (papersToAnalyze.length === 0) {
        addLog('success', 'No new papers detected. Generating review from archive.');
      } else {
        addLog('info', `Detected ${papersToAnalyze.length} new or pending documents.`);
      }

      // Update papers list locally
      setPapers(fetchedPapers.map(p => {
        const existing = existingPapers.find(ep => ep.id === p.id);
        return { 
          ...existing,
          ...p, 
          status: existing ? existing.status : 'pending'
        };
      }));

      const mappingStartTime = performance.now();
      const newMappings: MappingResult[] = [];
      const newPaperResults: Paper[] = [];

      // 3. PHASE THREE: MAPPING (ONLY FOR NEW ITEMS)
      if (papersToAnalyze.length > 0) {
        setAgentState({ status: 'mapping', message: `Analyzing ${papersToAnalyze.length} documents...`, progress: 20 });

        for (let i = 0; i < papersToAnalyze.length; i += concurrencyLimit) {
          const batch = papersToAnalyze.slice(i, i + concurrencyLimit);
          const batchResults = await Promise.all(
            batch.map(async paper => {
              try {
                addLog('info', `Mapping paper: ${paper.title}...`);
                const result = await mapPaperToParameters(paper, parameters, mappingModel, {
                  openai: openaiKey,
                  anthropic: anthropicKey
                });
                addLog('success', `Mapped paper: ${paper.title}`);
                return { ...result, status: 'success' as const };
              } catch (e: any) {
                addLog('error', `Failed to analyze paper ${paper.title}: ${e.message}`);
                return { paperId: paper.id, mappings: [], isRelevant: false, tokenUsage: { promptTokens: 0, candidatesTokens: 0, totalTokens: 0 }, status: 'failed' as const };
              }
            })
          );

          await Promise.all(batchResults.map(async res => {
            if (!res) return;
            totalPromptTokens += res.tokenUsage.promptTokens;
            totalCandidatesTokens += res.tokenUsage.candidatesTokens;

            const originalPaper = papersToAnalyze.find(p => p.id === res.paperId)!;
            let updatedPaper: Paper;

            if (res.status === 'success') {
              updatedPaper = {
                ...originalPaper,
                title: res.title || originalPaper.title,
                doi: res.doi,
                bibtex: res.bibtex,
                isRelevant: res.isRelevant,
                relevanceReason: res.relevanceReason,
                markdownContent: res.markdownContent,
                keyFindings: res.keyFindings,
                findings: res.findings,
                result: res.result,
                graphId: res.graphId,
                status: 'success'
              };
              
              // ARCHIVE MARKDOWN TO ARCHIVE REPO
              if (res.markdownContent) {
                const currentMappings = [...mappings, ...(res.mappings || [])];
                const mdFilename = getPaperMarkdownFilename(updatedPaper, currentMappings);
                const mdPath = `markdown_archive/${mdFilename}`;
                try {
                  await saveMarkdownToRepo(archiveOwner, archiveRepo, mdPath, res.markdownContent, archiveRef);
                } catch (e) {
                  console.warn(`Failed to archive markdown for ${originalPaper.title}`, e);
                }
              }
            } else {
              updatedPaper = { ...originalPaper, isRelevant: false, status: 'failed' };
            }
            
            newPaperResults.push(updatedPaper);
            if (res.isRelevant && res.status === 'success') {
              newMappings.push(...res.mappings);
            }
          }));

          // Progressive UI Update
          setPapers(prev => {
            const newPapers = [...prev];
            newPaperResults.forEach(np => {
              const idx = newPapers.findIndex(p => p.id === np.id);
              if (idx >= 0) newPapers[idx] = np;
              else newPapers.push(np);
            });
            return newPapers;
          });

          setMappings(prev => {
            const paperIds = new Set(newPaperResults.map(p => p.id));
            const filtered = prev.filter(m => !paperIds.has(m.paperId));
            return [...filtered, ...newMappings];
          });

          const completed = Math.min(i + concurrencyLimit, papersToAnalyze.length);
          setAgentState(prev => ({ 
            ...prev, 
            progress: 20 + (completed / papersToAnalyze.length) * 50,
            message: `Analyzed ${completed} of ${papersToAnalyze.length} documents...`
          }));

          if (i + concurrencyLimit < papersToAnalyze.length) await new Promise(r => setTimeout(r, 2000));
        }
      }

      // 4. PHASE FOUR: SYNTHESIS (FOR ALL SUCCESSFUL PAPERS - ARCHIVED + NEW)
      setAgentState({ status: 'synthesizing', message: 'Synthesizing global results...', progress: 85 });
      
      const allSuccessfulPapers = papersToAnalyze.length > 0 ? 
        [...existingPapers.filter(p => p.status === 'success' && !papersToAnalyze.some(pa => pa.id === p.id)), ...newPaperResults.filter(r => r.status === 'success')] : 
        existingPapers.filter(p => p.status === 'success');
        
      const allSuccessfulMappings = papersToAnalyze.length > 0 ?
        [...existingMappings.filter(m => !papersToAnalyze.some(pa => pa.id === m.paperId)), ...newMappings] :
        existingMappings;

      if (allSuccessfulPapers.length === 0) {
        throw new Error("No relevant documents available for review synthesis.");
      }

      const synthesizedSummary = await synthesizeReview(allSuccessfulPapers, allSuccessfulMappings, parameters);
      addLog('success', 'Global review synthesis complete.');

      const mappingEndTime = performance.now();
      const finalSummary: ReviewSummary = {
        ...synthesizedSummary,
        mappingModel,
        metadata: {
          appVersion: APP_VERSION,
          generationDate: new Date().toLocaleString(),
          githubRepoUrl: repoUrl,
          githubRef: ref || 'main'
        },
        performance: {
          ...synthesizedSummary.performance!,
          mappingTimeMs: Math.round(mappingEndTime - mappingStartTime),
          totalTimeMs: Math.round(performance.now() - totalStartTime),
          paperCount: allSuccessfulPapers.length,
          tokenUsage: {
            promptTokens: totalPromptTokens + (synthesizedSummary.performance?.tokenUsage?.promptTokens || 0),
            candidatesTokens: totalCandidatesTokens + (synthesizedSummary.performance?.tokenUsage?.candidatesTokens || 0),
            totalTokens: totalPromptTokens + totalCandidatesTokens + (synthesizedSummary.performance?.tokenUsage?.totalTokens || 0)
          }
        }
      };

      setRawSummary(finalSummary);
      setActiveTab('analysis');
      setAgentState({ status: 'idle', message: '', progress: 0 });

      // Update Graph Database with new entries
      try {
        addLog('info', 'Updating Knowledge Graph database with new entries...');
        const graphResult = await syncGraphDatabaseToServer(allSuccessfulPapers, allSuccessfulMappings, parameters);
        addLog('success', `Knowledge Graph database updated: ${graphResult.nodesCount} nodes, ${graphResult.edgesCount} relationships.`);
      } catch (ge: any) {
        console.warn('Failed to update graph database on server:', ge);
        addLog('info', `Graph database sync status: ${ge.message}`);
      }

      // 5. PHASE FIVE: ARCHIVE STATE TO ARCHIVE REPO
      try {
        addLog('info', 'Updating archive state on GitHub...');
        await saveAnalysisStateToRepo(archiveOwner, archiveRepo, allSuccessfulPapers, allSuccessfulMappings, finalSummary, archiveRef);
        addLog('success', 'Remote archive updated with latest analysis.');
      } catch (archiveError) {
        addLog('error', 'Failed to update remote archive state.');
      }

    } catch (e: any) {
      addLog('error', `Analysis run failed: ${e.message}`);
      setAgentState({ status: 'error', message: e.message, progress: 0 });
    }
  };


























  const restoreFromGitHub = async () => {
    const targetUrl = archiveUrl.trim() || repoUrl.trim();
    if (!targetUrl) {
      addLog('error', 'Please enter a GitHub repository URL (Archive or Papers).');
      return;
    }

    setAgentState({ status: 'fetching', message: 'Restoring state from archive...', progress: 30 });
    addLog('info', `Attempting restore from ${targetUrl}...`);

    try {
      const cleanUrl = targetUrl.replace('https://github.com/', '').replace('.git', '').replace(/\/$/, '');
      const urlParts = cleanUrl.split('/');
      if (urlParts.length < 2) throw new Error("Invalid GitHub URL.");
      
      const owner = urlParts[0];
      const repo = urlParts[1];
      let ref = undefined;
      
      if (urlParts.length > 3 && (urlParts[2] === 'tree' || urlParts[2] === 'blob')) {
        ref = urlParts[3];
      }

      const state = await fetchAnalysisStateFromRepo(owner, repo, ref);
      
      if (!state) {
        addLog('info', 'No archived analysis state found in this repository.');
        setAgentState({ status: 'idle', message: '', progress: 0 });
        return;
      }

      setPapers(state.papers || []);
      setMappings(state.mappings || []);
      setRawSummary(state.summary || null);
      if (state.summary) setActiveTab('analysis');

      addLog('success', `Restored analysis archive from ${owner}/${repo}.`);
      setAgentState({ status: 'idle', message: '', progress: 0 });

      // Update Graph Database with restored entries
      if (state.papers && state.mappings) {
        syncGraphDatabaseToServer(state.papers, state.mappings, parameters)
          .then(res => addLog('info', `Knowledge Graph database synced: ${res.nodesCount} nodes, ${res.edgesCount} relationships.`))
          .catch(err => console.warn('Graph database sync warning:', err));
      }
    } catch (error: any) {
      addLog('error', `Restore failed: ${error.message}`);
      setAgentState({ status: 'error', message: error.message, progress: 0 });
    }
  };

  useEffect(() => {
    if (isMounted && papersState.length === 0) {
      addLog('info', 'Restoring pre-analyzed papers from repository SQLite database cache...');
      restoreFromRepoCache().catch(() => {
        if (repoUrl.trim() || archiveUrl.trim()) {
          restoreFromGitHub();
        }
      });
    }
  }, [isMounted]);

  const restoreFromRepoCache = async () => {
    setAgentState({ status: 'fetching', message: 'Restoring from repository cache...', progress: 10 });
    addLog('info', 'Connecting to the repository cache database...');

    try {
      const response = await fetch('/api/cache');
      if (!response.ok) {
        throw new Error(`Failed to fetch cache: ${response.statusText}`);
      }
      const rows = await response.json();
      if (!rows || rows.length === 0) {
        addLog('info', 'No cached analyses found in the repository database.');
        setAgentState({ status: 'idle', message: '', progress: 0 });
        return;
      }

      addLog('info', `Found ${rows.length} cached paper(s) in repository cache.`);
      setAgentState({ status: 'fetching', message: 'Reconstructing paper state...', progress: 50 });

      const restoredPapers: Paper[] = rows.map((row: any) => {
        const title = row.title || row.id.split('/').pop() || 'Untitled Paper';
        const isPdf = title.toLowerCase().endsWith('.pdf');
        return {
          id: row.id,
          title: title,
          content: row.markdown_content || '',
          url: row.id.startsWith('http') ? row.id : `file://${row.id}`,
          path: row.id,
          mimeType: isPdf ? 'application/pdf' : 'text/plain',
          doi: row.doi || undefined,
          bibtex: row.bibtex || undefined,
          isRelevant: row.is_relevant === 1 || row.is_relevant === true,
          relevanceReason: row.relevance_reason || undefined,
          markdownContent: row.markdown_content || undefined,
          keyFindings: row.key_findings || undefined,
          findings: row.findings || undefined,
          result: row.result || undefined,
          graphId: row.graph_id || undefined,
          status: 'success' as const
        };
      });

      const restoredMappings: MappingResult[] = rows.flatMap((row: any) => {
        try {
          if (!row.mappings) return [];
          const rowMappings = typeof row.mappings === 'string' ? JSON.parse(row.mappings) : (row.mappings || []);
          return rowMappings.map((m: any) => ({
            ...m,
            paperId: row.id,
            verified: true
          }));
        } catch (e) {
          console.error(`Failed to parse mappings for paper ${row.id}`, e);
          return [];
        }
      });

      // Merge into state
      setPapers(prev => {
        const merged = [...prev];
        restoredPapers.forEach(rp => {
          const idx = merged.findIndex(p => p.id === rp.id);
          if (idx >= 0) {
            merged[idx] = { ...merged[idx], ...rp };
          } else {
            merged.push(rp);
          }
        });
        return merged;
      });

      setMappings(prev => {
        const merged = [...prev];
        restoredMappings.forEach(rm => {
          const idx = merged.findIndex(m => m.paperId === rm.paperId && m.parameterId === rm.parameterId);
          if (idx >= 0) {
            merged[idx] = rm;
          } else {
            merged.push(rm);
          }
        });
        return merged;
      });

      addLog('success', `Successfully restored ${restoredPapers.length} paper analyses and ${restoredMappings.length} parameter mappings from repository SQLite cache!`);
      setAgentState({ status: 'idle', message: '', progress: 0 });

      // Update Graph Database with restored entries
      syncGraphDatabaseToServer(restoredPapers, restoredMappings, parameters)
        .then(res => {
          addLog('info', `Knowledge Graph database synced: ${res.nodesCount} nodes, ${res.edgesCount} relationships.`);
        })
        .catch(e => console.warn('Could not sync restored graph database:', e));

      // If no summary currently in state, synthesize review dashboard in background
      if (!summary && restoredPapers.length > 0) {
        synthesizeReview(restoredPapers.filter(p => p.isRelevant), restoredMappings, parameters)
          .then(synth => {
            setRawSummary({
              ...synth,
              mappingModel,
              metadata: {
                appVersion: APP_VERSION,
                generationDate: new Date().toLocaleString(),
                githubRepoUrl: repoUrl,
                githubRef: 'main'
              }
            });
            addLog('success', 'Synthesized review dashboard from cached analyses.');
          })
          .catch(err => {
            console.warn('Initial background review synthesis error:', err);
          });
      }
    } catch (error: any) {
      addLog('error', `Repository cache restore failed: ${error.message}`);
      setAgentState({ status: 'error', message: error.message, progress: 0 });
    }
  };

  const runFailedAnalysis = async () => {
    if (!repoUrl.trim()) {
      addLog('error', 'Please enter a valid GitHub repository URL.');
      return;
    }

    const totalStartTime = performance.now();
    let totalPromptTokens = 0;
    let totalCandidatesTokens = 0;

    try {
      // 1. PHASE ONE: RESTORE EXISTING STATE IF ARCHIVE URL PROVIDED
      let existingPapers = [...papers];
      let existingMappings = [...mappings];
      let owner = "";
      let repo = "";
      let path = "";
      let ref = undefined;
      
      let archiveOwner = "";
      let archiveRepo = "";
      let archiveRef = undefined;

      try {
        const cleanUrl = repoUrl.replace('https://github.com/', '').replace('.git', '').replace(/\/$/, '');
        const urlParts = cleanUrl.split('/');
        if (urlParts.length < 2) throw new Error("Invalid GitHub URL.");
        owner = urlParts[0];
        repo = urlParts[1];
        if (urlParts.length > 3 && (urlParts[2] === 'tree' || urlParts[2] === 'blob')) {
          ref = urlParts[3];
          path = urlParts.slice(4).join('/');
        }
      } catch (e: any) {
        throw new Error(`Failed to parse GitHub URL: ${e.message}`);
      }

      // Parse Archive Repo URL (defaults to Paper Repo if empty)
      const targetArchiveUrl = archiveUrl.trim() || repoUrl.trim();
      try {
        const cleanUrl = targetArchiveUrl.replace('https://github.com/', '').replace('.git', '').replace(/\/$/, '');
        const urlParts = cleanUrl.split('/');
        if (urlParts.length >= 2) {
          archiveOwner = urlParts[0];
          archiveRepo = urlParts[1];
          if (urlParts.length > 3 && (urlParts[2] === 'tree' || urlParts[2] === 'blob')) {
            archiveRef = urlParts[3];
          }
        }
      } catch (e: any) {
        console.warn("Invalid Archive URL format, using Paper Repo for archiving.", e);
        archiveOwner = owner;
        archiveRepo = repo;
        archiveRef = ref;
      }

      // Try RESTORE first to save tokens
      setAgentState({ status: 'fetching', message: 'Checking for archived state...', progress: 5 });
      try {
        const state = await fetchAnalysisStateFromRepo(archiveOwner, archiveRepo, archiveRef);
        if (state) {
          addLog('info', `Found archived state from ${archiveOwner}/${archiveRepo}. Merging data...`);
          const archivedPapers = state.papers || [];
          const archivedMappings = state.mappings || [];
          
          existingPapers = [...existingPapers, ...archivedPapers.filter((ap: Paper) => !existingPapers.some(ep => ep.id === ap.id))];
          existingMappings = [...existingMappings, ...archivedMappings.filter((am: any) => !existingMappings.some(em => em.paperId === am.paperId))];
        } else {
          addLog('info', 'No relevant archive found.');
        }
      } catch (e) {
        console.warn("Archive restore skipped or failed during runFailedAnalysis", e);
      }

      addLog('info', 'Synchronizing repository state before re-analysis...');
      setAgentState({ status: 'fetching', message: 'Refreshing paper list...', progress: 10 });
      
      const fetchedPapers = await fetchRepoContent(owner, repo, path, ref);
      const currentIds = new Set(fetchedPapers.map(p => p.id));
      
      // We do NOT filter out existing papers. We want to KEEP all data from previous iterations!
      
      // Synchronize state: start with fetched papers
      const syncedPapers: Paper[] = fetchedPapers.map(fp => {
        const existing = existingPapers.find(ep => ep.id === fp.id);
        return {
          ...existing,
          ...fp,
          status: existing ? (existing.status || 'pending') : 'pending'
        };
      });

      // Add archived papers that were NOT in the fetched papers (e.g., from other folders)
      existingPapers.forEach(ep => {
        if (!currentIds.has(ep.id)) {
          syncedPapers.push(ep);
        }
      });

      setPapers(syncedPapers);
      setMappings(existingMappings);

      const failedPapersToAnalyze = syncedPapers.filter(p => {
        // Retry if expressly failed, or if it's a new paper (pending)
        if (p.status === 'failed' || p.status === 'pending') return true;

        if (p.status === 'success' && p.isRelevant) {
          // Re-analyze if any mapped parameter is missing or "not specified"
          const paperMappings = existingMappings.filter(m => m.paperId === p.id);
          const hasNotSpecified = parameters.some(param => {
            const mapping = paperMappings.find(m => m.parameterId === param.id);
            if (!mapping) return true;
            if (mapping.value === undefined || mapping.value === null) return true;
            const raw = Array.isArray(mapping.value) ? mapping.value.join(', ') : (typeof mapping.value === 'object' ? JSON.stringify(mapping.value) : String(mapping.value));
            const lowerRaw = raw.toLowerCase();
            return lowerRaw.includes('not specified') || lowerRaw.includes('no specified') || lowerRaw.includes('unspecified') || lowerRaw.includes('not mentioned') || raw.trim() === '' || raw === '[]' || raw === '{}';
          });

          return hasNotSpecified;
        }

        return false;
      });

      const skippedCount = syncedPapers.length - failedPapersToAnalyze.length;
      addLog('info', `Found ${syncedPapers.length} documents. Skipping ${skippedCount} successfully analyzed papers.`);

      if (failedPapersToAnalyze.length === 0) {
        addLog('success', 'All papers are already successfully analyzed.');
        setPapers(syncedPapers);
        setAgentState({ status: 'idle', message: '', progress: 0 });
        return;
      }

      addLog('info', `Starting analysis for ${failedPapersToAnalyze.length} failed/new papers...`);
      setAgentState({ status: 'mapping', message: `Analyzing ${failedPapersToAnalyze.length} papers...`, progress: 20 });
      
      const mappingStartTime = performance.now();
      const allMappings: MappingResult[] = [];
      const paperResults: Paper[] = [];
      
      for (let i = 0; i < failedPapersToAnalyze.length; i += concurrencyLimit) {
        const batch = failedPapersToAnalyze.slice(i, i + concurrencyLimit);
        const batchResults = await Promise.all(
          batch.map(async paper => {
            try {
              addLog('info', `Mapping paper: ${paper.title}...`);
              const result = await mapPaperToParameters(paper, parameters, mappingModel, {
                openai: openaiKey,
                anthropic: anthropicKey
              });
              addLog('success', `Mapped paper: ${paper.title}`);
              return { ...result, status: 'success' as const };
            } catch (e: any) {
              addLog('error', `Failed to analyze paper ${paper.title}: ${e.message}`);
              return { paperId: paper.id, mappings: [], isRelevant: false, tokenUsage: { promptTokens: 0, candidatesTokens: 0, totalTokens: 0 }, status: 'failed' as const };
            }
          })
        );

        const batchPapers: Paper[] = [];
        const batchMappings: MappingResult[] = [];

        batchResults.forEach(res => {
          if (!res) return;
          
          totalPromptTokens += res.tokenUsage.promptTokens;
          totalCandidatesTokens += res.tokenUsage.candidatesTokens;

          const originalPaper = failedPapersToAnalyze.find(p => p.id === res.paperId)!;
          let updatedPaper: Paper;

          if (res.status === 'success') {
            updatedPaper = {
              ...originalPaper,
              title: res.title || originalPaper.title,
              doi: res.doi,
              bibtex: res.bibtex,
              isRelevant: res.isRelevant,
              relevanceReason: res.relevanceReason,
              markdownContent: res.markdownContent,
              keyFindings: res.keyFindings,
              findings: res.findings,
              result: res.result,
              graphId: res.graphId,
              status: 'success'
            };
            
            if (res.isRelevant && res.markdownContent) {
              const currentMappings = [...mappings, ...(res.mappings || [])];
              const mdFilename = getPaperMarkdownFilename(updatedPaper, currentMappings);
              saveMarkdownToRepo(archiveOwner, archiveRepo, `markdown_archive/${mdFilename}`, res.markdownContent, archiveRef).catch(e => {
                console.warn(`Failed to archive markdown for ${updatedPaper.title}`, e);
              });
            }
          } else {
            updatedPaper = { ...originalPaper, status: 'failed' };
          }
          
          batchPapers.push(updatedPaper);
          paperResults.push(updatedPaper);
          if (res.status === 'success' && res.isRelevant) {
            batchMappings.push(...res.mappings);
            allMappings.push(...res.mappings);
          }
        });

        setPapers(prev => {
          const newPapers = [...prev];
          batchPapers.forEach(bp => {
            const index = newPapers.findIndex(p => p.id === bp.id);
            if (index >= 0) newPapers[index] = bp;
            else newPapers.push(bp);
          });
          return newPapers;
        });

        setMappings(prev => {
          const paperIds = new Set(batchPapers.map(p => p.id));
          const filtered = prev.filter(m => !paperIds.has(m.paperId));
          return [...filtered, ...batchMappings];
        });

        const completed = Math.min(i + concurrencyLimit, failedPapersToAnalyze.length);
        setAgentState(prev => ({ 
          ...prev, 
          progress: 20 + (completed / failedPapersToAnalyze.length) * 50,
          message: `Analyzed ${completed} of ${failedPapersToAnalyze.length} papers...`
        }));

        if (i + concurrencyLimit < failedPapersToAnalyze.length) await new Promise(r => setTimeout(r, 2000));
      }
      
      const mappingEndTime = performance.now();
      setAgentState({ status: 'synthesizing', message: 'Synthesizing final review...', progress: 85 });
      
      // Calculate final collections using the LATEST state to avoid stale closure issues
      setPapers(currentPapers => {
        setMappings(currentMappings => {
          const allSuccessfulPapers = currentPapers.filter(p => p.status === 'success');
          
          synthesizeReview(allSuccessfulPapers, currentMappings, parameters).then(synthesizedSummary => {
            addLog('success', 'Review synthesis complete.');
            
            const totalEndTime = performance.now();
            const finalSummary: ReviewSummary = {
              ...synthesizedSummary,
              mappingModel,
              metadata: {
                appVersion: APP_VERSION,
                generationDate: new Date().toLocaleString(),
                githubRepoUrl: repoUrl,
                githubRef: ref || 'main'
              },
              performance: {
                ...synthesizedSummary.performance!,
                mappingTimeMs: Math.round(mappingEndTime - mappingStartTime),
                totalTimeMs: Math.round(totalEndTime - totalStartTime),
                paperCount: allSuccessfulPapers.length,
                tokenUsage: {
                  promptTokens: totalPromptTokens + (synthesizedSummary.performance?.tokenUsage?.promptTokens || 0),
                  candidatesTokens: totalCandidatesTokens + (synthesizedSummary.performance?.tokenUsage?.candidatesTokens || 0),
                  totalTokens: totalPromptTokens + totalCandidatesTokens + (synthesizedSummary.performance?.tokenUsage?.totalTokens || 0)
                }
              }
            };
            
            setRawSummary(finalSummary);
            setAgentState({ status: 'idle', message: '', progress: 0 });

            // Update Graph Database with new entries
            addLog('info', 'Updating Knowledge Graph database with new entries...');
            syncGraphDatabaseToServer(allSuccessfulPapers, currentMappings, parameters)
              .then(res => {
                addLog('success', `Knowledge Graph database updated: ${res.nodesCount} nodes, ${res.edgesCount} relationships.`);
              })
              .catch(err => console.warn('Failed to update graph database:', err));
            
            // Archive state
            saveAnalysisStateToRepo(archiveOwner, archiveRepo, allSuccessfulPapers, currentMappings, finalSummary, archiveRef).catch(() => {
              addLog('error', 'Failed to update remote archive state.');
            });
          }).catch(e => {
            addLog('error', `Synthesis failed: ${e.message}`);
            setAgentState({ status: 'error', message: e.message, progress: 0 });
          });
          
          return currentMappings;
        });
        return currentPapers;
      });
      
    } catch (e: any) {
      addLog('error', `Re-analysis failed: ${e.message}`);
      setAgentState({ status: 'error', message: e.message, progress: 0 });
    }
  };
        




  const downloadExcel = async () => {
    if (!summary || papers.length === 0) return;
    await incrementStat('downloads');

    const wb = XLSX.utils.book_new();

    // 1. Overview Sheet (Include all for transparency, but clearly marked)
    const overviewData = papers.map(paper => {
      const paperMappings = mappings.filter(m => m.paperId === paper.id);
      const doiVal = paper.doi || (paper.bibtex ? (paper.bibtex.match(/doi\s*=\s*[\{\"]?([^}\"]+)[\}\"]?/i)?.[1] || '') : '');
      const findingsVal = paper.keyFindings || paper.findings || paper.result || 'Not specified';
      const row: any = {
        'Status': paper.status === 'failed' ? 'FAILED' : (paper.isRelevant ? 'INCLUDED' : 'EXCLUDED'),
        'Title': paper.title || 'Untitled',
        'DOI': doiVal || 'Not specified',
        'Key Findings': findingsVal,
        'Exclusion Reason': paper.isRelevant ? '-' : (paper.relevanceReason || 'Not specified'),
        'URL': paper.url || 'Not specified',
      };
      parameters.forEach(p => {
        row[p.name] = getPaperParameterValue(paper, p.id, mappings);
      });
      return row;
    }).sort((a, b) => b.Status.localeCompare(a.Status));

    const wsOverview = XLSX.utils.json_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(wb, wsOverview, "Overview");

    // 2. Individual Parameter Sheets (ONLY Relevant papers to match charts)
    parameters.forEach(p => {
      const paramData = papers
        .filter(paper => paper.isRelevant && paper.status !== 'failed')
        .map(paper => {
          const mapping = mappings.find(m => m.paperId === paper.id && m.parameterId === p.id);
          const val = getPaperParameterValue(paper, p.id, mappings);
          
          let displayValue: any = val;
          if (val === 'Not specified' && mapping?.value !== undefined && mapping?.value !== null) {
             displayValue = Array.isArray(mapping.value) ? mapping.value.join(', ') : (typeof mapping.value === 'object' ? JSON.stringify(mapping.value) : mapping.value);
          }

          return {
            'Paper Title': paper.title || 'Untitled',
            'Value': displayValue,
            'Evidence': mapping?.evidence || paper.keyFindings || 'Not specified',
            'Confidence': mapping?.confidence !== undefined ? mapping.confidence : 1.0
          };
        });
      
      if (paramData.length > 0) {
        const wsParam = XLSX.utils.json_to_sheet(paramData);
        XLSX.utils.book_append_sheet(wb, wsParam, p.name.substring(0, 31));
      }
    });

    // 3. Heatmaps Sheet
    if (summary.chartData.heatmaps && summary.chartData.heatmaps.length > 0) {
      const heatmapRows = summary.chartData.heatmaps.flatMap(heatmap => 
        heatmap.data.map(d => ({
          'Parameter Comparison': `Habitat Class vs ${heatmap.parameterName}`,
          'Habitat Class': d.x,
          [heatmap.parameterName]: d.y,
          'Citation Count': d.value
        }))
      );
      const wsHeatmaps = XLSX.utils.json_to_sheet(heatmapRows);
      XLSX.utils.book_append_sheet(wb, wsHeatmaps, "Heatmaps");
    }

    XLSX.writeFile(wb, `SLR_Analysis_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !summary) return;
    
    if (isVisOnly) {
      logAnalyticsEvent('chat_question', 'chatbox', inputMessage);
    }
    
    const userMsg: ChatMessage = { role: 'user', content: inputMessage };
    setChatMessages([...chatMessages, userMsg]);
    setInputMessage('');
    
    try {
      const response = await chatWithReview(inputMessage, { papers: reviewPapers, mappings: reviewMappings, summary });
      setChatMessages(prev => [...prev, response]);
    } catch (error: any) {
      const errorMessage = (error?.message || '').toLowerCase();
      let userFriendlyMessage = "Sorry, I encountered an error while processing your question.";
      
      if (errorMessage.includes('quota') || errorMessage.includes('rate limit') || errorMessage.includes('429')) {
        userFriendlyMessage = "I've hit my API quota limit. Please wait a few minutes before asking another question.";
      }
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: userFriendlyMessage }]);
    }
  };

  const renderSourceDocuments = () => (
    <section 
      onClick={() => { if (isVisOnly) logAnalyticsEvent('section_click', 'Source Documents List'); }}
      className="bg-white p-8 rounded-3xl shadow-sm border border-black/5"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-black/40">Source Documents ({papers.length})</h3>
          <p className="text-xs text-black/60">Detailed analysis results for each document in the repository</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" />
            <input 
              type="text" 
              placeholder="Search papers..." 
              value={paperSearch}
              onChange={(e) => setPaperSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-black/5 rounded-xl text-xs focus:ring-1 focus:ring-black/10 transition-all w-full sm:w-48"
            />
          </div>
          <select 
            value={paperFilter}
            onChange={(e) => setPaperFilter(e.target.value as any)}
            className="px-4 py-2 bg-black/5 rounded-xl text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-black/10 transition-all appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="relevant">Relevant</option>
            <option value="irrelevant">Irrelevant</option>
            <option value="failed">Failed</option>
          </select>
          <select 
            value={paperGroupBy}
            onChange={(e) => setPaperGroupBy(e.target.value)}
            className="px-4 py-2 bg-black/5 rounded-xl text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-black/10 transition-all appearance-none cursor-pointer"
          >
            <option value="none">No Grouping</option>
            {parameters.map(p => (
              <option key={p.id} value={p.id}>Group by {p.name}</option>
            ))}
          </select>
          {paperGroupBy !== 'none' && (
            <button 
              onClick={downloadGroupedTable}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black/80 transition-colors"
            >
              <Download size={14} />
              Grouped Table
            </button>
          )}
        </div>
      </div>
      
      <div className="space-y-12">
        {Object.entries(getGroupedPapers()).map(([groupName, groupPapers]) => (
          <div key={groupName} className="space-y-6">
            {paperGroupBy !== 'none' && (
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-black/5" />
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 whitespace-nowrap truncate max-w-[200px] sm:max-w-none">
                  {groupName} ({groupPapers.length})
                </h4>
                <div className="h-px flex-1 bg-black/5" />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {groupPapers.map(paper => (
                <div 
                  key={paper.id} 
                  onClick={() => setSelectedPaper(paper)}
                  className="p-3 bg-black/5 rounded-2xl flex items-center gap-3 hover:bg-black/10 transition-all cursor-pointer group border border-transparent hover:border-black/5"
                >
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center shadow-sm transition-colors shrink-0",
                    paper.status === 'failed' ? "bg-red-50 text-red-500" :
                    paper.isRelevant ? "bg-emerald-50 text-emerald-600" : "bg-white text-black/40"
                  )}>
                    {paper.status === 'failed' ? <AlertCircle size={14} /> : 
                     paper.isRelevant ? <CheckCircle2 size={14} /> : <FileText size={14} />}
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="text-xs font-bold truncate group-hover:text-black transition-colors">{paper.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[9px] text-black/40 truncate flex-1">{paper.path}</p>
                      {paper.isRelevant && (
                        <span className="text-[7px] font-bold uppercase tracking-tighter bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded shrink-0">Relevant</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={12} className="text-black/10 group-hover:text-black/30 transition-all group-hover:translate-x-1 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans">
      {/* Sidebar Navigation */}
      <nav className="fixed left-0 top-0 h-full w-20 bg-white border-r border-black/5 flex flex-col items-center py-8 gap-8 z-50">
        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white mb-4">
          <Database size={24} />
        </div>
        
        <NavButton 
          active={activeTab === 'analysis'} 
          onClick={() => {
            setActiveTab('analysis');
            logAnalyticsEvent('sidebar_click', 'Review');
          }} 
          icon={<BarChart3 size={20} />} 
          label="Review" 
        />
        <NavButton 
          active={activeTab === 'interactive'} 
          onClick={() => {
            setActiveTab('interactive');
            logAnalyticsEvent('sidebar_click', 'Visualizer');
          }} 
          icon={<Layers size={20} />} 
          label="Visualizer" 
        />
        <NavButton 
          active={activeTab === 'graph'} 
          onClick={() => {
            setActiveTab('graph');
            logAnalyticsEvent('sidebar_click', 'Graph');
          }} 
          icon={<Share2 size={20} />} 
          label="Graph" 
        />
        <NavButton 
          active={activeTab === 'source'} 
          onClick={() => {
            setActiveTab('source');
            logAnalyticsEvent('sidebar_click', 'Source');
          }} 
          icon={<FileText size={20} />} 
          label="Literature" 
        />
        <NavButton 
          active={activeTab === 'chat'} 
          onClick={() => {
            setActiveTab('chat');
            logAnalyticsEvent('sidebar_click', 'Chat');
          }} 
          icon={<MessageSquare size={20} />} 
          label="Assistant" 
        />

        <div className="mt-auto pb-4 flex flex-col items-center gap-3">
          <a 
            href="https://ais-pre-l2q5w2kqjoythmfxhzacal-384167759363.asia-east1.run.app/vis" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center transition-colors"
            title="Open Original Parent Tool in AI Studio"
          >
            <ExternalLink size={18} />
          </a>
          <a 
            href="https://github.com/zetazetalun/Space-Architecture-Literature" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center text-black/30 hover:text-black transition-colors"
            title="View Data Archive on GitHub"
          >
            <Github size={20} />
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pl-20 min-h-screen flex flex-col">
        <header className="h-16 bg-white border-b border-black/5 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold tracking-tight">Multi Agent SLR for CMs in ETEs</h1>
            <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200/80 rounded-full text-[10px] uppercase font-bold tracking-wider text-indigo-700">DATA VIS</span>
            <div className="hidden sm:flex items-center gap-2 ml-2 pl-3 border-l border-black/10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200/60 rounded-full text-[11px] font-semibold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {reviewPapers.length || papers.length} Papers
              </span>
              <span className="hidden md:inline-flex items-center px-2.5 py-0.5 bg-black/5 rounded-full text-[11px] font-medium text-black/60">
                {reviewMappings.length || mappings.length} Mappings
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5">
            {visSyncTime && (
              <span className="text-xs text-black/40 italic hidden lg:inline mr-1">
                Last refreshed: {visSyncTime}
              </span>
            )}

            <a
              href="https://ais-pre-l2q5w2kqjoythmfxhzacal-384167759363.asia-east1.run.app/vis"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-black/5 hover:bg-black/10 text-black/70 rounded-xl text-xs font-semibold transition-all border border-black/5"
              title="Open the original parent AI Studio tool"
            >
              <ExternalLink size={13} />
              <span>Parent Tool</span>
            </a>

            <button
              onClick={handleDirectRefresh}
              disabled={isSyncingRemote || visLoading}
              className="flex items-center gap-1.5 bg-black hover:bg-black/80 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50"
              title="Fetch latest generated dataset from parent tool"
            >
              <RefreshCw size={13} className={isSyncingRemote || visLoading ? 'animate-spin' : ''} />
              <span>{isSyncingRemote || visLoading ? 'Refreshing...' : 'Refresh Data'}</span>
            </button>

            <button
              onClick={() => setSyncModalOpen(true)}
              className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200/80 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              title="View data connection details and export"
            >
              <Database size={13} />
              <span className="hidden md:inline">Data Source</span>
            </button>

            <button
              onClick={downloadExcel}
              className="hidden md:flex items-center gap-1.5 bg-black/5 hover:bg-black/10 text-black/70 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              title="Download analysis dataset as Excel"
            >
              <Download size={13} />
              <span>Export</span>
            </button>
          </div>
        </header>

        <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {!summary ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="max-w-md bg-white p-8 rounded-3xl shadow-sm border border-black/5 space-y-6">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto animate-pulse">
                  <BarChart3 size={32} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold tracking-tight">Connecting to Literature Review Data</h2>
                  <p className="text-sm text-black/60 leading-relaxed">
                    Loading systematic literature review findings and visualisations from the parent database...
                  </p>
                </div>
                <button
                  onClick={() => fetchVisualizationState()}
                  disabled={visLoading}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-2xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
                >
                  <RefreshCw size={16} className={visLoading ? 'animate-spin' : ''} />
                  {visLoading ? 'Loading Visualisations...' : 'Refresh Dataset'}
                </button>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
            {activeTab === 'analysis' && summary && (
              <motion.div 
                key="analysis"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-black/5">
                      <div className="flex flex-col gap-6 mb-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <h2 className="text-3xl font-bold tracking-tight">Systematic Literature Review</h2>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={copyAllBibtex}
                              className="flex items-center gap-2 px-4 py-2 bg-black/5 text-black/60 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black/10 transition-colors"
                              title="Copy all relevant BibTeX citations"
                            >
                              <Copy size={14} />
                              BibTeX
                            </button>
                            <button 
                              onClick={downloadExcel}
                              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black/80 transition-colors whitespace-nowrap"
                            >
                              <Download size={14} />
                              Export Excel
                            </button>
                          </div>
                        </div>

                        {summary.performance && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 p-4 bg-black/[0.02] rounded-2xl border border-black/5">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-black/30 mb-1">Total Time</span>
                              <span className="text-sm font-bold text-black/70">{summary.performance.totalTimeMs ? (summary.performance.totalTimeMs / 1000).toFixed(1) : '0.0'}s</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-black/30 mb-1">Tokens</span>
                              <span className="text-sm font-bold text-black/70">{summary.performance.tokenUsage?.totalTokens?.toLocaleString() || 'N/A'}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-black/30 mb-1">Mapping</span>
                              <span className="text-sm font-bold text-black/70">{summary.performance.mappingTimeMs ? (summary.performance.mappingTimeMs / 1000).toFixed(1) : '0.0'}s</span>
                            </div>
                            {summary.mappingModel && (
                              <div className="flex flex-col">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-black/30 mb-1">Model</span>
                                <span className="text-sm font-bold text-black/70 uppercase">{summary.mappingModel.split('-')[0]}</span>
                              </div>
                            )}
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-black/30 mb-1">Total Papers</span>
                              <span className="text-sm font-bold text-black/70">{summary.performance.paperCount || 0}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-black/30 mb-1">Synthesis</span>
                              <span className="text-sm font-bold text-black/70">{summary.performance.synthesisTimeMs ? (summary.performance.synthesisTimeMs / 1000).toFixed(1) : '0.0'}s</span>
                            </div>
                          </div>
                        )}

                        {summary.metadata && (
                          <div className="flex flex-wrap gap-x-6 gap-y-2 px-4 py-2 bg-black/[0.01] rounded-xl border border-black/5 text-[10px] font-medium text-black/40 italic">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold uppercase tracking-tighter opacity-50">Version:</span>
                              <span>{summary.metadata.appVersion}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold uppercase tracking-tighter opacity-50">Generated:</span>
                              <span>{summary.metadata.generationDate}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold uppercase tracking-tighter opacity-50">Source:</span>
                              <span className="truncate max-w-[200px]">{summary.metadata.githubRepoUrl}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold uppercase tracking-tighter opacity-50">Ref:</span>
                              <span>{summary.metadata.githubRef}</span>
                            </div>
                          </div>
                        )}

                        {availableYears.length > 0 && (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-black/[0.02] rounded-2xl border border-black/5 mt-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-black/5 rounded-lg flex items-center justify-center text-black/60">
                                <span className="font-bold text-xs">YR</span>
                              </div>
                              <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-black/80">Publication Time Range</h4>
                                <p className="text-[10px] text-black/50">Filter review results and all graphical representations by year</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <select
                                value={startYear}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setStartYear(val);
                                  if (parseInt(val) > parseInt(endYear)) {
                                    setEndYear(val);
                                  }
                                }}
                                className="px-3 py-1.5 bg-white border border-black/10 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black/10 cursor-pointer"
                              >
                                {availableYears.map(yr => (
                                  <option key={yr} value={yr}>{yr}</option>
                                ))}
                              </select>
                              <span className="text-xs text-black/40 font-medium">to</span>
                              <select
                                value={endYear}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEndYear(val);
                                  if (parseInt(val) < parseInt(startYear)) {
                                    setStartYear(val);
                                  }
                                }}
                                className="px-3 py-1.5 bg-white border border-black/10 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black/10 cursor-pointer"
                              >
                                {availableYears.map(yr => (
                                  <option key={yr} value={yr}>{yr}</option>
                                ))}
                              </select>
                              {(startYear !== availableYears[0] || endYear !== availableYears[availableYears.length - 1]) && (
                                <button
                                  onClick={() => {
                                    setStartYear(availableYears[0]);
                                    setEndYear(availableYears[availableYears.length - 1]);
                                  }}
                                  className="ml-2 px-2.5 py-1.5 bg-black/5 hover:bg-black/10 text-black/60 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
                                >
                                  Reset
                                </button>
                              )}
                              <span className="ml-3 px-2 py-1 bg-black/5 text-black/50 rounded-lg text-[10px] font-bold">
                                {reviewPapers.length} / {papers.length} Papers
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      {(!isVisOnly || showReviewResults) && (
                        <div 
                          onClick={() => { if (isVisOnly) logAnalyticsEvent('section_click', 'Results Text'); }}
                          className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:text-black/70 prose-p:leading-relaxed prose-p:text-lg prose-li:text-black/70 prose-li:text-lg"
                        >
                          <Markdown>{summary.overview}</Markdown>
                          <h3 className="text-xl font-bold mt-12 mb-6">Key Findings</h3>
                          <Markdown>{summary.keyFindings}</Markdown>
                          <h3 className="text-xl font-bold mt-12 mb-6">Methodology Trends</h3>
                          <Markdown>{summary.methodologyTrends}</Markdown>
                          {summary.technologyClass3 && (
                            <>
                              <h3 className="text-xl font-bold mt-12 mb-6">Technology for Class III Habitat</h3>
                              <Markdown>{summary.technologyClass3}</Markdown>
                            </>
                          )}
                          {summary.chartAnalysis && (
                            <>
                              <h3 className="text-xl font-bold mt-12 mb-6">Chart Analysis & Interpretation</h3>
                              <Markdown>{summary.chartAnalysis}</Markdown>
                            </>
                          )}
                        </div>
                      )}
                    </section>

                  </div>

                  {(!isVisOnly || showReviewVisualisation) && (
                    <div 
                      onClick={() => { if (isVisOnly) logAnalyticsEvent('section_click', 'Charts & Graphical Analysis'); }}
                      className="space-y-8"
                    >
                      {summary.chartData?.distributions
                        ?.filter(dist => {
                          const name = dist.parameterName.toLowerCase();
                          return name.includes('year') || 
                                 name.includes('foci') || 
                                 name.includes('type') || 
                                 name.includes('scenario') || 
                                 name.includes('location') ||
                                 name.includes('habitat');
                        })
                        .map((dist, idx) => {
                          // Calculate height based on content
                          const itemCount = dist.data.length;
                          const calculatedHeight = dist.type === 'bar' 
                            ? Math.max(200, itemCount * 30) 
                            : 350;

                          return (
                            <section 
                              key={idx} 
                              className="bg-white p-8 rounded-3xl shadow-sm border border-black/5"
                              style={idx === 6 ? { height: '410px' } : undefined}
                            >
                              <h3 className="text-sm font-bold uppercase tracking-widest text-black/40 mb-6">{dist.parameterName}</h3>
                              <div style={{ height: idx === 6 ? '290px' : `${calculatedHeight}px` }} className="w-full">
                                {isMounted && (
                                  <ResponsiveContainer width="100%" height="100%" minWidth={10} minHeight={10} debounce={100}>
                                    {dist.type === 'pie' ? (
                                <PieChart>
                                  <Pie
                                    data={dist.data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                  >
                                    {dist.data.map((_, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                  />
                                  <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                              ) : dist.type === 'radar' ? (
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dist.data}>
                                  <PolarGrid stroke="#00000010" />
                                  <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: '#00000040' }} />
                                  <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fontSize: 8 }} />
                                  <Radar
                                    name={dist.parameterName}
                                    dataKey="value"
                                    stroke="#000000"
                                    fill="#000000"
                                    fillOpacity={0.1}
                                  />
                                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                </RadarChart>
                              ) : dist.type === 'treemap' ? (
                                <Treemap
                                  data={dist.data}
                                  dataKey="value"
                                  aspectRatio={4 / 3}
                                  stroke="#fff"
                                  content={<CustomizedTreemapContent colors={COLORS} />}
                                >
                                  <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    formatter={(value: number) => [value, 'Count']}
                                  />
                                </Treemap>
                              ) : (
                                <BarChart data={dist.data}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000005" />
                                  <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 9, fill: '#00000040' }} 
                                    interval={dist.data.length > 10 ? 'preserveStartEnd' : 0}
                                  />
                                  <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 9, fill: '#00000040' }} 
                                  />
                                  <Tooltip 
                                    cursor={{ fill: '#00000005' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '11px' }}
                                  />
                                  <Bar dataKey="value" fill="#000000" radius={[4, 4, 0, 0]} barSize={24} />
                                </BarChart>
                              )}
                            </ResponsiveContainer>
                          )}
                        </div>
                      </section>
                      );
                    })}
                  </div>
                  )}
                </div>

                <div className="space-y-8 mt-8 mb-8">
                  {(!isVisOnly || showReviewParameters) && (
                    <div onClick={() => { if (isVisOnly) logAnalyticsEvent('section_click', 'Parameter Definitions'); }}>
                      <ParameterDefinitions parameters={parameters} />
                    </div>
                  )}

                  {summary.chartData?.relevance && (
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-black/5">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold uppercase tracking-widest text-black/40">Paper Relevance Analysis</h3>
                          <p className="text-xs text-black/60">Distribution of relevant vs irrelevant papers in the knowledge base</p>
                        </div>
                      </div>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Relevant', value: summary.chartData?.relevance?.relevant || 0 },
                                { name: 'Irrelevant', value: summary.chartData?.relevance?.irrelevant || 0 },
                                ...(summary.chartData?.relevance?.failed ? [{ name: 'Failed Analysis', value: summary.chartData.relevance.failed }] : [])
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              <Cell fill="#10b981" />
                              <Cell fill="#ef4444" />
                              {summary.chartData?.relevance?.failed && <Cell fill="#94a3b8" />}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </section>
                  )}

                  {(!isVisOnly || showReviewInteractive) && (
                    <section 
                      onClick={() => { if (isVisOnly) logAnalyticsEvent('section_click', 'Interactive Chart Builder'); }}
                      className="bg-white p-8 rounded-3xl shadow-sm border border-black/5"
                    >
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                          <BarChart3 size={20} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold uppercase tracking-widest text-black/40">Interactive Chart Builder</h3>
                          <p className="text-xs text-black/60">Generate custom visualizations by combining research parameters</p>
                        </div>
                      </div>
                      <InteractiveChartBuilder 
                        papers={reviewPapers} 
                        mappings={reviewMappings} 
                        parameters={parameters} 
                        onChartGenerated={(p1, p2, type) => {
                          if (isVisOnly) {
                            logAnalyticsEvent('chart_generated', `${p1} vs ${p2} (${type})`);
                          }
                        }}
                        onChartDownloaded={() => {
                          if (isVisOnly) {
                            logAnalyticsEvent('chart_download', 'interactive_chart');
                          }
                        }}
                      />
                    </section>
                  )}
                </div>

                {!isVisOnly && renderSourceDocuments()}
              </motion.div>
            )}

            {activeTab === 'interactive' && (
              <motion.div 
                key="interactive"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-7xl mx-auto pb-16 space-y-8"
              >
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-black/5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                        <Layers size={20} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold tracking-tight">Interactive Visualizer & Cross-Tabulation</h2>
                        <p className="text-xs text-black/60">Generate dynamic charts across any two research parameters with instant graphic export</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={downloadExcel}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-black/5 hover:bg-black/10 text-black/80 rounded-xl text-xs font-semibold transition-colors"
                      >
                        <Download size={13} />
                        Export Data (Excel)
                      </button>
                    </div>
                  </div>
                  <InteractiveChartBuilder 
                    papers={reviewPapers.length > 0 ? reviewPapers : papers} 
                    mappings={reviewMappings.length > 0 ? reviewMappings : mappings} 
                    parameters={parameters} 
                    onChartGenerated={(p1, p2, type) => {
                      logAnalyticsEvent('chart_generated', `${p1} vs ${p2} (${type})`);
                    }}
                    onChartDownloaded={() => {
                      logAnalyticsEvent('chart_download', 'interactive_chart');
                    }}
                  />
                </section>
              </motion.div>
            )}

            {activeTab === 'source' && (
              <motion.div 
                key="source"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-7xl mx-auto pb-16"
              >
                {renderSourceDocuments()}
              </motion.div>
            )}

            {activeTab === 'graph' && (summary || reviewPapers.length > 0 || papers.length > 0) && (
              <motion.div 
                key="graph"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-[calc(100vh-12rem)]"
              >
                <KnowledgeGraph
                  papers={reviewPapers.length > 0 ? reviewPapers : papers}
                  mappings={reviewMappings.length > 0 ? reviewMappings : mappings}
                  parameters={parameters}
                  onGraphSynced={(n, e) => addLog('info', `Knowledge Graph synchronized: ${n} nodes, ${e} relationships.`)}
                />
              </motion.div>
            )}

            {activeTab === 'chat' && summary && (
              <motion.div 
                key="chat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto pb-16"
              >
                <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-black/5 h-[650px] flex flex-col">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-black/5">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-black/40">Scientific Chatbox</h3>
                      <p className="text-xs text-black/60">Ask questions and analyze review papers</p>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto space-y-6 pb-4 pr-2 scrollbar-hide">
                    {chatMessages.length === 0 && (
                      <div className="text-center py-12 space-y-4">
                        <div className="w-16 h-16 bg-black/5 rounded-3xl flex items-center justify-center mx-auto">
                          <MessageSquare size={32} className="text-black/20" />
                        </div>
                        <h3 className="text-xl font-semibold">Ask about the review</h3>
                        <p className="text-sm text-black/40 max-w-xs mx-auto">The agent can answer specific questions based on the extracted data and full text of the papers.</p>
                      </div>
                    )}
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={cn(
                        "flex gap-4",
                        msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                      )}>
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                          msg.role === 'user' ? "bg-black text-white" : "bg-black/5 text-black"
                        )}>
                          {msg.role === 'user' ? "U" : "A"}
                        </div>
                        <div className={cn(
                          "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed relative group",
                          msg.role === 'user' ? "bg-black text-white" : "bg-white shadow-sm border border-black/5"
                        )}>
                          <Markdown>{msg.content}</Markdown>
                          {msg.performance && (
                            <div className={cn(
                              "absolute -bottom-5 right-0 text-[8px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-black/40"
                            )}>
                              Execution: {msg.performance.executionTimeMs}ms
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="pt-4 border-t border-black/5">
                    <div className="relative">
                      <input 
                        type="text" 
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask a question about the research findings..."
                        className="w-full pl-6 pr-16 py-4 bg-black/5 rounded-2xl focus:ring-2 focus:ring-black/10 focus:bg-white transition-all text-sm outline-none"
                      />
                      <button 
                        onClick={handleSendMessage}
                        className="absolute right-3 top-3 p-2 bg-black text-white rounded-xl hover:bg-black/80 transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>
          )}
        </div>

        <footer className="mt-auto py-12 px-8 border-t border-black/5 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30">Created by:</p>
              <p className="text-sm font-semibold text-black/80">朱哲伦 (ZHU Zhelun), PhD, P.E., M.Eng.</p>
              <a href="mailto:zhelunzhu@gmail.com" className="text-xs text-black/50 hover:text-black transition-colors underline underline-offset-4 decoration-black/10">zhelunzhu@gmail.com</a>
            </div>
            
            <div className="md:text-right space-y-1 max-w-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30">Creative Copyright</p>
              <p className="text-sm font-semibold text-black/80 italic tracking-tight">Attribution-NonCommercial (CC BY-NC)</p>
              <p className="text-[10px] leading-relaxed text-black/40">
                This license allows others to remix, adapt, and build upon this work non-commercially. 
                New works must acknowledge the creator and be non-commercial. 
                Commercial use of this content is strictly prohibited without explicit permission.
              </p>
            </div>
          </div>
        </footer>
      </main>

      <AnimatePresence>
        {selectedPaper && (
          <PaperDetailsModal 
            paper={selectedPaper} 
            onClose={() => setSelectedPaper(null)} 
            mappings={mappings.filter(m => m.paperId === selectedPaper.id)}
            parameters={parameters}
          />
        )}
        {syncModalOpen && (
          <DataSourceModal
            isOpen={syncModalOpen}
            onClose={() => {
              setSyncModalOpen(false);
              setSyncStatusMsg(null);
            }}
            papersCount={reviewPapers.length || papers.length}
            mappingsCount={reviewMappings.length || mappings.length}
            syncTime={visSyncTime}
            onDirectRefresh={handleDirectRefresh}
            onSyncGitHub={handleSyncWithGitHub}
            onSyncRemote={handleSyncWithRemoteApplet}
            onImportJson={handleImportJsonFile}
            onExportJson={handleExportJson}
            onExportExcel={downloadExcel}
            isSyncing={isSyncingRemote}
            remoteUrl={remoteSyncUrl}
            setRemoteUrl={setRemoteSyncUrl}
            remoteToken={remoteSyncToken}
            setRemoteToken={setRemoteSyncToken}
            statusMsg={syncStatusMsg}
            snapshots={visSnapshots}
            onRestoreSnapshot={restoreSnapshot}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PaperDetailsModal({ paper, onClose, mappings, parameters }: { paper: Paper, onClose: () => void, mappings: MappingResult[], parameters: ResearchParameter[] }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 border-b border-black/5 flex items-start justify-between bg-black/[0.02]">
          <div className="flex gap-6 items-start">
            <div className={cn(
              "w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 shadow-sm",
              paper.status === 'failed' ? "bg-red-50 text-red-500" :
              paper.isRelevant ? "bg-emerald-50 text-emerald-600" : "bg-white text-black/20"
            )}>
              {paper.status === 'failed' ? <AlertCircle size={32} /> : 
               paper.isRelevant ? <CheckCircle2 size={32} /> : <FileText size={32} />}
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight leading-tight">{paper.title}</h2>
              <div className="flex flex-wrap gap-3 items-center">
                <p className="text-xs text-black/40 font-mono">{paper.path}</p>
                {paper.doi && (
                  <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-widest">DOI: {paper.doi}</a>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-black/5 rounded-2xl transition-colors">
            <X size={20} className="text-black/40" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-10">
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30">Relevance Classification</h3>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full",
                    paper.isRelevant ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
                  )}>
                    {paper.isRelevant ? "Included in SLR" : "Excluded"}
                  </span>
                </div>
                <div className={cn(
                  "p-6 rounded-3xl border",
                  paper.isRelevant ? "bg-emerald-50/50 border-emerald-100" : "bg-red-50/50 border-red-100"
                )}>
                  <p className="text-sm font-bold mb-2 flex items-center gap-2">
                    {paper.isRelevant ? <CheckCircle2 size={16} className="text-emerald-600" /> : <XCircle size={16} className="text-red-600" />}
                    {paper.isRelevant ? "Classified as Relevant" : "Classified as Irrelevant"}
                  </p>
                  <p className="text-sm text-black/60 leading-relaxed italic">"{paper.relevanceReason || "No reason provided."}"</p>
                </div>
              </section>

              {paper.keyFindings && (
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 mb-4">Key Findings</h3>
                  <div className="prose prose-sm max-w-none prose-p:text-black/70 prose-p:leading-relaxed">
                    <Markdown>{paper.keyFindings}</Markdown>
                  </div>
                </section>
              )}

              {paper.markdownContent && (
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 mb-4">Extracted Knowledge</h3>
                  <div className="bg-black/5 p-6 rounded-3xl overflow-x-auto">
                    <div className="prose prose-sm max-w-none prose-p:text-black/60 prose-headings:text-black/80">
                      <Markdown>{paper.markdownContent}</Markdown>
                    </div>
                  </div>
                </section>
              )}
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 mb-4">Research Parameters</h3>
                <div className="space-y-3">
                  {parameters.map(param => {
                    const mapping = mappings.find(m => m.parameterId === param.id);
                    return (
                      <div key={param.id} className="p-4 bg-white border border-black/5 rounded-2xl shadow-sm">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1">{param.name}</p>
                        <p className="text-sm font-bold text-black/80">{mapping?.value || <span className="text-black/20 italic">Not found</span>}</p>
                        {mapping?.confidence && (
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-1 bg-black/5 rounded-full overflow-hidden">
                              <div className="h-full bg-black/20" style={{ width: `${mapping.confidence * 100}%` }} />
                            </div>
                            <span className="text-[8px] font-bold text-black/30">{Math.round(mapping.confidence * 100)}%</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {paper.bibtex && (
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 mb-4">BibTeX Citation</h3>
                  <div className="relative group">
                    <pre className="text-[10px] bg-black/5 p-4 rounded-2xl overflow-x-auto font-mono text-black/60 leading-relaxed">
                      {paper.bibtex}
                    </pre>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(paper.bibtex || '');
                        alert('Citation copied to clipboard!');
                      }}
                      className="absolute top-2 right-2 p-2 bg-white rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black hover:text-white"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-black/5 bg-black/[0.01] flex justify-between items-center">
          <div className="flex gap-4">
            {paper.url && (
              <a 
                href={paper.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-black/80 transition-all"
              >
                <ExternalLink size={14} />
                View Original PDF
              </a>
            )}
          </div>
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-black/5 text-black/60 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-black/10 transition-all"
          >
            Close Details
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function NavButton({ active, onClick, icon, label, disabled }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, disabled?: boolean }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col items-center gap-1 transition-all group disabled:opacity-30 disabled:cursor-not-allowed",
        active ? "text-black" : "text-black/20 hover:text-black/40"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
        active ? "bg-black/5" : "group-hover:bg-black/5"
      )}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}

function AgentInfo({ icon, name, desc }: { icon: React.ReactNode, name: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold">{name}</h4>
        <p className="text-xs text-white/60 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function DataSourceModal({
  isOpen,
  onClose,
  papersCount,
  mappingsCount,
  syncTime,
  onDirectRefresh,
  onSyncGitHub,
  onSyncRemote,
  onImportJson,
  onExportJson,
  onExportExcel,
  isSyncing,
  remoteUrl,
  setRemoteUrl,
  remoteToken,
  setRemoteToken,
  statusMsg,
  snapshots,
  onRestoreSnapshot
}: {
  isOpen: boolean;
  onClose: () => void;
  papersCount: number;
  mappingsCount: number;
  syncTime: string;
  onDirectRefresh: () => void;
  onSyncGitHub: () => void;
  onSyncRemote: () => void;
  onImportJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExportJson: () => void;
  onExportExcel: () => void;
  isSyncing: boolean;
  remoteUrl: string;
  setRemoteUrl: (u: string) => void;
  remoteToken: string;
  setRemoteToken: (t: string) => void;
  statusMsg: { type: 'success' | 'error' | 'info'; text: string } | null;
  snapshots: any[];
  onRestoreSnapshot: (id: number) => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-black/10 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-black/5 flex items-center justify-between bg-black/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Database size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-black/90">Data Source & Synchronization</h2>
              <p className="text-xs text-black/50">Multi Agent Systematic Literature Review Dataset</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/60 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">Live Active Dataset</p>
                <p className="text-xs text-emerald-700">
                  <strong>{papersCount}</strong> Papers Analyzed &bull; <strong>{mappingsCount}</strong> Parameter Mappings
                </p>
              </div>
            </div>
            {syncTime && (
              <span className="text-[11px] font-medium text-emerald-800 bg-white/70 px-2.5 py-1 rounded-full border border-emerald-200">
                Synced at {syncTime}
              </span>
            )}
          </div>

          {/* Data Security Notice */}
          <div className="p-3.5 bg-black/[0.02] border border-black/5 rounded-2xl text-[11px] text-black/60 leading-relaxed flex items-start gap-2.5">
            <span className="text-emerald-600 text-sm">🛡️</span>
            <div>
              <strong className="text-black/80 font-semibold">External Presentation Architecture:</strong>
              <p className="mt-0.5">This frontend delivers secure, high-performance visualization for external researchers and reviewers. Repository modification credentials, token settings, and backend agent pipelines are maintained exclusively in the parent system.</p>
            </div>
          </div>

          {/* Feedback status message */}
          {statusMsg && (
            <div className={cn(
              "p-4 rounded-2xl text-xs flex items-start gap-2 border leading-relaxed",
              statusMsg.type === 'success' ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
              statusMsg.type === 'error' ? "bg-red-50 border-red-200 text-red-800" :
              "bg-indigo-50 border-indigo-200 text-indigo-800"
            )}>
              <Info size={16} className="shrink-0 mt-0.5" />
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Source 1: Parent Tool Feed (Primary) */}
          <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/30 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-indigo-600" />
                <h3 className="text-sm font-bold text-black/90">Original Parent Tool Generated Dataset</h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                Active Source
              </span>
            </div>
            <p className="text-xs text-black/60 leading-relaxed">
              Linked to the primary SLR extraction and synthesis engine running at <code className="bg-black/5 px-1 py-0.5 rounded text-[11px]">https://ais-pre-l2q5w2kqjoythmfxhzacal-384167759363.asia-east1.run.app/vis</code>.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                onClick={onDirectRefresh}
                disabled={isSyncing}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
              >
                <RefreshCw size={13} className={isSyncing ? "animate-spin" : ""} />
                {isSyncing ? "Refreshing Dataset..." : "Refresh Data from Parent Tool"}
              </button>
              <a
                href="https://ais-pre-l2q5w2kqjoythmfxhzacal-384167759363.asia-east1.run.app/vis"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition-colors"
              >
                <ExternalLink size={12} /> Open Parent Tool in AI Studio
              </a>
            </div>
          </div>

          {/* Source 2: Canonical GitHub Repository */}
          <div className="p-5 rounded-2xl border border-black/10 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Github size={18} className="text-black/70" />
                <h3 className="text-sm font-bold text-black/90">Canonical Repository Archive (GitHub)</h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                Synced Archive
              </span>
            </div>
            <p className="text-xs text-black/60 leading-relaxed">
              State archive stored in <code className="bg-black/5 px-1 py-0.5 rounded text-[11px]">analysis_state.json</code> in <a href="https://github.com/zetazetalun/Space-Architecture-Literature" target="_blank" rel="noreferrer" className="underline font-medium text-indigo-600 hover:text-indigo-800">zetazetalun/Space-Architecture-Literature</a>.
            </p>
            <div className="pt-1 flex items-center gap-3">
              <button
                onClick={onSyncGitHub}
                disabled={isSyncing}
                className="flex items-center gap-2 bg-black hover:bg-black/80 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
              >
                <RefreshCw size={13} className={isSyncing ? "animate-spin" : ""} />
                {isSyncing ? "Pulling Data..." : "Pull Latest from GitHub"}
              </button>
              <a
                href="https://github.com/zetazetalun/Space-Architecture-Literature/blob/main/analysis_state.json"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-black/50 hover:text-black flex items-center gap-1 transition-colors"
              >
                <ExternalLink size={12} /> View File on GitHub
              </a>
            </div>
          </div>

          {/* Source 3: Backup & File Import / Export */}
          <div className="p-5 rounded-2xl border border-black/10 bg-white shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-amber-600" />
              <h3 className="text-sm font-bold text-black/90">Export & Import Options</h3>
            </div>
            <p className="text-xs text-black/60 leading-relaxed">
              Export data for citation, manuscript compilation, or offline preservation.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={onExportExcel}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <Download size={13} /> Export Excel (.xlsx)
              </button>
              <button
                onClick={onExportJson}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-black/5 hover:bg-black/10 text-black/80 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <Download size={13} /> Export JSON (.json)
              </button>
              <label className="flex items-center gap-1.5 px-3.5 py-2 bg-black/5 hover:bg-black/10 text-black/80 rounded-xl text-xs font-semibold transition-colors cursor-pointer">
                <Upload size={13} /> Import JSON File
                <input
                  type="file"
                  accept=".json"
                  onChange={onImportJson}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Snapshots history */}
          {snapshots && snapshots.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-black/50">Recent State Snapshots</h4>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {snapshots.slice(0, 5).map(snap => (
                  <div key={snap.id} className="p-2.5 bg-black/[0.02] border border-black/5 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-black/80">Snapshot #{snap.id}</span>
                      <span className="text-black/40 ml-2">{new Date(snap.createdAt).toLocaleString()}</span>
                      <span className="text-black/50 ml-2">({snap.paperCount} papers)</span>
                    </div>
                    <button
                      onClick={() => onRestoreSnapshot(snap.id)}
                      className="px-2.5 py-1 bg-white hover:bg-black hover:text-white border border-black/10 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-black/[0.02] border-t border-black/5 flex items-center justify-between">
          <span className="text-[11px] text-black/40">Multi Agent SLR for CMs in ETEs - DATA VIS</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-black hover:bg-black/80 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
