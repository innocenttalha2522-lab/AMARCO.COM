import React, { useState } from 'react';
import {
  FileText,
  Download,
  ShieldCheck,
  Search,
  CheckCircle,
  Clock,
  Layers,
  Hash,
  ExternalLink,
} from 'lucide-react';
import { AuditLogEntry } from '../../types/amarco';
import { soundManager } from '../../utils/audio';

interface AuditLogViewProps {
  logs: AuditLogEntry[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.commandSnippet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.hashSignature.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.tunnelNode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || log.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const exportAuditLog = () => {
    soundManager.playActivate();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `amarco-audit-ledger-${Date.now()}.json`);
    a.click();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-neutral-900/60 border border-neutral-800 rounded-3xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-cyan-400 font-semibold uppercase tracking-wider">
              CRYPTOGRAPHIC OPERATION LEDGER
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">· Merkle Chain Verified</span>
          </div>
          <h1 className="text-lg font-bold text-neutral-100 mt-1">
            Immutable Audit Trail & Execution Receipts
          </h1>
          <p className="text-xs text-neutral-400 max-w-xl mt-0.5">
            Every autonomous directive executed by AMARCO is timestamped, cryptographically sealed, and logged locally with complete confidentiality.
          </p>
        </div>

        <button
          onClick={exportAuditLog}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono font-semibold rounded-xl border border-neutral-700 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export JSON Ledger</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-neutral-900 border border-neutral-800 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search commands, hashes, or nodes..."
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['all', 'SUCCESS', 'SECURE_COMPLETED', 'ISOLATED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                filterStatus === st
                  ? 'bg-neutral-800 text-cyan-400 border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900 shadow-xl">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
            <tr>
              <th className="p-3.5">TIME (UTC)</th>
              <th className="p-3.5">DIRECTIVE SNIPPET</th>
              <th className="p-3.5">RUNTIME</th>
              <th className="p-3.5">TUNNEL NODE</th>
              <th className="p-3.5">LATENCY</th>
              <th className="p-3.5">STATUS</th>
              <th className="p-3.5">HASH SIGNATURE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-850 text-neutral-300">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-neutral-850/50 transition-colors">
                <td className="p-3.5 text-neutral-400 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </td>
                <td className="p-3.5 font-sans font-medium text-neutral-200 max-w-xs truncate">
                  {log.commandSnippet}
                </td>
                <td className="p-3.5 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-300">
                    {log.executionMode}
                  </span>
                </td>
                <td className="p-3.5 text-neutral-300 whitespace-nowrap">
                  {log.tunnelNode}
                </td>
                <td className="p-3.5 text-cyan-400 whitespace-nowrap">
                  {log.durationMs}ms
                </td>
                <td className="p-3.5 whitespace-nowrap">
                  <span className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{log.status}</span>
                  </span>
                </td>
                <td className="p-3.5 text-neutral-500 whitespace-nowrap font-mono text-[11px]">
                  {log.hashSignature}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
