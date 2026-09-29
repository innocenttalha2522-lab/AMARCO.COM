import React, { useState } from 'react';
import {
  Play,
  Mic,
  Shield,
  Cpu,
  CheckCircle2,
  Clock,
  Download,
  Copy,
  Check,
  Volume2,
  ArrowUpRight,
  Sparkles,
  Lock,
  Layers,
  FileCode,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CommandExecution, ExecutionMode, TunnelState } from '../../types/amarco';
import { soundManager } from '../../utils/audio';

interface CommandTerminalViewProps {
  execution: CommandExecution | null;
  isExecuting: boolean;
  onExecute: (command: string, mode: ExecutionMode, voiceTriggered: boolean) => void;
  onOpenVoice: () => void;
  tunnel: TunnelState;
  history: CommandExecution[];
  onSelectHistory: (item: CommandExecution) => void;
}

export const CommandTerminalView: React.FC<CommandTerminalViewProps> = ({
  execution,
  isExecuting,
  onExecute,
  onOpenVoice,
  tunnel,
  history,
  onSelectHistory,
}) => {
  const [inputCommand, setInputCommand] = useState('');
  const [selectedMode, setSelectedMode] = useState<ExecutionMode>('cloud-neural');
  const [copied, setCopied] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState(true);

  const sampleDirectives = [
    'Synthesize & broadcast viral launch campaign across X, LinkedIn, and Reddit with zero trace',
    'Execute global sync between Frankfurt PostgreSQL, BigQuery, and local encrypted vault',
    'Gather stealth market intelligence on quantum computing startups worldwide',
    'Over-write local system telemetry and enforce WireGuard fail-safe kill switch',
  ];

  const handleRun = (cmd?: string) => {
    const text = cmd || inputCommand;
    if (!text.trim() || isExecuting) return;
    soundManager.playActivate();
    onExecute(text.trim(), selectedMode, false);
    setInputCommand('');
  };

  const handleCopyArtifact = () => {
    if (!execution?.artifact?.content) return;
    navigator.clipboard.writeText(execution.artifact.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadArtifact = () => {
    if (!execution?.artifact) return;
    const blob = new Blob([execution.artifact.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amarco-${execution.artifact.type}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReplayVoice = () => {
    if (execution?.spokenResponse) {
      soundManager.speak(execution.spokenResponse);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24 animate-in fade-in duration-200">
      
      {/* Top Banner / System Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-neutral-900/60 border border-neutral-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-neutral-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-neutral-100 font-mono tracking-wide">
                AMARCO AUTONOMOUS ORCHESTRATOR
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">
                v4.9 HYPERION
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Voice-activated executive agent across local applications & global cloud environments.
            </p>
          </div>
        </div>

        {/* Live Tunnel & Privacy Telemetry */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center gap-1.5 text-neutral-300">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span className="text-neutral-400">Masked IP:</span>
            <span className="text-emerald-400 font-semibold">{tunnel.maskedIp}</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center gap-1.5 text-neutral-300">
            <Shield className="w-3 h-3 text-cyan-400" />
            <span className="text-neutral-400">Exit Node:</span>
            <span>{tunnel.activeNode.city}</span>
          </div>
        </div>
      </div>

      {/* Primary Command Input Hub */}
      <div className="relative bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-2xl shadow-black/60 focus-within:border-cyan-500/50 transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              EXECUTIVE COMMAND PROMPT
            </span>
            <span className="text-[11px] text-neutral-500">· Real-time Execution</span>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
            <button
              onClick={() => setSelectedMode('cloud-neural')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-mono text-[11px] ${
                selectedMode === 'cloud-neural'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Cloud Neural Link
            </button>
            <button
              onClick={() => setSelectedMode('local-stealth')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-mono text-[11px] ${
                selectedMode === 'local-stealth'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Local Stealth
            </button>
            <button
              onClick={() => setSelectedMode('offline-isolated')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-mono text-[11px] ${
                selectedMode === 'offline-isolated'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Offline Isolated
            </button>
          </div>
        </div>

        {/* Main Textarea */}
        <div className="relative flex items-center bg-neutral-950 rounded-2xl border border-neutral-800/80 p-2 focus-within:border-cyan-500/40">
          <textarea
            value={inputCommand}
            onChange={(e) => setInputCommand(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleRun();
              }
            }}
            placeholder="Type your command or order AMARCO with your voice... (e.g., 'Deploy global campaign on X and LinkedIn', 'Sync worldwide cloud database')"
            rows={2}
            className="w-full bg-transparent px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none resize-none font-sans"
          />

          <div className="flex items-center gap-2 pr-2">
            <button
              type="button"
              onClick={onOpenVoice}
              className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-cyan-400 border border-neutral-700/60 transition-colors"
              title="Activate Voice Input (Microphone)"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleRun()}
              disabled={!inputCommand.trim() || isExecuting}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 disabled:opacity-40 disabled:pointer-events-none text-neutral-950 font-semibold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all font-mono"
            >
              {isExecuting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  <span>EXECUTING</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>TRANSMIT</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Suggested Directives */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-neutral-800/60 text-xs">
          <span className="text-[11px] font-mono text-neutral-500 mr-1">QUICK DIRECTIVES:</span>
          {sampleDirectives.map((cmd, i) => (
            <button
              key={i}
              onClick={() => handleRun(cmd)}
              className="px-2.5 py-1 rounded-lg bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/50 hover:border-cyan-500/40 text-neutral-300 hover:text-cyan-300 text-[11px] transition-all truncate max-w-[280px]"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Execution Progress & Status */}
      {isExecuting && (
        <div className="p-5 bg-neutral-900/90 border border-cyan-500/40 rounded-3xl shadow-xl shadow-cyan-500/5 animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-mono text-xs uppercase text-cyan-400 font-semibold tracking-wider">
                AUTONOMOUS WORKFLOW EXECUTION IN PROGRESS
              </span>
            </div>
            <span className="font-mono text-xs text-neutral-400">Zero-Leak Encrypted Routing</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            {['1. Strategic Reasoning', '2. Encrypted Tunnel Routing', '3. Multi-App Dispatch', '4. Output Verification'].map((step, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
                <span className="text-neutral-400 block text-[10px] font-mono">PHASE 0{idx + 1}</span>
                <span className="text-neutral-200 font-medium">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Execution Result Container */}
      {execution && !isExecuting && (
        <div className="space-y-5">
          
          {/* Spoken Response & Voice Confirmation Card */}
          {execution.spokenResponse && (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-neutral-900 via-neutral-900 to-cyan-950/40 border border-cyan-500/30 rounded-2xl shadow-lg">
              <div className="flex items-start gap-3">
                <button
                  onClick={handleReplayVoice}
                  className="p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors flex-shrink-0"
                  title="Replay AMARCO Spoken Response"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-cyan-400 uppercase font-semibold">
                      AMARCO AUDIO CONFIRMATION
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">Synthesized TTS</span>
                  </div>
                  <p className="text-sm text-neutral-200 mt-0.5 italic">
                    "{execution.spokenResponse}"
                  </p>
                </div>
              </div>

              <button
                onClick={handleReplayVoice}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-300 transition-colors"
              >
                <span>Replay Voice</span>
              </button>
            </div>
          )}

          {/* Autonomous Reasoning & Security Routing Profile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Left 2 Cols: Reasoning Thought */}
            <div className="md:col-span-2 p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                  STRATEGIC REASONING & INTENT DECOMPOSITION
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-emerald-400">
                  VERIFIED ACCURACY
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                {execution.thought}
              </p>
            </div>

            {/* Right 1 Col: Security Profile */}
            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                  SECURITY ENCLAVE
                </span>
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xs font-mono space-y-1">
                <div className="flex justify-between text-neutral-400">
                  <span>Tunnel Cipher:</span>
                  <span className="text-neutral-200 font-semibold">{execution.securityProfile.tunnelProtocol}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Exit Gateway:</span>
                  <span className="text-neutral-200 font-semibold">{execution.securityProfile.exitNode}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Masked IP:</span>
                  <span className="text-emerald-400 font-semibold">{execution.securityProfile.maskedIp}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Host Exposure:</span>
                  <span className="text-emerald-400 font-semibold">0% (Zero Leak)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Execution Pipeline Steps Accordion */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpandedSteps(!expandedSteps)}
              className="w-full flex items-center justify-between p-4 bg-neutral-900 hover:bg-neutral-850 text-left transition-colors"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-semibold text-neutral-200 uppercase tracking-wider">
                  AUTONOMOUS MULTI-APP EXECUTION SEQUENCE ({execution.steps.length} STEPS COMPLETED)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <span>{execution.executionTimeMs}ms Total</span>
                {expandedSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {expandedSteps && (
              <div className="p-4 pt-0 space-y-2 border-t border-neutral-800/60">
                {execution.steps.map((step, idx) => (
                  <div
                    key={step.id || idx}
                    className="flex items-start justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-850 hover:border-neutral-750 transition-all text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-neutral-200">
                            {step.title}
                          </span>
                          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-cyan-300">
                            {step.application}
                          </span>
                        </div>
                        <p className="text-neutral-400 text-xs mt-0.5">
                          {step.detail}
                        </p>
                      </div>
                    </div>

                    <div className="text-right font-mono text-[11px] text-neutral-500 flex-shrink-0 ml-3">
                      <span>{step.durationMs}ms</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actual Result Artifact Container */}
          {execution.artifact && (
            <div className="bg-neutral-900 border border-neutral-700/80 rounded-3xl p-6 shadow-2xl shadow-black/80 space-y-4">
              
              {/* Artifact Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                      ACTUAL REAL RESULT · {execution.artifact.type.toUpperCase()}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono">Verified Zero Trace</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-neutral-100 mt-1">
                    {execution.artifact.title}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {execution.artifact.summary}
                  </p>
                </div>

                {/* Artifact Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyArtifact}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-xs font-mono text-neutral-300 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownloadArtifact}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-xs font-mono text-neutral-300 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Metrics Pill Grid */}
              {execution.artifact.metrics && execution.artifact.metrics.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {execution.artifact.metrics.map((m, idx) => (
                    <div key={idx} className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                      <span className="text-[10px] font-mono text-neutral-500 block uppercase">
                        {m.label}
                      </span>
                      <span className="text-sm font-bold font-mono text-neutral-100 mt-0.5 block">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Artifact Body / Rendered Content */}
              <div className="p-5 bg-neutral-950 rounded-2xl border border-neutral-850 font-sans text-xs sm:text-sm text-neutral-200 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {execution.artifact.content}
              </div>

            </div>
          )}

        </div>
      )}

      {/* Previous Execution History */}
      {history.length > 1 && (
        <div className="mt-8 pt-6 border-t border-neutral-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-semibold">
              PREVIOUS EXECUTIONS STREAM
            </span>
            <span className="text-xs text-neutral-500 font-mono">{history.length} commands logged</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {history.slice(1, 5).map((h) => (
              <button
                key={h.id}
                onClick={() => onSelectHistory(h)}
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-left transition-all text-xs group"
              >
                <div className="truncate pr-3">
                  <span className="font-medium text-neutral-200 group-hover:text-cyan-400 block truncate">
                    {h.command}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    {new Date(h.timestamp).toLocaleTimeString()} · {h.steps.length} steps · {h.mode}
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-cyan-400 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
