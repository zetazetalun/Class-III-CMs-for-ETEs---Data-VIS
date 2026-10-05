import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, 
  BarChart3, 
  MessageSquare, 
  Github,
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
  Layers,
  Share2,
  UploadCloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResearchParameter, Paper, MappingResult, ReviewSummary, ChatMessage } from './types';
import { chatWithReview } from './services/gemini';
import { getDynamicCounts, getDynamicHeatmap, normalizeValue, getPaperParameterValue } from './lib/normalize';
import InteractiveChartBuilder from './components/InteractiveChartBuilder';
import KnowledgeGraph from './components/KnowledgeGraph';
import { ContributionSection } from './components/ContributionSection';
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
  const { depth, x, y, width, height, index, colors, name, value } = props;

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
          <p className="text-xs text-black/60">Standardized classification criteria used in this Systematic Literature Review</p>
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ec4899', '#6366f1'];

const DEFAULT_PARAMETERS: ResearchParameter[] = [
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
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'analysis' | 'interactive' | 'graph' | 'source' | 'chat' | 'contribute'>('analysis');
  const [parameters] = useState<ResearchParameter[]>(DEFAULT_PARAMETERS);
  
  const [papersState, setPapersState] = useState<Paper[]>([]);
  const [mappingsState, setMappingsState] = useState<MappingResult[]>([]);
  const [rawSummary, setRawSummary] = useState<ReviewSummary | null>(null);
  
  const [visLoading, setVisLoading] = useState(false);
  const [visSyncTime, setVisSyncTime] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Filters & Search
  const [startYear, setStartYear] = useState<string>('');
  const [endYear, setEndYear] = useState<string>('');
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [paperSearch, setPaperSearch] = useState('');
  const [paperFilter, setPaperFilter] = useState<'all' | 'relevant' | 'irrelevant' | 'failed'>('all');
  const [paperGroupBy, setPaperGroupBy] = useState<string>('none');

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Collect available publication years
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    
    mappingsState.forEach(m => {
      if (m.parameterId === 'year' && m.value) {
        const normalized = normalizeValue('year', m.value);
        normalized.forEach(y => {
          if (/^\d{4}$/.test(y)) years.add(y);
        });
      }
    });

    papersState.forEach(paper => {
      if (paper.bibtex) {
        const bibMatch = paper.bibtex.match(/year\s*=\s*[\{\"]?((?:19|20)\d{2})[\}\"]?/i);
        if (bibMatch) years.add(bibMatch[1]);
      }
      const pathMatch = (paper.path || '').match(/(19|20)\d{2}/);
      if (pathMatch) years.add(pathMatch[0]);
      const titleMatch = (paper.title || '').match(/(19|20)\d{2}/);
      if (titleMatch) years.add(titleMatch[0]);
    });

    return Array.from(years).sort((a, b) => parseInt(a) - parseInt(b));
  }, [mappingsState, papersState]);

  useEffect(() => {
    if (availableYears.length > 0) {
      setStartYear(prev => (prev && availableYears.includes(prev) ? prev : availableYears[0]));
      setEndYear(prev => (prev && availableYears.includes(prev) ? prev : availableYears[availableYears.length - 1]));
    }
  }, [availableYears]);

  // Filter papers and mappings by selected year range
  const filteredPapersAndMappings = useMemo(() => {
    if (!startYear || !endYear || availableYears.length === 0) {
      return { papers: papersState, mappings: mappingsState };
    }

    const start = parseInt(startYear);
    const end = parseInt(endYear);
    const papersInYearRange = new Set<string>();

    papersState.forEach(paper => {
      let paperYear: string | null = null;
      const yearMapping = mappingsState.find(m => m.paperId === paper.id && m.parameterId === 'year');
      if (yearMapping && yearMapping.value) {
        const normalized = normalizeValue('year', yearMapping.value);
        const found = normalized.find(y => /^\d{4}$/.test(y));
        if (found) paperYear = found;
      }
      if (!paperYear && paper.bibtex) {
        const bibMatch = paper.bibtex.match(/year\s*=\s*[\{\"]?((?:19|20)\d{2})[\}\"]?/i);
        if (bibMatch) paperYear = bibMatch[1];
      }
      if (!paperYear && paper.path) {
        const pathMatch = paper.path.match(/(19|20)\d{2}/);
        if (pathMatch) paperYear = pathMatch[0];
      }
      if (!paperYear && paper.title) {
        const titleMatch = paper.title.match(/(19|20)\d{2}/);
        if (titleMatch) paperYear = titleMatch[0];
      }

      if (paperYear) {
        const yNum = parseInt(paperYear);
        if (yNum >= start && yNum <= end) papersInYearRange.add(paper.id);
      } else {
        papersInYearRange.add(paper.id);
      }
    });

    return {
      papers: papersState.filter(p => papersInYearRange.has(p.id)),
      mappings: mappingsState.filter(m => papersInYearRange.has(m.paperId))
    };
  }, [papersState, mappingsState, startYear, endYear, availableYears]);

  const reviewPapers = filteredPapersAndMappings.papers;
  const reviewMappings = filteredPapersAndMappings.mappings;

  // Build reactive review summary with chart distributions
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

  // Load visualization data from server database
  const fetchVisualizationState = async (silent = false) => {
    if (!silent) setVisLoading(true);
    try {
      const response = await fetch('/api/vis-state');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.papers && data.papers.length > 0) {
          setPapersState(data.papers || []);
          setMappingsState(data.mappings || []);
          setRawSummary(data.summary || null);
          if (data.chatMessages) {
            setChatMessages(data.chatMessages);
          }
          const timeStr = data.updatedAt 
            ? new Date(data.updatedAt).toLocaleTimeString() 
            : new Date().toLocaleTimeString();
          setVisSyncTime(timeStr);
        } else {
          // If database is empty, auto-trigger a background sync
          handleDirectRefresh();
        }
      }
    } catch (error) {
      console.warn('Error fetching visualization state:', error);
    } finally {
      if (!silent) setVisLoading(false);
    }
  };

  const handleDirectRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/sync/refresh', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchVisualizationState(true);
      }
    } catch (err) {
      console.error("Failed to refresh dataset:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const copyAllBibtex = () => {
    const relevantPapers = reviewPapers.filter(p => p.isRelevant && p.bibtex);
    const allBibtex = relevantPapers.map(p => p.bibtex).join('\n\n');
    if (allBibtex) {
      navigator.clipboard.writeText(allBibtex);
    }
  };

  const downloadExcel = () => {
    if (!summary || reviewPapers.length === 0) return;
    const wb = XLSX.utils.book_new();

    // 1. Overview Sheet
    const overviewData = reviewPapers.map(paper => {
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
        row[p.name] = getPaperParameterValue(paper, p.id, reviewMappings);
      });
      return row;
    }).sort((a, b) => b.Status.localeCompare(a.Status));

    const wsOverview = XLSX.utils.json_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(wb, wsOverview, "Overview");

    // 2. Individual Parameter Sheets
    parameters.forEach(p => {
      const paramData = reviewPapers
        .filter(paper => paper.isRelevant && paper.status !== 'failed')
        .map(paper => {
          const mapping = reviewMappings.find(m => m.paperId === paper.id && m.parameterId === p.id);
          const val = getPaperParameterValue(paper, p.id, reviewMappings);
          
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

    XLSX.writeFile(wb, `SLR_Visualisation_Dataset_${new Date().toISOString().split('T')[0]}.xlsx`);
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
      const mapping = reviewMappings.find(m => m.paperId === paper.id && m.parameterId === paperGroupBy);
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
    
    const data = Object.entries(grouped).flatMap(([groupName, groupPapers]) => 
      groupPapers
        .filter(p => p.isRelevant && p.status !== 'failed')
        .map(paper => {
          const groupParam = parameters.find(p => p.id === paperGroupBy);
          const groupHeader = groupParam ? groupParam.name : 'Grouping';
          const yearVal = getPaperParameterValue(paper, 'year', reviewMappings);
          const authorsVal = getPaperParameterValue(paper, 'authors', reviewMappings);
          
          const row: any = {};
          row[groupHeader] = groupName;
          if (groupHeader !== 'Year of Publication') row['Year of Publication'] = yearVal;
          if (groupHeader !== 'Authors') row['Authors'] = authorsVal;
          if (groupHeader !== 'Title') row['Title'] = paper.title || 'Not specified';
          return row;
        })
    );

    if (data.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Grouped Analysis");
    XLSX.writeFile(wb, `SLR_Grouped_Analysis_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !summary) return;
    const userMsg: ChatMessage = { role: 'user', content: inputMessage };
    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    try {
      const response = await chatWithReview(inputMessage, { papers: reviewPapers, mappings: reviewMappings, summary });
      setChatMessages(prev => [...prev, response]);
    } catch {
      setChatMessages(prev => [
        ...prev, 
        { role: 'assistant', content: "Sorry, I encountered an issue querying the review dataset. Please try again in a moment." }
      ]);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchVisualizationState(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Primary Sidebar Navigation */}
      <nav className="fixed left-0 top-0 h-full w-20 bg-white border-r border-black/5 flex flex-col items-center py-6 gap-6 z-50 shadow-xs">
        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white mb-2 shadow-xs">
          <Database size={22} />
        </div>
        
        <NavButton 
          active={activeTab === 'analysis'} 
          onClick={() => setActiveTab('analysis')} 
          icon={<BarChart3 size={20} />} 
          label="Review" 
        />
        <NavButton 
          active={activeTab === 'interactive'} 
          onClick={() => setActiveTab('interactive')} 
          icon={<Layers size={20} />} 
          label="Charts" 
        />
        <NavButton 
          active={activeTab === 'source'} 
          onClick={() => setActiveTab('source')} 
          icon={<FileText size={20} />} 
          label="Literature" 
        />
        <NavButton 
          active={activeTab === 'chat'} 
          onClick={() => setActiveTab('chat')} 
          icon={<MessageSquare size={20} />} 
          label="Chatbox" 
        />
        <NavButton 
          active={activeTab === 'contribute'} 
          onClick={() => setActiveTab('contribute')} 
          icon={<UploadCloud size={20} />} 
          label="Contribute" 
        />

        <div className="mt-auto pb-4 flex flex-col items-center gap-3">
          <a 
            href="https://github.com/zetazetalun" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center text-black/30 hover:text-black transition-colors rounded-xl hover:bg-black/5"
            title="GitHub (@zetazetalun)"
          >
            <Github size={20} />
          </a>
        </div>
      </nav>

      {/* Main Container */}
      <main className="pl-20 min-h-screen flex flex-col">
        {/* Sticky Top Header */}
        <header className="h-16 bg-white border-b border-black/5 flex items-center justify-between px-6 sm:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <h1 className="text-base sm:text-lg font-semibold tracking-tight">Systematic Literature Review for CMs in ETEs</h1>
          </div>
          
          <div className="flex items-center gap-2.5">
            {visSyncTime && (
              <span className="text-xs text-black/40 italic hidden lg:inline mr-1">
                Last refreshed: {visSyncTime}
              </span>
            )}

            <button
              onClick={handleDirectRefresh}
              disabled={isRefreshing || visLoading}
              className="flex items-center gap-1.5 bg-black hover:bg-black/80 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50"
              title="Refresh literature dataset"
            >
              <RefreshCw size={13} className={isRefreshing || visLoading ? 'animate-spin' : ''} />
              <span>{isRefreshing || visLoading ? 'Refreshing...' : 'Refresh Data'}</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-x-hidden flex-1">
          {!summary ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="max-w-md bg-white p-8 rounded-3xl shadow-sm border border-black/5 space-y-6">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto animate-pulse">
                  <BarChart3 size={32} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold tracking-tight">Connecting to Literature Review Data</h2>
                  <p className="text-sm text-black/60 leading-relaxed">
                    Loading systematic literature review findings and visualisations...
                  </p>
                </div>
                <button
                  onClick={handleDirectRefresh}
                  disabled={visLoading || isRefreshing}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-2xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
                >
                  <RefreshCw size={16} className={visLoading || isRefreshing ? 'animate-spin' : ''} />
                  {visLoading || isRefreshing ? 'Loading Dataset...' : 'Refresh Dataset'}
                </button>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* TAB 1: REVIEW DASHBOARD */}
              {activeTab === 'analysis' && summary && (
                <motion.div 
                  key="analysis"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left 2 Cols: Synthesis & Findings */}
                    <div className="lg:col-span-2 space-y-8">
                      <section className="bg-white p-8 rounded-3xl shadow-sm border border-black/5">
                        <div className="flex flex-col gap-6 mb-8">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h2 className="text-3xl font-bold tracking-tight">Systematic Literature Review</h2>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={copyAllBibtex}
                                className="flex items-center gap-2 px-4 py-2 bg-black/5 text-black/60 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black/10 transition-colors cursor-pointer"
                                title="Copy all relevant BibTeX citations"
                              >
                                <Copy size={14} />
                                BibTeX
                              </button>
                              <button 
                                onClick={downloadExcel}
                                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black/80 transition-colors whitespace-nowrap cursor-pointer"
                              >
                                <Download size={14} />
                                Export Excel
                              </button>
                            </div>
                          </div>

                          {/* Dataset Stats Pills */}
                          {summary.performance && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-black/[0.02] rounded-2xl border border-black/5">
                              <div className="flex flex-col">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-black/30 mb-1">Total Papers</span>
                                <span className="text-sm font-bold text-black/70">{reviewPapers.length} / {papersState.length}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-black/30 mb-1">Total Mappings</span>
                                <span className="text-sm font-bold text-black/70">{reviewMappings.length}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-black/30 mb-1">Relevant Papers</span>
                                <span className="text-sm font-bold text-emerald-600">{reviewPapers.filter(p => p.isRelevant).length}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-black/30 mb-1">Synthesis Model</span>
                                <span className="text-sm font-bold text-black/70 uppercase">GEMINI</span>
                              </div>
                            </div>
                          )}

                          {/* Publication Year Range Filter */}
                          {availableYears.length > 0 && (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-black/[0.02] rounded-2xl border border-black/5">
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
                                    if (parseInt(val) > parseInt(endYear)) setEndYear(val);
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
                                    if (parseInt(val) < parseInt(startYear)) setStartYear(val);
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
                                    className="ml-2 px-2.5 py-1.5 bg-black/5 hover:bg-black/10 text-black/60 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                                  >
                                    Reset
                                  </button>
                                )}
                                <span className="ml-3 px-2 py-1 bg-black/5 text-black/50 rounded-lg text-[10px] font-bold">
                                  {reviewPapers.length} / {papersState.length} Papers
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Synthesis Prose */}
                        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:text-black/70 prose-p:leading-relaxed prose-p:text-lg prose-li:text-black/70 prose-li:text-lg">
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
                      </section>
                    </div>

                    {/* Right Col: Graphical Charts Breakdown */}
                    <div className="space-y-8">
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
                          const itemCount = dist.data.length;
                          const calculatedHeight = dist.type === 'bar' ? Math.max(200, itemCount * 30) : 340;

                          return (
                            <section 
                              key={idx} 
                              className="bg-white p-8 rounded-3xl shadow-sm border border-black/5"
                            >
                              <h3 className="text-sm font-bold uppercase tracking-widest text-black/40 mb-6">{dist.parameterName}</h3>
                              <div style={{ height: `${calculatedHeight}px` }} className="w-full">
                                {isMounted && (
                                  <ResponsiveContainer width="100%" height="100%">
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
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
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
                  </div>

                  {/* Parameter Definitions Reference */}
                  <div className="space-y-8 mt-8 mb-8">
                    <ParameterDefinitions parameters={parameters} />

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
                  </div>
                </motion.div>
              )}

              {/* TAB 2: INTERACTIVE CHART BUILDER */}
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
                          <p className="text-xs text-black/60">Generate dynamic cross-parameter heatmaps, matrices, and comparative bar charts</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={downloadExcel}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-black/5 hover:bg-black/10 text-black/80 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Download size={13} />
                          Export Data (Excel)
                        </button>
                      </div>
                    </div>
                    <InteractiveChartBuilder 
                      papers={reviewPapers.length > 0 ? reviewPapers : papersState} 
                      mappings={reviewMappings.length > 0 ? reviewMappings : mappingsState} 
                      parameters={parameters} 
                    />
                  </section>
                </motion.div>
              )}

              {/* TAB 3: KNOWLEDGE GRAPH */}
              {activeTab === 'graph' && (
                <motion.div 
                  key="graph"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="h-[calc(100vh-10rem)]"
                >
                  <KnowledgeGraph
                    papers={reviewPapers.length > 0 ? reviewPapers : papersState}
                    mappings={reviewMappings.length > 0 ? reviewMappings : mappingsState}
                    parameters={parameters}
                  />
                </motion.div>
              )}

              {/* TAB 4: LITERATURE & SOURCE DOCUMENTS EXPLORER */}
              {activeTab === 'source' && (
                <motion.div 
                  key="source"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-7xl mx-auto pb-16 space-y-8"
                >
                  <section className="bg-white p-8 rounded-3xl shadow-sm border border-black/5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-black/40">
                          Source Documents ({reviewPapers.length})
                        </h3>
                        <p className="text-xs text-black/60">Detailed analysis results, extraction findings, and parameter classifications</p>
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
                            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black/80 transition-colors cursor-pointer"
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
                </motion.div>
              )}

              {/* TAB 5: SCIENTIFIC LITERATURE ASSISTANT */}
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
                        <h3 className="text-sm font-bold uppercase tracking-widest text-black/40">Scientific Literature Assistant</h3>
                        <p className="text-xs text-black/60">Grounded Q&A across analyzed systematic review findings and paper metadata</p>
                      </div>
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="flex-1 overflow-y-auto space-y-6 pb-4 pr-2">
                      {chatMessages.length === 0 && (
                        <div className="text-center py-16 space-y-4">
                          <div className="w-16 h-16 bg-black/5 rounded-3xl flex items-center justify-center mx-auto text-black/20">
                            <MessageSquare size={32} />
                          </div>
                          <h3 className="text-xl font-semibold">Query the Systematic Review</h3>
                          <p className="text-sm text-black/40 max-w-sm mx-auto">
                            Ask questions regarding Extraterrestrial Construction Methods, habitat classification, material technologies, or specific papers.
                          </p>
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
                            "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                            msg.role === 'user' ? "bg-black text-white" : "bg-white shadow-sm border border-black/5"
                          )}>
                            <Markdown>{msg.content}</Markdown>
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
                          placeholder="Ask a question about the SLR findings or specific papers..."
                          className="w-full pl-6 pr-16 py-4 bg-black/5 rounded-2xl focus:ring-2 focus:ring-black/10 focus:bg-white transition-all text-sm outline-none"
                        />
                        <button 
                          onClick={handleSendMessage}
                          className="absolute right-3 top-3 p-2 bg-black text-white rounded-xl hover:bg-black/80 transition-colors cursor-pointer"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  </section>
                </motion.div>
              )}

              {activeTab === 'contribute' && (
                <motion.div 
                  key="contribute"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <ContributionSection onPaperContributed={() => fetchVisualizationState(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Global Academic Attribution Footer */}
        <footer className="mt-auto py-10 px-8 border-t border-black/5 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30">Created by:</p>
              <p className="text-sm font-semibold text-black/80">朱哲伦 (ZHU Zhelun), PhD, P.E., M.Eng.</p>
              <a href="mailto:zhelunzhu@gmail.com" className="text-xs text-black/50 hover:text-black transition-colors underline underline-offset-4 decoration-black/10">
                zhelunzhu@gmail.com
              </a>
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

      {/* Paper Details Inspection Modal */}
      <AnimatePresence>
        {selectedPaper && (
          <PaperDetailsModal 
            paper={selectedPaper} 
            onClose={() => setSelectedPaper(null)} 
            mappings={mappingsState.filter(m => m.paperId === selectedPaper.id)}
            parameters={parameters}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({ active, onClick, icon, label, disabled }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, disabled?: boolean }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col items-center gap-1 transition-all group disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer",
        active ? "text-black" : "text-black/25 hover:text-black/50"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
        active ? "bg-black/5 text-black" : "group-hover:bg-black/5"
      )}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
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
                  <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-widest">
                    DOI: {paper.doi}
                  </a>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-black/5 rounded-2xl transition-colors cursor-pointer">
            <X size={20} className="text-black/40" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
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
                      }}
                      className="absolute top-2 right-2 p-2 bg-white rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black hover:text-white cursor-pointer"
                      title="Copy BibTeX"
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
                className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-black/80 transition-all cursor-pointer"
              >
                <ExternalLink size={14} />
                View Original Document
              </a>
            )}
          </div>
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-black/5 text-black/60 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-black/10 transition-all cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}


