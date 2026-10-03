import { Paper, MappingResult, ResearchParameter, GraphNode, GraphEdge } from '../types';
import { getPaperParameterValue } from './normalize';

/**
 * Safely extracts an array of distinct normalized values from any mapping value
 * (handling strings, arrays, objects, and comma-separated lists).
 */
export function extractDistinctValues(rawVal: any): string[] {
  if (rawVal === undefined || rawVal === null) return [];

  let items: string[] = [];
  if (Array.isArray(rawVal)) {
    items = rawVal.map(v => String(v).trim());
  } else if (typeof rawVal === 'string') {
    items = rawVal.split(',').map(v => v.trim());
  } else if (typeof rawVal === 'object') {
    items = Object.values(rawVal).map(v => String(v).trim());
  } else {
    items = [String(rawVal).trim()];
  }

  return items.filter(v => {
    if (!v) return false;
    const lower = v.toLowerCase();
    return (
      lower !== 'n/a' &&
      lower !== 'none' &&
      lower !== 'unknown' &&
      lower !== '[]' &&
      lower !== '{}' &&
      !lower.includes('not specified') &&
      !lower.includes('not mentioned')
    );
  });
}

/**
 * Returns a clean semantic relationship label for a given parameter ID.
 */
export function getParameterEdgeLabel(paramId: string, paramName: string): string {
  switch (paramId) {
    case 'year': return 'published_in';
    case 'authors': return 'authored_by';
    case 'publisher': return 'published_by';
    case 'researchType': return 'research_type';
    case 'publicationType': return 'publication_type';
    case 'foci': return 'research_foci';
    case 'scenario': return 'application_scenario';
    case 'location': return 'application_location';
    case 'technologyClass3': return 'class_3_technology';
    case 'habitatClass': return 'habitat_class';
    default: return paramName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  }
}

/**
 * Constructs the canonical Knowledge Graph data (nodes and edges) from papers, mappings, and parameters.
 */
