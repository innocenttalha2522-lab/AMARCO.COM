import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Globe,
  Radio,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertTriangle,
  EyeOff,
  Cpu,
  Server,
  Activity,
} from 'lucide-react';
import { TunnelNode, TunnelState } from '../../types/amarco';
import { soundManager } from '../../utils/audio';

interface StealthTunnelViewProps {
  tunnel: TunnelState;
  availableNodes: TunnelNode[];
  onSelectNode: (node: TunnelNode) => void;
  onToggleTunnel: () => void;
  onToggleKillSwitch: () => void;
  onToggleDnsProtection: () => void;
}

export const StealthTunnelView: React.FC<StealthTunnelViewProps> = ({
  tunnel,
  availableNodes,
  onSelectNode,
  onToggleTunnel,
  onToggleKillSwitch,
  onToggleDnsProtection,
}) => {
  const [testingDns, setTestingDns] = useState(false);
  const [dnsTestPassed, setDnsTestPassed] = useState(true);
  const [selectedProtocol, setSelectedProtocol] = useState(tunnel.protocol);

  const runDnsLeakTest = () => {
    setTestingDns(true);
    soundManager.playActivate();
    setTimeout(() => {
      setTestingDns(false);
      setDnsTestPassed(true);
      soundManager.playStepComplete();
    }, 800);
  };

  const handleNodeSwitch = (node: TunnelNode) => {
    soundManager.playActivate();
    onSelectNode(node);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-neutral-900/60 border border-neutral-800 rounded-3xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-emerald-400 font-semibold uppercase tracking-wider">
              MILITARY-GRADE ENCRYPTED TUNNEL & PRIVACY SHIELD
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">· Zero-Log Policy</span>
          </div>
          <h1 className="text-lg font-bold text-neutral-100 mt-1">
            Stealth Network Tunnel & Identity Cloaker
          </h1>
          <p className="text-xs text-neutral-400 max-w-xl mt-0.5">
            AMARCO encapsulates all external operations inside an encrypted tunnel, obscuring real IP coordinates, preventing DNS leakage, and ensuring untraceable execution.
          </p>
        </div>

        <button
          onClick={onToggleTunnel}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs font-semibold rounded-xl border transition-all ${
            tunnel.enabled
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>{tunnel.enabled ? 'TUNNEL ACTIVE (ARMED)' : 'TUNNEL SUSPENDED'}</span>
        </button>
      </div>

      {/* Primary Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Masked IP */}
        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <span className="text-[10px] font-mono text-neutral-500 uppercase block">
            PUBLIC MASKED IP
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-base font-bold font-mono text-emerald-400">
              {tunnel.maskedIp}
            </span>
          </div>
          <span className="text-[11px] text-neutral-400 font-mono mt-0.5 block">
            {tunnel.activeNode.city}, {tunnel.activeNode.country}
          </span>
        </div>

        {/* Real IP Status */}
        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <span className="text-[10px] font-mono text-neutral-500 uppercase block">
            HOST IDENTITY STATUS
          </span>
          <div className="flex items-center gap-1.5 mt-1 text-emerald-400 text-sm font-bold font-mono">
            <EyeOff className="w-4 h-4" />
            <span>100% CLOAKED</span>
          </div>
          <span className="text-[11px] text-neutral-400 font-mono mt-0.5 block">
            Zero Forensic Traces
          </span>
        </div>

        {/* Encrypted Tunnel Latency */}
        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <span className="text-[10px] font-mono text-neutral-500 uppercase block">
            TUNNEL PING & CIPHER
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-base font-bold font-mono text-neutral-100">
              {tunnel.activeNode.latencyMs}ms
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-cyan-300">
              {tunnel.activeNode.cipher.split('/')[0]}
            </span>
          </div>
          <span className="text-[11px] text-neutral-400 font-mono mt-0.5 block">
            Load: {tunnel.activeNode.loadPercent}%
          </span>
        </div>

        {/* Stealth Score */}
        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <span className="text-[10px] font-mono text-neutral-500 uppercase block">
            STEALTH RESISTANCE SCORE
          </span>
          <div className="flex items-center gap-1.5 mt-1 text-cyan-400 text-base font-bold font-mono">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>{tunnel.stealthScore} / 100</span>
          </div>
          <span className="text-[11px] text-neutral-400 font-mono mt-0.5 block">
            WireGuard + Ephemeral Keys
          </span>
        </div>

      </div>

      {/* Global Tunnel Nodes Grid */}
      <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-mono font-bold text-neutral-100 uppercase tracking-wider">
              SECURE GLOBAL EXIT NODES
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Select an encrypted residential relay to route autonomous social campaigns and cloud queries through.
            </p>
          </div>
          <span className="text-[11px] font-mono text-neutral-500">
            {availableNodes.length} Nodes Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {availableNodes.map((node) => {
            const isCurrent = tunnel.activeNode.id === node.id;
            return (
              <div
                key={node.id}
                onClick={() => handleNodeSwitch(node)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  isCurrent
                    ? 'bg-neutral-950 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                    : 'bg-neutral-950/60 border-neutral-850 hover:border-neutral-750'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{node.flag}</span>
                    <span className="font-semibold text-xs text-neutral-200">
                      {node.city}, {node.country}
                    </span>
                  </div>
                  {isCurrent && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 uppercase">
                      ACTIVE
                    </span>
                  )}
                </div>

                <div className="font-mono text-xs text-neutral-400">
                  <span>IP: {node.ip}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-2 border-t border-neutral-850">
                  <span>Ping: <strong className="text-neutral-300">{node.latencyMs}ms</strong></span>
                  <span>Load: <strong className="text-neutral-300">{node.loadPercent}%</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Policies: Kill Switch & DNS Leak Shield */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Fail-Safe Kill Switch */}
        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-start justify-between">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-neutral-100">
                Network Fail-Safe Kill Switch
              </h3>
            </div>
            <p className="text-xs text-neutral-400">
              Instantly blocks all outbound socket traffic if the encrypted tunnel drops, preventing accidental IP leakage.
            </p>
          </div>
          <button
            onClick={onToggleKillSwitch}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold border transition-all ${
              tunnel.killSwitch
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-neutral-800 text-neutral-400 border-neutral-700'
            }`}
          >
            {tunnel.killSwitch ? 'ARMED' : 'DISABLED'}
          </button>
        </div>

        {/* Zero-Leak DNS & WebRTC Shield */}
        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-start justify-between">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-neutral-100">
                DNS Leak & WebRTC Shield
              </h3>
            </div>
            <p className="text-xs text-neutral-400">
              Forces all DNS inquiries through encrypted zero-knowledge resolvers. WebRTC STUN/TURN binding blocked.
            </p>
          </div>

          <button
            onClick={runDnsLeakTest}
            disabled={testingDns}
            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border border-neutral-700 rounded-xl font-mono text-xs font-semibold transition-all"
          >
            {testingDns ? 'Testing...' : 'Run Test'}
          </button>
        </div>

      </div>

    </div>
  );
};
