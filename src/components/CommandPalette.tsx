import React, { useState, useEffect } from 'react';
import { Search, X, Mic, Shield, Cpu, Lock, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { ExecutionMode } from '../types/amarco';
import { soundManager } from '../utils/audio';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteCommand: (command: string, mode: ExecutionMode) => void;
  onOpenVoice: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onExecuteCommand,
  onOpenVoice,
}) => {
  const [query, setQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<ExecutionMode>('cloud-neural');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickDirectives = [
    {
      title: 'Global Social Media Campaign',
      category: 'Social Orchestration',
      prompt: 'Synthesize and broadcast high-impact viral content across X, LinkedIn, and Reddit using rotating residential proxies',
    },
    {
      title: 'Sync Worldwide Databases & Cache Local Vault',
      category: 'Data Engineering',
      prompt: 'Execute distributed synchronization across PostgreSQL Frankfurt, BigQuery, and local encrypted NVMe storage',
    },
    {
      title: 'Stealth Global Market Research Scan',
      category: 'Web Intelligence',
      prompt: 'Collect and parse unrestricted global technology insights across international sources with zero IP leakage',
    },
    {
      title: 'Purge Telemetry & Reinforce WireGuard Tunnel',
      category: 'Security & Privacy',
      prompt: 'Scramble virtual hardware fingerprints, rotate exit node to Zurich, and engage fail-safe network kill switch',
    },
  ];

  const handleSubmit = (cmdText?: string) => {
    const text = cmdText || query;
    if (!text.trim()) return;
    soundManager.playActivate();
    onExecuteCommand(text.trim(), selectedMode);
    setQuery('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl shadow-black overflow-hidden">
        
        {/* Input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-800 gap-3">
          <Search className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
            placeholder="Order AMARCO to execute complex tasks across applications..."
            className="w-full bg-transparent text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none"
          />
          <button
            onClick={() => {
              onClose();
              onOpenVoice();
            }}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-cyan-400 transition-colors"
            title="Switch to Voice Mode"
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Execution Mode Selector */}
        <div className="flex items-center justify-between px-4 py-2 bg-neutral-950/60 border-b border-neutral-800/80 text-xs">
          <span className="text-neutral-400 font-mono text-[11px]">EXECUTION RUNTIME:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedMode('cloud-neural')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedMode === 'cloud-neural'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Cloud Neural Link
            </button>
            <button
              onClick={() => setSelectedMode('local-stealth')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedMode === 'local-stealth'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Local Stealth
            </button>
            <button
              onClick={() => setSelectedMode('offline-isolated')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedMode === 'offline-isolated'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Offline Isolated
            </button>
          </div>
        </div>

        {/* Quick Directives list */}
        <div className="p-3 max-h-80 overflow-y-auto">
          <div className="text-[11px] font-mono text-neutral-500 px-2 py-1 uppercase tracking-wider">
            Suggested Autonomous Directives
          </div>
          <div className="flex flex-col gap-1 mt-1">
            {quickDirectives.map((d, i) => (
              <button
                key={i}
                onClick={() => handleSubmit(d.prompt)}
                className="group flex items-start justify-between p-2.5 text-left rounded-xl hover:bg-neutral-800/80 border border-transparent hover:border-neutral-700/60 transition-all"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-neutral-200 group-hover:text-cyan-400">
                      {d.title}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500 px-1.5 py-0.2 rounded bg-neutral-800">
                      {d.category}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-1">
                    {d.prompt}
                  </p>
                </div>
                <CornerDownLeft className="w-3.5 h-3.5 text-neutral-500 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-950 border-t border-neutral-800 text-[11px] text-neutral-500 font-mono">
          <div className="flex items-center gap-2">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Encrypted Tunnel: Zurich Node (AES-256)</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Press <kbd className="px-1 py-0.5 rounded bg-neutral-800 text-neutral-300">Enter</kbd> to execute</span>
          </div>
        </div>

      </div>
    </div>
  );
};
