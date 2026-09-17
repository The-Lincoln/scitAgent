import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Video, 
  Building2, 
  Globe2, 
  DollarSign, 
  Mail, 
  User, 
  Phone,
  Layers
} from 'lucide-react';

interface LeadCaptureViewProps {
  onLeadCreated: () => void;
  onNavigateToPipeline: () => void;
}

export const LeadCaptureView: React.FC<LeadCaptureViewProps> = ({
  onLeadCreated,
  onNavigateToPipeline,
}) => {
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('');
  const [dealValue, setDealValue] = useState<string>('12000');
  const [serviceLine, setServiceLine] = useState('AI Product Suite (Chatbot / Analytics)');

  const [loading, setLoading] = useState(false);
  const [responseResult, setResponseResult] = useState<any | null>(null);

  const numericDeal = parseFloat(dealValue) || 0;
  const isHighValue = numericDeal >= 10000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponseResult(null);

    const payload = {
      client_name: clientName,
      email: email,
      phone: phone,
      company_name: companyName,
      country: country,
      deal_value: numericDeal,
      service_line: serviceLine,
      campaign_source: 'October SaaS Pilot Landing Page',
    };

    try {
      const response = await fetch('/api_webhook.php?action=submit_lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setResponseResult({
          type: 'success',
          isEscalated: data.ceo_video_escalation,
          leadId: data.lead_id,
          message: data.message,
        });
        // reset form
        setClientName('');
        setEmail('');
        setPhone('');
        setCompanyName('');
        setCountry('');
        setDealValue('10000');
        onLeadCreated();
      } else {
        setResponseResult({
          type: 'error',
          message: data.message || 'Failed to process lead.',
        });
      }
    } catch (err: any) {
      setResponseResult({
        type: 'error',
        message: 'Server connection failed. Please ensure the backend is active: ' + err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (presetType: 'high' | 'standard' | 'enterprise') => {
    if (presetType === 'high') {
      setClientName('Marcus Vance');
      setEmail('m.vance@techcorp.de');
      setPhone('+49 30 123456');
      setCompanyName('TechCorp Germany');
      setCountry('Germany');
      setDealValue('15000');
      setServiceLine('Custom Enterprise Software (ERP/HRM)');
    } else if (presetType === 'standard') {
      setClientName('Elena Rostova');
      setEmail('elena@nordicconsult.se');
      setPhone('+46 8 123 4567');
      setCompanyName('Nordic Consult AB');
      setCountry('Sweden');
      setDealValue('8500');
      setServiceLine('ICT Consultancy & Digital Transformation');
    } else {
      setClientName('Dr. Tariq Al-Mansoor');
      setEmail('tariq@gulfdata.ae');
      setPhone('+971 4 888 1234');
      setCompanyName('Gulf Data Systems');
      setCountry('United Arab Emirates');
      setDealValue('35000');
      setServiceLine('Cybersecurity & Compliance (ISO/GDPR)');
    }
  };

  return (
    <div className="py-6 px-4 max-w-4xl mx-auto">
      {/* Quick Demo Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#00ff87]" />
          <span className="font-semibold text-white">Live Form Sandbox:</span>
          <span>Fill manually or load realistic enterprise demo data:</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadPreset('high')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition-colors"
          >
            Load $15k High-Value Deal
          </button>
          <button
            type="button"
            onClick={() => loadPreset('enterprise')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 transition-colors"
          >
            Load $35k Enterprise
          </button>
          <button
            type="button"
            onClick={() => loadPreset('standard')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            Load $8.5k Standard
          </button>
        </div>
      </div>

      {/* Main Lead Capture Card */}
      <div className="bg-[#111827] border border-[#1e293b] rounded-2xl p-6 sm:p-10 shadow-[0_0_35px_rgba(0,0,0,0.6)] relative overflow-hidden">
        {/* Glow Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00ff87] to-transparent"></div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff87]/10 border border-[#00ff87]/40 text-[#00ff87] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#00ff87]" />
            <span>24/7 AI AUTOMATION ENGINE ACTIVE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Claim Your Free 30-Day AI Trial
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Unlock 95% dark data and automate operations with SCITBD Enterprise Solutions.
          </p>
        </div>

        {/* Lead Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#00ff87]" />
                <span>Full Name *</span>
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                required
                className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#00ff87] focus:ring-1 focus:ring-[#00ff87]/50 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none transition-all placeholder-slate-500"
              />
            </div>

            {/* Work Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#00ff87]" />
                <span>Work Email *</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="s.jenkins@enterprise.com"
                required
                className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#00ff87] focus:ring-1 focus:ring-[#00ff87]/50 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none transition-all placeholder-slate-500"
              />
            </div>

            {/* Phone / WhatsApp */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Phone / WhatsApp</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#00ff87] focus:ring-1 focus:ring-[#00ff87]/50 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none transition-all placeholder-slate-500"
              />
            </div>

            {/* Company / Organization */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Company / Organization</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Apex Global Tech"
                className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#00ff87] focus:ring-1 focus:ring-[#00ff87]/50 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none transition-all placeholder-slate-500"
              />
            </div>

            {/* Target Market / Country */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-[#00ff87]" />
                <span>Target Market / Country *</span>
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. UAE, USA, UK, Germany"
                required
                className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#00ff87] focus:ring-1 focus:ring-[#00ff87]/50 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none transition-all placeholder-slate-500"
              />
            </div>

            {/* Estimated Project Budget ($ USD) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-[#00ff87]" />
                  <span>Estimated Project Budget ($ USD) *</span>
                </span>
                {isHighValue && (
                  <span className="text-[10px] text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-950/60 border border-amber-600/40">
                    $10k+ CEO Escalation Tier
                  </span>
                )}
              </label>
              <input
                type="number"
                value={dealValue}
                onChange={(e) => setDealValue(e.target.value)}
                placeholder="10000"
                required
                min="0"
                step="500"
                className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#00ff87] focus:ring-1 focus:ring-[#00ff87]/50 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none transition-all placeholder-slate-500 font-mono"
              />
            </div>

            {/* Primary Capability Interest */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#00ff87]" />
                <span>Primary Capability Interest *</span>
              </label>
              <select
                value={serviceLine}
                onChange={(e) => setServiceLine(e.target.value)}
                required
                className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#00ff87] focus:ring-1 focus:ring-[#00ff87]/50 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none transition-all"
              >
                <option value="AI Product Suite (Chatbot / Analytics)">
                  AI Product Suite (Chatbot / Analytics)
                </option>
                <option value="ICT Consultancy & Digital Transformation">
                  ICT Consultancy & Digital Transformation
                </option>
                <option value="Custom Enterprise Software (ERP/HRM)">
                  Custom Enterprise Software (ERP/HRM)
                </option>
                <option value="Humanitarian M&E Software System">
                  Humanitarian M&E Software System
                </option>
                <option value="Cybersecurity & Compliance (ISO/GDPR)">
                  Cybersecurity & Compliance (ISO/GDPR)
                </option>
              </select>
            </div>
          </div>

          {/* SLA Rule & CEO Escalation Preview Indicator */}
          <div className="pt-2">
            {isHighValue ? (
              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2.5">
                <Video className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300">Executive Rule Trigger:</strong> Deals of $10,000+ USD automatically activate the{' '}
                  <span className="font-semibold text-white">CEO Video Protocol</span>. Founder Md Shoeb Lincoln receives immediate high-priority dispatch to deliver a custom video proposal within 24 hours.
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#00ff87] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#00ff87]">Standard SLA Rule:</strong> Inbound leads trigger the automated Proposal Engine and Touch 1 of our 7-Touch Email Campaign within our guaranteed <span className="font-semibold text-white">&lt; 2-Hour SLA</span>.
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-nano py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(0,255,135,0.25)] hover:shadow-[0_0_25px_rgba(0,255,135,0.5)] transition-all cursor-pointer disabled:opacity-50 mt-4"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
                <span>Processing & Dispatched via Webhook Engine...</span>
              </div>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Activate Trial & Dispatch AI Proposal</span>
              </>
            )}
          </button>
        </form>

        {/* Dynamic Response Alert Box */}
        {responseResult && (
          <div className="mt-6">
            {responseResult.type === 'success' ? (
              responseResult.isEscalated ? (
                <div className="p-4 rounded-xl bg-amber-950/40 border-2 border-amber-500/80 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                  <div className="flex items-center gap-2 text-base font-bold text-amber-300 mb-1">
                    <span className="text-xl">🚨</span>
                    <span>HIGH VALUE ENTERPRISE DEAL DETECTED!</span>
                  </div>
                  <p className="text-sm text-slate-200 mb-2">
                    {responseResult.message}
                  </p>
                  <div className="p-2.5 rounded bg-slate-900/80 border border-amber-500/30 text-xs text-amber-200 flex items-center justify-between">
                    <span>
                      Priority Escalation: Founder <strong>Md Shoeb Lincoln</strong> has been notified to send a custom video response within 24 hours. (Lead #{responseResult.leadId})
                    </span>
                    <button
                      onClick={onNavigateToPipeline}
                      className="ml-3 px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold transition-colors shrink-0 text-xs"
                    >
                      View in CRM →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-[#00ff87]/60 text-emerald-100 shadow-[0_0_20px_rgba(0,255,135,0.15)]">
                  <div className="flex items-center gap-2 text-base font-bold text-[#00ff87] mb-1">
                    <CheckCircle2 className="w-5 h-5 text-[#00ff87]" />
                    <span>Request Processed Successfully!</span>
                  </div>
                  <p className="text-sm text-slate-200 mb-2">
                    {responseResult.message}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                    <span>Lead ID #{responseResult.leadId} logged to SQLite with Touch 1 SENT.</span>
                    <button
                      onClick={onNavigateToPipeline}
                      className="px-2 py-1 rounded bg-[#00ff87]/15 hover:bg-[#00ff87]/25 text-[#00ff87] font-semibold transition-colors"
                    >
                      Inspect in Pipeline →
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500 text-rose-200">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                  <span>Submission Error</span>
                </div>
                <p className="text-sm">{responseResult.message}</p>
              </div>
            )}
          </div>
        )}

        {/* Footer Security Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-8 pt-4 border-t border-slate-800 text-slate-400 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-slate-300">ISO 27001 & GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300">SLA Response: &lt; 2 Hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};
