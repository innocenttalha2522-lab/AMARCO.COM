import React, { useState } from 'react';
import { 
  Zap, 
  Play, 
  Plus, 
  Clock, 
  Layers, 
  ShieldCheck, 
  Globe, 
  Cpu, 
  CheckCircle2, 
  Database, 
  SlidersHorizontal,
  ArrowRight,
  Terminal
} from 'lucide-react';
import { WorkflowRecipe } from '../types';

interface WorkflowAutomatorProps {
  onRunWorkflow: (commandPrompt: string) => void;
  isExecuting: boolean;
}

export const WorkflowAutomator: React.FC<WorkflowAutomatorProps> = ({
  onRunWorkflow,
  isExecuting,
}) => {
  const [recipes, setRecipes] = useState<WorkflowRecipe[]>([
    {
      id: 'wf-1',
      name: 'Omni-Channel Social Syndication Pipeline',
      description: 'Fully autonomous multi-platform campaign production, stealth hop routing, and scheduled syndication across X, LinkedIn, and Reddit without manual intervention.',
      category: 'Social Automation',
      triggerType: 'Voice Command',
      commandPrompt: 'Execute seamless omni-channel campaign syndication for AMARCO sovereign rollout across X, LinkedIn, and Reddit with targeted engagement hooks and zero origin exposure.',
      platforms: ['X (Twitter)', 'LinkedIn', 'Reddit'],
      estimatedRuntime: '1.2s',
      stealthLevel: 'Maximum Stealth',
      icon: 'globe',
    },
    {
      id: 'wf-2',
      name: 'Worldwide Cloud Database Continuous Sync',
      description: 'Synchronizes local encrypted vault records with worldwide distributed cloud nodes through ChaCha20-Poly1305 encrypted tunnels.',
      category: 'Intelligence',
      triggerType: 'Scheduled Cron',
      commandPrompt: 'Perform bidirectional differential synchronization between local sovereign database vault and worldwide cloud nodes. Verify SHA-256 block integrity.',
      platforms: ['Local Encrypted DB', 'Cloud Mesh Alpha'],
      estimatedRuntime: '0.8s',
      stealthLevel: 'Maximum Stealth',
      icon: 'database',
    },
    {
      id: 'wf-3',
      name: 'Sovereign Executive Intelligence Brief',
      description: 'Synthesizes competitive market dynamics, global unrestricted tech reports, and system telemetry into an executive brief with audio readout.',
      category: 'Intelligence',
      triggerType: 'Autonomous Event',
      commandPrompt: 'Generate high-accuracy executive market intelligence briefing on autonomous multi-agent computing and enterprise privacy paradigms.',
      platforms: ['Global Cloud', 'Local Daemon', 'Voice Synthesis'],
      estimatedRuntime: '1.5s',
      stealthLevel: 'High',
      icon: 'zap',
    },
    {
      id: 'wf-4',
      name: 'Local Air-Gap Security Audit & Log Purge',
      description: 'Conducts an exhaustive local security review, validates zero socket leakage, randomizes ephemeral keypairs, and produces cryptographic seal.',
      category: 'Security',
      triggerType: 'Voice Command',
      commandPrompt: 'Perform sovereign local desktop security audit. Verify air-gap readiness, scrub transient metadata, and rotate tunnel ephemeral keys.',
      platforms: ['Local Operating System', 'WireGuard Enclave'],
      estimatedRuntime: '0.4s',
      stealthLevel: 'Airgap',
      icon: 'shield',
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const [newCategory, setNewCategory] = useState<'Intelligence' | 'Social Automation' | 'Local Operations' | 'Security'>('Local Operations');

  const handleCreateRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrompt.trim()) return;

    const newRecipe: WorkflowRecipe = {
      id: `wf-${Date.now()}`,
      name: newTitle,
      description: newDescription || 'Autonomous custom pipeline triggered by AMARCO.',
      category: newCategory,
      triggerType: 'Voice Command',
      commandPrompt: newPrompt,
      platforms: ['Local Desktop', 'Encrypted Relay'],
      estimatedRuntime: '0.9s',
      stealthLevel: 'Maximum Stealth',
      icon: 'zap',
    };

    setRecipes([newRecipe, ...recipes]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
    setNewPrompt('');
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-5 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-neutral-800 border border-neutral-700 text-cyan-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-neutral-100 uppercase">
              Autonomous Unattended Workflow Engine
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Zero-intervention multi-step task automation across applications, local system daemons, and cloud networks.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Automated Recipe</span>
        </button>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 backdrop-blur-md flex flex-col justify-between gap-4 group hover:border-neutral-700 transition-all"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-cyan-400">
                    {recipe.category === 'Security' ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    ) : recipe.category === 'Social Automation' ? (
                      <Globe className="w-4 h-4 text-blue-400" />
                    ) : recipe.category === 'Intelligence' ? (
                      <Database className="w-4 h-4 text-violet-400" />
                    ) : (
                      <Cpu className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-100 group-hover:text-cyan-300 transition-colors">
                      {recipe.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono mt-0.5">
                      <span>{recipe.category}</span>
                      <span aria-hidden="true" className="text-neutral-600">·</span>
                      <span className="text-neutral-300">{recipe.triggerType}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                  {recipe.stealthLevel}
                </span>
              </div>

              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                {recipe.description}
              </p>

              {/* Command order preview */}
              <div className="p-2.5 rounded-lg bg-neutral-950/80 border border-neutral-800/80 text-[11px] font-mono text-neutral-400 flex items-start gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span className="text-neutral-300 line-clamp-2">{recipe.commandPrompt}</span>
              </div>

              {/* Target Platforms List */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {recipe.platforms.map((p) => (
                  <span
                    key={p}
                    className="text-[10px] font-mono text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Run Button */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-800/80">
              <span className="text-[11px] text-neutral-500 font-mono">
                Est. Latency: {recipe.estimatedRuntime}
              </span>

              <button
                onClick={() => onRunWorkflow(recipe.commandPrompt)}
                disabled={isExecuting}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isExecuting
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    : 'bg-neutral-800 hover:bg-cyan-600 text-neutral-100 hover:text-white border border-neutral-700 hover:border-cyan-500'
                }`}
              >
                <Play className="w-3 h-3 text-cyan-400 group-hover:text-white fill-current" />
                <span>Execute Unattended</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 max-w-lg w-full flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-semibold text-neutral-100 uppercase tracking-wide">
                Create Autonomous Workflow Recipe
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-neutral-400 hover:text-neutral-100 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRecipe} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-neutral-300">Recipe Name:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Real-Time Competitor Sweep & Database Sync"
                  required
                  className="h-10 px-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-neutral-300">Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="h-10 px-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:border-cyan-500 outline-none"
                >
                  <option value="Social Automation">Social Automation</option>
                  <option value="Intelligence">Intelligence</option>
                  <option value="Local Operations">Local Operations</option>
                  <option value="Security">Security</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-neutral-300">Description:</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Summary of automated actions taken by AMARCO"
                  className="h-10 px-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-neutral-300">
                  Execution Command Prompt (Instructions for AMARCO):
                </label>
                <textarea
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  placeholder="Exact prompt that AMARCO decomposes and executes autonomously"
                  required
                  rows={3}
                  className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white"
                >
                  Save Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
