import React, { useState } from 'react';
import {
  Cpu,
  Play,
  Plus,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  Zap,
  ArrowRight,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { AutomationWorkflow } from '../../types/amarco';
import { soundManager } from '../../utils/audio';

interface WorkflowsViewProps {
  workflows: AutomationWorkflow[];
  onTriggerWorkflow: (workflow: AutomationWorkflow) => void;
  onAddWorkflow: (workflow: AutomationWorkflow) => void;
}

export const WorkflowsView: React.FC<WorkflowsViewProps> = ({
  workflows,
  onTriggerWorkflow,
  onAddWorkflow,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'social' | 'database' | 'intelligence' | 'security' | 'desktop'>('social');
  const [newTrigger, setNewTrigger] = useState('Voice command or scheduled trigger');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: AutomationWorkflow = {
      id: `wf-${Date.now()}`,
      title: newTitle.trim(),
      category: selectedCategory,
      description: newDescription.trim() || 'Autonomous cross-application execution sequence managed by AMARCO.',
      trigger: newTrigger.trim(),
      appsInvolved: ['Encrypted Tunnel', 'Local FS', 'Cloud DB'],
      autoExecute: true,
      runsCount: 0,
      lastRunTime: 'Just now',
      status: 'active',
      stepsPreview: [
        'Initialize stealth routing and scrub identity',
        'Process input directives across local & cloud APIs',
        'Verify SHA-256 integrity and commit results',
      ],
    };

    onAddWorkflow(created);
    soundManager.playTaskSuccess();
    setShowModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-neutral-900/60 border border-neutral-800 rounded-3xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-cyan-400 font-semibold uppercase tracking-wider">
              AUTONOMOUS WORKFLOW AUTOMATION
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">· Zero Manual Intervention</span>
          </div>
          <h1 className="text-lg font-bold text-neutral-100 mt-1">
            Cross-Application Execution Pipelines
          </h1>
          <p className="text-xs text-neutral-400 max-w-xl mt-0.5">
            AMARCO orchestrates multi-step automations connecting social platforms, global databases, local encrypted storage, and network privacy shields.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-neutral-950 font-semibold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all font-mono"
        >
          <Plus className="w-4 h-4" />
          <span>New Workflow</span>
        </button>
      </div>

      {/* Grid of Workflows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workflows.map((wf) => (
          <div
            key={wf.id}
            className="flex flex-col justify-between p-5 bg-neutral-900 border border-neutral-800 hover:border-neutral-700/80 rounded-2xl transition-all space-y-4"
          >
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-cyan-300 uppercase">
                  {wf.category}
                </span>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{wf.status.toUpperCase()}</span>
                </div>
              </div>

              {/* Title & Description */}
              <h2 className="text-sm font-bold text-neutral-100 mb-1">
                {wf.title}
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                {wf.description}
              </p>

              {/* Steps preview */}
              <div className="space-y-1.5 p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                <span className="text-[10px] font-mono text-neutral-500 block uppercase">
                  Execution Sequence Preview:
                </span>
                {wf.stepsPreview.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] text-neutral-300">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                    <span className="truncate">{s}</span>
                  </div>
                ))}
              </div>

              {/* Apps involved */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                <span className="text-[10px] font-mono text-neutral-500">APPS:</span>
                {wf.appsInvolved.map((app, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800/80 text-neutral-300 border border-neutral-700/60"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom stats & trigger button */}
            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
              <div className="text-[11px] font-mono text-neutral-400">
                <span>Runs: <strong className="text-neutral-200">{wf.runsCount}</strong></span>
                <span className="mx-1.5">·</span>
                <span>Last: <strong className="text-neutral-200">{wf.lastRunTime}</strong></span>
              </div>

              <button
                onClick={() => {
                  soundManager.playActivate();
                  onTriggerWorkflow(wf);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-cyan-500 hover:text-neutral-950 text-neutral-200 text-xs font-mono rounded-xl border border-neutral-700 hover:border-cyan-400 transition-all font-semibold"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Run Now</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Workflow Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-neutral-100 font-mono mb-1">
              CREATE AUTONOMOUS WORKFLOW
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              Configure cross-application execution directives for AMARCO to run automatically.
            </p>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">
                  WORKFLOW TITLE:
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Autonomous Global Market Sync"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">
                  CATEGORY:
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e: any) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="social">Social Media Orchestration</option>
                  <option value="database">Database & Cloud Synchronization</option>
                  <option value="intelligence">Stealth Web Intelligence</option>
                  <option value="security">Security & Privacy Shield</option>
                  <option value="desktop">Local Desktop Automation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">
                  EXECUTION TRIGGER:
                </label>
                <input
                  type="text"
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                  placeholder="e.g. Voice order 'Sync all databases'"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">
                  DESCRIPTION:
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Explain what AMARCO executes..."
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white rounded-xl bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-neutral-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-colors font-mono"
                >
                  Save & Arm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
