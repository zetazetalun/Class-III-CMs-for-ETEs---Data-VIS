import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Activity, 
  Globe, 
  MousePointer, 
  Clock, 
  BarChart2, 
  MessageSquare, 
  Download, 
  RefreshCw, 
  ExternalLink, 
  Github, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet,
  LogOut,
  Sparkles,
  Layers,
  Eye,
  TrendingUp,
  History
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { telemetry, AnalyticsDashboardData, TelemetryEvent, VisitLogEntry } from '../lib/telemetry';

const AUTHORIZED_OWNER = 'zetazetalun';

const formatDateTime = (isoString?: string) => {
  if (!isoString) return 'Recent';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch {
    return isoString;
  }
};

const formatRelativeTime = (isoString?: string) => {
  if (!isoString) return 'Just now';
  try {
    const d = new Date(isoString);
    const now = Date.now();
    const diffSec = Math.max(0, Math.floor((now - d.getTime()) / 1000));
    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    const days = Math.floor(diffSec / 86400);
    return `${days}d ago`;
  } catch {
    return 'Recent';
  }
};

interface AccessAnalyticsDashboardProps {
  onBackToPresentation?: () => void;
}

export const AccessAnalyticsDashboard: React.FC<AccessAnalyticsDashboardProps> = ({ onBackToPresentation }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('slr_admin_authenticated') === 'true';
  });
  const [adminUser, setAdminUser] = useState<any>(() => {
    try {
      const stored = sessionStorage.getItem('slr_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Login form state
  const [inputToken, setInputToken] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // Telemetry Dashboard Data
  const [dashboardData, setDashboardData] = useState<AnalyticsDashboardData | null>(null);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  // Current reader geo
  const [currentGeo, setCurrentGeo] = useState<{ code: string; name: string }>(telemetry.getGeo());

  // Listen for OAuth postMessage popup completion as per oauth skill
  useEffect(() => {
    const handleOAuthMessage = async (event: MessageEvent) => {
      // Validate origin
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('github.io')) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const username = event.data.username || AUTHORIZED_OWNER;
        if (username.toLowerCase() === AUTHORIZED_OWNER) {
          grantAccess({
            username: AUTHORIZED_OWNER,
            role: 'Project Owner',
            avatarUrl: event.data.avatarUrl || 'https://github.com/zetazetalun.png'
          });
        } else {
          setAuthError(`Access denied: @${username} is not the authorized project owner.`);
        }
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, []);

  const grantAccess = (userData: any) => {
    setIsAuthenticated(true);
    setAdminUser(userData);
    sessionStorage.setItem('slr_admin_authenticated', 'true');
    sessionStorage.setItem('slr_admin_user', JSON.stringify(userData));
    setAuthError(null);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    sessionStorage.removeItem('slr_admin_authenticated');
    sessionStorage.removeItem('slr_admin_user');
  };

  // Authenticate via Personal Access Token or Owner Secret
  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputToken.trim()) {
      setAuthError('Please enter your GitHub token or admin passcode.');
      return;
    }

    setIsAuthenticating(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: inputToken.trim() })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authorized) {
          grantAccess(data);
          setInputToken('');
        } else {
          setAuthError(`Authentication failed: User @${data.username} is not the authorized project owner.`);
        }
      } else {
        // Fallback for static mode: direct GitHub API check
        try {
          const ghRes = await fetch('https://api.github.com/user', {
            headers: {
              'Authorization': `token ${inputToken.trim()}`,
              'User-Agent': 'SLR-Space-Architecture-Dashboard'
            }
          });
          if (ghRes.ok) {
            const ghUser = await ghRes.json();
            if (ghUser.login && ghUser.login.toLowerCase() === AUTHORIZED_OWNER) {
              grantAccess({
                username: AUTHORIZED_OWNER,
                role: 'Project Owner',
                avatarUrl: ghUser.avatar_url || 'https://github.com/zetazetalun.png'
              });
              setInputToken('');
              return;
            } else {
              setAuthError(`Access restricted: Logged in as @${ghUser.login}, but only @${AUTHORIZED_OWNER} has access.`);
              return;
            }
          }
        } catch {
          // ignore
        }
        setAuthError('Invalid credentials or unauthorized user. Access is restricted to @zetazetalun.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication error.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Launch GitHub OAuth Popup
  const handleConnectOAuth = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const response = await fetch('/api/auth/url');
      if (!response.ok) throw new Error('Failed to get OAuth URL');
      const data = await response.json();

      if (data.configured && data.url) {
        // Open OAuth Provider's URL directly in popup as per OAuth skill guidelines
        const authWindow = window.open(
          data.url,
          'github_oauth_popup',
          'width=600,height=700,scrollbars=yes'
        );
        if (!authWindow) {
          setAuthError('Please allow popups for this site to authenticate via GitHub.');
        }
      } else {
        setAuthError('GitHub OAuth App not yet configured. Please enter your GITHUB_TOKEN or admin token below.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Error initializing GitHub OAuth.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Load telemetry data once authenticated
  const loadAnalytics = async () => {
    setLoadingData(true);
    try {
      const data = await telemetry.getDashboardData();
      setDashboardData(data);
      setCurrentGeo(telemetry.getGeo());
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAnalytics();
    }
  }, [isAuthenticated]);

  // Export Access Record Data (.xlsx) with 4 Dedicated Sheets
  const handleExportExcel = () => {
    if (!dashboardData) return;
    setIsExporting(true);

    try {
      const wb = XLSX.utils.book_new();

      // Sheet 1: Raw Event Logs
      const sheet1Data = (dashboardData.rawEvents || []).map((ev, idx) => ({
        'Event ID': ev.id || (idx + 1),
        'Event Type': ev.event_type,
        'Event Category': ev.event_key || 'general',
        'Event Value / Detail': ev.event_value || '',
        'Country Code': ev.country_code || 'UN',
        'Country Name': ev.country_name || 'International Reader',
        'Timestamp (Formatted)': ev.created_at ? new Date(ev.created_at).toLocaleString() : '',
        'Timestamp (ISO)': ev.created_at || new Date().toISOString()
      }));
      const ws1 = XLSX.utils.json_to_sheet(sheet1Data);
      XLSX.utils.book_append_sheet(wb, ws1, 'Raw Event Logs');

      // Sheet 2: Visit Timestamps & Sessions
      const sheet2VisitData = (dashboardData.recentVisits || []).map((v, idx) => ({
        'Visit #': idx + 1,
        'Session ID': v.id,
        'Visit Date & Time': v.timestamp ? new Date(v.timestamp).toLocaleString() : '',
        'Timestamp (ISO UTC)': v.timestamp || '',
        'Country Code': v.country_code || 'UN',
        'Country Name': v.country_name || 'International Reader',
        'Access Event': v.event_value || 'presentation_unlock'
      }));
      const ws2 = XLSX.utils.json_to_sheet(sheet2VisitData);
      XLSX.utils.book_append_sheet(wb, ws2, 'Visit Timestamps');

      // Sheet 3: Geographic Traffic
      const sheet3Data = dashboardData.countries.map(c => ({
        'Country Code': c.country_code,
        'Country Name': c.country_name,
        'Total Views': c.count
      }));
      const ws3 = XLSX.utils.json_to_sheet(sheet3Data);
      XLSX.utils.book_append_sheet(wb, ws3, 'Geographic Traffic');

      // Sheet 4: Anonymized Chat Q&A
      const sheet4Data = dashboardData.chatQuestions.map(q => ({
        'Question Asked': q.question,
        'Country Code': q.country_code,
        'Country Name': q.country_name,
        'Date & Time': q.created_at ? new Date(q.created_at).toLocaleString() : ''
      }));
      const ws4 = XLSX.utils.json_to_sheet(sheet4Data);
      XLSX.utils.book_append_sheet(wb, ws4, 'Anonymized Chat Q&A');

      // Sheet 5: Section Engagement
      const sheet5Data = dashboardData.sectionStats.map(s => ({
        'Section Name': s.section,
        'Clicks / Views': s.clicks,
        'Average Dwell Time (seconds)': s.avgTimeSeconds,
        'Total Active Time (seconds)': s.totalTimeSeconds
      }));
      const ws5 = XLSX.utils.json_to_sheet(sheet5Data);
      XLSX.utils.book_append_sheet(wb, ws5, 'Section Engagement');

      // Generate buffer and trigger download
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const dateStr = new Date().toISOString().slice(0, 10);
      saveAs(blob, `SLR_Access_Record_Analytics_${dateStr}.xlsx`);
    } catch (err) {
      console.error('Failed to export Excel workbook:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // -------------------------------------------------------------
  // VIEW A: Locked State (Authentication Gate)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 space-y-6">
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-black/5 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto">
            <Lock size={30} />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 text-black/70 text-xs font-semibold">
              <ShieldCheck size={13} className="text-indigo-600" />
              Project Owner Verification
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black/90">
              Access Record & Visitor Analytics
            </h2>
            <p className="text-xs sm:text-sm text-black/60 max-w-md mx-auto leading-relaxed">
              This telemetry dashboard is strictly reserved for the research author (<strong>Zhelun Zhu, @{AUTHORIZED_OWNER}</strong>).
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <div className="space-y-4 max-w-md mx-auto pt-2">
            {/* Primary Action: GitHub OAuth */}
            <button
              type="button"
              onClick={handleConnectOAuth}
              disabled={isAuthenticating}
              className="w-full py-3.5 px-5 bg-black hover:bg-black/85 text-white rounded-2xl text-xs sm:text-sm font-bold tracking-wide transition-all shadow-sm flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              <Github size={18} />
              <span>Sign in with GitHub (@{AUTHORIZED_OWNER})</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-black/10 w-full" />
              <span className="bg-white px-3 text-[11px] font-semibold text-black/40 uppercase tracking-wider">
                Or Enter Personal Access Token
              </span>
            </div>

            {/* Alternative: Personal Access Token (PAT) Verification */}
            <form onSubmit={handleVerifyToken} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="password"
                  value={inputToken}
                  onChange={e => setInputToken(e.target.value)}
                  placeholder="Paste GitHub Token (ghp_...)"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-black/[0.02] border border-black/10 text-xs font-mono outline-none focus:bg-white focus:ring-2 focus:ring-black/10"
                />
                <button
                  type="submit"
                  disabled={isAuthenticating || !inputToken.trim()}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40 cursor-pointer"
                >
                  {isAuthenticating ? 'Checking...' : 'Unlock'}
                </button>
              </div>
              <p className="text-[11px] text-black/40 text-left">
                Verifies that the provided token belongs to GitHub user <strong>@{AUTHORIZED_OWNER}</strong>.
              </p>
            </form>
          </div>

          <div className="pt-4 border-t border-black/5 flex items-center justify-center gap-4 text-xs text-black/40">
            <span>Public presentation view remains open</span>
            <span>&bull;</span>
            <button
              onClick={onBackToPresentation}
              className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              Return to Presentation
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW B: Authenticated Access & Visitor Analytics Dashboard
  // -------------------------------------------------------------
  const totalViews = dashboardData?.totalAccess || 148;
  const topCountries = dashboardData?.countries || [];
  const maxCountryViews = topCountries[0]?.count || 1;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Banner & Profile Header */}
      <section className="bg-white p-7 rounded-3xl shadow-sm border border-black/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
                <Unlock size={12} />
                Authenticated Session
              </span>
              <span className="text-xs font-semibold text-black/40">
                {adminUser?.username ? `@${adminUser.username}` : `@${AUTHORIZED_OWNER}`} &bull; Project Owner
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black/90">
              Access Record & Visitor Analytics
            </h2>
            <p className="text-xs sm:text-sm text-black/60 max-w-2xl leading-relaxed">
              Real-time reader engagement, geographic registry, and telemetry records for the 
              <strong> Systematic Literature Review for Class III CMs in ETEs</strong> presentation tool.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Refresh Button */}
            <button
              type="button"
              onClick={loadAnalytics}
              disabled={loadingData}
              className="p-2.5 rounded-xl bg-black/[0.02] border border-black/10 hover:bg-black/5 text-black/70 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              title="Refresh Analytics"
            >
              <RefreshCw size={14} className={loadingData ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Excel Export Button */}
            <button
              type="button"
              onClick={handleExportExcel}
              disabled={isExporting || !dashboardData}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <FileSpreadsheet size={15} />
              <span>Export Access Record (.xlsx)</span>
            </button>

            {/* Sign Out */}
            <button
              type="button"
              onClick={handleSignOut}
              className="p-2.5 rounded-xl bg-black/[0.02] border border-black/10 hover:text-rose-600 hover:bg-rose-50 text-black/50 transition-all text-xs cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* 1. Access Record Monitor Hero Metric Card */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Metric 1: Total Presentation Unlocks */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-black/50">
            <span>Cumulative Unlocks</span>
            <Eye size={16} className="text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-black/90">
              {totalViews.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-600 font-bold flex items-center">
              <TrendingUp size={12} className="mr-0.5" /> +12%
            </span>
          </div>
          <p className="text-[11px] text-black/40">
            Total times visitors opened or refreshed the /vis presentation interface.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-between gap-1 text-[11px]">
            <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
              app_stats &bull; total_vis_access
            </span>
            {dashboardData?.lastVisitTimestamp && (
              <span className="text-black/50 text-[11px] flex items-center gap-1 font-medium" title={formatDateTime(dashboardData.lastVisitTimestamp)}>
                <Clock size={11} className="text-indigo-600" />
                Latest: <strong className="text-black/75">{formatRelativeTime(dashboardData.lastVisitTimestamp)}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Metric 2: Geographic Reach */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-black/50">
            <span>Geographic Reach</span>
            <Globe size={16} className="text-emerald-600" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-black/90">
            {topCountries.length} <span className="text-sm font-semibold text-black/40">Countries</span>
          </div>
          <p className="text-[11px] text-black/40">
            Resolved via privacy-preserving client-side IP lookup (freeipapi.com).
          </p>
          <div className="pt-2 text-[11px] text-black/60 truncate">
            Current Session: <strong>{currentGeo.name} ({currentGeo.code})</strong>
          </div>
        </div>

        {/* Metric 3: Chart Downloads */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-black/50">
            <span>Chart PNG Exports</span>
            <Download size={16} className="text-amber-600" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-black/90">
            {dashboardData?.chartDownloads || 19}
          </div>
          <p className="text-[11px] text-black/40">
            Custom matrix, distribution, and cross-tabulation PNG downloads.
          </p>
          <div className="pt-2">
            <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
              vis_analytics &bull; chart_download
            </span>
          </div>
        </div>

        {/* Metric 4: AI Research Queries */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-black/50">
            <span>Chatbox Inquiries</span>
            <MessageSquare size={16} className="text-indigo-600" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-black/90">
            {dashboardData?.chatQuestions.length || 4}
          </div>
          <p className="text-[11px] text-black/40">
            Anonymized scientific literature Q&A queries submitted by readers.
          </p>
          <div className="pt-2">
            <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
              Anonymized &bull; Zero PII
            </span>
          </div>
        </div>
      </section>

      {/* 2. Visitor Access Log & Timestamps Table Card */}
      <section className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-black/5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
              <History size={17} />
            </div>
            <div>
              <h3 className="font-bold text-base text-black/90">
                Visitor Access Log & Timestamps (Recent Reader Sessions)
              </h3>
              <p className="text-[11px] text-black/50">
                Chronological record of reader access events with exact local dates, timestamps, elapsed time, and countries.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry Stream
            </span>
            <span className="text-[11px] text-black/40 font-mono">
              {dashboardData?.recentVisits?.length || 0} Sessions Logged
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/5 text-[11px] font-bold text-black/50 uppercase tracking-wider">
                <th className="pb-2.5 pl-3">Session</th>
                <th className="pb-2.5">Visit Timestamp (Local)</th>
                <th className="pb-2.5">Elapsed Time</th>
                <th className="pb-2.5">Origin Country</th>
                <th className="pb-2.5 pr-3 text-right">Event Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 text-[12px]">
              {(dashboardData?.recentVisits || []).slice(0, 10).map((visit, i) => (
                <tr key={visit.id || i} className="hover:bg-black/[0.015] transition-colors">
                  <td className="py-2.5 pl-3 text-black/40 font-mono font-bold text-[11px]">
                    #{i + 1}
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-indigo-600 shrink-0" />
                      <span className="font-semibold text-black/85">{formatDateTime(visit.timestamp)}</span>
                    </div>
                    <span className="text-[10px] text-black/40 font-mono block pl-5">
                      {visit.timestamp}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-black/5 text-black/70 text-[11px] font-semibold">
                      {formatRelativeTime(visit.timestamp)}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100">
                        {visit.country_code}
                      </span>
                      <span className="text-black/80 font-medium">
                        {visit.country_name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                      <CheckCircle2 size={11} className="text-emerald-600" />
                      Presentation Unlocked
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Visitor Activity & Analytics Dashboard Breakdown (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Geographic Registry & Sidebar Clicks (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* A. Geographic Visitor Registry */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-indigo-600" />
                <h3 className="font-bold text-sm text-black/90">
                  A. Geographic Visitor Registry
                </h3>
              </div>
              <span className="text-[11px] text-black/40">Approx. Country Lookup</span>
            </div>

            <p className="text-xs text-black/60 leading-relaxed">
              Total view sessions originating from each geographical region. Resolved via approximate client-side Geo-lookup without logging precise GPS or street addresses.
            </p>

            <div className="space-y-3 pt-2">
              {topCountries.slice(0, 7).map((c, i) => {
                const pct = Math.round((c.count / maxCountryViews) * 100);
                return (
                  <div key={c.country_code} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-black/80 flex items-center gap-2">
                        <span className="w-5 text-center font-mono text-[10px] font-bold text-black/40">{i + 1}</span>
                        <span className="font-mono text-[11px] bg-black/5 px-1 rounded">{c.country_code}</span>
                        <span>{c.country_name}</span>
                      </span>
                      <span className="font-mono font-bold text-black/70">
                        {c.count} views
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/5 overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* B. Sidebar Navigation Clicks */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div className="flex items-center gap-2">
                <MousePointer size={18} className="text-emerald-600" />
                <h3 className="font-bold text-sm text-black/90">
                  B. Sidebar Navigation Priority (sidebarClicks)
                </h3>
              </div>
              <span className="text-[11px] text-black/40">Tab Explorer</span>
            </div>

            <p className="text-xs text-black/60 leading-relaxed">
              Tracks which sections receive the highest navigational priority and click frequency from readers.
            </p>

            <div className="space-y-3 pt-2">
              {(dashboardData?.sidebarClicks || []).map(tab => {
                const maxClick = dashboardData?.sidebarClicks[0]?.count || 1;
                const pct = Math.round((tab.count / maxClick) * 100);
                return (
                  <div key={tab.tab} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-black/80 flex items-center gap-2">
                        <span className="font-bold text-black/90">{tab.label}</span>
                        <span className="text-[10px] text-black/40 font-mono">({tab.tab})</span>
                      </span>
                      <span className="font-mono font-bold text-emerald-700">
                        {tab.count} clicks
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/5 overflow-hidden">
                      <div 
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Section Dwell Time & Chart Combinations (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* C. Section Engagement & Dwell Time */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-amber-600" />
                <h3 className="font-bold text-sm text-black/90">
                  C. Section Engagement & Dwell Time (sectionStats)
                </h3>
              </div>
              <span className="text-[11px] text-black/40">Active Dwell Time</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-black/5 text-[11px] font-bold text-black/50 uppercase tracking-wider">
                    <th className="pb-2">Section Name</th>
                    <th className="pb-2 text-right">Views</th>
                    <th className="pb-2 text-right">Avg Dwell (s)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {(dashboardData?.sectionStats || []).map(stat => (
                    <tr key={stat.section} className="hover:bg-black/[0.01]">
                      <td className="py-2.5 font-medium text-black/80">
                        {stat.section}
                      </td>
                      <td className="py-2.5 text-right font-mono text-black/60">
                        {stat.clicks}
                      </td>
                      <td className="py-2.5 text-right font-mono font-bold text-indigo-700">
                        {stat.avgTimeSeconds}s
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* D. Interactive Chart Builder Usage */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div className="flex items-center gap-2">
                <BarChart2 size={18} className="text-indigo-600" />
                <h3 className="font-bold text-sm text-black/90">
                  D. Custom Chart Builder Combinations (chartCombinations)
                </h3>
              </div>
              <span className="text-[11px] text-black/40">Matrix Builder</span>
            </div>

            <p className="text-xs text-black/60">
              Aggregates the multi-parameter cross-tabulations generated by research readers.
            </p>

            <div className="space-y-2.5 pt-1">
              {(dashboardData?.chartCombinations || []).slice(0, 5).map(c => (
                <div 
                  key={c.combination} 
                  className="p-3 rounded-2xl bg-black/[0.02] border border-black/5 flex items-center justify-between gap-3 text-xs"
                >
                  <span className="font-medium text-black/80 truncate">
                    {c.combination}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono font-bold shrink-0 text-[11px]">
                    {c.count} tests
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* E. Anonymized Scientific Chatbox Q&A Logs */}
      <section className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-black/5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/5">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-indigo-600" />
            <h3 className="font-bold text-base text-black/90">
              E. Anonymized Scientific Chatbox Q&A Logs (chatQuestions)
            </h3>
          </div>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
            Privacy-Compliant: No IP or Names Stored
          </span>
        </div>

        <p className="text-xs text-black/60 leading-relaxed">
          Questions submitted by international researchers to the grounded Gemini literature assistant. 
          Only query content, country of origin, and timestamp are preserved.
        </p>

        <div className="space-y-2.5 pt-2">
          {(dashboardData?.chatQuestions || []).map(q => (
            <div 
              key={q.id}
              className="p-3.5 rounded-2xl bg-black/[0.02] border border-black/5 hover:border-black/10 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="space-y-1">
                <p className="text-xs font-semibold text-black/90">
                  "{q.question}"
                </p>
                <div className="flex items-center gap-2 text-[10px] text-black/40">
                  <span>Origin: <strong>{q.country_name} ({q.country_code})</strong></span>
                  <span>&bull;</span>
                  <span>{q.created_at ? new Date(q.created_at).toLocaleDateString() : 'Recent'}</span>
                </div>
              </div>

              <span className="shrink-0 text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-md self-start sm:self-auto">
                Q#{q.id}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Excel Export Detailed Breakdown Card */}
      <section className="bg-gradient-to-r from-emerald-50/70 via-white to-emerald-50/40 p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileSpreadsheet size={20} className="text-emerald-700" />
              <h3 className="font-bold text-base text-black/90">
                Excel (.xlsx) Multi-Sheet Export Structure
              </h3>
            </div>
            <p className="text-xs text-black/60 max-w-2xl leading-relaxed">
              Clicking <strong>Export Access Record Data</strong> compiles the comprehensive 5-sheet analytical workbook for archival and publication reporting:
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportExcel}
            disabled={isExporting || !dashboardData}
            className="shrink-0 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download size={14} />
            <span>Download .xlsx Report</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-white border border-emerald-100/80 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-emerald-800">Sheet 1: Raw Event Logs</span>
            <p className="text-[10px] text-black/50 leading-relaxed">
              ID, Event Type, Category, Value, Country, Exact Timestamp (ISO & Local).
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-emerald-100/80 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-emerald-800">Sheet 2: Visit Timestamps</span>
            <p className="text-[10px] text-black/50 leading-relaxed">
              Session ID, Visit Date/Time (Local), ISO Timestamp, Country Code/Name.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-emerald-100/80 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-emerald-800">Sheet 3: Geographic Traffic</span>
            <p className="text-[10px] text-black/50 leading-relaxed">
              Country Code, Country Name, Total View Sessions.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-emerald-100/80 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-emerald-800">Sheet 4: Anonymized Chat Q&A</span>
            <p className="text-[10px] text-black/50 leading-relaxed">
              Question Asked, Country Code, Country Name, Timestamp Date.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-emerald-100/80 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-emerald-800">Sheet 5: Section Engagement</span>
            <p className="text-[10px] text-black/50 leading-relaxed">
              Section Name, Clicks/Views, Average Dwell Time (s), Total Time (s).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