export function buildGraphFromAnalysis(
  papers: Paper[],
  mappings: MappingResult[],
  parameters: ResearchParameter[]
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const nodeMap = new Map<string, GraphNode>();
  const edgeSet = new Set<string>();

  const addNode = (
    id: string,
    name: string,
    type: GraphNode['type'],
    category: string,
    group: number,
    details?: string,
    paperId?: string,
    paramId?: string
  ) => {
    if (!nodeMap.has(id)) {
      const node: GraphNode = { id, name, type, category, group, details, paperId, paramId };
      nodes.push(node);
      nodeMap.set(id, node);
    }
    return id;
  };

  const addEdge = (source: string, target: string, label: string, paperId?: string, weight: number = 1) => {
    const key = `${source}-->${label}-->${target}`;
    if (!edgeSet.has(key)) {
      edgeSet.add(key);
      edges.push({
        id: `edge_${source}_${target}_${label}`.replace(/[^a-zA-Z0-9_-]/g, '_'),
        source,
        target,
        label,
        paperId,
        weight
      });
    }
  };

  const relevantPapers = papers.filter(p => p.isRelevant !== false && p.status !== 'failed');

  // Publication naming tracker for unique disambiguation (Year_Author_Publisher_A/B/C)
  const pubNameCounts = new Map<string, number>();

  relevantPapers.forEach(paper => {
    const yearVal = getPaperParameterValue(paper, 'year', mappings);
    const authorVal = getPaperParameterValue(paper, 'authors', mappings);
    const publisherVal = getPaperParameterValue(paper, 'publisher', mappings);

    const year = yearVal && yearVal !== 'Not specified' ? yearVal : 'UnknownYear';
    const firstAuthor = authorVal && authorVal !== 'Not specified'
      ? authorVal.split(',')[0].trim().split(' ').pop() || 'UnknownAuthor'
      : 'UnknownAuthor';
    const publisher = publisherVal && publisherVal !== 'Not specified'
      ? publisherVal.split(',')[0].trim().split(' ').pop() || 'UnknownPublisher'
      : 'UnknownPublisher';

    const baseName = `${year}_${firstAuthor}_${publisher}`;
    const count = (pubNameCounts.get(baseName) || 0) + 1;
    pubNameCounts.set(baseName, count);

    const alphabet = String.fromCharCode(64 + count);
    const pubDisplayName = `${baseName}_${alphabet}`;
    const pubId = paper.graphId || `pub_${paper.id}`;

    // 1. Add Publication Node
    addNode(
      pubId,
      pubDisplayName,
      'publication',
      'publication',
      1,
      paper.keyFindings || paper.relevanceReason || paper.title,
      paper.id
    );

    // 2. Parameter Relationships
    parameters.forEach(param => {
      const mapping = mappings.find(m => m.paperId === paper.id && m.parameterId === param.id);
      if (mapping) {
        const values = extractDistinctValues(mapping.value);
        values.forEach(val => {
          const normalizedVal = val.toLowerCase().trim();
          const valId = `${param.id}_${normalizedVal}`.replace(/[^a-zA-Z0-9_-]/g, '_');
          
          addNode(valId, val, 'value', param.id, 2, `Category: ${param.name}`, undefined, param.id);

          const label = getParameterEdgeLabel(param.id, param.name);
          addEdge(pubId, valId, label, paper.id);
        });
      }
    });

    // 3. Findings and Results Nodes
    if (paper.findings) {
      const findingsId = `findings_${paper.id}`.replace(/[^a-zA-Z0-9_-]/g, '_');
      const findingsDetails = `FINDINGS:\n${paper.findings}${paper.result ? `\n\nRESULT:\n${paper.result}` : ''}`;
      addNode(findingsId, 'Findings', 'findings', 'findings', 3, findingsDetails, paper.id);
      addEdge(pubId, findingsId, 'main_findings', paper.id);

      if (paper.result) {
        const resultId = `result_${paper.id}`.replace(/[^a-zA-Z0-9_-]/g, '_');
        addNode(resultId, 'Result', 'result', 'result', 4, paper.result, paper.id);
        addEdge(findingsId, resultId, 'result', paper.id);
      }
    }
  });

  // 4. Cross-Publication Similar Work Edges based on shared research foci (top k nearest neighbors)
  const findingsNodes = nodes.filter(n => n.type === 'findings');
  const paperFociMap = new Map<string, string[]>();
  findingsNodes.forEach(f => {
    const m = mappings.find(map => map.paperId === f.paperId && map.parameterId === 'foci');
    paperFociMap.set(f.id, m ? extractDistinctValues(m.value).map(v => v.toLowerCase()) : []);
  });

  const addedSimilarEdges = new Set<string>();
  findingsNodes.forEach(f1 => {
    const f1Foci = paperFociMap.get(f1.id) || [];
    if (f1Foci.length === 0) return;

    const similarities: { targetId: string; weight: number }[] = [];
    findingsNodes.forEach(f2 => {
      if (f1.id === f2.id) return;
      const f2Foci = paperFociMap.get(f2.id) || [];
      const sharedCount = f1Foci.filter(focus => f2Foci.includes(focus)).length;
      if (sharedCount >= 2) {
        similarities.push({ targetId: f2.id, weight: sharedCount });
      }
    });

    // Sort descending by shared foci weight and link top 3 closest scientific neighbors
    similarities.sort((a, b) => b.weight - a.weight);
    const topNeighbors = similarities.slice(0, 3);

    topNeighbors.forEach(sim => {
      const pairKey = [f1.id, sim.targetId].sort().join('<-->');
      if (!addedSimilarEdges.has(pairKey)) {
        addedSimilarEdges.add(pairKey);
        addEdge(f1.id, sim.targetId, 'similar_work', undefined, sim.weight);
      }
    });
  });

  return { nodes, edges };
}

