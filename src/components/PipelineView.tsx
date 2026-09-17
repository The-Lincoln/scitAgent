import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Video, 
  Clock, 
  Building2, 
  Mail, 
  Phone, 
  Globe2, 
  ChevronRight,
  Sparkles,
  CheckCircle,
  ExternalLink,
  DollarSign,
  X
} from 'lucide-react';
import { Lead } from '../types';

interface PipelineViewProps {
  leads: Lead[];
  onStatusChange: (id: number, newStatus: string) => void;
  onNavigateToCapture: () => void;
}

export const PipelineView: React.FC<PipelineViewProps> = ({
  leads,
  onStatusChange,
  onNavigateToCapture,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const query = searchTerm.trim().toLowerCase();

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      query === '' ||
      lead.client_name.toLowerCase().includes(query) ||
      (lead.company_name && lead.company_name.toLowerCase().includes(query)) ||
      lead.email.toLowerCase().includes(query);

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'campaign_active':
        return 'bg-emerald-500/15 text-[#00ff87] border-emerald-500/40';
      case 'proposal_sent':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40';
      case 'won':
        return 'bg-green-500/20 text-green-300 border-green-500/50 font-bold';
      case 'lost':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/40';
      default:
        return 'bg-slate-500/15 text-slate-300 border-slate-500/40';
    }
  };

  const highlightMatch = (text: string | undefined | null) => {
    if (!text) return null;
    if (!query) return <>{text}</>;
    
    // Split on search terms safely
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query ? (
            <mark
              key={index}
              className="bg-[#00ff87]/30 text-[#00ff87] font-semibold px-0.5 rounded"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const totalValue = filteredLeads.reduce((acc, l) => acc + (l.deal_value || 0), 0);
  const highValueCount = filteredLeads.filter((l) => (l.deal_value || 0) >= 10000).length;

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Quick Metrics */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-[#111827] border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Inbound Pipeline & CRM Management</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              SQLite Table: leads
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time pipeline ingested via `api_webhook.php?action=submit_lead` and external webhooks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400">Filtered Value: </span>
            <strong className="text-[#00ff87] font-mono text-sm">${totalValue.toLocaleString()}</strong>
          </div>
          <button
            onClick={onNavigateToCapture}
            className="btn-nano px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-950 flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,135,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ Capture New Lead</span>
          </button>
        </div>
      </div>

      {/* Filter and Real-Time Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="pipeline-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by client name, company, or email address in real-time..."
            aria-label="Filter leads by client name, company, or email"
            className="w-full pl-10 pr-10 py-2.5 bg-[#0f172a] border border-slate-800 focus:border-[#00ff87] rounded-lg text-xs text-white placeholder-slate-500 outline-none transition-colors shadow-inner"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              title="Clear search filter"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Result Count Indicator */}
          <div className="hidden sm:flex items-center px-3 py-2 bg-[#0f172a] border border-slate-800 rounded-lg text-xs text-slate-400 font-mono whitespace-nowrap">
            <span>
              Showing <strong className="text-white">{filteredLeads.length}</strong> of{' '}
              <strong className="text-slate-300">{leads.length}</strong> leads
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0f172a] border border-slate-800 focus:border-[#00ff87] rounded-lg px-3 py-2.5 text-xs text-white outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="campaign_active">Campaign Active</option>
              <option value="proposal_sent">Proposal Sent</option>
              <option value="new">New</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Search Tag Pill (if active) */}
      {(searchTerm || statusFilter !== 'all') && (
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <span className="text-slate-400">Active Filters:</span>
          {searchTerm && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00ff87]/10 border border-[#00ff87]/30 text-[#00ff87] font-mono text-[11px]">
              <span>Query: "{searchTerm}"</span>
              <button
                onClick={() => setSearchTerm('')}
                className="hover:text-white"
                title="Remove query filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {statusFilter !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[11px]">
              <span>Status: {statusFilter}</span>
              <button
                onClick={() => setStatusFilter('all')}
                className="hover:text-white"
                title="Remove status filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
            className="text-[11px] text-slate-400 hover:text-slate-200 underline ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Leads Table */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Lead #</th>
                <th className="py-3 px-4">Client & Company</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Target Market</th>
                <th className="py-3 px-4">Budget / Deal Value</th>
                <th className="py-3 px-4">Service Line</th>
                <th className="py-3 px-4">Pipeline Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="w-8 h-8 text-slate-700 mb-1" />
                      <p className="text-sm font-semibold text-slate-400">
                        {searchTerm ? `No leads found matching "${searchTerm}"` : 'No leads found in this view.'}
                      </p>
                      <p className="text-xs text-slate-500 max-w-sm">
                        {searchTerm
                          ? 'Try searching by a different client name, company name, or email address.'
                          : 'Leads captured via form submissions or webhooks will appear here.'}
                      </p>
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="mt-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700 transition-colors"
                        >
                          Clear Search Filter
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const isHighVal = (lead.deal_value || 0) >= 10000;
                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-900/50 transition-colors group cursor-pointer"
                      onClick={() => setSelectedLead(lead)}
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        #{lead.id}
                      </td>

                      {/* Client & Company */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white group-hover:text-[#00ff87] transition-colors">
                          {highlightMatch(lead.client_name)}
                        </div>
                        <div className="text-slate-400 flex items-center gap-1 mt-0.5 text-[11px]">
                          <Building2 className="w-3 h-3 text-slate-500" />
                          <span>{highlightMatch(lead.company_name) || 'Enterprise'}</span>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-300 flex items-center gap-1 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span className="truncate max-w-[150px]">{highlightMatch(lead.email)}</span>
                        </div>
                        {lead.phone && (
                          <div className="text-slate-500 flex items-center gap-1 mt-0.5 text-[11px]">
                            <Phone className="w-3 h-3" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Country */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Globe2 className="w-3.5 h-3.5 text-slate-500" />
                          <span>{lead.country}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {lead.campaign_source}
                        </div>
                      </td>

                      {/* Deal Value */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className={`font-bold text-sm ${isHighVal ? 'text-amber-400' : 'text-[#00ff87]'}`}>
                          ${(lead.deal_value || 0).toLocaleString()}
                        </div>
                        {isHighVal ? (
                          <div className="inline-flex items-center gap-1 text-[10px] text-amber-300 px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/30 mt-1">
                            <Video className="w-2.5 h-2.5" />
                            <span>CEO Protocol</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 text-[10px] text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30 mt-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>&lt; 2h SLA</span>
                          </div>
                        )}
                      </td>

                      {/* Service Line */}
                      <td className="py-3.5 px-4 text-slate-300">
                        <span className="truncate block max-w-[180px]" title={lead.service_line}>
                          {lead.service_line}
                        </span>
                      </td>

                      {/* Status dropdown */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          onChange={(e) => onStatusChange(lead.id, e.target.value)}
                          className={`text-xs px-2.5 py-1 rounded-full border outline-none font-medium cursor-pointer ${getStatusBadge(
                            lead.status
                          )}`}
                        >
                          <option value="campaign_active" className="bg-slate-900 text-slate-200">
                            Campaign Active
                          </option>
                          <option value="proposal_sent" className="bg-slate-900 text-slate-200">
                            Proposal Sent
                          </option>
                          <option value="new" className="bg-slate-900 text-slate-200">
                            New
                          </option>
                          <option value="won" className="bg-slate-900 text-slate-200">
                            Won
                          </option>
                          <option value="lost" className="bg-slate-900 text-slate-200">
                            Lost
                          </option>
                        </select>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="px-2 py-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedLead(null)}
        >
          <div 
            className="bg-[#111827] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <span className="text-xs font-mono text-[#00ff87]">LEAD RECORD #{selectedLead.id}</span>
                <h3 className="text-xl font-bold text-white mt-0.5">{selectedLead.client_name}</h3>
                <p className="text-xs text-slate-400">{selectedLead.company_name || 'Enterprise'}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-white text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div>
                  <span className="text-slate-400">Deal Value:</span>
                  <div className="text-base font-bold font-mono text-[#00ff87]">
                    ${(selectedLead.deal_value || 0).toLocaleString()} USD
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Protocol Triggered:</span>
                  <div className="text-sm font-semibold text-slate-200 mt-0.5">
                    {(selectedLead.deal_value || 0) >= 10000 ? (
                      <span className="text-amber-400 flex items-center gap-1">
                        <Video className="w-3.5 h-3.5" />
                        CEO Video (Md Shoeb Lincoln)
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Sub-2h SLA Proposal Engine
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Work Email:</span>
                  <span className="text-white font-mono">{selectedLead.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Phone:</span>
                  <span className="text-white font-mono">{selectedLead.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Country / Market:</span>
                  <span className="text-white">{selectedLead.country}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Service Line:</span>
                  <span className="text-white font-medium">{selectedLead.service_line}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Campaign Source:</span>
                  <span className="text-slate-300">{selectedLead.campaign_source}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Logged At:</span>
                  <span className="text-slate-400 font-mono">{selectedLead.created_at}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/20 border border-[#00ff87]/30 text-emerald-200">
                <div className="flex items-center gap-1.5 font-semibold text-[#00ff87] mb-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>October 7-Touch Email Sequence Queued</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Touch 1 was dispatched immediately to {selectedLead.email}. Future drip triggers are scheduled according to SCITBD enterprise cadence.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
