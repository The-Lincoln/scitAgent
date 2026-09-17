import React, { useState } from 'react';
import { 
  Send, 
  Copy, 
  Check, 
  Terminal, 
  Code2, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2,
  ExternalLink,
  Layers
} from 'lucide-react';

interface WebhookTesterProps {
  onSuccess: () => void;
}

export const WebhookTester: React.FC<WebhookTesterProps> = ({ onSuccess }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<'submit_lead' | 'external_webhook'>('submit_lead');
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [responseLog, setResponseLog] = useState<any | null>(null);

  const samplePayloadLead = JSON.stringify(
    {
      client_name: 'Marcus Vance',
      email: 'm.vance@techcorp.de',
      phone: '+49 30 123456',
      company_name: 'TechCorp Germany',
      country: 'Germany',
      deal_value: 15000,
      service_line: 'Custom Enterprise Software (ERP/HRM)',
      campaign_source: 'LinkedIn B2B Outreach',
    },
    null,
    2
  );

  const samplePayloadExternal = JSON.stringify(
    {
      event_type: 'zapier_hubspot_lead_synced',
      lead_source: 'Typeform Enterprise Campaign',
      company: 'Nordic Logistics Group',
      tier: 'Enterprise Tier 1',
      metadata: {
        crm_deal_id: 'HS-98231',
        rep_assigned: 'Md Shoeb Lincoln',
        timestamp: new Date().toISOString(),
      },
    },
    null,
    2
  );

  const [payloadText, setPayloadText] = useState(samplePayloadLead);

  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://scit.zya.me';
  const targetUrl = `${currentHost}/api_webhook.php?action=${selectedEndpoint}`;
  const productionUrl = `https://scit.zya.me/api_webhook.php?action=${selectedEndpoint}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWebhook = async () => {
    setSending(true);
    setResponseLog(null);

    let parsedPayload;
    try {
      parsedPayload = JSON.parse(payloadText);
    } catch (e: any) {
      setResponseLog({
        status: 400,
        statusText: 'JSON Syntax Error',
        body: { error: 'Invalid JSON payload: ' + e.message },
      });
      setSending(false);
      return;
    }

    try {
      const startTime = performance.now();
      const res = await fetch(`/api_webhook.php?action=${selectedEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedPayload),
      });

      const elapsed = Math.round(performance.now() - startTime);
      const data = await res.json();

      setResponseLog({
        status: res.status,
        statusText: res.statusText || (res.status === 200 ? 'OK' : 'Error'),
        elapsed: `${elapsed}ms`,
        body: data,
      });

      if (res.status === 200) {
        onSuccess();
      }
    } catch (err: any) {
      setResponseLog({
        status: 500,
        statusText: 'Network Error',
        body: { error: err.message },
      });
    } finally {
      setSending(false);
    }
  };

  const setPreset = (type: string) => {
    if (type === 'marcus') {
      setSelectedEndpoint('submit_lead');
      setPayloadText(samplePayloadLead);
    } else if (type === 'tariq') {
      setSelectedEndpoint('submit_lead');
      setPayloadText(
        JSON.stringify(
          {
            client_name: 'Dr. Tariq Al-Mansoor',
            email: 'tariq@gulfdata.ae',
            phone: '+971 4 888 1234',
            company_name: 'Gulf Data Systems',
            country: 'United Arab Emirates',
            deal_value: 35000,
            service_line: 'Cybersecurity & Compliance (ISO/GDPR)',
            campaign_source: 'Direct Founder Referral',
          },
          null,
          2
        )
      );
    } else if (type === 'standard') {
      setSelectedEndpoint('submit_lead');
      setPayloadText(
        JSON.stringify(
          {
            client_name: 'Chloe Bennett',
            email: 'c.bennett@ukretail.co.uk',
            phone: '+44 20 7946 0912',
            company_name: 'UK Retail Tech Ltd',
            country: 'United Kingdom',
            deal_value: 7500,
            service_line: 'AI Product Suite (Chatbot / Analytics)',
            campaign_source: 'Organic / Lead Capture',
          },
          null,
          2
        )
      );
    } else if (type === 'external') {
      setSelectedEndpoint('external_webhook');
      setPayloadText(samplePayloadExternal);
    }
  };

  const curlSnippet = `curl -X POST "${targetUrl}" \\
  -H "Content-Type: application/json" \\
  -d '${payloadText.replace(/'/g, "\\'")}'`;

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#00ff87]/10 text-[#00ff87] font-semibold border border-[#00ff87]/30">
              Zapier & Make.com Ingestion Gateway
            </span>
            <span className="text-xs text-slate-400 font-mono">Controller: api_webhook.php</span>
          </div>
          <h2 className="text-lg font-bold text-white">External Webhook Dispatch & Simulator</h2>
          <p className="text-xs text-slate-400">
            Connect external form builders (Typeform, HubSpot, Elementor) or simulate automated inbound enterprise webhooks.
          </p>
        </div>

        <button
          onClick={() => handleCopy(productionUrl)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-mono transition-colors"
        >
          <span>Copy Production URL (scit.zya.me)</span>
          {copied ? <Check className="w-3.5 h-3.5 text-[#00ff87]" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Target URL Card */}
      <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 font-mono text-xs">
        <div className="text-slate-400 mb-1 flex items-center justify-between">
          <span>DESTINATION HTTP ENDPOINT:</span>
          <span className="text-emerald-400">METHOD: POST</span>
        </div>
        <div className="p-2.5 rounded bg-[#0a0d14] border border-slate-800 text-slate-200 flex items-center justify-between overflow-x-auto gap-2">
          <span className="text-[#00ff87] font-semibold">{targetUrl}</span>
          <button
            onClick={() => handleCopy(targetUrl)}
            className="p-1 text-slate-400 hover:text-white shrink-0"
            title="Copy Endpoint"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
        <button
          onClick={() => setPreset('marcus')}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 text-xs font-semibold"
        >
          Marcus Vance ($15,000 Germany - CEO Escalation)
        </button>
        <button
          onClick={() => setPreset('tariq')}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40 text-xs font-semibold"
        >
          Dr. Tariq Al-Mansoor ($35,000 UAE)
        </button>
        <button
          onClick={() => setPreset('standard')}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs"
        >
          Chloe Bennett ($7,500 UK - Standard SLA)
        </button>
        <button
          onClick={() => setPreset('external')}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 text-xs"
        >
          Zapier CRM Ingestion Payload (?action=external_webhook)
        </button>
      </div>

      {/* Editor & Response Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Request Payload */}
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#00ff87]" />
                <span>JSON Request Body</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Content-Type: application/json</span>
            </div>

            <textarea
              rows={14}
              value={payloadText}
              onChange={(e) => setPayloadText(e.target.value)}
              className="w-full bg-[#0a0d14] border border-slate-800 focus:border-[#00ff87] rounded-lg p-3 text-xs text-white font-mono outline-none leading-relaxed"
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => handleCopy(curlSnippet)}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 font-mono"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Copy cURL</span>
            </button>

            <button
              onClick={handleSendWebhook}
              disabled={sending}
              className="btn-nano px-5 py-2.5 rounded-lg text-xs font-bold text-slate-950 flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,135,0.25)] hover:shadow-[0_0_20px_rgba(0,255,135,0.45)] disabled:opacity-50"
            >
              {sending ? (
                <span>Dispatching Webhook...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test Webhook HTTP POST</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Response Inspector */}
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#00ff87]" />
                <span>Webhook Execution Response</span>
              </h3>
              {responseLog && (
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span
                    className={`px-2 py-0.5 rounded font-bold ${
                      responseLog.status === 200
                        ? 'bg-emerald-500/20 text-[#00ff87]'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    HTTP {responseLog.status} {responseLog.statusText}
                  </span>
                  <span className="text-slate-400">{responseLog.elapsed}</span>
                </div>
              )}
            </div>

            {responseLog ? (
              <div className="space-y-3">
                {responseLog.body?.ceo_video_escalation && (
                  <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500 text-amber-200 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300">CEO Escalation Rule In Effect:</strong> Deal meets the $10,000+ USD threshold. Founder Md Shoeb Lincoln has been dispatched for 24h video response.
                    </div>
                  </div>
                )}

                <div className="bg-[#0a0d14] border border-slate-800 rounded-lg p-3 text-xs font-mono overflow-x-auto text-slate-200 max-h-[320px] overflow-y-auto">
                  <pre>{JSON.stringify(responseLog.body, null, 2)}</pre>
                </div>
              </div>
            ) : (
              <div className="h-[280px] rounded-lg border border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-500 text-xs text-center p-6">
                <Send className="w-8 h-8 text-slate-700 mb-2" />
                <p className="font-semibold text-slate-400">No Webhook Dispatched Yet</p>
                <p className="max-w-xs mt-1 text-slate-500">
                  Select a preset and click "Send Test Webhook HTTP POST" to watch the real-time response and database trigger logs.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Enforces Sub-2-Hour SLA Rules</span>
            <span className="text-emerald-400">Writes directly to scitbd_crm.sqlite</span>
          </div>
        </div>
      </div>
    </div>
  );
};
