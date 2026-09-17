import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { LeadCaptureView } from './components/LeadCaptureView';
import { PipelineView } from './components/PipelineView';
import { CampaignView } from './components/CampaignView';
import { LogsView } from './components/LogsView';
import { WebhookTester } from './components/WebhookTester';
import { CodeExportView } from './components/CodeExportView';
import { Lead, CampaignTrigger, OperationalLog, SystemStats } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('capture');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [triggers, setTriggers] = useState<CampaignTrigger[]>([]);
  const [logs, setLogs] = useState<OperationalLog[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    try {
      const [leadsRes, triggersRes, logsRes, statsRes] = await Promise.all([
        fetch('/api/leads').then((r) => r.json()),
        fetch('/api/campaign_triggers').then((r) => r.json()),
        fetch('/api/operational_logs').then((r) => r.json()),
        fetch('/api/stats').then((r) => r.json()),
      ]);

      if (Array.isArray(leadsRes)) setLeads(leadsRes);
      if (Array.isArray(triggersRes)) setTriggers(triggersRes);
      if (Array.isArray(logsRes)) setLogs(logsRes);
      if (statsRes && !statsRes.error) setStats(statsRes);
    } catch (err) {
      console.error('Failed to fetch CRM data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await fetch(`/api/leads/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchData();
    } catch (err) {
      console.error('Failed to update lead status:', err);
    }
  };

  const handleResetDb = async () => {
    if (window.confirm('Reset SQLite database to original sample records?')) {
      try {
        await fetch('/api/reset_db', { method: 'POST' });
        fetchData();
      } catch (err) {
        console.error('Failed to reset DB:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#f1f5f9] flex flex-col selection:bg-[#00ff87]/30 selection:text-white">
      {/* Top Navigation & Status Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        onRefresh={fetchData}
        onResetDb={handleResetDb}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'capture' && (
          <LeadCaptureView
            onLeadCreated={fetchData}
            onNavigateToPipeline={() => setActiveTab('pipeline')}
          />
        )}

        {activeTab === 'pipeline' && (
          <PipelineView
            leads={leads}
            onStatusChange={handleStatusChange}
            onNavigateToCapture={() => setActiveTab('capture')}
          />
        )}

        {activeTab === 'campaign' && <CampaignView triggers={triggers} />}

        {activeTab === 'logs' && <LogsView logs={logs} />}

        {activeTab === 'webhook' && <WebhookTester onSuccess={fetchData} />}

        {activeTab === 'codebase' && <CodeExportView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#07090e] py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff87]"></span>
            <span>SCITBD Enterprise Lead Acquisition & Webhook Engine</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Powered by PHP • SQLite • Bootstrap 5 & Express API Controller
          </div>
          <div className="text-[11px] text-slate-400">
            Target Deployment: <code className="text-slate-300">scit.zya.me</code>
          </div>
        </div>
      </footer>
    </div>
  );
}
