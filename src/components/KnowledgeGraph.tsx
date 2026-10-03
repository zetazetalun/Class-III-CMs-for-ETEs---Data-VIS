import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { Paper, MappingResult, ResearchParameter, GraphNode, GraphEdge } from '../types';
import {
  Share2,
  ZoomIn,
  ZoomOut,
  Download,
  Database,
  Layout,
  Info,
  X,
  RefreshCw,
  Trash2,
  FileJson,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { saveAs } from 'file-saver';
import { toPng } from 'html-to-image';
import { motion, AnimatePresence } from 'motion/react';
import {
  buildGraphFromAnalysis,
  syncGraphDatabaseToServer,
  fetchGraphDatabaseFromServer,
  exportCypherScript,
  exportGraphJSON
} from '../lib/graphDatabase';

interface KnowledgeGraphProps {
  papers: Paper[];
  mappings: MappingResult[];
  parameters: ResearchParameter[];
  onGraphSynced?: (nodesCount: number, edgesCount: number) => void;
}

interface SimNode extends d3.SimulationNodeDatum, GraphNode {}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  source: string | SimNode;
  target: string | SimNode;
  label: string;
  weight?: number;
}

export default function KnowledgeGraph({
  papers,
  mappings,
  parameters,
  onGraphSynced
}: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);

  const [organizeBy, setOrganizeBy] = useState<string>('none');
  const [selectedNode, setSelectedNode] = useState<SimNode | null>(null);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [highlightedLinks, setHighlightedLinks] = useState<Set<number>>(new Set());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [serverGraph, setServerGraph] = useState<{ nodes: GraphNode[]; edges: GraphEdge[] } | null>(null);

  // Fetch persisted graph from server database on mount
  useEffect(() => {
    fetchGraphDatabaseFromServer()
      .then(data => {
        if (data && data.nodes.length > 0) {
          setServerGraph(data);
        }
      })
      .catch(err => console.warn('Could not fetch server graph:', err));
  }, []);

  const categoryColors: Record<string, string> = useMemo(() => ({
    publication: '#6366f1', // Indigo
    year: '#94a3b8',        // Slate
    authors: '#ec4899',     // Pink
    publisher: '#8b5cf6',   // Violet
    publicationType: '#f97316', // Orange
    researchType: '#06b6d4',    // Cyan
    scenario: '#14b8a6',        // Teal
    location: '#10b981',        // Emerald
    foci: '#eab308',            // Yellow
    findings: '#f59e0b',        // Amber
    result: '#ef4444',          // Red
    habitatClass: '#3b82f6',    // Blue
    technologyClass3: '#a855f7' // Purple
  }), []);

  // Build canonical graph elements safely (preferring papers/mappings, fallback to server database)
  const { nodes: rawNodes, edges: rawEdges } = useMemo(() => {
    if (papers.length > 0 && mappings.length > 0) {
      const live = buildGraphFromAnalysis(papers, mappings, parameters);
      if (live.nodes.length > 0) return live;
    }
    if (serverGraph && serverGraph.nodes.length > 0) {
      return serverGraph;
    }
    if (papers.length > 0) {
      return buildGraphFromAnalysis(papers, mappings, parameters);
    }
    return { nodes: [], edges: [] };
  }, [papers, mappings, parameters, serverGraph]);

  // Convert to simulation objects
  const { simNodes, simLinks, legendItems } = useMemo(() => {
    const simNodes: SimNode[] = rawNodes.map(n => ({ ...n }));
    const simLinks: SimLink[] = rawEdges.map(e => ({
      source: e.source,
      target: e.target,
      label: e.label,
      weight: e.weight
    }));

    const legendItems = Object.entries(categoryColors).map(([cat, color]) => {
      const param = parameters.find(p => p.id === cat);
      let name = cat.charAt(0).toUpperCase() + cat.slice(1);
      if (param) name = param.name;
      if (cat === 'publication') name = 'Publication';
      if (cat === 'findings') name = 'Findings';
      if (cat === 'result') name = 'Result';
      return { name, color, type: cat };
    });

    return { simNodes, simLinks, legendItems };
  }, [rawNodes, rawEdges, categoryColors, parameters]);

  // Handle manual or automatic graph database synchronization
  const handleSyncToDatabase = useCallback(async () => {
    if (papers.length === 0 && (!serverGraph || serverGraph.nodes.length === 0)) return;
    setIsSyncing(true);
    setSyncStatus('Syncing graph database...');
    try {
      if (papers.length > 0) {
        const result = await syncGraphDatabaseToServer(papers, mappings, parameters);
        setSyncStatus(`Updated: ${result.nodesCount} nodes, ${result.edgesCount} edges`);
        if (onGraphSynced) {
          onGraphSynced(result.nodesCount, result.edgesCount);
        }
      } else {
        const refreshed = await fetchGraphDatabaseFromServer();
        if (refreshed) {
          setServerGraph(refreshed);
          setSyncStatus(`Refreshed: ${refreshed.nodes.length} nodes, ${refreshed.edges.length} edges`);
        }
      }
      setTimeout(() => setSyncStatus(null), 4000);
    } catch (err: any) {
      setSyncStatus(`Sync error: ${err.message}`);
      setTimeout(() => setSyncStatus(null), 5000);
    } finally {
      setIsSyncing(false);
    }
  }, [papers, mappings, parameters, onGraphSynced, serverGraph]);

  // Auto-sync when papers or mappings change and there are relevant papers
  useEffect(() => {
    if (papers.length > 0 && papers.some(p => p.status === 'success')) {
      // Fire-and-forget sync in background
      syncGraphDatabaseToServer(papers, mappings, parameters)
        .then(res => {
          if (onGraphSynced) onGraphSynced(res.nodesCount, res.edgesCount);
        })
        .catch(err => console.warn('Background graph sync noticed:', err));
    }
  }, [papers, mappings, parameters, onGraphSynced]);

  // Render D3 Force Simulation
  useEffect(() => {
    if (!svgRef.current || simNodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 800;
    const height = svgRef.current.clientHeight || 600;

    const g = svg.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.05, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    zoomRef.current = zoom;
    svg.call(zoom);

    const simulation = d3.forceSimulation<SimNode>(simNodes)
      .force('link', d3.forceLink<SimNode, SimLink>(simLinks).id(d => d.id).distance(140))
      .force('charge', d3.forceManyBody().strength(-350))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    simulationRef.current = simulation;

    // Apply organization criteria
    if (organizeBy !== 'none') {
      simulation.force('x', d3.forceX<SimNode>().x(d => {
        if (d.paramId === organizeBy) return width / 2;
        if (d.type === 'publication') return width / 4;
        return (3 * width) / 4;
      }).strength(0.5));

      if (organizeBy === 'year') {
        const years = Array.from(new Set(simNodes.filter(n => n.paramId === 'year').map(n => n.name))).sort();
        simulation.force('y', d3.forceY<SimNode>().y(d => {
          if (d.paramId === 'year') {
            const index = years.indexOf(d.name);
            return (height / (years.length + 1)) * (index + 1);
          }
          return height / 2;
        }).strength(0.8));
      } else {
        simulation.force('y', d3.forceY<SimNode>().y(height / 2).strength(0.1));
      }
    }

    // Arrow markers
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 22)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#cbd5e1')
      .style('stroke', 'none');

    const link = g.append('g')
      .selectAll('line')
      .data(simLinks)
      .enter().append('line')
      .attr('stroke', d => {
        if (highlightedLinks.has(simLinks.indexOf(d))) return '#6366f1';
        return '#e2e8f0';
      })
      .attr('stroke-opacity', d => {
        if (highlightedLinks.has(simLinks.indexOf(d))) return 1;
        return highlightedNodes.size > 0 ? 0.1 : 0.75;
      })
      .attr('stroke-width', d => highlightedLinks.has(simLinks.indexOf(d)) ? 3 : 1.5)
      .attr('marker-end', 'url(#arrowhead)');

    const linkLabels = g.append('g')
      .selectAll('text')
      .data(simLinks)
      .enter().append('text')
      .attr('font-size', 7)
      .attr('fill', '#94a3b8')
      .attr('text-anchor', 'middle')
      .attr('dy', -4)
      .attr('opacity', d => highlightedLinks.has(simLinks.indexOf(d)) ? 1 : (highlightedNodes.size > 0 ? 0.1 : 0.8))
      .text(d => d.label);

    const node = g.append('g')
      .selectAll('g')
      .data(simNodes)
      .enter().append('g')
      .attr('cursor', 'pointer')
      .on('click', (event, d) => {
        setSelectedNode(d);

        // Highlight connected elements
        const neighbors = new Set<string>([d.id]);
        const activeLinks = new Set<number>();

        simLinks.forEach((l, i) => {
          const sId = typeof l.source === 'string' ? l.source : (l.source as SimNode).id;
          const tId = typeof l.target === 'string' ? l.target : (l.target as SimNode).id;

          if (sId === d.id) {
            neighbors.add(tId);
            activeLinks.add(i);
          } else if (tId === d.id) {
            neighbors.add(sId);
            activeLinks.add(i);
          }
        });

        setHighlightedNodes(neighbors);
        setHighlightedLinks(activeLinks);
        event.stopPropagation();
      })
      .call(d3.drag<SVGGElement, SimNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    node.append('circle')
      .attr('r', d => {
        if (d.type === 'publication') return 16;
        if (d.type === 'findings') return 10;
        if (d.type === 'result') return 8;
        return 12;
      })
      .attr('fill', d => categoryColors[d.category] || '#94a3b8')
      .attr('opacity', d => highlightedNodes.size > 0 && !highlightedNodes.has(d.id) ? 0.2 : 1)
      .attr('stroke', d => {
        if (selectedNode?.id === d.id) return '#000';
        if (organizeBy !== 'none' && d.paramId === organizeBy) return '#000';
        return '#fff';
      })
      .attr('stroke-width', d => {
        if (selectedNode?.id === d.id) return 4;
        if (organizeBy !== 'none' && d.paramId === organizeBy) return 3;
        return 2;
      })
      .attr('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))');

    node.append('text')
      .attr('dx', 18)
      .attr('dy', 4)
      .attr('font-size', 9)
      .attr('font-weight', d => d.type === 'publication' ? 'bold' : 'normal')
      .attr('fill', '#334155')
      .attr('opacity', d => highlightedNodes.size > 0 && !highlightedNodes.has(d.id) ? 0.2 : 1)
      .text(d => d.name.length > 35 ? d.name.substring(0, 35) + '...' : d.name);

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as SimNode).x || 0)
        .attr('y1', d => (d.source as SimNode).y || 0)
        .attr('x2', d => (d.target as SimNode).x || 0)
        .attr('y2', d => (d.target as SimNode).y || 0);

      linkLabels
        .attr('x', d => (((d.source as SimNode).x || 0) + ((d.target as SimNode).x || 0)) / 2)
        .attr('y', d => (((d.source as SimNode).y || 0) + ((d.target as SimNode).y || 0)) / 2);

      node.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
    });

    function dragstarted(event: any, d: SimNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: SimNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: SimNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [simNodes, simLinks, organizeBy, categoryColors, highlightedNodes, highlightedLinks, selectedNode]);

  // Zoom Helpers
  const handleZoomIn = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().duration(250).call(zoomRef.current.scaleBy, 1.35);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().duration(250).call(zoomRef.current.scaleBy, 0.74);
    }
  };

  const handleZoomReset = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.transform, d3.zoomIdentity);
    }
  };

  const handleDownloadPNG = async () => {
    if (!containerRef.current) return;
    try {
      const dataUrl = await toPng(containerRef.current, { backgroundColor: '#f8fafc' });
      const link = document.createElement('a');
      link.download = `knowledge-graph-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download PNG', err);
    }
  };

  const handleExportNeo4j = () => {
    const cypher = exportCypherScript(rawNodes, rawEdges);
    const blob = new Blob([cypher], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `knowledge-graph-${new Date().toISOString().split('T')[0]}.cypher`);
  };

  const handleExportJSON = () => {
    const jsonStr = exportGraphJSON(rawNodes, rawEdges);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    saveAs(blob, `knowledge-graph-database-${new Date().toISOString().split('T')[0]}.json`);
  };

  const handleDistribute = () => {
    if (simulationRef.current) {
      simulationRef.current.alpha(1).restart();
      simNodes.forEach(n => {
        n.x = Math.random() * 800;
        n.y = Math.random() * 600;
        n.fx = null;
        n.fy = null;
      });
    }
  };

  const handleClearHighlights = () => {
    setSelectedNode(null);
    setHighlightedNodes(new Set());
    setHighlightedLinks(new Set());
    setOrganizeBy('none');
    if (simulationRef.current) {
      simulationRef.current.alpha(0.3).restart();
    }
  };

  return (
    <div
      className="flex flex-col h-full relative"
      onClick={() => {
        setSelectedNode(null);
        setHighlightedNodes(new Set());
        setHighlightedLinks(new Set());
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
            <Share2 size={20} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-black/80">Knowledge Graph</h3>
              <div className="flex items-center gap-2">
                <span id="stat-graph-nodes" className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200/70 flex items-center gap-1.5 shadow-2xs">
                  <Database size={12} className="text-indigo-600" />
                  <span>Nodes: <strong className="font-bold text-indigo-950">{rawNodes.length.toLocaleString()}</strong></span>
                </span>
                <span id="stat-graph-edges" className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-xs font-semibold rounded-lg border border-purple-200/70 flex items-center gap-1.5 shadow-2xs">
                  <Share2 size={12} className="text-purple-600" />
                  <span>Edges: <strong className="font-bold text-purple-950">{rawEdges.length.toLocaleString()}</strong></span>
                </span>
              </div>
            </div>
            <p className="text-xs text-black/50 mt-0.5">
              Relational network mapping literature entities • {rawNodes.length.toLocaleString()} total nodes and {rawEdges.length.toLocaleString()} relationships
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Sync status toast */}
          {syncStatus && (
            <div className="text-xs px-2.5 py-1 bg-slate-900 text-white rounded-lg flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>{syncStatus}</span>
            </div>
          )}

          {/* Sync DB Button */}
          <button
            onClick={handleSyncToDatabase}
            disabled={isSyncing || papers.length === 0}
            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-[11px] font-bold uppercase flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Update and persist Knowledge Graph database"
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Graph DB'}</span>
          </button>

          {/* Organize Layout */}
          <div className="flex items-center gap-2 bg-black/5 px-3 py-1.5 rounded-xl">
            <Layout size={14} className="text-black/40" />
            <select
              value={organizeBy}
              onChange={(e) => setOrganizeBy(e.target.value)}
              className="bg-transparent text-[10px] font-bold uppercase tracking-widest focus:outline-none cursor-pointer"
            >
              <option value="none">Free Layout</option>
              {parameters.map(p => (
                <option key={p.id} value={p.id}>Organize by {p.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleDistribute}
            className="p-2 hover:bg-black/5 rounded-xl text-black/60 transition-colors flex items-center gap-1.5"
            title="Redistribute Nodes"
          >
            <RefreshCw size={16} />
            <span className="text-[10px] font-bold uppercase hidden sm:inline">Distribute</span>
          </button>

          <div className="h-6 w-px bg-black/10 mx-1" />

          {/* Export Buttons */}
          <button
            onClick={handleExportNeo4j}
            className="p-2 hover:bg-black/5 rounded-xl text-black/60 transition-colors flex items-center gap-1"
            title="Export Cypher script for Neo4j"
          >
            <Database size={16} />
            <span className="text-[10px] font-bold uppercase hidden lg:inline">Neo4j</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="p-2 hover:bg-black/5 rounded-xl text-black/60 transition-colors flex items-center gap-1"
            title="Export Graph Database JSON"
          >
            <FileJson size={16} />
            <span className="text-[10px] font-bold uppercase hidden lg:inline">JSON</span>
          </button>

          <button
            onClick={handleDownloadPNG}
            className="p-2 hover:bg-black/5 rounded-xl text-black/60 transition-colors"
            title="Download Graph Image PNG"
          >
            <Download size={16} />
          </button>

          <button
            onClick={handleClearHighlights}
            className="p-2 hover:bg-red-50 rounded-xl text-red-500 transition-colors flex items-center gap-1"
            title="Reset Graph Selection"
          >
            <Trash2 size={16} />
            <span className="text-[10px] font-bold uppercase hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 bg-slate-50 rounded-3xl border border-black/5 overflow-hidden relative group">
        <svg ref={svgRef} className="w-full h-full cursor-move" />

        {/* Floating Top-Left Status HUD */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-black/5 shadow-xs flex items-center gap-3 z-10 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-xs" />
            <span className="text-xs font-medium text-black/60">Nodes:</span>
            <span className="text-xs font-bold text-black/90 tabular-nums">{rawNodes.length.toLocaleString()}</span>
          </div>
          <div className="h-3 w-px bg-black/10" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 shadow-xs" />
            <span className="text-xs font-medium text-black/60">Edges:</span>
            <span className="text-xs font-bold text-black/90 tabular-nums">{rawEdges.length.toLocaleString()}</span>
          </div>
          {highlightedNodes.size > 0 && (
            <>
              <div className="h-3 w-px bg-black/10" />
              <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
                <span>Active:</span>
                <span className="font-bold tabular-nums">{highlightedNodes.size}</span>
              </div>
            </>
          )}
        </div>

        {/* Empty state if 0 nodes */}
        {rawNodes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-50/80 backdrop-blur-xs">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mb-3">
              <Share2 size={24} />
            </div>
            <h4 className="text-sm font-semibold text-black/80">No Graph Elements Available</h4>
            <p className="text-xs text-black/40 max-w-xs mt-1">
              Nodes: 0 • Edges: 0. Run review analysis or sync from database to populate graph entities and relationships.
            </p>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl border border-black/5 shadow-sm overflow-y-auto max-h-[190px] w-48">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2.5 sticky top-0 bg-white/95 pb-1">Legend</h4>
          <div className="flex flex-col gap-1.5">
            {legendItems.map(cat => (
              <div key={cat.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-[10px] font-medium text-black/70 truncate">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-1.5">
          <button
            onClick={handleZoomIn}
            className="p-2.5 bg-white/95 hover:bg-white rounded-xl border border-black/5 shadow-sm text-black/60 hover:text-black transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2.5 bg-white/95 hover:bg-white rounded-xl border border-black/5 shadow-sm text-black/60 hover:text-black transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={handleZoomReset}
            className="p-2.5 bg-white/95 hover:bg-white rounded-xl border border-black/5 shadow-sm text-black/60 hover:text-black transition-colors"
            title="Reset View"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedNode && (
          <div
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-5 border-b border-black/5 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: categoryColors[selectedNode.category] || '#94a3b8' }}
                  >
                    <Info size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/40">{selectedNode.category}</h4>
                    <h3 className="text-sm font-bold text-black/80 line-clamp-1">{selectedNode.name}</h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-2 hover:bg-black/5 rounded-xl text-black/40 hover:text-black transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2">Details / Extracted Content</h5>
                  <div className="text-sm text-black/80 leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-black/5">
                    {selectedNode.details || 'No detailed information available for this node.'}
                  </div>
                </div>
                {selectedNode.paperId && (
                  <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between text-xs">
                    <span className="font-bold text-black/40 uppercase tracking-wider text-[10px]">Linked Document</span>
                    <span className="font-mono text-indigo-600 font-semibold">{selectedNode.paperId}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
