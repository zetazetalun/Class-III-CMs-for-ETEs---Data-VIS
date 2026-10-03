import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Paper, MappingResult, ResearchParameter } from '../types';
import { Maximize2, Minimize2, Download, Database, X } from 'lucide-react';
import { extractDistinctValues } from '../lib/graphDatabase';

interface ResearchMapProps {
  papers: Paper[];
  mappings: MappingResult[];
  parameters: ResearchParameter[];
}

export default function ResearchMap({ papers, mappings, parameters }: ResearchMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    const updateDimensions = () => {
      if (isFullScreen) {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      } else if (containerRef.current) {
        setDimensions({ 
          width: containerRef.current.clientWidth, 
          height: containerRef.current.clientHeight || 500 
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isFullScreen]);

  if (!papers || !mappings || !parameters) {
    return <div className="w-full h-full flex items-center justify-center text-black/40 text-xs">Waiting for data...</div>;
  }

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const graphData = useMemo(() => {
    if (papers.length === 0) return { nodes: [], links: [] };

    // 1. Prepare Nodes (Parameter Values Only, excluding Authors)
    const valueMap = new Map<string, { id: string, name: string, count: number, parameterId: string }>();
    const authorParam = parameters.find(p => p.name.toLowerCase().includes('author'));
    
    mappings.forEach(m => {
      if (authorParam && m.parameterId === authorParam.id) return;
      const values = extractDistinctValues(m.value);
      values.forEach(val => {
        const key = `${m.parameterId}:${val}`;
        if (!valueMap.has(key)) {
          valueMap.set(key, { id: key, name: val, count: 1, parameterId: m.parameterId });
        } else {
          valueMap.get(key)!.count++;
        }
      });
    });

    const nodes = Array.from(valueMap.values());

    // 2. Prepare Links (Co-occurrence between values in the same paper)
    const linksMap = new Map<string, { source: string, target: string, value: number }>();
    papers.forEach(paper => {
      const paperMappings = mappings.filter(m => m.paperId === paper.id && (!authorParam || m.parameterId !== authorParam.id));
      const paperValues: string[] = [];
      paperMappings.forEach(m => {
        const vals = extractDistinctValues(m.value);
        vals.forEach(v => paperValues.push(`${m.parameterId}:${v}`));
      });

      for (let i = 0; i < paperValues.length; i++) {
        for (let j = i + 1; j < paperValues.length; j++) {
          const v1 = paperValues[i];
          const v2 = paperValues[j];
          if (v1 === v2) continue;
          const linkKey = [v1, v2].sort().join('---');
          if (!linksMap.has(linkKey)) {
            linksMap.set(linkKey, { source: v1, target: v2, value: 1 });
          } else {
            linksMap.get(linkKey)!.value++;
          }
        }
      }
    });

    const links = Array.from(linksMap.values());
    return { nodes, links };
  }, [papers, mappings, parameters]);

  const downloadSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "knowledge-graph.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const exportGraphData = () => {
    const exportData = {
      nodes: graphData.nodes.map(n => ({
        id: n.id,
        label: n.name,
        parameter: parameters.find(p => p.id === n.parameterId)?.name,
        count: n.count
      })),
      links: graphData.links.map(l => ({
        source: l.source,
        target: l.target,
        weight: l.value
      }))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "knowledge-graph-data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  useEffect(() => {
    if (!svgRef.current || graphData.nodes.length === 0) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const nodes = graphData.nodes.map(d => ({ ...d }));
    const links = graphData.links.map(d => ({ ...d }));

    // 3. Force Simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("collide", d3.forceCollide().radius((d: any) => Math.max(40, Math.sqrt(d.count) * 15 + 10)))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const container = svg.append("g");

    // Define drop shadow filter
    const defs = svg.append("defs");
    const filter = defs.append("filter")
      .attr("id", "drop-shadow")
      .attr("height", "130%");
    filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 2)
      .attr("result", "blur");
    filter.append("feOffset")
      .attr("in", "blur")
      .attr("dx", 1)
      .attr("dy", 1)
      .attr("result", "offsetBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "offsetBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Zoom behavior
    svg.call(d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      }));

    // 4. Render Links
    const link = container.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", d => Math.max(1, (d.value / papers.length) * 10))
      .attr("stroke-dasharray", "none");

    // 5. Render Nodes
    const node = container.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "node-group")
      .call(d3.drag<any, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Node Circle (Neo4J style)
    node.append("circle")
      .attr("r", (d: any) => Math.max(30, Math.sqrt(d.count) * 10 + 5))
      .attr("fill", (d: any) => {
        const pIndex = parameters.findIndex(p => p.id === d.parameterId);
        return d3.schemeCategory10[pIndex % 10];
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("filter", "url(#drop-shadow)")
      .style("cursor", "pointer")
      .style("transition", "all 0.2s ease");

    // Node Text (Centered)
    node.append("text")
      .text((d: any) => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("font-size", (d: any) => {
        const radius = Math.max(30, Math.sqrt(d.count) * 10 + 5);
        return Math.min(10, radius / 3);
      })
      .attr("font-weight", "600")
      .attr("fill", "#fff")
      .attr("pointer-events", "none")
      .each(function(d: any) {
        const text = d3.select(this);
        const words = d.name.split(/\s+/);
        const radius = Math.max(30, Math.sqrt(d.count) * 10 + 5);
        if (words.length > 1 && d.name.length > 10) {
          text.text(null);
          words.forEach((word, i) => {
            text.append("tspan")
              .attr("x", 0)
              .attr("y", 0)
              .attr("dy", `${i * 1.1 - (words.length - 1) * 0.55}em`)
              .text(word);
          });
        }
      });

    // 6. Interactivity (Hover)
    node.on("mouseenter", (event, d) => {
      const connectedNodeIds = new Set();
      connectedNodeIds.add(d.id);
      
      links.forEach((l: any) => {
        if (l.source.id === d.id) connectedNodeIds.add(l.target.id);
        if (l.target.id === d.id) connectedNodeIds.add(l.source.id);
      });

      node.style("opacity", n => connectedNodeIds.has(n.id) ? 1 : 0.1);
      link.style("opacity", (l: any) => l.source.id === d.id || l.target.id === d.id ? 1 : 0.05)
          .attr("stroke", (l: any) => l.source.id === d.id || l.target.id === d.id ? "#000" : "#00000010");
    });

    node.on( "mouseleave", () => {
      node.style("opacity", 1);
      link.style("opacity", 0.4)
          .attr("stroke", "#999");
    });

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [papers, mappings, parameters, isFullScreen]);

  return (
    <div 
      ref={containerRef}
      className={`bg-white rounded-3xl overflow-hidden relative border border-black/5 shadow-inner transition-all duration-300 ${
        isFullScreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full h-full'
      }`}
    >
      {/* Controls */}
      <div className="absolute top-6 right-6 flex gap-2 z-20">
        <button 
          onClick={exportGraphData}
          title="Export Graph Data (JSON)"
          className="p-2 bg-white/80 backdrop-blur-sm rounded-xl border border-black/5 hover:bg-black hover:text-white transition-all shadow-sm"
        >
          <Database size={16} />
        </button>
        <button 
          onClick={downloadSVG}
          title="Download as SVG"
          className="p-2 bg-white/80 backdrop-blur-sm rounded-xl border border-black/5 hover:bg-black hover:text-white transition-all shadow-sm"
        >
          <Download size={16} />
        </button>
        <button 
          onClick={toggleFullScreen}
          title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
          className="p-2 bg-white/80 backdrop-blur-sm rounded-xl border border-black/5 hover:bg-black hover:text-white transition-all shadow-sm"
        >
          {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      <div className="absolute top-6 left-6 flex flex-col gap-3 z-10">
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-2 rounded-xl border border-black/5">
          <div className="w-4 h-4 bg-white border-2 border-black/10 rounded-full shadow-sm"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-black/60">Research Value</span>
        </div>
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-2 rounded-xl border border-black/5">
          <div className="w-6 h-[1px] border-t border-solid border-black/20"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-black/60">Co-occurrence Strength</span>
        </div>
        <div className="mt-2 p-2 bg-white/80 backdrop-blur-sm rounded-xl border border-black/5">
          <p className="text-[8px] font-bold uppercase tracking-widest text-black/40 mb-2">Node Size = Publication Density</p>
          <div className="flex flex-wrap gap-2 max-w-[150px]">
            {parameters
              .filter(p => !p.name.toLowerCase().includes('author'))
              .map((p) => {
                const pIndex = parameters.findIndex(param => param.id === p.id);
                return (
                  <div key={p.id} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d3.schemeCategory10[pIndex % 10] }}></div>
                    <span className="text-[8px] text-black/60">{p.name}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 right-6 text-[10px] font-bold uppercase tracking-widest text-black/20 pointer-events-none">
        Drag to explore • Scroll to zoom • Hover to highlight
      </div>
      <svg 
        ref={svgRef} 
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} 
        className="w-full h-full cursor-grab active:cursor-grabbing" 
      />
    </div>
  );
}
