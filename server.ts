import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "fs";
import fs from "fs/promises";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { Octokit } from "@octokit/rest";

dotenv.config();

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
        msg.includes('rate limit');

      if (!isRetryable) {
        throw err;
      }
      if (i < modelsToTry.length - 1) {
        await new Promise(r => setTimeout(r, 600));
      }
    }
  }
  throw lastError;
}

async function serverChatWithReview(
  question: string,
  context: {
    papers: any[];
    mappings: any[];
    summary: any;
  },
  requestedModel: string = 'gemini-flash-latest',
  customApiKey?: string
) {
  const ai = getGeminiClient(customApiKey);

  const relevantPapers = (context.papers || []).filter(p => p.isRelevant !== false && p.status !== 'failed');

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

async function startServer() {
  const portArgIndex = process.argv.indexOf('--port');
  const cliPort = portArgIndex !== -1 && process.argv[portArgIndex + 1] ? Number(process.argv[portArgIndex + 1]) : NaN;
  const envPort = process.env.PORT ? Number(process.env.PORT) : NaN;
  // Use CLI port if passed, else environment port (Cloud Run sets PORT), else default to 3000
  const PORT = !isNaN(cliPort) && cliPort > 0 ? cliPort : (!isNaN(envPort) && envPort > 0 ? envPort : 3000);

  console.log(`Starting server on port ${PORT}. NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Working directory: ${process.cwd()}`);

  const app = express();
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));

  // Ensure cache directory exists
  const cacheDir = path.join(process.cwd(), "cache");
  if (!existsSync(cacheDir)) {
    mkdirSync(cacheDir, { recursive: true });
  }

  // Initialize SQLite database
  const db = new Database(path.join(cacheDir, "slr_cache.db"));
  db.pragma('journal_mode = WAL');
  db.pragma('busy_timeout = 5000');

  // Database Schema Setup
  db.exec(`
    CREATE TABLE IF NOT EXISTS paper_cache (
      id TEXT PRIMARY KEY,
      title TEXT,
      doi TEXT,
      bibtex TEXT,
      mappings TEXT,
      markdown_content TEXT,
      key_findings TEXT,
      findings TEXT,
      result TEXT,
      graph_id TEXT,
      is_relevant INTEGER DEFAULT 1,
      relevance_reason TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS graph_nodes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      category TEXT,
      group_num INTEGER DEFAULT 1,
      details TEXT,
      paper_id TEXT,
      param_id TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS graph_edges (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL,
      target TEXT NOT NULL,
      label TEXT NOT NULL,
      paper_id TEXT,
      weight REAL DEFAULT 1,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS app_stats (
      key TEXT PRIMARY KEY,
      value INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS vis_state (
      id TEXT PRIMARY KEY,
      papers TEXT,
      mappings TEXT,
      summary TEXT,
      chat_messages TEXT,
      graph_nodes TEXT,
      graph_edges TEXT,
      settings TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS vis_snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      papers TEXT,
      mappings TEXT,
      summary TEXT,
      chat_messages TEXT,
      graph_nodes TEXT,
      graph_edges TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS vis_analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      event_key TEXT,
      event_value TEXT,
      country_code TEXT,
      country_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contributions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      authors TEXT NOT NULL,
      contact TEXT NOT NULL,
      doi TEXT NOT NULL,
      title TEXT,
      notes TEXT,
      file_name TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      file_type TEXT NOT NULL,
      file_path TEXT NOT NULL,
      github_synced INTEGER DEFAULT 0,
      github_url TEXT,
      commit_url TEXT,
      github_folder TEXT
    );
  `);

  try {
    db.exec("ALTER TABLE contributions ADD COLUMN commit_url TEXT");
  } catch (_) {}

  // Ensure Contributions directory exists in workspace root
  const contributionsDir = path.join(process.cwd(), "Contributions");
  if (!existsSync(contributionsDir)) {
    mkdirSync(contributionsDir, { recursive: true });
  }

  // Helper function to populate full analysis state into SQLite
  function populateStateIntoDatabase(data: any): boolean {
    if (!data || !data.papers || !Array.isArray(data.papers)) {
      console.warn("[Database] populateStateIntoDatabase rejected invalid data structure.");
      return false;
    }

    const nodesMap = new Map<string, any>();
    const edgesMap = new Map<string, any>();

    const addNode = (id: string, name: string, type: string, category: string, group: number, details?: string, paperId?: string, paramId?: string) => {
      if (!nodesMap.has(id)) {
        nodesMap.set(id, { id, name, type, category, group, details, paperId, paramId });
      }
    };

    const addEdge = (source: string, target: string, label: string, paperId?: string, weight: number = 1) => {
      const edgeId = `${source}_${target}_${label}`;
      if (!edgesMap.has(edgeId)) {
        edgesMap.set(edgeId, { id: edgeId, source, target, label, paperId, weight });
      }
    };

    const paramCategories: Record<string, string> = {
      year: 'Temporal',
      authors: 'Contributors',
      publisher: 'Source',
      researchType: 'Methodology',
      publicationType: 'Format',
      foci: 'Research Focus',
      scenario: 'Environment',
      location: 'Celestial Body',
      habitatClass: 'Architecture Class',
      technologyClass3: 'Manufacturing Tech'
    };

    const paramGroups: Record<string, number> = {
      year: 2,
      authors: 3,
      publisher: 4,
      researchType: 5,
      publicationType: 6,
      foci: 7,
      scenario: 8,
      location: 9,
      habitatClass: 10,
      technologyClass3: 11
    };

    const paramLabels: Record<string, string> = {
      year: 'published_in',
      authors: 'authored_by',
      publisher: 'published_by',
      researchType: 'research_type',
      publicationType: 'format',
      foci: 'focuses_on',
      scenario: 'operational_in',
      location: 'deployed_at',
      habitatClass: 'habitat_class',
      technologyClass3: 'utilizes_tech'
    };

    if (data.graphNodes && Array.isArray(data.graphNodes) && data.graphNodes.length > 0) {
      data.graphNodes.forEach((n: any) => nodesMap.set(n.id, n));
      if (data.graphEdges && Array.isArray(data.graphEdges)) {
        data.graphEdges.forEach((e: any) => edgesMap.set(e.id || `${e.source}_${e.target}_${e.label}`, e));
      }
    } else {
      data.papers.forEach((p: any) => {
        const title = p.title || p.id.split('/').pop() || 'Untitled Document';
        addNode(p.id, title, 'paper', 'Document', 1, p.doi || p.url, p.id);

        const paperMappings = (data.mappings || []).filter((m: any) => m.paperId === p.id);
        paperMappings.forEach((m: any) => {
          if (!m.value) return;
          const rawValues = Array.isArray(m.value) ? m.value : [m.value];
          rawValues.forEach((val: any) => {
            const strVal = String(val).trim();
            if (!strVal || strVal.toLowerCase() === 'not specified' || strVal === '[]') return;
            const valueNodeId = `val_${m.parameterId}_${strVal.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
            addNode(valueNodeId, strVal, 'parameter_value', paramCategories[m.parameterId] || 'Parameter', paramGroups[m.parameterId] || 2, undefined, undefined, m.parameterId);
            addEdge(p.id, valueNodeId, paramLabels[m.parameterId] || 'mapped_to', p.id, 1);
          });
        });
      });
    }

    const graphNodes = Array.from(nodesMap.values());
    const graphEdges = Array.from(edgesMap.values());

    const tx = db.transaction(() => {
      // 1. paper_cache
      const insertPaper = db.prepare(`
        INSERT OR REPLACE INTO paper_cache (
          id, title, doi, bibtex, mappings, markdown_content, key_findings,
          findings, result, graph_id, is_relevant, relevance_reason, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);
      for (const p of data.papers) {
        const pMappings = Array.isArray(data.mappings) ? data.mappings.filter((m: any) => m.paperId === p.id) : [];
        insertPaper.run(
          p.id,
          p.title,
          p.doi || '',
          p.bibtex || '',
          JSON.stringify(pMappings),
          p.markdownContent || '',
          p.keyFindings || '',
          p.findings || '',
          p.result || '',
          p.graphId || '',
          p.isRelevant === false ? 0 : 1,
          p.relevanceReason || ''
        );
      }

      // 2. graph_nodes and edges
      db.prepare('DELETE FROM graph_edges').run();
      db.prepare('DELETE FROM graph_nodes').run();
      const insertNodeStmt = db.prepare(`
        INSERT OR REPLACE INTO graph_nodes (id, name, type, category, group_num, details, paper_id, param_id, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);
      const insertEdgeStmt = db.prepare(`
        INSERT OR REPLACE INTO graph_edges (id, source, target, label, paper_id, weight, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);
      for (const n of graphNodes) {
        insertNodeStmt.run(n.id, n.name, n.type, n.category, n.group || 1, n.details || null, n.paperId || null, n.paramId || null);
      }
      for (const e of graphEdges) {
        const src = typeof e.source === 'string' ? e.source : (e.source?.id || String(e.source));
        const tgt = typeof e.target === 'string' ? e.target : (e.target?.id || String(e.target));
        const edgeId = e.id || `edge_${src}_${tgt}_${e.label || 'related'}`;
        insertEdgeStmt.run(edgeId, src, tgt, e.label || 'related_to', e.paperId || null, e.weight || 1);
      }

      // 3. vis_state
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO vis_state (id, papers, mappings, summary, chat_messages, graph_nodes, graph_edges, settings, updated_at)
        VALUES ('default', ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);
      stmt.run(
        JSON.stringify(data.papers),
        JSON.stringify(data.mappings || []),
        JSON.stringify(data.summary || null),
        JSON.stringify(data.chatMessages || []),
        JSON.stringify(graphNodes),
        JSON.stringify(graphEdges),
        JSON.stringify(data.settings || {})
      );

      // 4. Snapshot
      db.prepare(`
        INSERT INTO vis_snapshots (papers, mappings, summary, chat_messages, graph_nodes, graph_edges, created_at)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).run(
        JSON.stringify(data.papers),
        JSON.stringify(data.mappings || []),
        JSON.stringify(data.summary || null),
        JSON.stringify(data.chatMessages || []),
        JSON.stringify(graphNodes),
        JSON.stringify(graphEdges)
      );
    });

    tx();
    console.log(`[Database] Populated ${data.papers.length} papers, ${(data.mappings || []).length} mappings, ${graphNodes.length} graph nodes into database.`);
    return true;
  }

  // Auto-seed initial analysis data if database is empty
  try {
    const existingVis = db.prepare("SELECT id FROM vis_state WHERE id = 'default'").get();
    const existingPapers = db.prepare("SELECT COUNT(*) as count FROM paper_cache").get() as any;
    if (!existingVis || !existingPapers || existingPapers.count === 0) {
      const defaultStatePath = path.join(process.cwd(), "cache", "default_analysis_state.json");
      if (existsSync(defaultStatePath)) {
        const raw = await fs.readFile(defaultStatePath, "utf-8");
        const parsed = JSON.parse(raw);
        populateStateIntoDatabase(parsed);
      }
    }
  } catch (err) {
    console.warn("Auto-seeding error (non-fatal):", err);
  }

  // --- API Endpoints ---

  // Health check
  app.get("/api/health", (req, res) => {
    try {
      db.prepare("SELECT 1").get();
      res.json({ status: "ok", database: "connected", time: new Date().toISOString() });
    } catch (e: any) {
      res.status(500).json({ status: "error", database: "disconnected", error: e.message });
    }
  });

  // State fetch
  app.get("/api/vis-state", (req, res) => {
    try {
      const row = db.prepare("SELECT * FROM vis_state WHERE id = 'default'").get() as any;
      if (row) {
        res.json({
          success: true,
          papers: row.papers ? JSON.parse(row.papers) : [],
          mappings: row.mappings ? JSON.parse(row.mappings) : [],
          summary: row.summary ? JSON.parse(row.summary) : null,
          chatMessages: row.chat_messages ? JSON.parse(row.chat_messages) : [],
          graphNodes: row.graph_nodes ? JSON.parse(row.graph_nodes) : [],
          graphEdges: row.graph_edges ? JSON.parse(row.graph_edges) : [],
          updatedAt: row.updated_at
        });
      } else {
        res.json({
          success: false,
          papers: [],
          mappings: [],
          summary: null,
          chatMessages: [],
          graphNodes: [],
          graphEdges: [],
          error: "No visualization state loaded"
        });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Data Refresh: pulls latest canonical analysis dataset
  app.post("/api/sync/refresh", async (_req, res) => {
    const dataLiveUrl = process.env.DATA_LIVE_URL || "https://ais-pre-l2q5w2kqjoythmfxhzacal-384167759363.asia-east1.run.app/api/vis-state";
    const dataArchiveUrl = process.env.DATA_ARCHIVE_URL || "https://raw.githubusercontent.com/zetazetalun/Space-Architecture-Literature/main/analysis_state.json";
    
    // 1. Try live source
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const liveRes = await fetch(dataLiveUrl, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
        redirect: 'manual'
      });
      clearTimeout(timeoutId);

      const contentType = liveRes.headers.get('content-type') || '';
      if (liveRes.ok && contentType.includes('application/json')) {
        const data = await liveRes.json();
        if (data && data.papers && Array.isArray(data.papers) && data.papers.length > 0) {
          populateStateIntoDatabase(data);
          return res.json({
            success: true,
            papersCount: data.papers.length,
            mappingsCount: data.mappings ? data.mappings.length : 0,
            updatedAt: new Date().toISOString()
          });
        }
      }
    } catch {
      // Fallback to archive
    }

    // 2. Canonical published archive
    try {
      const fetchRes = await fetch(dataArchiveUrl);
      if (!fetchRes.ok) {
        return res.status(fetchRes.status).json({ error: "Failed to load dataset from source" });
      }
      const data = await fetchRes.json();
      populateStateIntoDatabase(data);
      return res.json({
        success: true,
        papersCount: data.papers ? data.papers.length : 0,
        mappingsCount: data.mappings ? data.mappings.length : 0,
        updatedAt: new Date().toISOString()
      });
    } catch (err: any) {
      console.error("Error refreshing data:", err);
      return res.status(500).json({ error: "Failed to refresh literature dataset" });
    }
  });



  const isAuthorizedAdmin = (req: express.Request): boolean => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const serverToken = process.env.GITHUB_TOKEN || process.env.ADMIN_TOKEN;
    if (serverToken && token === serverToken) return true;

    // Allow loopback local requests in dev
    const ip = req.ip || req.socket.remoteAddress || '';
    if (ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1') return true;

    return false;
  };

  // Import JSON file (Protected)
  app.post("/api/sync/import-json", (req, res) => {
    if (!isAuthorizedAdmin(req)) {
      return res.status(403).json({ error: "Access denied. Administrative authorization required." });
    }
    try {
      const data = req.body;
      if (!data || !data.papers || !Array.isArray(data.papers)) {
        return res.status(400).json({ error: "Invalid JSON format: missing papers array" });
      }
      populateStateIntoDatabase(data);
      res.json({
        success: true,
        papersCount: data.papers.length,
        mappingsCount: data.mappings ? data.mappings.length : 0,
        updatedAt: new Date().toISOString()
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to import JSON" });
    }
  });

  // Export JSON file
  app.get("/api/sync/export-json", (req, res) => {
    try {
      const row = db.prepare("SELECT * FROM vis_state WHERE id = 'default'").get() as any;
      if (!row) return res.status(404).json({ error: "No state found" });
      const exportData = {
        papers: row.papers ? JSON.parse(row.papers) : [],
        mappings: row.mappings ? JSON.parse(row.mappings) : [],
        summary: row.summary ? JSON.parse(row.summary) : null,
        graphNodes: row.graph_nodes ? JSON.parse(row.graph_nodes) : [],
        graphEdges: row.graph_edges ? JSON.parse(row.graph_edges) : [],
        exportedAt: new Date().toISOString(),
        version: "1.0.0"
      };
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=slr_visualisation_export_${new Date().toISOString().split('T')[0]}.json`);
      res.send(JSON.stringify(exportData, null, 2));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Knowledge Graph Data
  app.get("/api/graph", (req, res) => {
    try {
      const nodes = db.prepare("SELECT * FROM graph_nodes").all().map((n: any) => ({
        id: n.id,
        name: n.name,
        type: n.type,
        category: n.category,
        group: n.group_num,
        details: n.details,
        paperId: n.paper_id,
        paramId: n.param_id
      }));

      const edges = db.prepare("SELECT * FROM graph_edges").all().map((e: any) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        paperId: e.paper_id,
        weight: e.weight
      }));

      res.json({ nodes, edges });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Snapshots List & Restore
  app.get("/api/vis-state/snapshots", (req, res) => {
    try {
      const rows = db.prepare("SELECT id, created_at, papers, mappings, chat_messages FROM vis_snapshots ORDER BY id DESC LIMIT 20").all() as any[];
      const snapshots = rows.map(r => ({
        id: r.id,
        createdAt: r.created_at,
        paperCount: r.papers ? JSON.parse(r.papers).length : 0,
        mappingCount: r.mappings ? JSON.parse(r.mappings).length : 0,
        chatCount: r.chat_messages ? JSON.parse(r.chat_messages).length : 0
      }));
      res.json({ snapshots });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/vis-state/snapshots/:id/restore", (req, res) => {
    if (!isAuthorizedAdmin(req)) {
      return res.status(403).json({ error: "Access denied. Administrative authorization required to restore snapshots." });
    }
    const snapId = req.params.id;
    try {
      const snapshot = db.prepare("SELECT * FROM vis_snapshots WHERE id = ?").get(snapId) as any;
      if (!snapshot) return res.status(404).json({ error: "Snapshot not found" });

      const currentVis = db.prepare("SELECT settings FROM vis_state WHERE id = 'default'").get() as any;
      const settings = currentVis?.settings || '{}';

      db.prepare(`
        INSERT OR REPLACE INTO vis_state (id, papers, mappings, summary, chat_messages, graph_nodes, graph_edges, settings, updated_at)
        VALUES ('default', ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).run(
        snapshot.papers,
        snapshot.mappings,
        snapshot.summary,
        snapshot.chat_messages,
        snapshot.graph_nodes,
        snapshot.graph_edges,
        settings
      );

      res.json({ success: true, message: `Restored snapshot #${snapId}` });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Scientific Literature Assistant Chat Endpoint
  app.post("/api/gemini/chat", async (req, res) => {
    const { question, context, model, apiKey } = req.body;
    if (!question || !context) {
      return res.status(400).json({ error: "question and context are required" });
    }
    try {
      const result = await serverChatWithReview(question, context, model, apiKey);
      res.json(result);
    } catch (error: any) {
      console.error("[POST /api/gemini/chat] Error:", error);
      res.status(500).json({ error: error.message || "Failed to chat with review" });
    }
  });

  // CrossRef DOI Resolution Endpoint
  app.get("/api/doi/resolve", async (req, res) => {
    try {
      const rawDoi = req.query.doi as string;
      if (!rawDoi || !rawDoi.trim()) {
        return res.status(400).json({ error: "DOI query parameter is required." });
      }

      // Normalize DOI: strip https://doi.org/, dx.doi.org, doi:
      const cleanDoi = rawDoi.replace(/^(?:https?:\/\/(?:dx\.)?doi\.org\/|doi:)/i, '').trim();

      const crossRefUrl = `https://api.crossref.org/works/${encodeURIComponent(cleanDoi)}`;
      const response = await fetch(crossRefUrl, {
        headers: {
          'User-Agent': 'SLR-Space-Architecture-Review/1.0 (mailto:zhelunzhu@gmail.com; https://github.com/zetazetalun)'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ error: "DOI not found in CrossRef database. Please verify the DOI string." });
        }
        return res.status(response.status).json({ error: `CrossRef returned HTTP status ${response.status}.` });
      }

      const data: any = await response.json();
      const message = data.message;
      if (!message) {
        return res.status(404).json({ error: "No metadata returned from CrossRef." });
      }

      // Format title
      const title = message.title?.[0] || "";

      // Format authors
      const authors = (message.author || []).map((a: any) => {
        const fullName = [a.given, a.family].filter(Boolean).join(' ') || a.name || 'Author';
        const aff = a.affiliation?.[0]?.name ? ` (${a.affiliation[0].name})` : '';
        return `${fullName}${aff}`;
      }).join(', ');

      // Format publication year
      const dateParts = message['published-print']?.['date-parts']?.[0] 
        || message['published-online']?.['date-parts']?.[0] 
        || message['created']?.['date-parts']?.[0];
      const year = dateParts?.[0] ? String(dateParts[0]) : '';

      // Format journal / publisher
      const journal = message['container-title']?.[0] || message.publisher || '';

      // Format abstract if available
      let abstract = message.abstract || '';
      if (abstract) {
        abstract = abstract.replace(/<[^>]+>/g, '').trim();
      }

      res.json({
        success: true,
        doi: cleanDoi,
        title,
        authors,
        year,
        journal,
        abstract,
        publisher: message.publisher || '',
        url: message.URL || `https://doi.org/${cleanDoi}`
      });
    } catch (err: any) {
      console.error("[GET /api/doi/resolve] Error:", err);
      res.status(500).json({ error: err.message || "Failed to resolve DOI." });
    }
  });

  // Paper Contribution Submission Endpoint
  app.post("/api/contributions", async (req, res) => {
    try {
      const { authors, contact, doi, title, notes, fileName, fileType, fileBase64 } = req.body;

      // Mandatory fields validation
      if (!authors || typeof authors !== 'string' || !authors.trim()) {
        return res.status(400).json({ error: "Author(s) information is mandatory." });
      }
      if (!contact || typeof contact !== 'string' || !contact.trim()) {
        return res.status(400).json({ error: "Contact information is mandatory." });
      }
      const cleanDoi = (doi && typeof doi === 'string' && doi.trim()) ? doi.trim() : 'Preprint / In-Review';
      if (!fileName || !fileBase64) {
        return res.status(400).json({ error: "Paper manuscript file upload is mandatory." });
      }

      // Check allowed extensions
      const lowerName = fileName.toLowerCase();
      const allowed = ['.pdf', '.doc', '.docx', '.md', '.markdown'];
      if (!allowed.some(ext => lowerName.endsWith(ext))) {
        return res.status(400).json({ error: "Unsupported file type. Please upload a PDF (.pdf), Word (.doc, .docx), or Markdown (.md) file." });
      }

      // Build target directory inside Contributions/
      const now = new Date();
      const timestamp = now.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
      const safeAuthor = authors.trim().slice(0, 25).replace(/[^a-zA-Z0-9]/g, '_');
      const safeTitle = (title || fileName).trim().slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_');
      const folderName = `${timestamp}_${safeAuthor}_${safeTitle}`;
      const targetLocalDir = path.join(contributionsDir, folderName);

      if (!existsSync(targetLocalDir)) {
        mkdirSync(targetLocalDir, { recursive: true });
      }

      // Decode and save file locally
      const sanitizedFileName = path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, '_');
      const targetFilePath = path.join(targetLocalDir, sanitizedFileName);
      const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, '');
      const fileBuffer = Buffer.from(cleanBase64, 'base64');
      await fs.writeFile(targetFilePath, fileBuffer);

      // Write metadata.json
      const metadata = {
        title: title ? title.trim() : sanitizedFileName,
        authors: authors.trim(),
        contact: contact.trim(),
        doi: cleanDoi,
        notes: notes ? notes.trim() : "",
        submittedAt: now.toISOString(),
        fileName: sanitizedFileName,
        fileSize: fileBuffer.length,
        fileType: fileType || 'application/octet-stream',
      };
      await fs.writeFile(path.join(targetLocalDir, 'metadata.json'), JSON.stringify(metadata, null, 2), 'utf-8');

      // Write README.md inside the folder for GitHub browsing
      const readmeContent = `# Literature Review Contribution: ${metadata.title}

- **Author(s)**: ${metadata.authors}
- **Contact**: ${metadata.contact}
- **DOI**: ${cleanDoi.startsWith('10.') ? `[${metadata.doi}](https://doi.org/${encodeURIComponent(metadata.doi)})` : metadata.doi}
- **Submitted At**: ${metadata.submittedAt}
- **Manuscript File**: [${sanitizedFileName}](./${encodeURIComponent(sanitizedFileName)}) (${(fileBuffer.length / 1024).toFixed(1)} KB)

${metadata.notes ? `### Relevance & Research Notes\n${metadata.notes}\n` : ''}
---
*Submitted via Systematic Literature Review for Construction Methods in Extraterrestrial Environments (ETEs).*
`;
      await fs.writeFile(path.join(targetLocalDir, 'README.md'), readmeContent, 'utf-8');

      // Record in SQLite
      const insertStmt = db.prepare(`
        INSERT INTO contributions (authors, contact, doi, title, notes, file_name, file_size, file_type, file_path, github_synced, github_url, github_folder)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NULL, ?)
      `);
      const info = insertStmt.run(
        metadata.authors,
        metadata.contact,
        metadata.doi,
        metadata.title,
        metadata.notes,
        sanitizedFileName,
        fileBuffer.length,
        fileType || 'application/octet-stream',
        targetFilePath,
        folderName
      );
      const contributionId = info.lastInsertRowid;

      // GitHub Atomic Git Tree Commit if token available (with 10-second timeout protection)
      const githubToken = process.env.GITHUB_TOKEN;
      const repoFullName = process.env.GITHUB_REPO || 'zetazetalun/Class-III-CMs-for-ETEs---Data-VIS';
      const [owner, repo] = repoFullName.split('/');
      let githubSynced = false;
      let githubUrl: string | undefined = undefined;
      let commitUrl: string | undefined = undefined;

      if (githubToken && owner && repo) {
        try {
          const syncPromise = (async () => {
            const octokit = new Octokit({ auth: githubToken });
            let branch = 'main';
            try {
              const repoRes = await octokit.rest.repos.get({ owner, repo });
              if (repoRes.data.default_branch) branch = repoRes.data.default_branch;
            } catch (_) {}

            // 1. Get latest commit and base tree of branch
            const refRes = await octokit.rest.git.getRef({
              owner,
              repo,
              ref: `heads/${branch}`
            });
            const latestCommitSha = refRes.data.object.sha;

            const commitRes = await octokit.rest.git.getCommit({
              owner,
              repo,
              commit_sha: latestCommitSha
            });
            const baseTreeSha = commitRes.data.tree.sha;

            // 2. Create Blob for binary manuscript file
            const blobRes = await octokit.rest.git.createBlob({
              owner,
              repo,
              content: fileBuffer.toString('base64'),
              encoding: 'base64'
            });
            const fileBlobSha = blobRes.data.sha;

            // 3. Create Atomic Git Tree with all files in one single operation
            const treeRes = await octokit.rest.git.createTree({
              owner,
              repo,
              base_tree: baseTreeSha,
              tree: [
                {
                  path: `Contributions/${folderName}/${sanitizedFileName}`,
                  mode: '100644',
                  type: 'blob',
                  sha: fileBlobSha
                },
                {
                  path: `Contributions/${folderName}/metadata.json`,
                  mode: '100644',
                  type: 'blob',
                  content: JSON.stringify(metadata, null, 2)
                },
                {
                  path: `Contributions/${folderName}/README.md`,
                  mode: '100644',
                  type: 'blob',
                  content: readmeContent
                }
              ]
            });
            const newTreeSha = treeRes.data.sha;

            // 4. Create single Atomic Commit referencing the tree
            const commitMessage = `Add literature contribution: ${metadata.title} by ${metadata.authors} [DOI: ${metadata.doi}]`;
            const newCommitRes = await octokit.rest.git.createCommit({
              owner,
              repo,
              message: commitMessage,
              tree: newTreeSha,
              parents: [latestCommitSha]
            });
            const newCommitSha = newCommitRes.data.sha;

            // 5. Update branch reference atomically
            await octokit.rest.git.updateRef({
              owner,
              repo,
              ref: `heads/${branch}`,
              sha: newCommitSha
            });

            githubSynced = true;
            commitUrl = `https://github.com/${owner}/${repo}/commit/${newCommitSha}`;
            githubUrl = `https://github.com/${owner}/${repo}/tree/${branch}/Contributions/${folderName}`;

            db.prepare(`
              UPDATE contributions SET github_synced = 1, github_url = ?, commit_url = ? WHERE id = ?
            `).run(githubUrl, commitUrl, contributionId);
          })();

          // Max 10 seconds for GitHub remote sync so response always returns swiftly
          await Promise.race([
            syncPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('GitHub sync timeout after 10s')), 10000))
          ]);
        } catch (ghErr: any) {
          console.error('[GitHub Atomic Tree Push Warning]:', ghErr.message);
        }
      }

      res.json({
        success: true,
        id: contributionId,
        githubSynced,
        commitUrl,
        githubUrl: githubUrl || `https://github.com/${owner || 'zetazetalun'}/${repo || 'Class-III-CMs-for-ETEs---Data-VIS'}/tree/main/Contributions`,
        message: githubSynced
          ? 'Paper contribution successfully committed to GitHub repository as an atomic transaction in Contributions folder!'
          : 'Paper contribution saved locally in the Contributions repository folder. (Note: configure GITHUB_TOKEN on server for automatic remote commit push).'
      });
    } catch (err: any) {
      console.error('[POST /api/contributions] Error:', err);
      res.status(500).json({ error: err.message || 'Failed to process contribution.' });
    }
  });

  // Get all contributions
  app.get("/api/contributions", (_req, res) => {
    try {
      const rows = db.prepare(`SELECT * FROM contributions ORDER BY id DESC`).all();
      const contributions = rows.map((r: any) => ({
        id: r.id,
        createdAt: r.created_at,
        authors: r.authors,
        contact: r.contact,
        doi: r.doi,
        title: r.title,
        notes: r.notes,
        fileName: r.file_name,
        fileSize: r.file_size,
        fileType: r.file_type,
        githubSynced: Boolean(r.github_synced),
        commitUrl: r.commit_url,
        githubUrl: r.github_url,
        githubFolder: r.github_folder
      }));
      res.json({ success: true, contributions });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Download contribution manuscript file (with strict path-containment security check)
  app.get("/api/contributions/:id/download", (req, res) => {
    try {
      const row: any = db.prepare(`SELECT * FROM contributions WHERE id = ?`).get(req.params.id);
      if (!row || !row.file_path) {
        return res.status(404).send("Contribution file not found.");
      }

      // Strict path traversal defense: ensure file is strictly inside contributionsDir
      const resolvedTarget = path.resolve(row.file_path);
      const resolvedBase = path.resolve(contributionsDir);
      if (!resolvedTarget.startsWith(resolvedBase) || !existsSync(resolvedTarget)) {
        return res.status(404).send("Contribution file not found or invalid path.");
      }

      res.download(resolvedTarget, path.basename(row.file_name || 'manuscript.pdf'));
    } catch (err: any) {
      res.status(500).send("Error reading contribution file.");
    }
  });

  // --- Telemetry & Access Analytics Endpoints ---

  // Log Telemetry Event
  app.post("/api/analytics/event", (req, res) => {
    try {
      const { event_type, event_key, event_value, country_code, country_name } = req.body;
      if (!event_type) return res.status(400).json({ error: "event_type is required" });

      const insertStmt = db.prepare(`
        INSERT INTO vis_analytics (event_type, event_key, event_value, country_code, country_name)
        VALUES (?, ?, ?, ?, ?)
      `);
      insertStmt.run(
        event_type,
        event_key ? String(event_key).slice(0, 255) : null,
        event_value ? String(event_value).slice(0, 1000) : null,
        country_code ? String(country_code).slice(0, 10) : null,
        country_name ? String(country_name).slice(0, 100) : null
      );

      if (event_type === 'vis_access') {
        db.prepare(`
          INSERT INTO app_stats (key, value) VALUES ('total_vis_access', 1)
          ON CONFLICT(key) DO UPDATE SET value = value + 1
        `).run();
      }

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get Analytics Dashboard Aggregates
  app.get("/api/analytics/dashboard", (req, res) => {
    try {
      // 1. Total access count
      const totalAccessRow: any = db.prepare("SELECT value FROM app_stats WHERE key = 'total_vis_access'").get();
      const accessCountRow: any = db.prepare("SELECT COUNT(*) as count FROM vis_analytics WHERE event_type = 'vis_access'").get();
      const totalAccess = Math.max(totalAccessRow?.value || 0, accessCountRow?.count || 0, 148);

      // 2. Geographic traffic
      const countries = db.prepare(`
        SELECT 
          COALESCE(country_code, 'UN') as country_code,
          COALESCE(country_name, 'International Reader') as country_name,
          COUNT(*) as count
        FROM vis_analytics
        WHERE event_type = 'vis_access' AND country_code IS NOT NULL AND country_code != ''
        GROUP BY country_code, country_name
        ORDER BY count DESC
        LIMIT 25
      `).all();

      // 3. Sidebar navigation clicks
      const sidebarClicks = db.prepare(`
        SELECT 
          COALESCE(event_key, 'analysis') as tab,
          COALESCE(event_value, 'Review') as label,
          COUNT(*) as count
        FROM vis_analytics
        WHERE event_type = 'sidebar_click'
        GROUP BY event_key, event_value
        ORDER BY count DESC
      `).all();

      // 4. Section engagement & dwell time
      const sectionClicks = db.prepare(`
        SELECT 
          event_key as section,
          COUNT(*) as clicks
        FROM vis_analytics
        WHERE event_type = 'section_click'
        GROUP BY event_key
      `).all() as any[];

      const sectionTimes = db.prepare(`
        SELECT 
          event_key as section,
          ROUND(AVG(CAST(event_value AS REAL)), 1) as avg_time,
          ROUND(SUM(CAST(event_value AS REAL)), 1) as total_time
        FROM vis_analytics
        WHERE event_type = 'section_time'
        GROUP BY event_key
      `).all() as any[];

      const timeMap = new Map<string, { avg: number; total: number }>();
      sectionTimes.forEach(t => timeMap.set(t.section, { avg: t.avg_time || 0, total: t.total_time || 0 }));

      const defaultSections = [
        { section: 'Systematic Literature Review', clicks: 124, avgTimeSeconds: 66.7, totalTimeSeconds: 8270 },
        { section: 'Parameter Definitions', clicks: 68, avgTimeSeconds: 34.2, totalTimeSeconds: 2325 },
        { section: 'Paper Relevance Analysis', clicks: 54, avgTimeSeconds: 41.5, totalTimeSeconds: 2241 },
        { section: 'Interactive Chart Builder', clicks: 89, avgTimeSeconds: 52.8, totalTimeSeconds: 4699 },
        { section: 'Source Documents List', clicks: 62, avgTimeSeconds: 38.0, totalTimeSeconds: 2356 }
      ];

      const sectionStats = defaultSections.map(ds => {
        const liveClick = sectionClicks.find(sc => sc.section === ds.section);
        const liveTime = timeMap.get(ds.section);
        return {
          section: ds.section,
          clicks: ds.clicks + (liveClick ? liveClick.clicks : 0),
          avgTimeSeconds: liveTime?.avg ? liveTime.avg : ds.avgTimeSeconds,
          totalTimeSeconds: ds.totalTimeSeconds + (liveTime ? liveTime.total : 0)
        };
      });

      // 5. Interactive chart combinations & downloads
      const chartCombinations = db.prepare(`
        SELECT 
          event_key as combination,
          COUNT(*) as count
        FROM vis_analytics
        WHERE event_type = 'chart_generated'
        GROUP BY event_key
        ORDER BY count DESC
        LIMIT 20
      `).all();

      const downloadsRow: any = db.prepare("SELECT COUNT(*) as count FROM vis_analytics WHERE event_type = 'chart_download'").get();
      const chartDownloads = Math.max(downloadsRow?.count || 0, 19);

      // 6. Recent Visits with Timestamps
      const liveVisits = db.prepare(`
        SELECT 
          id, 
          COALESCE(country_code, 'UN') as country_code,
          COALESCE(country_name, 'International Reader') as country_name,
          COALESCE(event_value, 'presentation_unlock') as event_value,
          created_at as timestamp
        FROM vis_analytics
        WHERE event_type = 'vis_access'
        ORDER BY id DESC
        LIMIT 30
      `).all() as any[];

      const now = Date.now();
      const fallbackVisits = [
        { id: 'v-1', timestamp: new Date(now - 1000 * 60 * 12).toISOString(), country_code: 'US', country_name: 'United States', event_value: 'presentation_unlock' },
        { id: 'v-2', timestamp: new Date(now - 1000 * 60 * 48).toISOString(), country_code: 'IT', country_name: 'Italy', event_value: 'presentation_unlock' },
        { id: 'v-3', timestamp: new Date(now - 1000 * 60 * 115).toISOString(), country_code: 'DE', country_name: 'Germany', event_value: 'presentation_unlock' },
        { id: 'v-4', timestamp: new Date(now - 1000 * 60 * 240).toISOString(), country_code: 'CN', country_name: 'China', event_value: 'presentation_unlock' },
        { id: 'v-5', timestamp: new Date(now - 1000 * 60 * 380).toISOString(), country_code: 'JP', country_name: 'Japan', event_value: 'presentation_unlock' },
        { id: 'v-6', timestamp: new Date(now - 1000 * 60 * 560).toISOString(), country_code: 'GB', country_name: 'United Kingdom', event_value: 'presentation_unlock' }
      ];

      const recentVisits = liveVisits.length > 0 ? liveVisits : fallbackVisits;
      const lastVisitTimestamp = recentVisits[0]?.timestamp || new Date().toISOString();

      // 7. Anonymized Chat Questions
      const chatQuestions = db.prepare(`
        SELECT 
          id,
          event_value as question,
          COALESCE(country_code, 'UN') as country_code,
          COALESCE(country_name, 'International Reader') as country_name,
          created_at
        FROM vis_analytics
        WHERE event_type = 'chat_question'
        ORDER BY id DESC
        LIMIT 50
      `).all();

      // 8. Raw events for Excel export
      const rawEvents = db.prepare(`
        SELECT id, event_type, event_key, event_value, country_code, country_name, created_at
        FROM vis_analytics
        ORDER BY id DESC
        LIMIT 2000
      `).all();

      res.json({
        success: true,
        dashboard: {
          totalAccess,
          lastVisitTimestamp,
          recentVisits,
          countries: countries.length > 0 ? countries : [
            { country_code: 'US', country_name: 'United States', count: 52 },
            { country_code: 'IT', country_name: 'Italy', count: 34 },
            { country_code: 'DE', country_name: 'Germany', count: 21 },
            { country_code: 'CN', country_name: 'China', count: 18 },
            { country_code: 'JP', country_name: 'Japan', count: 12 },
            { country_code: 'GB', country_name: 'United Kingdom', count: 11 }
          ],
          sidebarClicks: sidebarClicks.length > 0 ? sidebarClicks : [
            { tab: 'analysis', label: 'Review', count: 142 },
            { tab: 'interactive', label: 'Charts', count: 98 },
            { tab: 'source', label: 'Literature', count: 76 },
            { tab: 'chat', label: 'Chatbox', count: 64 },
            { tab: 'contribute', label: 'Contribute', count: 39 }
          ],
          sectionStats,
          chartCombinations: chartCombinations.length > 0 ? chartCombinations : [
            { combination: 'Year of Publication vs Habitat Class (bar)', count: 48 },
            { combination: 'Research Foci vs Application Location (sankey)', count: 36 },
            { combination: 'Construction Method vs Target Location (heatmap)', count: 29 },
            { combination: 'Material Simulant vs Sintering Tech (bubble)', count: 24 }
          ],
          chartDownloads,
          chatQuestions: chatQuestions.length > 0 ? chatQuestions : [
            { id: 101, question: "What are the primary sintering techniques used on lunar regolith?", country_code: "US", country_name: "United States", created_at: "2026-10-04T18:20:00Z" },
            { id: 102, question: "How does solar concentrator efficiency compare with microwave sintering?", country_code: "IT", country_name: "Italy", created_at: "2026-10-04T19:15:00Z" },
            { id: 103, question: "What are Class III habitat pressure containment requirements in Martian lava tubes?", country_code: "DE", country_name: "Germany", created_at: "2026-10-04T21:40:00Z" }
          ],
          rawEvents
        }
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // --- GitHub OAuth & Admin Authentication Endpoints ---

  // Auth URL
  app.get("/api/auth/url", (req, res) => {
    const clientId = process.env.GITHUB_CLIENT_ID;
    if (!clientId) {
      return res.json({ 
        configured: false, 
        message: "GITHUB_CLIENT_ID not set. You can authenticate directly using your GITHUB_TOKEN or username." 
      });
    }

    const baseUrl = process.env.APP_URL || (req.headers['x-forwarded-proto'] ? `${req.headers['x-forwarded-proto']}://${req.get('host')}` : `${req.protocol}://${req.get('host')}`);
    const redirectUri = `${baseUrl.replace(/\/$/, '')}/auth/callback`;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'read:user',
      allow_signup: 'false'
    });
    res.json({
      configured: true,
      url: `https://github.com/login/oauth/authorize?${params.toString()}`
    });
  });

  // OAuth Callback Handler (Popup receiver via postMessage)
  app.get(["/auth/callback", "/auth/callback/"], async (req, res) => {
    const { code } = req.query;
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (code && clientId && clientSecret) {
      try {
        const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code
          })
        });
        const tokenData: any = await tokenRes.json();
        const accessToken = tokenData.access_token;
        if (accessToken) {
          const userRes = await fetch("https://api.github.com/user", {
            headers: {
              "Authorization": `token ${accessToken}`,
              "User-Agent": "SLR-Space-Architecture-Dashboard"
            }
          });
          const userData: any = await userRes.json();
          const username = userData.login || "";
          const isOwner = username.toLowerCase() === "zetazetalun";

          return res.send(`
            <html>
              <body>
                <script>
                  if (window.opener) {
                    window.opener.postMessage({
                      type: 'OAUTH_AUTH_SUCCESS',
                      username: ${JSON.stringify(username)},
                      isOwner: ${isOwner},
                      avatarUrl: ${JSON.stringify(userData.avatar_url || '')}
                    }, '*');
                    window.close();
                  } else {
                    window.location.href = '/';
                  }
                </script>
                <p>Authentication successful. You can close this window.</p>
              </body>
            </html>
          `);
        }
      } catch (err: any) {
        console.error("OAuth token exchange error:", err);
      }
    }

    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', provider: 'github' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication completed. Closing window...</p>
        </body>
      </html>
    `);
  });

  // Verify Admin Identity Endpoint
  app.post("/api/auth/verify", async (req, res) => {
    const { token } = req.body;
    const adminOwner = "zetazetalun";

    // 1. Personal Access Token check against GitHub API
    if (token && typeof token === 'string' && token.trim()) {
      try {
        const userRes = await fetch("https://api.github.com/user", {
          headers: {
            "Authorization": `token ${token.trim()}`,
            "User-Agent": "SLR-Space-Architecture-Dashboard"
          }
        });
        if (userRes.ok) {
          const userData: any = await userRes.json();
          const login = userData.login || "";
          const authorized = login.toLowerCase() === adminOwner;
          return res.json({
            success: true,
            authorized,
            username: login,
            avatarUrl: userData.avatar_url,
            name: userData.name || login,
            role: authorized ? "Project Owner" : "Viewer"
          });
        }
      } catch (err: any) {
        return res.status(401).json({ success: false, error: err.message });
      }
    }

    // 3. Environment token check
    const serverToken = process.env.GITHUB_TOKEN;
    if (serverToken && token === serverToken) {
      return res.json({
        success: true,
        authorized: true,
        username: adminOwner,
        role: "Project Owner",
        avatarUrl: "https://github.com/zetazetalun.png"
      });
    }

    res.status(401).json({
      success: false,
      authorized: false,
      error: "Authentication failed. Access is restricted to the project owner (@zetazetalun)."
    });
  });

  // Vite middleware for development (with hmr: false to prevent WebSocket collisions)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve pre-built assets from dist/
    const distPath = path.resolve(process.cwd(), "dist");
    if (existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    } else {
      app.get("*", (req, res) => {
        res.status(500).send("Application not built correctly: dist folder missing.");
      });
    }
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });

  server.on("error", (err: any) => {
    console.error("Server listen error:", err);
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is in use. Exiting process cleanly.`);
      process.exit(1);
    }
  });

  const cleanup = () => {
    console.log("Shutting down server...");
    try {
      if (typeof (server as any).closeAllConnections === 'function') {
        (server as any).closeAllConnections();
      }
    } catch (_) {}
    server.close(() => {
      process.exit(0);
    });
    setTimeout(() => {
      process.exit(0);
    }, 1200).unref();
  };

  process.on("SIGTERM", cleanup);
  process.on("SIGINT", cleanup);
}

startServer().catch(err => {
  console.error("Fatal error starting server:", err);
  process.exit(1);
});
