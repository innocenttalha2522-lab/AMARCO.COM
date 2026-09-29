import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Terminal, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  Share2, 
  ExternalLink, 
  Layers, 
  Zap, 
  Server, 
  Radio, 
  Lock,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { TaskExecution, ExecutionStep } from '../types';

interface AutonomousExecutionHubProps {
  currentExecution: TaskExecution | null;
  history: TaskExecution[];
  onSelectExecution: (exec: TaskExecution) => void;
  isExecuting: boolean;
}

export const AutonomousExecutionHub: React.FC<AutonomousExecutionHubProps> = ({
  currentExecution,
  history,
  onSelectExecution,
  isExecuting,
}) => {
  const [copied, setCopied] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState(true);

  const handleCopyContent = () => {
    if (!currentExecution?.resultPayload.generatedContent) return;
    navigator.clipboard.writeText(currentExecution.resultPayload.generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    if (!currentExecution) return;
    const content = `# AMARCO AUTONOMOUS EXECUTION REPORT
Timestamp: ${currentExecution.timestamp}
Order: "${currentExecution.command}"
Status: ${currentExecution.status.toUpperCase()}
Execution Mode: ${currentExecution.mode.toUpperCase()}
Privacy: ${currentExecution.privacyLevel}

## EXECUTIVE SUMMARY
${currentExecution.resultPayload.summary}

## SECURITY & TUNNEL TELEMETRY
- Encrypted Tunnel: ${currentExecution.resultPayload.securityVerification.encryptedTunnel ? 'Active (WireGuard / ChaCha20)' : 'Bypass'}
- Cloak Node: ${currentExecution.resultPayload.securityVerification.ipCloakNode}
- Signature Verified: ${currentExecution.resultPayload.securityVerification.localSignatureVerified ? 'YES (SHA256 Seal)' : 'NO'}
- Latency: ${currentExecution.resultPayload.securityVerification.latencyMs}ms

## EXECUTION STEPS
${currentExecution.executionSteps.map((s, idx) => `${idx + 1}. [${s.environment.toUpperCase()}] ${s.label}: ${s.outputSnippet || 'Done'}`).join('\n')}

## DELIVERABLE ARTIFACT
${currentExecution.resultPayload.generatedContent || 'None'}
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AMARCO-Execution-${currentExecution.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left Column: Live Execution Pipeline & Deliverable (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-5">
        {currentExecution ? (
          <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-5 backdrop-blur-md flex flex-col gap-5">
            {/* Header info */}
            <div className="flex flex-col gap-2 border-b border-neutral-800 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-100">
                    {currentExecution.resultPayload.title || 'Command Fulfillment'}
                  </h3>
                </div>

                {/* Status indicator unboxed */}
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>VERIFIED & SEALED</span>
                  </span>
                  <span aria-hidden="true" className="text-neutral-600">·</span>
                  <span className="text-neutral-400">
                    {new Date(currentExecution.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Order text */}
              <div className="bg-neutral-950/80 rounded-lg p-3 border border-neutral-800/80 font-mono text-xs text-neutral-300">
                <span className="text-cyan-400 font-semibold">COMMAND ORDER: </span>
                <span>&ldquo;{currentExecution.command}&rdquo;</span>
              </div>
            </div>

            {/* Stepped Workflow Pipeline Progress */}
            <div className="flex flex-col gap-2">
              <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
                <span>Autonomous Execution Pipeline</span>
                <span className="text-[11px] text-neutral-400 font-mono">
                  {currentExecution.executionSteps.length} Steps Completed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {currentExecution.executionSteps.map((step, idx) => (
                  <div
                    key={step.id || idx}
                    className="p-3 rounded-lg bg-neutral-950/70 border border-neutral-800/90 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center text-[10px] font-mono">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-neutral-200">{step.label}</span>
                      </div>
                      <span className="text-[10px] uppercase font-mono text-cyan-400">
                        {step.environment}
                      </span>
                    </div>
                    {step.outputSnippet && (
                      <p className="text-[11px] font-mono text-neutral-400 truncate pl-6">
                        {step.outputSnippet}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverable Artifact Output Box */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                    Actual Output & Deliverable Content
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyContent}
                    className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-neutral-700"
                    title="Copy deliverable artifact to clipboard"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Artifact'}</span>
                  </button>
                  <button
                    onClick={handleDownloadReport}
                    className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-neutral-700"
                    title="Download complete report"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Report</span>
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="bg-neutral-950 rounded-lg border border-neutral-800 p-4 font-mono text-xs text-neutral-200 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto select-text selection:bg-cyan-500/30">
                {currentExecution.resultPayload.generatedContent || currentExecution.resultPayload.summary}
              </div>
            </div>

            {/* Telemetry & Target Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-neutral-800/80">
              <div className="p-3 rounded-lg bg-neutral-950/40 border border-neutral-800/80 flex flex-col gap-1">
                <span className="text-[11px] text-neutral-400 uppercase font-mono">Target Platforms</span>
                <div className="text-xs font-medium text-neutral-200 truncate">
                  {(currentExecution.resultPayload.platformsTargeted || ['Desktop Environment']).join(', ')}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-950/40 border border-neutral-800/80 flex flex-col gap-1">
                <span className="text-[11px] text-neutral-400 uppercase font-mono">Records Touched</span>
                <div className="text-xs font-medium text-cyan-400 font-mono">
                  {currentExecution.resultPayload.recordsAffected || 1} Entities Synchronized
                </div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-950/40 border border-neutral-800/80 flex flex-col gap-1">
                <span className="text-[11px] text-neutral-400 uppercase font-mono">Stealth Cloak Node</span>
                <div className="text-xs font-medium text-emerald-400 font-mono truncate">
                  {currentExecution.resultPayload.securityVerification.ipCloakNode}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-10 flex flex-col items-center justify-center text-center gap-3 min-h-[320px]">
            <Server className="w-10 h-10 text-neutral-600" />
            <h3 className="text-sm font-semibold text-neutral-300">AMARCO Standby</h3>
            <p className="text-xs text-neutral-500 max-w-md">
              Awaiting voice activation or command input. Give AMARCO an order to orchestrate workflows, manage social media campaigns, or pull from global cloud databases.
            </p>
          </div>
        )}
      </div>

      {/* Right Column: Execution History Log & Quick Telemetry (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        {/* Security & Tunnel Seal */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-4 backdrop-blur-md flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Sovereign Security Seal</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-400">ENCRYPTED</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between py-1.5 border-b border-neutral-800/80">
              <span className="text-neutral-400">Network Tunnel:</span>
              <span className="text-neutral-200">WireGuard 256-bit</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-neutral-800/80">
              <span className="text-neutral-400">IP Identity:</span>
              <span className="text-emerald-400">Cloaked & Masked</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-neutral-800/80">
              <span className="text-neutral-400">Local Air-Gap:</span>
              <span className="text-cyan-400">Capable (Zero Cloud Leak)</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-neutral-400">Autonomous Level:</span>
              <span className="text-neutral-200">100% Unattended</span>
            </div>
          </div>
        </div>

        {/* Execution History Feed */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-4 backdrop-blur-md flex flex-col gap-3 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Audit Execution Trail</span>
            </span>
            <span className="text-[11px] font-mono text-neutral-400">
              {history.length} logged
            </span>
          </div>

          <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1">
            {history.map((exec) => {
              const isSelected = currentExecution?.id === exec.id;
              return (
                <button
                  key={exec.id}
                  onClick={() => onSelectExecution(exec)}
                  className={`text-left p-3 rounded-lg border transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-neutral-800/90 border-cyan-500/60 shadow-sm'
                      : 'bg-neutral-950/50 border-neutral-800/80 hover:bg-neutral-800/40 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-200 truncate pr-2">
                      {exec.resultPayload.title || exec.command}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono shrink-0">
                      {new Date(exec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-400 line-clamp-2">
                    {exec.resultPayload.summary}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-mono mt-0.5">
                    <span>{exec.mode.toUpperCase()}</span>
                    <span>·</span>
                    <span className="text-cyan-400">{exec.resultPayload.category}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
