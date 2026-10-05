import React, { useState, useEffect, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Clock, 
  User, 
  Mail, 
  BookOpen, 
  FileCheck, 
  X, 
  RefreshCw, 
  Download, 
  Github,
  Info,
  Sparkles,
  GitCommit,
  Check,
  Bot,
  Copy,
  ArrowUpRight,
  ShieldCheck,
  Server
} from 'lucide-react';
import { PaperContribution } from '../types';

interface ContributionSectionProps {
  onPaperContributed?: () => void;
}

const REPO_OWNER = 'zetazetalun';
const REPO_NAME = 'SRL-on-Space-Architecture';
const REPO_FULL = `${REPO_OWNER}/${REPO_NAME}`;

export const ContributionSection: React.FC<ContributionSectionProps> = ({ onPaperContributed }) => {
  // Submission mode: 'github-actions' (Zero External Servers) vs 'server-api' (Node.js Express)
  const [submissionMode, setSubmissionMode] = useState<'github-actions' | 'server-api'>('github-actions');

  // Form fields
  const [doi, setDoi] = useState('');
  const [authors, setAuthors] = useState('');
  const [contact, setContact] = useState('');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  
  // CrossRef DOI Resolution State
  const [isResolvingDoi, setIsResolvingDoi] = useState(false);
  const [doiResolveError, setDoiResolveError] = useState<string | null>(null);
  const [doiResolvedData, setDoiResolvedData] = useState<{
    doi: string;
    title?: string;
    authors?: string;
    journal?: string;
    year?: string;
    publisher?: string;
    abstract?: string;
  } | null>(null);
  const [autoFilledFields, setAutoFilledFields] = useState<{ [key: string]: boolean }>({});

  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form validation & submission state
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [generatedIssueUrl, setGeneratedIssueUrl] = useState('');
  const [generatedIssueBody, setGeneratedIssueBody] = useState('');

  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    githubSynced?: boolean;
    commitUrl?: string;
    githubUrl?: string;
    mode?: 'github-actions' | 'server-api';
  } | null>(null);

  // Contributions history
  const [contributions, setContributions] = useState<PaperContribution[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const allowedExtensions = ['.pdf', '.doc', '.docx', '.md', '.markdown'];

  const loadLocalContributions = (): PaperContribution[] => {
    try {
      const stored = localStorage.getItem('srl_paper_contributions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveLocalContribution = (item: PaperContribution) => {
    try {
      const existing = loadLocalContributions();
      const updated = [item, ...existing.filter(x => x.id !== item.id)];
      localStorage.setItem('srl_paper_contributions', JSON.stringify(updated.slice(0, 50)));
      return updated;
    } catch {
      return [item];
    }
  };

  const fetchContributions = async () => {
    setLoadingHistory(true);
    let serverList: PaperContribution[] = [];
    try {
      const res = await fetch('/api/contributions');
      if (res.ok) {
        const data = await res.json();
        if (data.contributions) {
          serverList = data.contributions;
        }
      }
    } catch (err) {
      // In static mode or offline, /api/contributions won't respond
    }

    // Merge with local submissions
    const localList = loadLocalContributions();
    const map = new Map<string | number, PaperContribution>();
    serverList.forEach(item => map.set(item.id, item));
    localList.forEach(item => {
      if (!map.has(item.id)) map.set(item.id, item);
    });

    setContributions(Array.from(map.values()));
    setLoadingHistory(false);
  };

  useEffect(() => {
    fetchContributions();
  }, []);

  // Automatic DOI Resolution: Works both via backend API or directly client-side via CrossRef CORS
  const handleResolveDoi = async () => {
    if (!doi.trim()) {
      setDoiResolveError('Please enter a DOI or DOI URL first.');
      return;
    }

    setIsResolvingDoi(true);
    setDoiResolveError(null);

    const cleanDoi = doi.trim().replace(/^(?:https?:\/\/(?:dx\.)?doi\.org\/|doi:)/i, '').trim();

    let resolvedData: any = null;

    // 1. Try server-side endpoint first
    try {
      const res = await fetch(`/api/doi/resolve?doi=${encodeURIComponent(cleanDoi)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          resolvedData = data;
        }
      }
    } catch {
      // Server not reachable (static mode), fallback to client-side CrossRef API
    }

    // 2. Direct client-side CrossRef call (Supports CORS for 100% static mode)
    if (!resolvedData) {
      try {
        const crossRefUrl = `https://api.crossref.org/works/${encodeURIComponent(cleanDoi)}`;
        const crRes = await fetch(crossRefUrl, {
          headers: {
            'Accept': 'application/json'
          }
        });

        if (crRes.ok) {
          const crJson = await crRes.json();
          const message = crJson.message;
          if (message) {
            const parsedTitle = message.title?.[0] || '';
            const parsedAuthors = (message.author || []).map((a: any) => {
              const fullName = [a.given, a.family].filter(Boolean).join(' ') || a.name || 'Author';
              const aff = a.affiliation?.[0]?.name ? ` (${a.affiliation[0].name})` : '';
              return `${fullName}${aff}`;
            }).join(', ');

            const dateParts = message['published-print']?.['date-parts']?.[0] 
              || message['published-online']?.['date-parts']?.[0] 
              || message['created']?.['date-parts']?.[0];
            const parsedYear = dateParts?.[0] ? String(dateParts[0]) : '';
            const parsedJournal = message['container-title']?.[0] || message.publisher || '';
            const parsedAbstract = message.abstract ? message.abstract.replace(/<[^>]+>/g, '').trim() : '';

            resolvedData = {
              success: true,
              doi: cleanDoi,
              title: parsedTitle,
              authors: parsedAuthors,
              journal: parsedJournal,
              year: parsedYear,
              publisher: message.publisher || '',
              abstract: parsedAbstract
            };
          }
        } else if (crRes.status === 404) {
          setDoiResolveError('DOI not found in CrossRef database. You can still fill fields manually.');
        }
      } catch (err: any) {
        setDoiResolveError(err.message || 'Network error fetching DOI metadata from CrossRef.');
      }
    }

    if (resolvedData && resolvedData.success) {
      setDoiResolvedData(resolvedData);
      if (resolvedData.doi) setDoi(resolvedData.doi);
      if (resolvedData.title) {
        setTitle(resolvedData.title);
        setAutoFilledFields(prev => ({ ...prev, title: true }));
      }
      if (resolvedData.authors) {
        setAuthors(resolvedData.authors);
        setAutoFilledFields(prev => ({ ...prev, authors: true }));
      }

      // Suggest structured context into notes if empty
      let suggestedNotes = '';
      if (resolvedData.journal) suggestedNotes += `Published in: ${resolvedData.journal}`;
      if (resolvedData.year) suggestedNotes += ` (${resolvedData.year})\n`;
      if (resolvedData.publisher) suggestedNotes += `Publisher: ${resolvedData.publisher}\n`;
      if (resolvedData.abstract) suggestedNotes += `\nAbstract:\n${resolvedData.abstract}`;

      if (suggestedNotes && !notes.trim()) {
        setNotes(suggestedNotes);
        setAutoFilledFields(prev => ({ ...prev, notes: true }));
      }

      // Clear error indicators on resolved fields
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated.doi;
        delete updated.authors;
        return updated;
      });
    } else if (!doiResolveError) {
      setDoiResolveError('Could not auto-fill metadata from CrossRef. You can still submit details manually.');
    }

    setIsResolvingDoi(false);
  };

  const validateFile = (selectedFile: File): boolean => {
    setFileError(null);
    const ext = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
    
    if (!allowedExtensions.includes(ext)) {
      setFileError(`Invalid file format "${ext}". Supported: PDF (.pdf), Word (.doc, .docx), Markdown (.md).`);
      return false;
    }

    // Max 50MB
    const maxSize = 50 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setFileError('File size exceeds 50MB limit. Please upload a compressed or standard manuscript.');
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const chosen = e.target.files[0];
      if (validateFile(chosen)) {
        setFile(chosen);
        if (!title) {
          const cleanName = chosen.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
          setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
        }
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const chosen = e.dataTransfer.files[0];
      if (validateFile(chosen)) {
        setFile(chosen);
        if (!title) {
          const cleanName = chosen.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
          setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
        }
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!doi.trim()) {
      errors.doi = 'Digital Object Identifier (DOI) is required.';
    }

    if (!authors.trim()) {
      errors.authors = 'Author(s) information is required.';
    }

    if (!contact.trim()) {
      errors.contact = 'Contact information (email) is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim()) && contact.trim().length < 5) {
      errors.contact = 'Please provide a valid contact email or institutional address.';
    }

    if (!file) {
      errors.file = 'A research paper manuscript file (PDF, DOC, MD) is required.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fileToBase64 = (f: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  // Build structured issue body for GitHub Actions automation
  const buildIssueMarkdown = (fileBase64?: string): string => {
    const cleanDoi = doi.trim().replace(/^(?:https?:\/\/(?:dx\.)?doi\.org\/|doi:)/i, '').trim();
    const paperTitle = title.trim() || (file ? file.name : 'Manuscript Submission');

    const metadataPayload = {
      authors: authors.trim(),
      contact: contact.trim(),
      doi: cleanDoi,
      title: paperTitle,
      notes: notes.trim(),
      fileName: file ? file.name : 'manuscript.pdf',
      fileSize: file ? file.size : 0,
      fileType: file ? file.type : 'application/pdf',
      submittedAt: new Date().toISOString(),
      ...(fileBase64 && file && file.size < 500000 ? { fileBase64 } : {})
    };

    return `## 📄 Systematic Literature Review Paper Contribution

### Author(s)
${authors.trim()}

### Contact
${contact.trim()}

### DOI
${cleanDoi}

### Paper Title
${paperTitle}

### Manuscript File
${file ? `**${file.name}** (${(file.size / 1024).toFixed(1)} KB)` : 'Attached manuscript'}

### Notes / Abstract
${notes.trim() || '*No additional notes provided.*'}

---
### 📎 Manuscript Attachment Instructions
Please drag and drop your paper file (**${file ? file.name : 'PDF/Word'}**) into this issue box below so it is attached directly to GitHub!

<!-- CONTRIBUTION_METADATA_START -->
${JSON.stringify(metadataPayload, null, 2)}
<!-- CONTRIBUTION_METADATA_END -->
`;
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !file) return;

    setIsSubmitting(true);
    setSubmitResult(null);

    // ==========================================
    // ROUTE 1: Zero-Server GitHub Actions Mode
    // ==========================================
    if (submissionMode === 'github-actions') {
      try {
        let base64Data = '';
        if (file.size < 500000) {
          try {
            base64Data = await fileToBase64(file);
          } catch {
            // ignore
          }
        }

        const issueBody = buildIssueMarkdown(base64Data);
        const cleanTitle = title.trim() || file.name;
        const issueTitle = `[Contribution]: ${cleanTitle}`;
        
        // Encode URL for GitHub New Issue
        const encodedTitle = encodeURIComponent(issueTitle);
        const encodedBody = encodeURIComponent(issueBody);
        const encodedLabels = encodeURIComponent('contribution');
        const issueUrl = `https://github.com/${REPO_FULL}/issues/new?title=${encodedTitle}&labels=${encodedLabels}&body=${encodedBody}`;

        setGeneratedIssueUrl(issueUrl);
        setGeneratedIssueBody(issueBody);
        setShowIssueModal(true);

        // Record in local cache
        const localRecord: PaperContribution = {
          id: Date.now(),
          authors: authors.trim(),
          contact: contact.trim(),
          doi: doi.trim(),
          title: cleanTitle,
          notes: notes.trim(),
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type || 'application/pdf',
          filePath: '',
          githubSynced: false,
          githubUrl: `https://github.com/${REPO_FULL}/issues`,
          createdAt: new Date().toISOString()
        };
        saveLocalContribution(localRecord);
        fetchContributions();

        setSubmitResult({
          success: true,
          message: 'GitHub Contribution Issue prepared! Click to launch the issue and trigger the automated GitHub Action workflow.',
          mode: 'github-actions'
        });
      } catch (err: any) {
        setSubmitResult({
          success: false,
          message: err.message || 'Failed to prepare GitHub issue payload.'
        });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // ==========================================
    // ROUTE 2: Direct Server API (Node.js backend)
    // ==========================================
    try {
      const fileBase64 = await fileToBase64(file);

      const payload = {
        authors: authors.trim(),
        contact: contact.trim(),
        doi: doi.trim(),
        title: title.trim() || file.name,
        notes: notes.trim(),
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || 'application/octet-stream',
        fileBase64
      };

      const res = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.status === 404) {
        // App is deployed statically without a backend!
        // Automatically switch user to Zero-Server GitHub Actions mode
        setSubmissionMode('github-actions');
        setIsSubmitting(false);
        setSubmitResult({
          success: false,
          message: 'Server API not found (detected static GitHub Pages hosting). Switched to Zero-Server GitHub Actions mode!'
        });
        return;
      }

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitResult({
          success: true,
          message: data.message || 'Contribution submitted successfully!',
          githubSynced: data.githubSynced,
          commitUrl: data.commitUrl,
          githubUrl: data.githubUrl,
          mode: 'server-api'
        });

        // Reset form
        setDoi('');
        setAuthors('');
        setContact('');
        setTitle('');
        setNotes('');
        setFile(null);
        setDoiResolvedData(null);
        setAutoFilledFields({});
        setFormErrors({});

        fetchContributions();
        if (onPaperContributed) onPaperContributed();
      } else {
        setSubmitResult({
          success: false,
          message: data.error || 'Failed to submit contribution. Please verify inputs and try again.'
        });
      }
    } catch (err: any) {
      setSubmitResult({
        success: false,
        message: `${err.message || 'Network error'}. If running on static hosting without a server, use "Zero-Server (GitHub Actions)" mode.`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyIssueBody = () => {
    navigator.clipboard.writeText(generatedIssueBody);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2500);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Hero Header */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-black/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
              <Bot size={13} />
              Peer Review Contribution Program
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black/90">
              Contribute to this Project!
            </h2>
            <p className="text-sm text-black/60 max-w-2xl leading-relaxed">
              Expand the Systematic Literature Review on <strong>Construction Methods (CMs) in Extraterrestrial Environments (ETEs)</strong>. 
              Submit published manuscripts, technical notes, or conference preprints. All accepted records are archived in the 
              repository’s dedicated <code className="bg-black/5 px-1.5 py-0.5 rounded text-black/80 font-mono text-xs">Contributions/</code> folder.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-start md:items-end gap-2 bg-black/[0.02] p-4 rounded-2xl border border-black/5">
            <div className="text-xs font-semibold text-black/70 flex items-center gap-1.5">
              <Bot size={13} className="text-indigo-600" />
              <span>Zero-Server GitHub Actions</span>
            </div>
            <span className="font-mono text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
              .github/workflows/process-contribution.yml
            </span>
            <span className="text-[11px] text-black/40">Automated bot extracts & commits files</span>
          </div>
        </div>
      </section>

      {/* Prominent High-Yield Feature Callout: CrossRef DOI Resolution */}
      <section className="bg-gradient-to-r from-indigo-50/70 via-white to-indigo-50/40 p-6 rounded-3xl border border-indigo-100 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
                Instant Auto-Fill
              </span>
              <h3 className="font-bold text-base text-black/90">
                Automatic DOI Resolution (CrossRef API)
              </h3>
            </div>
            <p className="text-xs text-black/60 max-w-xl">
              Type or paste any scientific DOI (e.g. <code className="bg-black/5 px-1.5 py-0.5 rounded font-mono text-indigo-900">10.1016/j.actaastro.2023.01.018</code>) and click <strong>Auto-Fill</strong>. Authors, title, journal, and publication context will be verified and populated automatically. <em>Works 100% in static deployment without server dependencies!</em>
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setDoi('10.1016/j.actaastro.2023.01.018');
              setTimeout(() => {
                const btn = document.getElementById('doi-resolve-button');
                if (btn) btn.click();
              }, 50);
            }}
            className="shrink-0 px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-700 font-semibold text-xs rounded-xl border border-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={13} />
            <span>Try Sample Space DOI</span>
          </button>
        </div>
      </section>

      {/* Main Grid: Form (7 cols) + Sidebar/History (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Contribution Submission Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-7 rounded-3xl shadow-sm border border-black/5 space-y-6">
          
          {/* Architecture Mode Toggle: GitHub Actions (Zero Server) vs Direct Server */}
          <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-black/70 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-indigo-600" />
                Ingest Architecture
              </span>
              <span className="text-[11px] text-black/40">Select submission pipeline</span>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-black/5 rounded-xl">
              <button
                type="button"
                onClick={() => setSubmissionMode('github-actions')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  submissionMode === 'github-actions'
                    ? 'bg-white text-indigo-900 shadow-sm border border-black/5'
                    : 'text-black/60 hover:text-black'
                }`}
              >
                <Bot size={13} />
                <span>GitHub Actions (Zero Server)</span>
              </button>

              <button
                type="button"
                onClick={() => setSubmissionMode('server-api')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  submissionMode === 'server-api'
                    ? 'bg-white text-black shadow-sm border border-black/5'
                    : 'text-black/60 hover:text-black'
                }`}
              >
                <Server size={13} />
                <span>Direct Server API</span>
              </button>
            </div>

            {submissionMode === 'github-actions' ? (
              <div className="text-[11px] text-indigo-900 bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 flex items-start gap-2">
                <Bot size={15} className="text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-indigo-950">Zero External Servers — Static GitHub Pages Compatible</p>
                  <p className="text-indigo-800/80 leading-relaxed mt-0.5">
                    Submissions format into a standardized GitHub Issue. The repository's automated GitHub Action (<code>.github/workflows/process-contribution.yml</code>) extracts the manuscript and metadata, commits directly into <code>Contributions/</code>, and archives it.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-black/60 bg-black/[0.02] p-3 rounded-xl border border-black/5 flex items-start gap-2">
                <Server size={14} className="text-black/50 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-black/80">Full-Stack Node.js Mode</p>
                  <p className="leading-relaxed mt-0.5">
                    Requires a running Node.js / Express backend with SQLite and server-side Git tree commits.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Submission Feedback Banner */}
          {submitResult && (
            <div className={`p-4 rounded-2xl border text-sm flex items-start gap-3 ${
              submitResult.success 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              {submitResult.success ? (
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-semibold">{submitResult.message}</p>
                {submitResult.commitUrl && (
                  <a 
                    href={submitResult.commitUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-emerald-800 underline font-mono font-medium hover:text-emerald-950 pt-1"
                  >
                    <GitCommit size={12} />
                    View Atomic Git Commit on GitHub
                    <ExternalLink size={10} />
                  </a>
                )}
                {submitResult.mode === 'github-actions' && (
                  <button
                    type="button"
                    onClick={() => setShowIssueModal(true)}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
                  >
                    <span>View GitHub Issue Details</span>
                    <ArrowUpRight size={13} />
                  </button>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* DOI Field with Auto-Fill Feature */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-black/70">
                <span className="flex items-center gap-1.5">
                  <BookOpen size={13} className="text-indigo-500" />
                  Digital Object Identifier (DOI) <span className="text-rose-500">*</span>
                </span>
                {formErrors.doi && (
                  <span className="text-rose-500 normal-case font-normal text-[11px]">{formErrors.doi}</span>
                )}
              </label>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={doi}
                    onChange={e => {
                      setDoi(e.target.value);
                      if (formErrors.doi) setFormErrors(prev => ({ ...prev, doi: '' }));
                    }}
                    placeholder="e.g. 10.1016/j.actaastro.2023.01.018 or https://doi.org/..."
                    className={`w-full px-4 py-3 rounded-2xl bg-black/[0.02] border transition-all text-sm outline-none focus:bg-white focus:ring-2 focus:ring-black/10 font-mono ${
                      formErrors.doi ? 'border-rose-400 bg-rose-50/20' : 'border-black/10 hover:border-black/20'
                    }`}
                  />
                  {doi && (
                    <button
                      type="button"
                      onClick={() => { setDoi(''); setDoiResolvedData(null); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60 p-1"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Auto-Fill Button */}
                <button
                  type="button"
                  id="doi-resolve-button"
                  onClick={handleResolveDoi}
                  disabled={isResolvingDoi || !doi.trim()}
                  className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-40 flex items-center gap-1.5 shrink-0"
                  title="Auto-fill publication metadata via CrossRef API"
                >
                  {isResolvingDoi ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>Resolving...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} />
                      <span>Auto-Fill</span>
                    </>
                  )}
                </button>
              </div>

              {/* Resolved Data Preview Card */}
              {doiResolvedData && (
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs flex items-start justify-between gap-3 animate-in fade-in duration-200">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="font-bold text-emerald-900">
                        CrossRef Verified: {doiResolvedData.journal || 'Journal Paper'} {doiResolvedData.year && `(${doiResolvedData.year})`}
                      </p>
                      <p className="text-emerald-800 line-clamp-1 italic">
                        "{doiResolvedData.title}"
                      </p>
                      <p className="text-emerald-700 text-[11px]">
                        Authors & Title populated automatically into the fields below.
                      </p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setDoiResolvedData(null)}
                    className="text-emerald-700/60 hover:text-emerald-900 p-1 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {doiResolveError && (
                <p className="text-xs text-rose-500 flex items-center gap-1.5 pt-1">
                  <AlertCircle size={13} />
                  {doiResolveError}
                </p>
              )}

              <p className="text-[11px] text-black/40">
                Permanent DOI link or identifier registered with CrossRef / DataCite.
              </p>
            </div>

            {/* Author(s) Information - Mandatory */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-black/70">
                <span className="flex items-center gap-1.5">
                  <User size={13} className="text-indigo-500" />
                  Author(s) Information <span className="text-rose-500">*</span>
                  {autoFilledFields.authors && (
                    <span className="ml-1.5 text-[10px] text-indigo-700 bg-indigo-100 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check size={10} /> Auto-filled via CrossRef
                    </span>
                  )}
                </span>
                {formErrors.authors && (
                  <span className="text-rose-500 normal-case font-normal text-[11px]">{formErrors.authors}</span>
                )}
              </label>
              <textarea
                value={authors}
                onChange={e => {
                  setAuthors(e.target.value);
                  if (formErrors.authors) setFormErrors(prev => ({ ...prev, authors: '' }));
                }}
                rows={2}
                placeholder="e.g. ZHU Zhelun (Univ. Dept.), Jane Doe (NASA Goddard), Alex Smith (ESA EAC)"
                className={`w-full px-4 py-3 rounded-2xl bg-black/[0.02] border transition-all text-sm outline-none resize-none focus:bg-white focus:ring-2 focus:ring-black/10 ${
                  formErrors.authors ? 'border-rose-400 bg-rose-50/20' : 'border-black/10 hover:border-black/20'
                }`}
              />
              <p className="text-[11px] text-black/40">
                Full names of primary authors and their academic or research affiliations.
              </p>
            </div>

            {/* Paper Title */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-black/70">
                <span className="flex items-center gap-1.5">
                  <FileText size={13} className="text-indigo-500" />
                  Paper / Manuscript Title
                  {autoFilledFields.title && (
                    <span className="ml-1.5 text-[10px] text-indigo-700 bg-indigo-100 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check size={10} /> Auto-filled via CrossRef
                    </span>
                  )}
                </span>
                <span className="text-[11px] text-black/30 font-normal">Optional / Auto-filled</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Automated Sintering of Lunar Regolith for Class III Pressure Habitats"
                className="w-full px-4 py-3 rounded-2xl bg-black/[0.02] border border-black/10 hover:border-black/20 transition-all text-sm outline-none focus:bg-white focus:ring-2 focus:ring-black/10"
              />
            </div>

            {/* Contact Information - Mandatory */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-black/70">
                <span className="flex items-center gap-1.5">
                  <Mail size={13} className="text-indigo-500" />
                  Contact Information <span className="text-rose-500">*</span>
                </span>
                {formErrors.contact && (
                  <span className="text-rose-500 normal-case font-normal text-[11px]">{formErrors.contact}</span>
                )}
              </label>
              <input
                type="text"
                value={contact}
                onChange={e => {
                  setContact(e.target.value);
                  if (formErrors.contact) setFormErrors(prev => ({ ...prev, contact: '' }));
                }}
                placeholder="e.g. corresponding.author@institution.edu or phone / lab contact"
                className={`w-full px-4 py-3 rounded-2xl bg-black/[0.02] border transition-all text-sm outline-none focus:bg-white focus:ring-2 focus:ring-black/10 ${
                  formErrors.contact ? 'border-rose-400 bg-rose-50/20' : 'border-black/10 hover:border-black/20'
                }`}
              />
              <p className="text-[11px] text-black/40">
                Email address used for citation verification and metadata correspondence.
              </p>
            </div>

            {/* File Upload Field - Mandatory */}
            <div className="space-y-2">
              <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-black/70">
                <span className="flex items-center gap-1.5">
                  <UploadCloud size={13} className="text-indigo-500" />
                  Manuscript File Upload <span className="text-rose-500">*</span>
                </span>
                <span className="text-[11px] text-black/40 font-normal">PDF, DOC, DOCX, or MD (max 50MB)</span>
              </label>

              {!file ? (
                <div
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                    isDragging 
                      ? 'border-indigo-600 bg-indigo-50/50 scale-[0.99]' 
                      : formErrors.file 
                        ? 'border-rose-300 bg-rose-50/20 hover:border-rose-400' 
                        : 'border-black/15 bg-black/[0.01] hover:border-black/30 hover:bg-black/[0.02]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.md,.markdown"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                    <UploadCloud size={24} />
                  </div>
                  <p className="text-sm font-bold text-black/80">
                    Click to browse or drop manuscript file here
                  </p>
                  <p className="text-xs text-black/40 mt-1">
                    Accepts research manuscripts, technical notes, or conference papers (.pdf, .doc, .docx, .md)
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <FileText size={18} />
                    </div>
                    <div className="space-y-0.5 truncate max-w-xs sm:max-w-md">
                      <p className="text-xs font-bold text-black/90 truncate">
                        {file.name}
                      </p>
                      <p className="text-[11px] text-black/50">
                        {formatFileSize(file.size)} &bull; {file.type || 'Manuscript Document'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="p-1.5 text-black/40 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                    title="Remove file"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {(fileError || formErrors.file) && (
                <p className="text-xs text-rose-500 flex items-center gap-1 pt-1">
                  <AlertCircle size={12} />
                  {fileError || formErrors.file}
                </p>
              )}
            </div>

            {/* Research Notes & Relevance (Optional) */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-black/70">
                <span className="flex items-center gap-1.5">
                  <Info size={13} className="text-indigo-500" />
                  Relevance Notes / Abstract / Category
                  {autoFilledFields.notes && (
                    <span className="ml-1.5 text-[10px] text-indigo-700 bg-indigo-100 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check size={10} /> Auto-filled
                    </span>
                  )}
                </span>
                <span className="text-[11px] text-black/30 font-normal">Optional</span>
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="Mention key parameters (e.g. Class III habitat, microwave sintering, regolith simulant, Moon/Mars scenario) or a brief abstract."
                className="w-full px-4 py-3 rounded-2xl bg-black/[0.02] border border-black/10 hover:border-black/20 transition-all text-sm outline-none resize-none focus:bg-white focus:ring-2 focus:ring-black/10"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-black hover:bg-black/85 text-white rounded-2xl text-sm font-bold tracking-wide transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Processing Submission...</span>
                  </>
                ) : submissionMode === 'github-actions' ? (
                  <>
                    <Bot size={16} className="text-indigo-300" />
                    <span>Submit via GitHub Action (Zero Server)</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={16} />
                    <span>Submit Paper Contribution (Server API)</span>
                  </>
                )}
              </button>
              
              <p className="text-[11px] text-center text-black/40 mt-2">
                {submissionMode === 'github-actions' ? (
                  <>Zero external servers &bull; Handled via GitHub Action automated workflow &bull; Archives into <code className="font-mono text-black/60">Contributions/</code></>
                ) : (
                  <>Direct commit to repository <code className="font-mono text-black/60">Contributions/</code> directory via Atomic Git Tree</>
                )}
              </p>
            </div>
          </form>
        </div>

        {/* Right: Review Guidelines & Contributions Log (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Submission Guidelines Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 space-y-4">
            <div className="flex items-center gap-2.5 text-black/80 font-bold text-sm">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Info size={16} />
              </div>
              <h4>Inclusion Criteria for Review</h4>
            </div>

            <ul className="text-xs text-black/60 space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span><strong>Target Domain:</strong> Must directly address Construction Methods (CMs), structural habitats, or resource utilization in Extraterrestrial Environments (ETEs).</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span><strong>Supported Formats:</strong> Manuscripts in <strong>PDF</strong>, Word (<strong>.doc, .docx</strong>), or formatted <strong>Markdown</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span><strong>DOI Mandatory:</strong> Must have an active or assigned DOI for automatic citation linkage and validation.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span><strong>Zero-Server Workflow:</strong> GitHub Actions parses issues labeled <code className="bg-black/5 px-1 rounded font-mono text-[11px]">contribution</code>, runs automated checks, and archives files to <code className="bg-black/5 px-1 rounded font-mono text-[11px]">Contributions/</code>.</span>
              </li>
            </ul>

            <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs text-black/50">
              <span>Automated GitHub Ingest</span>
              <a 
                href={`https://github.com/${REPO_FULL}/blob/main/.github/workflows/process-contribution.yml`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
              >
                <span>View Action YAML</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>

          {/* Submissions History Log */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-black/40" />
                <h4 className="text-sm font-bold text-black/80">Submitted Contributions</h4>
              </div>
              <button 
                onClick={fetchContributions}
                disabled={loadingHistory}
                className="text-black/40 hover:text-black transition-colors p-1 rounded cursor-pointer"
                title="Refresh contributions"
              >
                <RefreshCw size={13} className={loadingHistory ? 'animate-spin' : ''} />
              </button>
            </div>

            {contributions.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-black/5 flex items-center justify-center mx-auto text-black/30">
                  <BookOpen size={18} />
                </div>
                <p className="text-xs font-medium text-black/50">No contributions logged yet</p>
                <p className="text-[11px] text-black/40 max-w-xs mx-auto">
                  Be the first to submit a paper to enrich the systematic literature synthesis.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {contributions.map(item => (
                  <div 
                    key={item.id} 
                    className="p-3.5 rounded-2xl bg-black/[0.02] border border-black/5 hover:border-black/15 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-xs font-bold text-black/90 line-clamp-1">
                        {item.title || item.fileName}
                      </h5>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium shrink-0 flex items-center gap-1 ${
                        item.githubSynced 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}>
                        {item.githubSynced ? (
                          <>
                            <GitCommit size={10} />
                            Atomic Commit
                          </>
                        ) : (
                          <>
                            <Bot size={10} />
                            Issue Bot
                          </>
                        )}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] text-black/60">
                      <p className="line-clamp-1">
                        <strong className="text-black/70">Authors:</strong> {item.authors}
                      </p>
                      <p className="font-mono text-[10px] text-black/50 truncate">
                        <strong>DOI:</strong> {item.doi}
                      </p>
                    </div>

                    <div className="pt-1.5 flex items-center justify-between border-t border-black/5 text-[10px] text-black/40">
                      <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'} &bull; {formatFileSize(item.fileSize)}</span>
                      
                      <div className="flex items-center gap-2">
                        {item.githubUrl && (
                          <a 
                            href={item.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black/60 hover:text-black font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Github size={11} />
                            Repo
                          </a>
                        )}
                        {item.filePath && (
                          <a 
                            href={`/api/contributions/${item.id}/download`}
                            download
                            className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 transition-colors"
                            title="Download submitted manuscript"
                          >
                            <Download size={11} />
                            Download
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal / Dialog for GitHub Issue Submission (Zero-Server Ingest) */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-black/10 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-black/90">
                    Submit via GitHub Actions (Zero Server)
                  </h3>
                  <p className="text-xs text-black/50">
                    Automated Ingest into <code className="font-mono text-black/70">Contributions/</code>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIssueModal(false)}
                className="text-black/40 hover:text-black p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-black/70 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1.5 text-indigo-950">
                <p className="font-bold flex items-center gap-1.5 text-indigo-900">
                  <CheckCircle2 size={14} className="text-indigo-600" />
                  Your Submission is Ready to Launch:
                </p>
                <p className="text-[11px] text-indigo-800">
                  Click the button below to open a pre-filled GitHub Issue. Then, simply drag your manuscript file (<strong>{file?.name || 'manuscript'}</strong>) into GitHub's comment box and click <strong>Submit new issue</strong>.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-black/80">Automated Pipeline Process:</p>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="p-2.5 rounded-xl bg-black/[0.02] border border-black/5">
                    <span className="block font-bold text-indigo-600 mb-0.5">1. Issue Created</span>
                    <span className="text-black/50 text-[10px]">Metadata verified</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/[0.02] border border-black/5">
                    <span className="block font-bold text-indigo-600 mb-0.5">2. Action Bot Runs</span>
                    <span className="text-black/50 text-[10px]">Extracts manuscript</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/[0.02] border border-black/5">
                    <span className="block font-bold text-indigo-600 mb-0.5">3. Repo Committed</span>
                    <span className="text-black/50 text-[10px]">Saved in Contributions/</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <a
                href={generatedIssueUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setShowIssueModal(false);
                }}
                className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Github size={15} />
                <span>Open Pre-filled GitHub Issue</span>
                <ArrowUpRight size={14} />
              </a>

              <button
                type="button"
                onClick={copyIssueBody}
                className="py-3 px-4 bg-black/5 hover:bg-black/10 text-black/80 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedPayload ? (
                  <>
                    <Check size={14} className="text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Issue Data</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
