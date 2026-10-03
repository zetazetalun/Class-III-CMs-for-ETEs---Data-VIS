import React, { useState, useMemo, useRef } from 'react';
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
  Legend
} from 'recharts';
import { Paper, MappingResult, ResearchParameter } from '../types';
import { BarChart3, PieChart as PieChartIcon, Grid3X3, Info, Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { normalizeValue } from '../lib/normalize';

interface InteractiveChartBuilderProps {
  papers: Paper[];
  mappings: MappingResult[];
  parameters: ResearchParameter[];
  onChartGenerated?: (param1: string, param2: string, chartType: string) => void;
  onChartDownloaded?: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

export default function InteractiveChartBuilder({ papers, mappings, parameters, onChartGenerated, onChartDownloaded }: InteractiveChartBuilderProps) {
  const [param1Id, setParam1Id] = useState<string>(parameters[0]?.id || '');
  const [param2Id, setParam2Id] = useState<string>('');
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'heatmap'>('bar');
  const chartRef = useRef<HTMLDivElement>(null);

  const param1Name = useMemo(() => parameters.find(p => p.id === param1Id)?.name || '', [parameters, param1Id]);
  const param2Name = useMemo(() => parameters.find(p => p.id === param2Id)?.name || 'None', [parameters, param2Id]);

  React.useEffect(() => {
    if (param1Name && onChartGenerated) {
      onChartGenerated(param1Name, param2Name, chartType);
    }
  }, [param1Name, param2Name, chartType, onChartGenerated]);

  const chartData = useMemo(() => {
    if (!param1Id) return [];

    const p1 = parameters.find(p => p.id === param1Id);
    if (!p1) return [];

    const isYear = p1.name.toLowerCase().includes('year');

    // Create a Set of relevant and successful papers to ensure exact consistency with dashboard counts
    const relevantPaperIds = new Set(
      papers
        .filter(p => p.status === 'success' && p.isRelevant !== false)
        .map(p => p.id)
    );

    if (!param2Id) {
      // Single parameter distribution
      const counts: Record<string, number> = {};
      mappings
        .filter(m => m.parameterId === param1Id && m.paperId && relevantPaperIds.has(m.paperId))
        .forEach(m => {
          const values = normalizeValue(param1Id, m.value);
          values.forEach(v => {
            counts[v] = (counts[v] || 0) + 1;
          });
        });
      
      const result = Object.entries(counts).map(([name, value]) => ({ name, value }));
      
      if (isYear) {
        return result.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
      }
      return result.sort((a, b) => b.value - a.value);
    } else {
      // Cross-tabulation
      const p2 = parameters.find(p => p.id === param2Id);
      if (!p2) return [];

      const matrix: Record<string, Record<string, number>> = {};
      
      papers.forEach(paper => {
        if (!relevantPaperIds.has(paper.id)) return;

        const m1 = mappings.find(m => m.paperId === paper.id && m.parameterId === param1Id);
        const m2 = mappings.find(m => m.paperId === paper.id && m.parameterId === param2Id);

        if (m1 && m2) {
          const v1s = normalizeValue(param1Id, m1.value);
          const v2s = normalizeValue(param2Id, m2.value);

          v1s.forEach(v1 => {
            if (!matrix[v1]) matrix[v1] = {};
            v2s.forEach(v2 => {
              matrix[v1][v2] = (matrix[v1][v2] || 0) + 1;
            });
          });
        }
      });

      if (chartType === 'heatmap') {
        const flatData: { x: string; y: string; value: number }[] = [];
        Object.entries(matrix).forEach(([x, yMap]) => {
          Object.entries(yMap).forEach(([y, value]) => {
            flatData.push({ x, y, value });
          });
        });
        
        if (isYear) {
          return flatData.sort((a, b) => a.x.localeCompare(b.x, undefined, { numeric: true }));
        }
        return flatData;
      } else {
        // Stacked bar or similar
        const result = Object.entries(matrix).map(([name, yMap]) => ({
          name,
          ...yMap
        }));

        if (isYear) {
          return result.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
        }
        return result;
      }
    }
  }, [param1Id, param2Id, chartType, mappings, papers, parameters]);

  const downloadChart = async () => {
    if (chartRef.current === null) return;
    try {
      const dataUrl = await toPng(chartRef.current, { backgroundColor: '#ffffff' });
      saveAs(dataUrl, `chart-${new Date().getTime()}.png`);
      if (onChartDownloaded) {
        onChartDownloaded();
      }
    } catch (err) {
      console.error('Failed to download chart', err);
    }
  };

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="h-64 flex flex-col items-center justify-center text-black/30 bg-black/5 rounded-2xl border border-dashed border-black/10">
          <Info size={24} className="mb-2" />
          <p className="text-xs font-bold uppercase tracking-widest">No data available for this combination</p>
        </div>
      );
    }

    if (chartType === 'heatmap' && param2Id) {
      const data = chartData as { x: string; y: string; value: number }[];
      const xLabels = Array.from(new Set(data.map(d => d.x))).sort();
      const yLabels = Array.from(new Set(data.map(d => d.y))).sort();
      const maxValue = Math.max(...data.map(d => d.value), 1);

      return (
        <div className="overflow-x-auto">
          <div className="min-w-[400px] p-4">
            <div className="grid" style={{ gridTemplateColumns: `120px repeat(${xLabels.length}, 1fr)` }}>
              <div />
              {xLabels.map(x => (
                <div key={x} className="text-[10px] font-bold text-center py-2 text-black/40 uppercase tracking-tighter truncate px-1" title={x}>
                  {x}
                </div>
              ))}
              {yLabels.map(y => (
                <React.Fragment key={y}>
                  <div className="text-[10px] font-bold flex items-center pr-2 text-black/60 leading-tight truncate" title={y}>
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
                          backgroundColor: val > 0 ? `rgba(99, 102, 241, ${0.1 + opacity * 0.9})` : '#f9fafb',
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
      );
    }

    if (chartType === 'pie' && !param2Id) {
      return (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }

    // Default to Bar Chart (Stacked if param2Id exists)
    const allYValues = param2Id ? Array.from(new Set((chartData as any[]).flatMap(d => Object.keys(d).filter(k => k !== 'name')))) : [];

    return (
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout={chartData.length > 8 ? 'vertical' : 'horizontal'}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            {chartData.length > 8 ? (
              <>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} fontSize={10} tick={{ fill: '#666' }} />
              </>
            ) : (
              <>
                <XAxis dataKey="name" fontSize={10} tick={{ fill: '#666' }} />
                <YAxis fontSize={10} tick={{ fill: '#666' }} />
              </>
            )}
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              cursor={{ fill: '#f9fafb' }}
            />
            {param2Id ? (
              <>
                <Legend />
                {allYValues.map((y, index) => (
                  <Bar key={y} dataKey={y} stackId="a" fill={COLORS[index % COLORS.length]} radius={[2, 2, 0, 0]} />
                ))}
              </>
            ) : (
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Primary Parameter</label>
          <select 
            value={param1Id} 
            onChange={(e) => setParam1Id(e.target.value)}
            className="w-full bg-black/5 border border-black/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
          >
            {parameters.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Secondary (Optional)</label>
          <select 
            value={param2Id} 
            onChange={(e) => {
              setParam2Id(e.target.value);
              if (e.target.value && chartType === 'pie') setChartType('bar');
            }}
            className="w-full bg-black/5 border border-black/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
          >
            <option value="">None (Distribution)</option>
            {parameters.filter(p => p.id !== param1Id).map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Chart Type</label>
          <div className="flex bg-black/5 p-1 rounded-xl border border-black/5">
            <button 
              onClick={() => setChartType('bar')}
              className={`flex-1 flex items-center justify-center py-1 rounded-lg transition-all ${chartType === 'bar' ? 'bg-white shadow-sm text-black' : 'text-black/40 hover:text-black/60'}`}
            >
              <BarChart3 size={16} />
            </button>
            <button 
              onClick={() => setChartType('pie')}
              disabled={!!param2Id}
              className={`flex-1 flex items-center justify-center py-1 rounded-lg transition-all ${chartType === 'pie' ? 'bg-white shadow-sm text-black' : 'text-black/40 hover:text-black/60 disabled:opacity-20'}`}
            >
              <PieChartIcon size={16} />
            </button>
            <button 
              onClick={() => setChartType('heatmap')}
              disabled={!param2Id}
              className={`flex-1 flex items-center justify-center py-1 rounded-lg transition-all ${chartType === 'heatmap' ? 'bg-white shadow-sm text-black' : 'text-black/40 hover:text-black/60 disabled:opacity-20'}`}
            >
              <Grid3X3 size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-black/40" />
          <span className="text-xs font-bold uppercase tracking-widest text-black/40">Visualization</span>
        </div>
        <button 
          onClick={downloadChart}
          className="flex items-center gap-2 px-3 py-1.5 bg-black/5 hover:bg-black/10 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors"
        >
          <Download size={12} />
          Download PNG
        </button>
      </div>

      <div ref={chartRef} className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
        {renderChart()}
      </div>
    </div>
  );
}
