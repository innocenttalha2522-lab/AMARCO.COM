import React, { useState } from 'react';
import {
  Database,
  RefreshCw,
  Play,
  CheckCircle2,
  HardDrive,
  Globe,
  Lock,
  Layers,
  Search,
  Server,
  Terminal,
} from 'lucide-react';
import { DatabaseNode } from '../../types/amarco';
import { soundManager } from '../../utils/audio';

interface DatabasesViewProps {
  databases: DatabaseNode[];
  onTriggerSync: (dbId: string) => void;
  onExecuteQuery: (query: string, targetDb: string) => void;
}

export const DatabasesView: React.FC<DatabasesViewProps> = ({
  databases,
  onTriggerSync,
  onExecuteQuery,
}) => {
  const [selectedDbId, setSelectedDbId] = useState<string>(databases[0]?.id || '');
  const [sqlQuery, setSqlQuery] = useState<string>(
    'SELECT cluster_id, region, synced_records, status FROM system_nodes ORDER BY synced_records DESC LIMIT 5;'
  );
  const [queryRunning, setQueryRunning] = useState(false);
  const [queryResult, setQueryResult] = useState<any[]>([
    { cluster_id: 'pg-eu-frankfurt', region: 'Frankfurt (DE)', synced_records: '1,420,500', status: 'SYNCHRONIZED' },
    { cluster_id: 'bq-global-wh', region: 'Multi-Region Global', synced_records: '89,400,000', status: 'SYNCHRONIZED' },
    { cluster_id: 'supa-sg-edge', region: 'Singapore (SG)', synced_records: '384,000', status: 'SYNCHRONIZED' },
    { cluster_id: 'local-nvme-vault', region: 'Air-Gapped Vault', synced_records: '290,120', status: 'ENCRYPTED' },
  ]);

  const handleRunQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sqlQuery.trim() || queryRunning) return;
    setQueryRunning(true);
    soundManager.playActivate();

    setTimeout(() => {
      soundManager.playStepComplete();
      setQueryRunning(false);
      onExecuteQuery(sqlQuery, selectedDbId);
    }, 600);
  };

  const handleSyncAll = () => {
    soundManager.playActivate();
    databases.forEach((d) => onTriggerSync(d.id));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-neutral-900/60 border border-neutral-800 rounded-3xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-cyan-400 font-semibold uppercase tracking-wider">
              WORLDWIDE CLOUD DATABASE MATRIX
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">· Encrypted Tunnel Sockets</span>
          </div>
          <h1 className="text-lg font-bold text-neutral-100 mt-1">
            Distributed Cloud & Local Storage Enclave
          </h1>
          <p className="text-xs text-neutral-400 max-w-xl mt-0.5">
            AMARCO accesses worldwide cloud databases and synchronizes records directly to an offline-capable encrypted local vault with zero host IP exposure.
          </p>
        </div>

        <button
          onClick={handleSyncAll}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-neutral-950 font-semibold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all font-mono"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync All Worldwide DBs</span>
        </button>
      </div>

      {/* Database Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {databases.map((db) => {
          const isSelected = selectedDbId === db.id;
          return (
            <div
              key={db.id}
              onClick={() => setSelectedDbId(db.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                isSelected
                  ? 'bg-neutral-900 border-cyan-500/50 shadow-lg shadow-cyan-500/5'
                  : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-750'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-xs font-semibold text-neutral-200">
                    {db.provider}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{db.status.toUpperCase()}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-neutral-100">{db.name}</h3>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">{db.region}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-neutral-500 block">RECORDS</span>
                  <span className="font-semibold text-neutral-200">
                    {db.recordsCount.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">LAST SYNCED</span>
                  <span className="font-semibold text-neutral-200">{db.lastSynced}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-850 text-[11px] font-mono">
                <div className="flex items-center gap-1 text-emerald-400">
                  <Lock className="w-3 h-3" />
                  <span>WireGuard Tunnel Active</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundManager.playActivate();
                    onTriggerSync(db.id);
                  }}
                  className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                >
                  Sync Node
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Encrypted SQL Query Terminal */}
      <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-mono font-bold text-neutral-200 uppercase tracking-wider">
              ENCRYPTED CLOUD SQL TERMINAL
            </h2>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">
            TLS 1.3 + ChaCha20 Poly1305 Socket
          </span>
        </div>

        <form onSubmit={handleRunQuery} className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              className="w-full p-4 bg-neutral-950 font-mono text-xs sm:text-sm text-cyan-300 border border-neutral-800 rounded-2xl focus:outline-none focus:border-cyan-500/60 resize-none selection:bg-cyan-500/30"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-500">
              Target Node: <strong className="text-neutral-300">{databases.find((d) => d.id === selectedDbId)?.name || 'Default Node'}</strong>
            </span>

            <button
              type="submit"
              disabled={queryRunning}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 disabled:opacity-50 text-neutral-950 font-semibold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all font-mono"
            >
              {queryRunning ? (
                <span>Executing Query...</span>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Encrypted Query</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Results Table */}
        <div className="mt-4 pt-4 border-t border-neutral-800">
          <span className="text-[11px] font-mono text-neutral-400 block mb-2 uppercase">
            Query Execution Output ({queryResult.length} rows returned in 28ms)
          </span>

          <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-950">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-neutral-900/80 text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="p-3">CLUSTER ID</th>
                  <th className="p-3">REGION</th>
                  <th className="p-3">SYNCED RECORDS</th>
                  <th className="p-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850 text-neutral-300">
                {queryResult.map((row, idx) => (
                  <tr key={idx} className="hover:bg-neutral-900/40">
                    <td className="p-3 text-cyan-400">{row.cluster_id}</td>
                    <td className="p-3">{row.region}</td>
                    <td className="p-3 font-semibold">{row.synced_records}</td>
                    <td className="p-3 text-emerald-400">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
