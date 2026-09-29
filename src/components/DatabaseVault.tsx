import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  RefreshCw, 
  Plus, 
  Download, 
  ShieldCheck, 
  Lock, 
  Eye, 
  Layers, 
  ExternalLink,
  CheckCircle2,
  FileSpreadsheet,
  Globe,
  Filter
} from 'lucide-react';
import { DatabaseRecord } from '../types';

interface DatabaseVaultProps {
  records: DatabaseRecord[];
  onSyncDatabase: () => void;
  onAddRecord: (record: Partial<DatabaseRecord>) => void;
  isSyncing: boolean;
}

export const DatabaseVault: React.FC<DatabaseVaultProps> = ({
  records,
  onSyncDatabase,
  onAddRecord,
  isSyncing,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeRecord, setActiveRecord] = useState<DatabaseRecord | null>(records[0] || null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New record form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Market Intelligence');
  const [newSource, setNewSource] = useState('Worldwide Web Node');
  const [newDetails, setNewDetails] = useState('');
  const [newConfidentiality, setNewConfidentiality] = useState<'Top-Secret' | 'Restricted' | 'Encrypted'>('Restricted');

  const categories = [
    'all',
    'Market Intelligence',
    'Campaign Operations',
    'Security Enclave',
    'Unrestricted Harvest',
  ];

  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || rec.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `AMARCO-Cloud-Database-${Date.now()}.json`);
    a.click();
  };

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddRecord({
      title: newTitle,
      category: newCategory,
      source: newSource,
      details: newDetails,
      confidentiality: newConfidentiality,
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewDetails('');
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Top Banner */}
      <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-5 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-neutral-800 border border-neutral-700 text-cyan-400">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-neutral-100 uppercase">
              Worldwide Cloud Database & Encrypted Local Vault
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Securely query, synchronize, and persist operational records, intelligence reports, and campaign manifests globally.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSyncDatabase}
            disabled={isSyncing}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Trigger differential synchronization between local vault and worldwide cloud cluster"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Synchronizing Nodes...' : 'Sync Cloud DB'}</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Vault</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Insert Record</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search records, entities, ciphers, or intelligence vectors..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-neutral-950/80 border border-neutral-800 focus:border-cyan-500 text-xs text-neutral-100 placeholder:text-neutral-500 outline-none"
          />
        </div>

        {/* Category buttons */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-lg border border-neutral-800 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap capitalize ${
                selectedCategory === cat
                  ? 'bg-neutral-800 text-cyan-400 border border-neutral-700 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {cat === 'all' ? 'All Entities' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Master Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Records List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-2.5 max-h-[560px] overflow-y-auto pr-1">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((rec) => {
              const isSelected = activeRecord?.id === rec.id;
              return (
                <div
                  key={rec.id}
                  onClick={() => setActiveRecord(rec)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-neutral-900 border-cyan-500/60 shadow-md'
                      : 'bg-neutral-950/60 border-neutral-800/80 hover:bg-neutral-900/60 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-cyan-400 text-[11px]">{rec.id}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        rec.confidentiality === 'Top-Secret'
                          ? 'bg-rose-950/40 text-rose-300 border-rose-800/50'
                          : 'bg-neutral-900 text-neutral-300 border-neutral-700'
                      }`}
                    >
                      {rec.confidentiality}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-neutral-200 line-clamp-1">
                    {rec.title}
                  </h4>

                  <p className="text-[11px] text-neutral-400 line-clamp-2">
                    {rec.details}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60 text-[10px] text-neutral-500 font-mono">
                    <span className="truncate max-w-[150px]">{rec.source}</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {rec.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-neutral-500 font-mono">
              No matching records found in cloud database.
            </div>
          )}
        </div>

        {/* Record Inspector (7 cols) */}
        <div className="lg:col-span-7">
          {activeRecord ? (
            <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-5 backdrop-blur-md flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-cyan-400">{activeRecord.id}</span>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase">
                      · {activeRecord.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-100 mt-1">
                    {activeRecord.title}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-neutral-400 font-mono block">
                    Updated: {new Date(activeRecord.updatedAt).toLocaleTimeString()}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    SHA256 Encrypted Block Verified
                  </span>
                </div>
              </div>

              {/* Source & Confidentiality Bar */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80">
                  <span className="text-[10px] text-neutral-500 font-mono block uppercase">Ingestion Source</span>
                  <span className="text-xs text-neutral-200 font-medium truncate block">{activeRecord.source}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80">
                  <span className="text-[10px] text-neutral-500 font-mono block uppercase">Security Level</span>
                  <span className="text-xs text-amber-400 font-mono block">{activeRecord.confidentiality}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80">
                  <span className="text-[10px] text-neutral-500 font-mono block uppercase">Replication State</span>
                  <span className="text-xs text-emerald-400 font-mono block">Synced Globally</span>
                </div>
              </div>

              {/* Record Summary / Narrative Details */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                  Operational Details & Findings
                </span>
                <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 leading-relaxed font-sans select-text">
                  {activeRecord.details}
                </div>
              </div>

              {/* Metrics table if available */}
              {activeRecord.metrics && Object.keys(activeRecord.metrics).length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                    Associated Vector Telemetry
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(activeRecord.metrics).map(([k, v]) => (
                      <div key={k} className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/70 font-mono text-xs">
                        <span className="text-[10px] text-neutral-500 block truncate">{k}</span>
                        <span className="text-neutral-200 font-medium truncate block">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-10 flex flex-col items-center justify-center text-center gap-2">
              <Database className="w-8 h-8 text-neutral-600" />
              <p className="text-xs text-neutral-400">Select a record from the database vault to inspect details.</p>
            </div>
          )}
        </div>
      </div>

      {/* Insert Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 max-w-lg w-full flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-semibold text-neutral-100 uppercase tracking-wide">
                Insert Record into Cloud Database
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-100 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-neutral-300">Record Title:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Q4 Global Market Vector Report"
                  required
                  className="h-10 px-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-neutral-300">Category:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="h-10 px-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:border-cyan-500 outline-none"
                  >
                    <option value="Market Intelligence">Market Intelligence</option>
                    <option value="Campaign Operations">Campaign Operations</option>
                    <option value="Security Enclave">Security Enclave</option>
                    <option value="Unrestricted Harvest">Unrestricted Harvest</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-neutral-300">Confidentiality:</label>
                  <select
                    value={newConfidentiality}
                    onChange={(e) => setNewConfidentiality(e.target.value as any)}
                    className="h-10 px-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:border-cyan-500 outline-none"
                  >
                    <option value="Top-Secret">Top-Secret</option>
                    <option value="Restricted">Restricted</option>
                    <option value="Encrypted">Encrypted</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-neutral-300">Source:</label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="e.g. AMARCO Crawler Node"
                  className="h-10 px-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-neutral-300">Details / Dataset:</label>
                <textarea
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  placeholder="Data payload, intelligence notes, or parameters"
                  rows={4}
                  className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white"
                >
                  Commit to Cloud Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
