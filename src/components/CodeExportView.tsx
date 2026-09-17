import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  Database, 
  Globe2, 
  Server,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export const CodeExportView: React.FC = () => {
  const [activeFile, setActiveFile] = useState<'schema.sql' | 'lead_capture.html' | 'api_webhook.php' | 'zapier.json'>('schema.sql');
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFiles() {
      setLoading(true);
      try {
        const [schemaRes, htmlRes, phpRes] = await Promise.all([
          fetch('/api/raw_files/schema.sql').then((r) => r.text()),
          fetch('/api/raw_files/lead_capture.html').then((r) => r.text()),
          fetch('/api/raw_files/api_webhook.php').then((r) => r.text()),
        ]);

        const zapierGuide = `// ==========================================
// SCITBD External Webhook Integration Snippet (Zapier / Make.com)
// ==========================================

1. Destination URL:
   POST https://scit.zya.me/api_webhook.php?action=submit_lead

2. Request Headers:
   Content-Type: application/json

3. Sample JSON Payload:
{
  "client_name": "Marcus Vance",
  "email": "m.vance@techcorp.de",
  "phone": "+49 30 123456",
  "company_name": "TechCorp Germany",
  "country": "Germany",
  "deal_value": 15000,
  "service_line": "Custom Enterprise Software (ERP/HRM)",
  "campaign_source": "LinkedIn B2B Outreach"
}

4. Expected HTTP 200 Response:
{
  "status": "success",
  "message": "Lead captured. Proposal Engine and 7-Touch Email Campaign activated within our sub-2-hour SLA.",
  "lead_id": 1,
  "ceo_video_escalation": true
}

5. Rules Enforced by Backend Engine:
   - Ingests prospect into SQLite leads table
   - Queues Touch 1 of October 7-Touch Email Campaign with status 'SENT'
   - Deals >= $10,000 USD trigger CEO Video Protocol (Founder Md Shoeb Lincoln notified)
   - Dispatches webhook alert to CEO notification channel
   - Logs audit trail into operational_logs table`;

        setFileContents({
          'schema.sql': schemaRes,
          'lead_capture.html': htmlRes,
          'api_webhook.php': phpRes,
          'zapier.json': zapierGuide,
        });
      } catch (e) {
        console.error('Failed to load raw files', e);
      } finally {
        setLoading(false);
      }
    }
    loadFiles();
  }, []);

  const currentCode = fileContents[activeFile] || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = activeFile;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#00ff87]/10 text-[#00ff87] font-semibold border border-[#00ff87]/30">
              SCITBD Core Stack
            </span>
            <span className="text-xs text-slate-400 font-mono">PHP • SQLite • Bootstrap 5 • HTML5 • CSS3</span>
          </div>
          <h2 className="text-lg font-bold text-white">Production Codebase & Architecture Hub</h2>
          <p className="text-xs text-slate-400">
            Export standalone production scripts matching scit.zya.me for instant deployment to Apache, Nginx, or cPanel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 hover:text-white hover:border-[#00ff87] transition-all font-semibold"
          >
            {copied ? <Check className="w-4 h-4 text-[#00ff87]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="btn-nano flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-slate-950 transition-all shadow-[0_0_12px_rgba(0,255,135,0.2)]"
          >
            <Download className="w-4 h-4" />
            <span>Download {activeFile}</span>
          </button>
        </div>
      </div>

      {/* File Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveFile('schema.sql')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
            activeFile === 'schema.sql'
              ? 'bg-[#111827] text-[#00ff87] border border-[#00ff87]/50 shadow-[0_0_10px_rgba(0,255,135,0.15)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-[#00ff87]" />
          <span>1. schema.sql (SQLite CRM Database)</span>
        </button>

        <button
          onClick={() => setActiveFile('lead_capture.html')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
            activeFile === 'lead_capture.html'
              ? 'bg-[#111827] text-[#00ff87] border border-[#00ff87]/50 shadow-[0_0_10px_rgba(0,255,135,0.15)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>2. lead_capture.html (Bootstrap 5 Frontend)</span>
        </button>

        <button
          onClick={() => setActiveFile('api_webhook.php')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
            activeFile === 'api_webhook.php'
              ? 'bg-[#111827] text-[#00ff87] border border-[#00ff87]/50 shadow-[0_0_10px_rgba(0,255,135,0.15)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Server className="w-3.5 h-3.5 text-amber-400" />
          <span>3. api_webhook.php (PHP Controller)</span>
        </button>

        <button
          onClick={() => setActiveFile('zapier.json')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
            activeFile === 'zapier.json'
              ? 'bg-[#111827] text-[#00ff87] border border-[#00ff87]/50 shadow-[0_0_10px_rgba(0,255,135,0.15)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>4. Zapier & Make.com Guide</span>
        </button>
      </div>

      {/* Code Viewer */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#00ff87]" />
            <span className="text-white font-semibold">{activeFile}</span>
            <span className="text-slate-500">•</span>
            <span>{currentCode.split('\n').length} lines</span>
          </div>

          <div className="flex items-center gap-3">
            {activeFile === 'lead_capture.html' && (
              <a
                href="/lead_capture.html"
                target="_blank"
                rel="noreferrer"
                className="text-[#00ff87] hover:underline flex items-center gap-1"
              >
                <span>Launch in new tab</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button onClick={handleCopy} className="hover:text-white flex items-center gap-1">
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </button>
          </div>
        </div>

        <div className="p-4 overflow-x-auto max-h-[600px] overflow-y-auto bg-[#0a0d14]">
          {loading ? (
            <div className="py-12 text-center text-slate-500 font-mono text-xs">
              Loading source file...
            </div>
          ) : (
            <pre className="font-mono text-xs text-slate-200 leading-relaxed whitespace-pre selection:bg-[#00ff87]/30 selection:text-white">
              {currentCode}
            </pre>
          )}
        </div>
      </div>

      {/* Deployment Quick Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#111827] border border-slate-800">
          <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#00ff87]/20 text-[#00ff87] flex items-center justify-center font-mono text-xs">
              1
            </span>
            <span>SQLite Database Setup</span>
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Execute <code className="text-emerald-300 font-mono">schema.sql</code> into <code className="text-emerald-300 font-mono">scitbd_crm.sqlite</code>. Ensure write permissions (chmod 664/775) on the directory for PHP PDO.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#111827] border border-slate-800">
          <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#00ff87]/20 text-[#00ff87] flex items-center justify-center font-mono text-xs">
              2
            </span>
            <span>Upload Controller</span>
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Place <code className="text-amber-300 font-mono">api_webhook.php</code> at the webroot (e.g., <code className="text-slate-300 font-mono">https://scit.zya.me/api_webhook.php</code>). Verify <code className="text-slate-300 font-mono">php-sqlite3</code> and <code className="text-slate-300 font-mono">php-curl</code> extensions are enabled.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#111827] border border-slate-800">
          <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#00ff87]/20 text-[#00ff87] flex items-center justify-center font-mono text-xs">
              3
            </span>
            <span>Connect Webhooks</span>
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Direct your frontend landing pages, Zapier, or HubSpot webhooks to <code className="text-cyan-300 font-mono">?action=submit_lead</code> to trigger automated sub-2-hour SLA response and CEO escalation.
          </p>
        </div>
      </div>
    </div>
  );
};
