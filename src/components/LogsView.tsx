import React, { useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  ShieldAlert, 
  Video, 
  Terminal,
  Zap
} from 'lucide-react';
import { OperationalLog } from '../types';

interface LogsViewProps {
  logs: OperationalLog[];
}

export const LogsView: React.FC<LogsViewProps> = ({ logs }) => {
  const [filter, setFilter] = useState<'all' | 'ESCALATED' | 'SUCCESS'>('all');

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.status === filter;
  });

  const escalatedCount = logs.filter((l) => l.status === 'ESCALATED').length;
  const successCount = logs.filter((l) => l.status === 'SUCCESS').length;

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
              SQLite Table: operational_logs
            </span>
            <span className="text-xs text-amber-400 flex items-center gap-1 font-semibold">
              <Video className="w-3.5 h-3.5" />
              $10,000+ CEO Escalation Engine
            </span>
          </div>
          <h2 className="text-lg font-bold text-white">Operational & SLA Escalation Audit Trail</h2>
          <p className="text-xs text-slate-400">
            Immutable SQLite logs tracking sub-2-hour SLA dispatches, high-value founder alerts, and external webhook deliveries.
          </p>
        </div>

        {/* Quick counters */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Total Logs: </span>
            <strong className="text-white">{logs.length}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300">
            <span>Escalations: </span>
            <strong>{escalatedCount}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-[#00ff87]">
            <span>Success: </span>
            <strong>{successCount}</strong>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400" />
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filter === 'all'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All Events ({logs.length})
        </button>
        <button
          onClick={() => setFilter('ESCALATED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
            filter === 'ESCALATED'
              ? 'bg-amber-950/60 text-amber-300 border border-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
              : 'text-slate-400 hover:text-amber-400'
          }`}
        >
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          <span>High-Value Escalations ({escalatedCount})</span>
        </button>
        <button
          onClick={() => setFilter('SUCCESS')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
            filter === 'SUCCESS'
              ? 'bg-emerald-950/60 text-[#00ff87] border border-emerald-500/60'
              : 'text-slate-400 hover:text-emerald-400'
          }`}
        >
          <CheckCircle2 className="w-3 h-3 text-[#00ff87]" />
          <span>Standard Dispatches ({successCount})</span>
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Log #</th>
                <th className="py-3 px-4">Engine / Block Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action Taken & Telemetry</th>
                <th className="py-3 px-4 text-right">Executed At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No operational logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isEscalated = log.status === 'ESCALATED';
                  return (
                    <tr
                      key={log.id}
                      className={`hover:bg-slate-900/40 transition-colors ${
                        isEscalated ? 'bg-amber-950/10' : ''
                      }`}
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        #{log.id}
                      </td>

                      {/* Block Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          {isEscalated ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          ) : (
                            <Zap className="w-3.5 h-3.5 text-[#00ff87] shrink-0" />
                          )}
                          <span>{log.block_name}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 font-mono">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            isEscalated
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                              : log.status === 'SUCCESS'
                              ? 'bg-emerald-500/15 text-[#00ff87] border border-emerald-500/40'
                              : 'bg-rose-500/15 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {isEscalated ? 'ESCALATED' : log.status}
                        </span>
                      </td>

                      {/* Action Taken */}
                      <td className="py-3.5 px-4 text-slate-200 leading-relaxed font-mono text-[11px]">
                        {log.action_taken}
                      </td>

                      {/* Executed At */}
                      <td className="py-3.5 px-4 text-slate-400 text-right font-mono text-[11px] whitespace-nowrap">
                        {log.executed_at}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
