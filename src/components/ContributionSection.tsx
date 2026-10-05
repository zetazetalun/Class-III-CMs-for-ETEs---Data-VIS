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
  Check
} from 'lucide-react';
import { PaperContribution } from '../types';

interface ContributionSectionProps {
  onPaperContributed?: () => void;
}

export const ContributionSection: React.FC<ContributionSectionProps> = ({ onPaperContributed }) => {
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
    title: string;
    authors: string;
    year?: string;
    journal?: string;
    abstract?: string;
    publisher?: string;
  } | null>(null);
  const [autoFilledFields, setAutoFilledFields] = useState<{ [key: string]: boolean }>({});

  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    githubSynced?: boolean;
    commitUrl?: string;
    githubUrl?: string;
  } | null>(null);

  // Contributions history
  const [contributions, setContributions] = useState<PaperContribution[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const allowedExtensions = ['.pdf', '.doc', '.docx', '.md', '.markdown'];

  const fetchContributions = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/contributions');
      if (res.ok) {
        const data = await res.json();
        if (data.contributions) {
          setContributions(data.contributions);
        }
      }
    } catch (err) {
      console.error('Failed to load contributions:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchContributions();
  }, []);

  // Automatic DOI Resolution via CrossRef API
  const handleResolveDoi = async () => {
    if (!doi.trim()) {
      setDoiResolveError('Please enter a DOI or DOI URL first.');
      return;
    }

    setIsResolvingDoi(true);
    setDoiResolveError(null);

    try {
      const res = await fetch(`/api/doi/resolve?doi=${encodeURIComponent(doi.trim())}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setDoiResolvedData(data);
        if (data.doi) setDoi(data.doi);
        if (data.title) {
          setTitle(data.title);
          setAutoFilledFields(prev => ({ ...prev, title: true }));
        }
        if (data.authors) {
          setAuthors(data.authors);
          setAutoFilledFields(prev => ({ ...prev, authors: true }));
        }

        // Suggest structured context into notes if empty
        let suggestedNotes = '';
        if (data.journal) suggestedNotes += `Published in: ${data.journal}`;
        if (data.year) suggestedNotes += ` (${data.year})\n`;
        if (data.publisher) suggestedNotes += `Publisher: ${data.publisher}\n`;
        if (data.abstract) suggestedNotes += `\nAbstract:\n${data.abstract}`;

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
      } else {
        setDoiResolveError(data.error || 'Could not find DOI in CrossRef database. You can still fill fields manually.');
      }
    } catch (err: any) {
      setDoiResolveError(err.message || 'Network error fetching DOI metadata from CrossRef.');
    } finally {
      setIsResolvingDoi(false);
    }
  };

  const validateFile = (selectedFile: File): boolean => {
    setFileError(null);
    const fileName = selectedFile.name.toLowerCase();
    const isAllowed = allowedExtensions.some(ext => fileName.endsWith(ext));

    if (!isAllowed) {
      setFileError('Invalid file type. Please upload a PDF (.pdf), Word Document (.doc, .docx), or Markdown (.md).');
      return false;
    }

    // 50 MB limit
    if (selectedFile.size > 50 * 1024 * 1024) {
      setFileError('File exceeds 50MB limit.');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !file) return;

    setIsSubmitting(true);
    setSubmitResult(null);

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

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitResult({
          success: true,
          message: data.message || 'Contribution submitted successfully!',
          githubSynced: data.githubSynced,
          commitUrl: data.commitUrl,
          githubUrl: data.githubUrl
        });

        // Reset form fields
        setDoi('');
        setAuthors('');
        setContact('');
        setTitle('');
        setNotes('');
        setFile(null);
        setDoiResolvedData(null);
        setAutoFilledFields({});
        setFormErrors({});

        // Refresh contributions list
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
        message: err.message || 'Network error occurred during submission.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Hero Header with Architecture Badges */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-black/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
              Peer Review Contribution Program
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black/90">
              Contribute to this Project!
            </h2>
            <p className="text-sm text-black/60 max-w-2xl leading-relaxed">
              Expand the Systematic Literature Review on <strong>Construction Methods (CMs) in Extraterrestrial Environments (ETEs)</strong>. 
              Submit published manuscripts, technical notes, or conference preprints. All accepted records are archived in the 
              repository’s dedicated <code className="bg-black/5 px-1.5 py-0.5 rounded text-black/80 font-mono text-xs">Contributions/</code> folder via atomic Git tree commits.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-start md:items-end gap-2 bg-black/[0.02] p-4 rounded-2xl border border-black/5">
            <div className="text-xs font-semibold text-black/70">
              <span>Atomic Git Transactions</span>
            </div>
            <span className="font-mono text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
              Contributions/ [Single Tree Commit]
            </span>
            <span className="text-[11px] text-black/40">Clean Git log & zero partial writes</span>
          </div>
        </div>
      </section>

      {/* Prominent High-Yield Feature Callout: CrossRef DOI Resolution */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-black/5 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50/80 text-indigo-700 text-xs font-semibold border border-indigo-100/60">
              Fast-Track Workflow
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-black/90">
              Instant DOI Resolution with CrossRef
            </h3>
            <p className="text-xs sm:text-sm text-black/60 max-w-2xl leading-relaxed">
              Skip typing lengthy author lists and paper titles. Enter any publication DOI below and click 
              <span className="text-indigo-700 font-semibold mx-1">Auto-Fill</span> to retrieve verified metadata directly from the official CrossRef scholarly database.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3 bg-black/[0.02] px-4 py-3 rounded-2xl border border-black/5">
            <div className="text-left text-xs">
              <p className="font-semibold text-black/80">Saves ~90% Entry Time</p>
              <p className="text-black/40 text-[11px]">CrossRef API Resolution</p>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Feedback Alert */}
      {submitResult && (
        <div className={`p-6 rounded-3xl border transition-all ${
          submitResult.success 
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' 
            : 'bg-rose-50 border-rose-200 text-rose-950'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              submitResult.success ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}>
              {submitResult.success ? <CheckCircle2 size={22} /> : <AlertCircle size={22} />}
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm sm:text-base">
                  {submitResult.success ? 'Paper Contribution Recorded' : 'Submission Encountered an Issue'}
                </h4>
                {submitResult.githubSynced && (
                  <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                    Atomic Git Commit Verified
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-black/70 leading-relaxed">
                {submitResult.message}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {submitResult.commitUrl && (
                  <a 
                    href={submitResult.commitUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white rounded-xl text-xs font-semibold hover:bg-black/80 transition-colors shadow-xs"
                  >
                    <GitCommit size={13} />
                    <span>View Atomic Commit</span>
                    <ExternalLink size={12} />
                  </a>
                )}
                {submitResult.githubUrl && (
                  <a 
                    href={submitResult.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/5 hover:bg-black/10 text-black/80 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Github size={13} />
                    <span>View Directory on GitHub</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
            <button 
              onClick={() => setSubmitResult(null)}
              className="p-1.5 text-black/40 hover:text-black rounded-lg transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Main Form (7 cols) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-black/5 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-black/5">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-indigo-600" />
                <h3 className="text-base font-bold text-black/90">Manuscript Information</h3>
              </div>
              <span className="text-[11px] text-black/40 font-medium">* Mandatory fields</span>
            </div>

            {/* DOI Section with Highlighted CrossRef Auto-Fill Button */}
            <div className="space-y-2 p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100">
              <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-black/80">
                <span className="flex items-center gap-1.5">
                  <FileCheck size={14} className="text-indigo-600" />
                  Digital Object Identifier (DOI) <span className="text-rose-500">*</span>
                </span>
                {formErrors.doi && (
                  <span className="text-rose-500 normal-case font-normal text-[11px]">{formErrors.doi}</span>
                )}
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={doi}
                  onChange={e => {
                    setDoi(e.target.value);
                    if (formErrors.doi) setFormErrors(prev => ({ ...prev, doi: '' }));
                    if (doiResolveError) setDoiResolveError(null);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleResolveDoi();
                    }
                  }}
                  placeholder="e.g. 10.1016/j.actaastro.2023.08.012 or https://doi.org/..."
                  className={`flex-1 px-4 py-3 rounded-xl bg-white border transition-all text-sm outline-none font-mono focus:ring-2 focus:ring-indigo-500/20 ${
                    formErrors.doi ? 'border-rose-400 bg-rose-50/20' : 'border-indigo-200 hover:border-indigo-400'
                  }`}
                />

                <button
                  type="button"
                  onClick={handleResolveDoi}
                  disabled={isResolvingDoi || !doi.trim()}
                  className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Auto-fill authors, title, and citation details from CrossRef"
                >
                  {isResolvingDoi ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Resolving...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} className="text-amber-300" />
                      <span>Auto-Fill with CrossRef</span>
                    </>
                  )}
                </button>
              </div>

              {/* Resolved Preview Card */}
              {doiResolvedData && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start justify-between gap-3 text-xs animate-in fade-in duration-200">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
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
                    className="text-emerald-700/60 hover:text-emerald-900 p-1"
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

            {/* Paper Title (Auto-filled by CrossRef or Auto-suggested from File) */}
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
                  <p className="text-sm font-semibold text-black/80">
                    Click to browse or drag & drop paper file
                  </p>
                  <p className="text-xs text-black/40 mt-1">
                    Accepts <strong>.pdf</strong>, <strong>.doc</strong>, <strong>.docx</strong>, or <strong>.md</strong> files
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50/30 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold text-black/90 truncate">{file.name}</p>
                      <p className="text-xs text-black/50">{formatFileSize(file.size)} &bull; {file.type || 'Document'}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-1.5 hover:bg-black/10 text-black/50 hover:text-black rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Remove selected file"
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
                    <span>Committing via Atomic Git Tree...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={16} />
                    <span>Submit Paper Contribution</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-black/40 mt-2">
                Submissions are stored in the <code className="font-mono text-black/60">Contributions/</code> repository directory in a single atomic Git transaction.
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
                <span><strong>Identifiers:</strong> A verifiable <strong>DOI</strong> (or preprint arXiv/OSF identifier) must be provided for academic indexing.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span><strong>Atomic Git Storage:</strong> Uploaded papers are committed to the <code className="bg-black/5 px-1 py-0.5 rounded text-black/80 font-mono text-[11px]">Contributions/</code> directory in a single atomic tree commit alongside metadata.</span>
              </li>
            </ul>
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
                            <FileCheck size={10} />
                            Archived
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
                        <a 
                          href={`/api/contributions/${item.id}/download`}
                          download
                          className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 transition-colors"
                          title="Download submitted manuscript"
                        >
                          <Download size={11} />
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
