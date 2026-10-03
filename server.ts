import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";
import fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import crypto from "crypto";
import { serverAnalyzePaper, serverSynthesizeReview, serverChatWithReview } from "./server/geminiService";

dotenv.config();

// Standard ESM path detection for development (not used currently)

async function startServer() {
  console.log(`Starting server. NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`CWD: ${process.cwd()}`);
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '200mb' }));
  app.use(express.urlencoded({ limit: '200mb', extended: true }));
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // Ensure papers and cache directory exists
  const papersDir = path.join(process.cwd(), "papers");
  const cacheDir = path.join(process.cwd(), "cache");
  
  [papersDir, cacheDir].forEach(dir => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  });

  // Initialize SQLite in the cache folder
  const db = new Database(path.join(cacheDir, "slr_cache.db"));
  db.pragma('journal_mode = WAL');
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    try {
      db.prepare("SELECT 1").get();
      res.json({ status: "ok", database: "connected", time: new Date().toISOString() });
    } catch (e: any) {
      res.status(500).json({ status: "error", database: "disconnected", error: e.message });
    }
  });

  app.post("/api/files/upload", (req, res) => {
    res.status(403).json({ error: "File upload is disabled on the public visualization tool to protect data integrity." });
  });

  app.delete("/api/files/delete", (req, res) => {
    res.status(403).json({ error: "File deletion is disabled on the public visualization tool to protect data integrity." });
  });

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
      embeddings TEXT,
      parameters_hash TEXT,
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

    INSERT OR IGNORE INTO app_stats (key, value) VALUES ('generations', 0);
    INSERT OR IGNORE INTO app_stats (key, value) VALUES ('reports', 0);
    INSERT OR IGNORE INTO app_stats (key, value) VALUES ('downloads', 0);
    INSERT OR IGNORE INTO app_stats (key, value) VALUES ('vis_accesses', 0);
  `);

  // Safe migrations for existing databases
  try { db.exec("ALTER TABLE paper_cache ADD COLUMN findings TEXT;"); } catch (_) {}
  try { db.exec("ALTER TABLE paper_cache ADD COLUMN result TEXT;"); } catch (_) {}
  try { db.exec("ALTER TABLE paper_cache ADD COLUMN graph_id TEXT;"); } catch (_) {}
  try { db.exec("ALTER TABLE vis_state ADD COLUMN settings TEXT;"); } catch (_) {}

  // Helper to load analysis state into SQLite
  function populateStateIntoDatabase(data: any) {
    if (!data || !data.papers || !Array.isArray(data.papers)) return false;

    // Build knowledge graph nodes & edges
    const nodesMap = new Map<string, any>();
    const edgesMap = new Map<string, any>();

    const addNode = (id: string, name: string, type: string, category: string, group: number, details?: string, paperId?: string, paramId?: string) => {
      if (!nodesMap.has(id)) {
        nodesMap.set(id, { id, name, type, category, group, details, paperId, paramId });
      }
    };

    const addEdge = (source: string, target: string, label: string, paperId?: string, weight: number = 1) => {
      const id = `edge_${source}_${target}_${label}`;
      if (!edgesMap.has(id)) {
        edgesMap.set(id, { id, source, target, label, paperId, weight });
      }
    };

    data.papers.forEach((p: any) => {
      addNode(p.id, p.title ? p.title.replace(/\.(pdf|md|docx?)$/i, '') : p.id, 'paper', 'Paper', 1, p.keyFindings || p.relevanceReason || '', p.id, undefined);
    });

    const paramLabels: Record<string, string> = {
      year: 'published_in',
      authors: 'authored_by',
      publisher: 'published_by',
      researchType: 'research_type',
      publicationType: 'publication_type',
      foci: 'research_foci',
      scenario: 'application_scenario',
      location: 'application_location',
      habitatClass: 'habitat_class',
      technologyClass3: 'class_3_technology'
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

    if (Array.isArray(data.mappings)) {
      data.mappings.forEach((m: any) => {
        if (!m.value) return;
        const rawValues = Array.isArray(m.value) ? m.value : [m.value];
        rawValues.forEach((val: any) => {
          if (!val || typeof val !== 'string') return;
          const cleanVal = val.trim();
          if (!cleanVal || ['n/a', 'none', 'unknown'].includes(cleanVal.toLowerCase())) return;
          
          const valueNodeId = `${m.parameterId}:${cleanVal}`;
          addNode(
            valueNodeId,
            cleanVal,
            'parameter_value',
            m.parameterId,
            paramGroups[m.parameterId] || 12,
            m.evidence || '',
            m.paperId,
            m.parameterId
          );
          addEdge(m.paperId, valueNodeId, paramLabels[m.parameterId] || 'mapped_to', m.paperId, 1);
        });
      });
    }

    const graphNodes = data.graphNodes && data.graphNodes.length > 0 ? data.graphNodes : Array.from(nodesMap.values());
    const graphEdges = data.graphEdges && data.graphEdges.length > 0 ? data.graphEdges : Array.from(edgesMap.values());

    const defaultSettings = {
      enabled: true,
      pinProtected: false,
      pin: '',
      showReviewVisualisation: true,
      showReviewResults: true,
      showReviewParameters: true,
      showReviewInteractive: true,
      showReviewDocuments: true,
      showGraphSection: true,
      showChatbox: true
    };

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
        JSON.stringify(data.settings || defaultSettings)
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

  // Auto-seed if database is empty
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

  // Sync API Routes
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
      console.error("Error syncing with GitHub:", err);
      res.status(500).json({ error: err.message || "Failed to sync with GitHub" });
    }
  });

  app.post("/api/sync/refresh", async (req, res) => {
    const parentAppUrl = "https://ais-pre-l2q5w2kqjoythmfxhzacal-384167759363.asia-east1.run.app/api/vis-state";
    const githubFallbackUrl = "https://raw.githubusercontent.com/zetazetalun/Space-Architecture-Literature/main/analysis_state.json";
    
    // First attempt: direct fetch from original tool
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
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
    } catch (parentErr) {
      console.warn("Direct parent tool fetch bypassed, falling back to canonical synced dataset...", parentErr);
    }

    // Second attempt: fetch canonical published dataset from GitHub
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

  app.post("/api/sync/remote-applet", async (req, res) => {
    const { url, token } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
      // Normalize URL
      let targetUrl = url.trim().replace(/\/+$/, '');
      if (targetUrl.endsWith('/vis')) {
        targetUrl = targetUrl.replace(/\/vis$/, '/api/vis-state');
      } else if (!targetUrl.endsWith('/api/vis-state')) {
        targetUrl = `${targetUrl}/api/vis-state`;
      }

      const headers: Record<string, string> = {
        'Accept': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['Cookie'] = `__SECURE-aistudio_auth_token=${token}`;
      }

      const remoteRes = await fetch(targetUrl, {
        headers,
        redirect: 'manual'
      });

      if (remoteRes.status >= 300 && remoteRes.status < 400) {
        // AI Studio Preview redirect to auth bridge
        const location = remoteRes.headers.get('location') || '';
        if (location.includes('applet-auth-bridge') || location.includes('cookie_check')) {
          return res.json({
            success: false,
            isAuthProtected: true,
            message: "The remote AI Studio preview environment requires Google session authentication. We recommend clicking 'Sync from GitHub' (which pulls the exact state saved by your SLR app) or importing your JSON export file."
          });
        }
      }

      if (!remoteRes.ok) {
        return res.status(remoteRes.status).json({
          success: false,
          error: `Remote endpoint returned HTTP ${remoteRes.status}: ${remoteRes.statusText}`
        });
      }

      const contentType = remoteRes.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return res.json({
          success: false,
          isAuthProtected: true,
          message: "Remote URL returned non-JSON content. If this is an AI Studio preview URL, it is protected by Google session authentication. Please use 'Sync from GitHub' to load the synchronized state."
        });
      }

      const remoteData = await remoteRes.json();
      if (!remoteData.papers || !remoteData.summary) {
        return res.json({
          success: false,
          error: "Remote applet returned no published analysis state. Please make sure data has been published on the parent app."
        });
      }

      populateStateIntoDatabase(remoteData);
      res.json({
        success: true,
        papersCount: remoteData.papers ? remoteData.papers.length : 0,
        mappingsCount: remoteData.mappings ? remoteData.mappings.length : 0,
        updatedAt: new Date().toISOString()
      });
    } catch (err: any) {
      console.error("Error in remote-applet sync:", err);
      res.status(500).json({ error: err.message || "Failed to fetch from remote URL" });
    }
  });

  app.post("/api/sync/import-json", (req, res) => {
    try {
      const data = req.body;
      if (!data || !data.papers || !Array.isArray(data.papers)) {
        return res.status(400).json({ error: "Invalid JSON format: missing 'papers' array." });
      }
      populateStateIntoDatabase(data);
      res.json({
        success: true,
        papersCount: data.papers.length,
        mappingsCount: data.mappings ? data.mappings.length : 0,
        updatedAt: new Date().toISOString()
      });
    } catch (err: any) {
      console.error("Error importing JSON:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/sync/export-json", (req, res) => {
    try {
      const row = db.prepare("SELECT * FROM vis_state WHERE id = 'default'").get() as any;
      if (!row) {
        return res.status(404).json({ error: "No state found" });
      }
      const data = {
        papers: row.papers ? JSON.parse(row.papers) : [],
        mappings: row.mappings ? JSON.parse(row.mappings) : [],
        summary: row.summary ? JSON.parse(row.summary) : null,
        chatMessages: row.chat_messages ? JSON.parse(row.chat_messages) : [],
        graphNodes: row.graph_nodes ? JSON.parse(row.graph_nodes) : [],
        graphEdges: row.graph_edges ? JSON.parse(row.graph_edges) : [],
        settings: row.settings ? JSON.parse(row.settings) : {},
        updatedAt: row.updated_at
      };
      res.setHeader('Content-Disposition', 'attachment; filename="slr_analysis_visualization.json"');
      res.setHeader('Content-Type', 'application/json');
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Routes
  app.get("/api/stats", (req, res) => {
    const rows = db.prepare("SELECT * FROM app_stats").all();
    const stats = rows.reduce((acc: any, row: any) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
    res.json(stats);
  });

  app.post("/api/stats/:key/increment", (req, res) => {
    const { key } = req.params;
    db.prepare("UPDATE app_stats SET value = value + 1 WHERE key = ?").run(key);
    res.json({ success: true });
  });

  app.get("/api/cache", (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM paper_cache").all();
      res.json(rows);
    } catch (error: any) {
      console.error("Database error in GET /api/cache:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/cache/item", (req, res) => {
    const id = req.query.id as string;
    const paramsHash = req.query.paramsHash as string;
    if (!id) return res.status(400).json({ error: "id is required" });
    let row;
    if (paramsHash) {
      row = db.prepare("SELECT * FROM paper_cache WHERE id = ? AND parameters_hash = ?").get(id, paramsHash);
    } else {
      row = db.prepare("SELECT * FROM paper_cache WHERE id = ?").get(id);
    }
    
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.get("/api/cache/:id", (req, res) => {
    const paramsHash = req.query.paramsHash as string;
    let row;
    if (paramsHash) {
      row = db.prepare("SELECT * FROM paper_cache WHERE id = ? AND parameters_hash = ?").get(req.params.id, paramsHash);
    } else {
      row = db.prepare("SELECT * FROM paper_cache WHERE id = ?").get(req.params.id);
    }
    
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.post("/api/cache", (req, res) => {
    res.status(403).json({ error: "Cache writing is disabled on the public visualization tool to protect data integrity." });
  });

  // Graph Database API Routes
  app.get("/api/graph", (req, res) => {
    try {
      const nodes = db.prepare("SELECT id, name, type, category, group_num as 'group', details, paper_id as paperId, param_id as paramId FROM graph_nodes").all();
      const edges = db.prepare("SELECT id, source, target, label, paper_id as paperId, weight FROM graph_edges").all();
      res.json({
        success: true,
        nodes,
        edges,
        count: {
          nodes: nodes.length,
          edges: edges.length
        }
      });
    } catch (error: any) {
      console.error("Database error in GET /api/graph:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/graph/sync", (req, res) => {
    const { nodes, edges, paperIds, fullSync } = req.body;
    try {
      const insertNode = db.prepare(`
        INSERT OR REPLACE INTO graph_nodes (id, name, type, category, group_num, details, paper_id, param_id, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);

      const insertEdge = db.prepare(`
        INSERT OR REPLACE INTO graph_edges (id, source, target, label, paper_id, weight, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);

      const syncTx = db.transaction((nodesList: any[], edgesList: any[], targetPaperIds?: string[], isFullSync?: boolean) => {
        if (isFullSync) {
          db.prepare("DELETE FROM graph_edges").run();
          db.prepare("DELETE FROM graph_nodes").run();
        } else if (targetPaperIds && targetPaperIds.length > 0) {
          const deleteEdgesStmt = db.prepare(`DELETE FROM graph_edges WHERE paper_id = ? OR source = ? OR target = ?`);
          const deleteNodesStmt = db.prepare(`DELETE FROM graph_nodes WHERE paper_id = ? OR id = ?`);
          for (const pid of targetPaperIds) {
            deleteEdgesStmt.run(pid, pid, pid);
            deleteNodesStmt.run(pid, pid);
          }
        }

        if (Array.isArray(nodesList)) {
          for (const n of nodesList) {
            insertNode.run(
              n.id,
              n.name || n.label || n.id,
              n.type || 'entity',
              n.category || null,
              n.group || 1,
              n.details || null,
              n.paperId || null,
              n.paramId || null
            );
          }
        }

        if (Array.isArray(edgesList)) {
          for (const e of edgesList) {
            const src = typeof e.source === 'string' ? e.source : (e.source?.id || String(e.source));
            const tgt = typeof e.target === 'string' ? e.target : (e.target?.id || String(e.target));
            const edgeId = e.id || `${src}_${tgt}_${e.label || 'related'}`;
            insertEdge.run(
              edgeId,
              src,
              tgt,
              e.label || 'related_to',
              e.paperId || null,
              e.weight || 1
            );
          }
        }
      });

      syncTx(nodes || [], edges || [], paperIds, fullSync);

      const totalNodes = db.prepare("SELECT COUNT(*) as count FROM graph_nodes").get() as any;
      const totalEdges = db.prepare("SELECT COUNT(*) as count FROM graph_edges").get() as any;

      res.json({
        success: true,
        nodesCount: totalNodes?.count || 0,
        edgesCount: totalEdges?.count || 0
      });
    } catch (error: any) {
      console.error("Database error in POST /api/graph/sync:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/graph/clear", (req, res) => {
    res.status(403).json({ error: "Graph clearing is disabled on the public visualization tool to protect data integrity." });
  });

  // Visualization State API Routes
  app.get("/api/vis-state", (req, res) => {
    try {
      const isVisitor = req.query.visitor === 'true';
      if (isVisitor) {
        try {
          db.prepare("UPDATE app_stats SET value = value + 1 WHERE key = 'vis_accesses'").run();
          
          const countryCode = (req.query.countryCode as string) || 'Unknown';
          const countryName = (req.query.countryName as string) || 'Unknown Location';
          db.prepare(`
            INSERT INTO vis_analytics (event_type, event_key, event_value, country_code, country_name)
            VALUES ('vis_access', 'vis_page', '1', ?, ?)
          `).run(countryCode, countryName);
        } catch (err) {
          console.warn("Failed to log visitor access event:", err);
        }
      }
      const row = db.prepare("SELECT * FROM vis_state WHERE id = 'default'").get() as any;
      const defaultSettings = {
        enabled: true,
        pinProtected: false,
        pin: "",
        showReviewVisualisation: true,
        showReviewResults: true,
        showReviewParameters: true,
        showReviewInteractive: true,
        showReviewDocuments: true,
        showGraphSection: true,
        showChatbox: true
      };

      if (row) {
        res.json({
          success: true,
          papers: row.papers ? JSON.parse(row.papers) : [],
          mappings: row.mappings ? JSON.parse(row.mappings) : [],
          summary: row.summary ? JSON.parse(row.summary) : null,
          chatMessages: isVisitor ? [] : (row.chat_messages ? JSON.parse(row.chat_messages) : []),
          graphNodes: row.graph_nodes ? JSON.parse(row.graph_nodes) : [],
          graphEdges: row.graph_edges ? JSON.parse(row.graph_edges) : [],
          settings: row.settings ? { ...defaultSettings, ...JSON.parse(row.settings) } : defaultSettings,
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
          settings: defaultSettings,
          error: "No visualization state published yet"
        });
      }
    } catch (error: any) {
      console.error("Database error in GET /api/vis-state:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/vis-state", (req, res) => {
    res.status(403).json({ error: "Direct state overwrite is disabled. Please use the Refresh Data link to synchronize with the original tool." });
  });

  app.post("/api/vis-state/settings", (req, res) => {
    res.status(403).json({ error: "Settings modification is disabled on the public visualization tool to protect data integrity." });
  });

  app.get("/api/vis-state/snapshots", (req, res) => {
    try {
      const rows = db.prepare("SELECT id, created_at, papers, mappings, chat_messages FROM vis_snapshots ORDER BY id DESC").all() as any[];
      const snapshots = rows.map(r => {
        let paperCount = 0;
        let mappingCount = 0;
        let chatCount = 0;
        try { paperCount = r.papers ? JSON.parse(r.papers).length : 0; } catch(_) {}
        try { mappingCount = r.mappings ? JSON.parse(r.mappings).length : 0; } catch(_) {}
        try { chatCount = r.chat_messages ? JSON.parse(r.chat_messages).length : 0; } catch(_) {}

        return {
          id: r.id,
          createdAt: r.created_at,
          paperCount,
          mappingCount,
          chatCount
        };
      });
      res.json({ success: true, snapshots });
    } catch (error: any) {
      console.error("Database error in GET /api/vis-state/snapshots:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/vis-state/snapshots/:id/restore", (req, res) => {
    const { id } = req.params;
    try {
      const snapshot = db.prepare("SELECT * FROM vis_snapshots WHERE id = ?").get(id) as any;
      if (!snapshot) {
        return res.status(404).json({ success: false, error: "Snapshot not found" });
      }

      const row = db.prepare("SELECT settings FROM vis_state WHERE id = 'default'").get() as any;
      const currentSettings = row ? row.settings : null;

      const stmt = db.prepare(`
        INSERT OR REPLACE INTO vis_state (id, papers, mappings, summary, chat_messages, graph_nodes, graph_edges, settings, updated_at)
        VALUES ('default', ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);
      stmt.run(
        snapshot.papers || '[]',
        snapshot.mappings || '[]',
        snapshot.summary || 'null',
        snapshot.chat_messages || '[]',
        snapshot.graph_nodes || '[]',
        snapshot.graph_edges || '[]',
        currentSettings || '{}'
      );

      res.json({ success: true });
    } catch (error: any) {
      console.error("Database error in POST /api/vis-state/snapshots/restore:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vis Analytics Event Tracking API
  app.post("/api/analytics/event", (req, res) => {
    const { eventType, eventKey, eventValue, countryCode, countryName } = req.body;
    try {
      db.prepare(`
        INSERT INTO vis_analytics (event_type, event_key, event_value, country_code, country_name)
        VALUES (?, ?, ?, ?, ?)
      `).run(eventType, eventKey, String(eventValue || ''), countryCode || 'Unknown', countryName || 'Unknown Location');
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error inserting analytics event:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vis Analytics Summary compile API
  app.get("/api/analytics/summary", (req, res) => {
    try {
      // 1. Sidebar clicks
      const sidebarClicks = db.prepare(`
        SELECT event_key as button, COUNT(*) as count 
        FROM vis_analytics 
        WHERE event_type = 'sidebar_click' 
        GROUP BY event_key 
        ORDER BY count DESC
      `).all();

      // 2. Section views & time spent
      const sectionStats = db.prepare(`
        SELECT 
          event_key as section, 
          COUNT(*) as clicks,
          AVG(CASE WHEN event_value != '' THEN CAST(event_value AS REAL) ELSE 0 END) as avgTime
        FROM vis_analytics 
        WHERE event_type = 'section_click' OR event_type = 'section_time'
        GROUP BY event_key
      `).all();

      // 3. Generated chart combinations
      const chartCombinations = db.prepare(`
        SELECT event_key as combination, COUNT(*) as count 
        FROM vis_analytics 
        WHERE event_type = 'chart_generated' 
        GROUP BY event_key 
        ORDER BY count DESC
      `).all();

      // 4. Chart downloads
      const chartDownloadsRow = db.prepare(`
        SELECT COUNT(*) as count 
        FROM vis_analytics 
        WHERE event_type = 'chart_download'
      `).get() as any;
      const chartDownloads = chartDownloadsRow?.count || 0;

      // 5. Chat questions
      const chatQuestions = db.prepare(`
        SELECT event_value as question, country_code as countryCode, country_name as countryName, created_at as createdAt 
        FROM vis_analytics 
        WHERE event_type = 'chat_question' 
        ORDER BY id DESC 
        LIMIT 50
      `).all();

      // 6. Country breakdown
      const countries = db.prepare(`
        SELECT country_code as code, country_name as name, COUNT(*) as count 
        FROM vis_analytics 
        WHERE event_type = 'vis_access' 
        GROUP BY country_code, country_name 
        ORDER BY count DESC
      `).all();

      // 7. Raw events
      const rawEvents = db.prepare(`
        SELECT id, event_type as eventType, event_key as eventKey, event_value as eventValue, country_code as countryCode, country_name as countryName, created_at as createdAt 
        FROM vis_analytics 
        ORDER BY id DESC
      `).all();

      res.json({
        success: true,
        sidebarClicks,
        sectionStats,
        chartCombinations,
        chartDownloads,
        chatQuestions,
        countries,
        rawEvents
      });
    } catch (error: any) {
      console.error("Error compiling analytics summary:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // GitHub Proxy Routes
  app.get("/api/github/fetch", async (req, res) => {
    const { owner, repo, path: repoPath, ref } = req.query;
    if (!owner || !repo) {
      return res.status(400).json({ error: "Owner and repo are required" });
    }

    try {
      const response = await octokit.repos.getContent({
        owner: owner as string,
        repo: repo as string,
        path: (repoPath as string) || "",
        ref: ref as string,
      });
      res.json(response.data);
    } catch (error: any) {
      // 404 is often a user error (wrong URL/path), don't log as full error
      if (error.status === 404) {
        console.warn(`GitHub content not found: ${owner}/${repo}/${repoPath}`);
      } else {
        console.error("Error fetching GitHub content:", error);
      }
      res.status(error.status || 500).json({ error: error.message });
    }
  });

  app.get("/api/github/blob", async (req, res) => {
    const { owner, repo, sha } = req.query;
    if (!owner || !repo || !sha) {
      return res.status(400).json({ error: "Owner, repo, and sha are required" });
    }

    try {
      const response = await octokit.git.getBlob({
        owner: owner as string,
        repo: repo as string,
        file_sha: sha as string,
      });
      res.json(response.data);
    } catch (error: any) {
      console.error("Error fetching GitHub blob:", error);
      res.status(error.status || 500).json({ error: error.message });
    }
  });

  app.post("/api/github/save", (req, res) => {
    res.status(403).json({ error: "Repository modification is disabled on the public visualization tool to protect data integrity." });
  });

  app.get("/api/github/config", (req, res) => {
    res.json({ hasToken: false, readOnly: true });
  });

  // Local File System Routes
  app.get("/api/files/list", async (req, res) => {
    let { folderPath } = req.query;
    
    // Defensive check: if folderPath is missing or looks like a Windows path, use default
    if (!folderPath || (folderPath as string).includes(':') || (folderPath as string).includes('\\')) {
      folderPath = path.join(process.cwd(), 'papers');
    }

    try {
      const absolutePath = path.resolve(folderPath as string);
      
      // Ensure the path is within the app directory
      if (!absolutePath.startsWith(process.cwd())) {
        return res.status(403).json({ error: "Access denied: Path must be within the application directory." });
      }
      
      async function getFiles(dir: string): Promise<any[]> {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        const files = await Promise.all(entries.map(async (entry) => {
          const resPath = path.resolve(dir, entry.name);
          if (entry.isDirectory()) {
            if (entry.name === 'cache' || entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'markdown_archive') return [];
            return getFiles(resPath);
          } else {
            const ext = path.extname(entry.name).toLowerCase();
            const supportedExtensions = ['.md', '.txt', '.pdf', '.html', '.htm', '.docx', '.doc', '.bib'];
            if (supportedExtensions.includes(ext)) {
              const stats = await fs.stat(resPath);
              
              // Use file path and size to create a unique-ish ID without reading the full file
              const sha = crypto.createHash('sha1').update(`${resPath}-${stats.size}-${stats.mtimeMs}`).digest('hex');
              
              // Use relative path from papersDir as the name for better UI display
              const relativeName = path.relative(papersDir, resPath);
              
              return [{
                name: relativeName,
                path: resPath,
                sha: sha,
                size: stats.size,
                type: 'file'
              }];
            }
            return [];
          }
        }));
        return files.flat();
      }

      const allFiles = await getFiles(absolutePath);
      res.json(allFiles);
    } catch (error: any) {
      console.error("Error listing files:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/files/content", async (req, res) => {
    const { filePath } = req.query;
    if (!filePath) {
      return res.status(400).json({ error: "filePath is required" });
    }

    try {
      const absolutePath = path.resolve(filePath as string);
      const content = await fs.readFile(absolutePath);
      res.json({
        content: content.toString('base64')
      });
    } catch (error: any) {
      console.error("Error reading file:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/files/save", (req, res) => {
    res.status(403).json({ error: "File write operations are disabled on the public visualization tool to protect data integrity." });
  });

  // Gemini Server-Side API Routes
  app.get("/api/gemini/config", (req, res) => {
    res.json({
      hasKey: !!process.env.GEMINI_API_KEY,
      defaultModel: 'gemini-flash-latest'
    });
  });

  app.post("/api/gemini/analyze", (req, res) => {
    res.status(403).json({ error: "Paper analysis pipeline is disabled on the public visualization tool to protect data integrity. Analysis runs must be executed in the parent tool." });
  });

  app.post("/api/gemini/synthesize", (req, res) => {
    res.status(403).json({ error: "Synthesis pipeline is disabled on the public visualization tool to protect data integrity. Review synthesis must be executed in the parent tool." });
  });

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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : undefined
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, we serve from the 'dist' folder which is in the current working directory
    const distPath = path.resolve(process.cwd(), "dist");
    console.log(`Serving static files from: ${distPath}`);
    
    if (existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    } else {
      console.error(`ERROR: Dist path not found: ${distPath}`);
      app.get("*", (req, res) => {
        res.status(500).send("Application not built correctly: dist folder missing.");
      });
    }
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} in use, retrying in 1.5s...`);
      setTimeout(() => {
        server.close();
        server.listen(PORT, "0.0.0.0");
      }, 1500);
    } else {
      console.error("Server listen error:", err);
    }
  });

  const cleanup = () => {
    console.log("Shutting down server...");
    server.close(() => {
      process.exit(0);
    });
  };
  process.on("SIGTERM", cleanup);
  process.on("SIGINT", cleanup);
}

startServer().catch(err => {
  console.error("Fatal error starting server:", err);
  process.exit(1);
});
