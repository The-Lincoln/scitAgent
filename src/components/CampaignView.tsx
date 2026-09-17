import React from 'react';
import { 
  MailCheck, 
  Clock, 
  Send, 
  CheckCircle2, 
  Calendar, 
  Layers, 
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { CampaignTrigger } from '../types';

interface CampaignViewProps {
  triggers: CampaignTrigger[];
}

export const CampaignView: React.FC<CampaignViewProps> = ({ triggers }) => {
  const dripSchedule = [
    {
      touch: 1,
      name: 'Immediate Trial Activation & Custom Proposal',
      timing: 'Within < 2 Hours (Sub-2h SLA)',
      goal: 'Delivers 30-day AI trial credentials, enterprise platform access, and scoping questionnaire.',
      status: 'AUTOMATED_DISPATCH',
    },
    {
      touch: 2,
      name: 'Dark Data Intelligence & Enterprise Case Study',
      timing: 'Day 2 (+48 Hours)',
      goal: 'Demonstrates unlocking 95% dark enterprise data using SCITBD Analytics Engine.',
      status: 'SCHEDULED',
    },
    {
      touch: 3,
      name: 'Security, Compliance & Architecture Deep Dive',
      timing: 'Day 4 (+96 Hours)',
      goal: 'Details ISO 27001, GDPR compliance, and client-isolated SQLite/PostgreSQL architecture.',
      status: 'SCHEDULED',
    },
    {
      touch: 4,
      name: 'Custom ERP/HRM & M&E Software Capability Matrix',
      timing: 'Day 7 (Week 1)',
      goal: 'Outlines modular system integration for international humanitarian & enterprise sectors.',
      status: 'SCHEDULED',
    },
    {
      touch: 5,
      name: 'Executive Technical Walkthrough Invitation',
      timing: 'Day 11',
      goal: 'Direct booking link with SCITBD Senior Technical Solution Architects.',
      status: 'SCHEDULED',
    },
    {
      touch: 6,
      name: 'ROI Benchmarks & Cloud Migration Roadmap',
      timing: 'Day 16',
      goal: 'Financial payback modeling and 30-day implementation milestones.',
      status: 'SCHEDULED',
    },
    {
      touch: 7,
      name: 'Founder Executive Follow-Up & Final Pilot Review',
      timing: 'Day 21',
      goal: 'Direct message from Founder Md Shoeb Lincoln evaluating trial outcomes and formal agreement.',
      status: 'SCHEDULED',
    },
  ];

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#00ff87]/10 text-[#00ff87] font-semibold border border-[#00ff87]/30">
              October AI SaaS Launch
            </span>
            <span className="text-xs text-slate-400 font-mono">SQLite Table: campaign_triggers</span>
          </div>
          <h2 className="text-lg font-bold text-white">7-Touch Enterprise Email Drip Architecture</h2>
          <p className="text-xs text-slate-400">
            Every lead captured immediately queues Touch 1 within our sub-2-hour SLA, followed by automated multi-stage follow-ups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            Active Triggers: <strong className="text-[#00ff87] font-mono text-sm">{triggers.length}</strong>
          </div>
        </div>
      </div>

      {/* 7-Touch Visual Roadmap */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#00ff87]" />
          <span>7-Touch Drip Cadence & Deliverables</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {dripSchedule.map((step) => {
            const isFirst = step.touch === 1;
            const isFounder = step.touch === 7;
            return (
              <div
                key={step.touch}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                  isFirst
                    ? 'bg-emerald-950/20 border-[#00ff87]/50 shadow-[0_0_12px_rgba(0,255,135,0.1)]'
                    : isFounder
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                        isFirst
                          ? 'bg-[#00ff87] text-slate-950'
                          : isFounder
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      Touch #{step.touch}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{step.timing}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1.5">{step.name}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{step.goal}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Status:</span>
                  <span
                    className={`font-semibold ${
                      isFirst ? 'text-[#00ff87]' : isFounder ? 'text-amber-300' : 'text-slate-300'
                    }`}
                  >
                    {step.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Database Campaign Triggers Queue Table */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MailCheck className="w-4 h-4 text-[#00ff87]" />
            <h3 className="text-sm font-bold text-white">Live Dispatched Campaign Triggers</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Total Logged: {triggers.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Trigger #</th>
                <th className="py-3 px-4">Lead Ref</th>
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Touch Step</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Scheduled For</th>
                <th className="py-3 px-4">Sent At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {triggers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
                    No campaign triggers registered yet.
                  </td>
                </tr>
              ) : (
                triggers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 text-slate-400">#{t.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-sans font-semibold text-white">
                        {t.client_name || `Lead #${t.lead_id}`}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{t.email || `ID: ${t.lead_id}`}</div>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-200">{t.campaign_name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-[11px] font-bold">
                        Touch {t.touch_number}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          t.status === 'SENT'
                            ? 'bg-emerald-500/15 text-[#00ff87] border border-emerald-500/40'
                            : t.status === 'PENDING'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
                            : 'bg-rose-500/15 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">{t.scheduled_for}</td>
                    <td className="py-3 px-4 text-emerald-400 text-[11px]">{t.sent_at || 'Pending'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
