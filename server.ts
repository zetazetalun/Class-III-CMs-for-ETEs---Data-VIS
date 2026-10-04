import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "fs";
import fs from "fs/promises";
import dotenv from "dotenv";
import { serverChatWithReview } from "./server/geminiService";

dotenv.config();

async function startServer() {
  const portArgIndex = process.argv.indexOf('--port');
  const cliPort = portArgIndex !== -1 && process.argv[portArgIndex + 1] ? Number(process.argv[portArgIndex + 1]) : NaN;
  // Always default to port 3000 as required by the AI Studio environment
  const PORT = !isNaN(cliPort) && cliPort > 0 ? cliPort : 3000;

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
  `);

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

  // Data Refresh: pulls canonical analysis dataset
  app.post("/api/sync/refresh", async (req, res) => {
    const parentAppUrl = "https://ais-pre-l2q5w2kqjoythmfxhzacal-384167759363.asia-east1.run.app/api/vis-state";
    const githubFallbackUrl = "https://raw.githubusercontent.com/zetazetalun/Space-Architecture-Literature/main/analysis_state.json";
    
    // Quick test of parent tool
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const parentRes = await fetch(parentAppUrl, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
        redirect: 'manual'
      });
      clearTimeout(timeoutId);

      const contentType = parentRes.headers.get('content-type') || '';
      if (parentRes.ok && contentType.includes('application/json')) {
        const data = await parentRes.json();
        if (data && data.papers && Array.isArray(data.papers) && data.papers.length > 0) {
          populateStateIntoDatabase(data);
          return res.json({
            success: true,
            source: 'parent_tool_live',
            papersCount: data.papers.length,
            mappingsCount: data.mappings ? data.mappings.length : 0,
            updatedAt: new Date().toISOString()
          });
        }
      }
    } catch {
      // Proceed directly to canonical archive
    }

    // Canonical published repository archive
    try {
      const fetchRes = await fetch(githubFallbackUrl);
      if (!fetchRes.ok) {
        return res.status(fetchRes.status).json({ error: `Failed to refresh from parent source (HTTP ${fetchRes.status})` });
      }
      const data = await fetchRes.json();
      populateStateIntoDatabase(data);
      return res.json({
        success: true,
        source: 'canonical_archive',
        papersCount: data.papers ? data.papers.length : 0,
        mappingsCount: data.mappings ? data.mappings.length : 0,
        updatedAt: new Date().toISOString()
      });
    } catch (err: any) {
      console.error("Error refreshing data:", err);
      return res.status(500).json({ error: err.message || "Failed to refresh data" });
    }
  });

  // Pull latest from GitHub
  app.post("/api/sync/github", async (req, res) => {
    try {
      const repoUrl = req.body?.url || "https://raw.githubusercontent.com/zetazetalun/Space-Architecture-Literature/main/analysis_state.json";
      const fetchRes = await fetch(repoUrl);
      if (!fetchRes.ok) {
        return res.status(fetchRes.status).json({ error: `GitHub fetch failed with status ${fetchRes.status}` });
      }
      const data = await fetchRes.json();
      populateStateIntoDatabase(data);
      res.json({
        success: true,
        papersCount: data.papers ? data.papers.length : 0,
        mappingsCount: data.mappings ? data.mappings.length : 0,
        updatedAt: new Date().toISOString()
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to sync with GitHub" });
    }
  });

  // Sync with remote applet URL
  app.post("/api/sync/remote-applet", async (req, res) => {
    const { url, token } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
      let targetUrl = url.trim().replace(/\/+$/, '');
      if (targetUrl.endsWith('/vis')) {
        targetUrl = targetUrl.replace(/\/vis$/, '/api/vis-state');
      } else if (!targetUrl.endsWith('/api/vis-state')) {
        targetUrl = `${targetUrl}/api/vis-state`;
      }

      const headers: Record<string, string> = { 'Accept': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const remoteRes = await fetch(targetUrl, { headers, redirect: 'manual' });

      if (remoteRes.status >= 300 && remoteRes.status < 400) {
        return res.json({
          success: false,
          isAuthProtected: true,
          message: "The remote AI Studio preview environment requires Google session authentication. Please use 'Refresh Data from Parent Tool' or import your JSON export file."
        });
      }

      if (!remoteRes.ok) {
        return res.status(remoteRes.status).json({
          success: false,
          error: `Remote endpoint returned HTTP ${remoteRes.status}: ${remoteRes.statusText}`
        });
      }

      const data = await remoteRes.json();
      if (!data.papers || !data.summary) {
        return res.json({
          success: false,
          error: "Remote applet returned no published analysis dataset."
        });
      }

      populateStateIntoDatabase(data);
      res.json({
        success: true,
        papersCount: data.papers.length,
        mappingsCount: data.mappings ? data.mappings.length : 0,
        updatedAt: new Date().toISOString()
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to fetch from remote URL" });
    }
  });

  // Import JSON file
  app.post("/api/sync/import-json", (req, res) => {
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
