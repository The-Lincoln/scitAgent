import React from 'react';
import { 
  Zap, 
  Database, 
  MailCheck, 
  Activity, 
  Send, 
  Code2, 
  ShieldCheck, 
  RefreshCw, 
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { SystemStats } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: SystemStats | null;
  onRefresh: () => void;
  onResetDb: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  stats,
  onRefresh,
  onResetDb,
}) => {
  const tabs = [
    { id: 'capture', label: 'Lead Capture Portal', icon: Zap },
    { id: 'pipeline', label: 'CRM Pipeline', icon: Database, badge: stats?.total_leads },
    { id: 'campaign', label: '7-Touch Drip Engine', icon: MailCheck, badge: stats?.total_triggers },
    { id: 'logs', label: 'Operational & SLA Logs', icon: Activity, alert: stats?.ceo_escalations },
    { id: 'webhook', label: 'Webhook & Zapier Tester', icon: Send },
    { id: 'codebase', label: 'Production Code & Docs', icon: Code2 },
  ];

  return (
    <header className="border-b border-slate-800 bg-[#0a0d14]/90 backdrop-blur-md sticky top-0 z-50">
      {/* Top Status Strip */}
      <div className="max-w-7xl mx-auto px-4 py-2 border-b border-slate-800/80 flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#00ff87]/10 border border-[#00ff87]/40 text-[#00ff87] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#00ff87] animate-pulse"></span>
            <span>24/7 AI AUTOMATION ENGINE ACTIVE</span>
          </div>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00ff87]" />
            <span>ISO 27001 & GDPR Compliant</span>
          </div>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-slate-300">
            SLA Response: <strong className="text-slate-100">&lt; 2 Hours</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a 
            href="/lead_capture.html" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-[#00ff87] transition-colors"
          >
            <span>Raw lead_capture.html</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={onRefresh}
            title="Refresh database records"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Sync</span>
          </button>
          <button
            onClick={onResetDb}
            title="Reset to initial demo records"
            className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
          >
            Reset DB
          </button>
        </div>
      </div>

      {/* Main Header & Metrics */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-[#111827] border border-[#00ff87]/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,135,0.15)]">
              <Zap className="w-5 h-5 text-[#00ff87]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">SCITBD</h1>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  v2.4.0 • SQLite
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automated Lead Capture, SLA Proposal Engine & 7-Touch Webhook Controller
              </p>
            </div>
          </div>

          {/* KPI Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">TOTAL LEADS</div>
              <div className="text-base font-bold text-white font-mono">{stats?.total_leads ?? 0}</div>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">PIPELINE VALUE</div>
              <div className="text-base font-bold text-[#00ff87] font-mono">
                ${(stats?.total_pipeline_value ?? 0).toLocaleString()}
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">SLA COMPLIANCE</div>
              <div className="text-base font-bold text-emerald-400 font-mono">&lt; 2h (100%)</div>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">CEO ESCALATIONS</div>
              <div className="text-base font-bold text-amber-400 font-mono flex items-center gap-1">
                {stats?.ceo_escalations ?? 0}
                {(stats?.ceo_escalations ?? 0) > 0 && (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 inline" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 mt-4 overflow-x-auto pb-1 border-t border-slate-800/80 pt-2 text-sm no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-all whitespace-nowrap text-xs sm:text-sm ${
                  isActive
                    ? 'bg-[#111827] text-[#00ff87] border border-[#00ff87]/50 shadow-[0_0_12px_rgba(0,255,135,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#00ff87]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-[#00ff87]/20 text-[#00ff87]' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
                {tab.alert !== undefined && tab.alert > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/40">
                    {tab.alert} Alert
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