/**
 * Synchronizes the graph database on the backend server with newly analyzed papers and mappings.
 */
export async function syncGraphDatabaseToServer(
  papers: Paper[],
  mappings: MappingResult[],
  parameters: ResearchParameter[]
): Promise<{ success: boolean; nodesCount: number; edgesCount: number }> {
  try {
    const { nodes, edges } = buildGraphFromAnalysis(papers, mappings, parameters);
    const paperIds = papers.map(p => p.id);

    const response = await fetch('/api/graph/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodes, edges, paperIds })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Server returned ${response.status}: ${errText}`);
    }

    const data = await response.json();
    return {
      success: true,
      nodesCount: data.nodesCount ?? nodes.length,
      edgesCount: data.edgesCount ?? edges.length
    };
  } catch (error) {
    console.error('Failed to sync graph database to server:', error);
    throw error;
  }
}

/**
 * Fetches the persisted graph database state from the server.
 */
export async function fetchGraphDatabaseFromServer(): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] } | null> {
  try {
    const response = await fetch('/api/graph');
    if (!response.ok) return null;
    const data = await response.json();
    if (data.success && Array.isArray(data.nodes) && Array.isArray(data.edges)) {
      return { nodes: data.nodes, edges: data.edges };
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch graph database from server:', error);
    return null;
  }
}

/**
 * Exports graph nodes and edges into Neo4j Cypher statements.
 */
export function exportCypherScript(nodes: GraphNode[], edges: GraphEdge[]): string {
  let cypher = '// Neo4j Graph Database Export\n// Generated by Systematic Literature Review Assistant\n\n';

  // Create/Merge Nodes
  nodes.forEach(node => {
    const label = node.type.charAt(0).toUpperCase() + node.type.slice(1);
    const cleanId = node.id.replace(/[^a-zA-Z0-9_]/g, '_');
    const safeName = (node.name || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const safeCat = (node.category || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const safeDetails = (node.details || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ');

    cypher += `MERGE (n_${cleanId}:${label} {id: '${node.id}'}) ON CREATE SET n_${cleanId}.name = '${safeName}', n_${cleanId}.category = '${safeCat}', n_${cleanId}.details = '${safeDetails}';\n`;
  });

  cypher += '\n// Create Relationships\n';

  // Create/Merge Edges
  edges.forEach(edge => {
    const rel = (edge.label || 'RELATED_TO').toUpperCase().replace(/[^A-Z0-9_]/g, '_');
    const sourceId = (typeof edge.source === 'string' ? edge.source : (edge.source as any).id).replace(/'/g, "\\'");
    const targetId = (typeof edge.target === 'string' ? edge.target : (edge.target as any).id).replace(/'/g, "\\'");

    cypher += `MATCH (a {id: '${sourceId}'}), (b {id: '${targetId}'}) MERGE (a)-[:${rel}]->(b);\n`;
  });

  return cypher;
}

/**
 * Exports graph nodes and edges to standard Node-Link JSON format.
 */
export function exportGraphJSON(nodes: GraphNode[], edges: GraphEdge[]): string {
  return JSON.stringify(
    {
      format: 'graph-database-export',
      exportedAt: new Date().toISOString(),
      stats: {
        nodeCount: nodes.length,
        edgeCount: edges.length
      },
      nodes: nodes.map(n => ({
        id: n.id,
        name: n.name,
        type: n.type,
        category: n.category,
        group: n.group,
        details: n.details,
        paperId: n.paperId,
        paramId: n.paramId
      })),
      edges: edges.map(e => ({
        id: e.id,
        source: typeof e.source === 'string' ? e.source : (e.source as any).id,
        target: typeof e.target === 'string' ? e.target : (e.target as any).id,
        label: e.label,
        paperId: e.paperId,
        weight: e.weight || 1
      }))
    },
    null,
    2
  );
}
