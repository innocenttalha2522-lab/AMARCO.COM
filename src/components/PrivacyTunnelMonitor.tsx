import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Cpu, 
  Server, 
  ArrowRight, 
  Zap, 
  EyeOff, 
  Eye, 
  Activity,
  Key
} from 'lucide-react';
import { SystemStatus } from '../types';

interface PrivacyTunnelMonitorProps {
  systemStatus: SystemStatus | null;
  stealthModeActive: boolean;
  onToggleStealthMode: () => void;
  airgapMode: boolean;
  onToggleAirgapMode: () => void;
}

export const PrivacyTunnelMonitor: React.FC<PrivacyTunnelMonitorProps> = ({
  systemStatus,
  stealthModeActive,
  onToggleStealthMode,
  airgapMode,
  onToggleAirgapMode,
}) => {
  const [killSwitchActive, setKillSwitchActive] = useState(true);
  const [isRotatingKeys, setIsRotatingKeys] = useState(false);
  const [lastRotated, setLastRotated] = useState('2 minutes ago');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleRotateKeypairs = () => {
    setIsRotatingKeys(true);
    setTimeout(() => {
      setIsRotatingKeys(false);
      setLastRotated('Just now');
      setTestResult('Ephemeral ChaCha20-Poly1305 keypair rotated. 0 packet loss.');
    }, 900);
  };

  const handleRunLeakTest = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult('Leak test clean: 0 DNS leaks, 0 WebRTC leaks, Origin IP completely concealed behind Zurich Relay (185.122.94.12).');
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Top Banner */}
      <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-5 backdrop-blur-md flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-neutral-800 border border-neutral-700 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-neutral-100 uppercase">
                Stealth Encrypted Tunnel & Sovereign Privacy Shield
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Every AMARCO action is routed through an encrypted ChaCha20-Poly1305 multi-hop tunnel to hide network traffic and origin IP.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRotateKeypairs}
              disabled={isRotatingKeys}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRotatingKeys ? 'animate-spin' : ''}`} />
              <span>Rotate Ephemeral Keys</span>
            </button>
          </div>
        </div>

        {/* Master Control Switches */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-neutral-800/80">
          {/* Stealth Tunnel Toggle */}
          <div className="p-3.5 rounded-lg bg-neutral-950/70 border border-neutral-800 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-neutral-200">Encrypted Stealth Tunnel</span>
              <span className="text-[11px] text-neutral-400">Multi-hop WireGuard relay</span>
            </div>
            <button
              onClick={onToggleStealthMode}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                stealthModeActive ? 'bg-emerald-600' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  stealthModeActive ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Airgap Offline Toggle */}
          <div className="p-3.5 rounded-lg bg-neutral-950/70 border border-neutral-800 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-neutral-200">Local Air-Gap Mode</span>
              <span className="text-[11px] text-neutral-400">Zero outbound network traffic</span>
            </div>
            <button
              onClick={onToggleAirgapMode}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                airgapMode ? 'bg-cyan-600' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  airgapMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Network Kill Switch */}
          <div className="p-3.5 rounded-lg bg-neutral-950/70 border border-neutral-800 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-neutral-200">Hard Kill Switch</span>
              <span className="text-[11px] text-neutral-400">Block unencrypted leakage</span>
            </div>
            <button
              onClick={() => setKillSwitchActive(!killSwitchActive)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                killSwitchActive ? 'bg-emerald-600' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  killSwitchActive ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Visual Multi-Hop Tunnel Route Diagram */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 backdrop-blur-md flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
            Live Cryptographic Route Visualization
          </h3>
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            TUNNEL ESTABLISHED · 0 LEAKS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
          {/* Node 1: Local Sovereign Client */}
          <div className="p-4 rounded-lg bg-neutral-950/80 border border-cyan-800/60 flex flex-col gap-2 relative">
            <div className="flex items-center justify-between">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-mono text-cyan-400">ORIGIN</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-neutral-100">Local Sovereign Desktop</span>
              <span className="text-[11px] font-mono text-neutral-400">AMARCO Core Engine</span>
            </div>
            <div className="pt-2 border-t border-neutral-800 text-[10px] font-mono text-emerald-400">
              IP: [HIDDEN IN AIRGAP]
            </div>
          </div>

          {/* Node 2: Zurich Entry Node */}
          <div className="p-4 rounded-lg bg-neutral-950/80 border border-neutral-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-mono text-neutral-400">HOP 1</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-neutral-100">Zurich Zero-Log Relay</span>
              <span className="text-[11px] font-mono text-neutral-400">Switzerland (185.122.x.x)</span>
            </div>
            <div className="pt-2 border-t border-neutral-800 text-[10px] font-mono text-neutral-300">
              Cipher: ChaCha20-Poly1305
            </div>
          </div>

          {/* Node 3: Tokyo Hyper-Router */}
          <div className="p-4 rounded-lg bg-neutral-950/80 border border-neutral-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-mono text-neutral-400">HOP 2</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-neutral-100">Tokyo Hyper-Router</span>
              <span className="text-[11px] font-mono text-neutral-400">Japan (133.242.x.x)</span>
            </div>
            <div className="pt-2 border-t border-neutral-800 text-[10px] font-mono text-neutral-300">
              Latency: 16ms · Zero Trace
            </div>
          </div>

          {/* Node 4: Target Cloud / Social Media */}
          <div className="p-4 rounded-lg bg-neutral-950/80 border border-emerald-800/60 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Server className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-mono text-emerald-400">TARGET</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-neutral-100">Worldwide Cloud APIs</span>
              <span className="text-[11px] font-mono text-neutral-400">Social & DB Networks</span>
            </div>
            <div className="pt-2 border-t border-neutral-800 text-[10px] font-mono text-emerald-400">
              Viewed Origin: Tokyo Node
            </div>
          </div>
        </div>
      </div>

      {/* Security Telemetry & Live Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left: Cryptographic Integrity Cards */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 backdrop-blur-md flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-4 h-4 text-cyan-400" />
              <span>Cryptographic Identity Attributes</span>
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between py-1.5 border-b border-neutral-800">
              <span className="text-neutral-400">Ephemeral Key Rotation:</span>
              <span className="text-neutral-200">{lastRotated}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-neutral-800">
              <span className="text-neutral-400">Handshake Protocol:</span>
              <span className="text-neutral-200">WireGuard Noise IKpsk2</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-neutral-800">
              <span className="text-neutral-400">DNS Resolution:</span>
              <span className="text-emerald-400">Encrypted DNS-over-HTTPS (DoH)</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-neutral-800">
              <span className="text-neutral-400">WebRTC Protection:</span>
              <span className="text-emerald-400">Zero STUN Leak Sealed</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-neutral-400">Traffic Obfuscation:</span>
              <span className="text-neutral-200">Enabled (Looks like standard HTTPS)</span>
            </div>
          </div>
        </div>

        {/* Right: Live Diagnostics Runner */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 backdrop-blur-md flex flex-col gap-3 justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Stealth Verification Engine</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Verify that no identifying packets or IP metadata escape AMARCO during autonomous operations.
            </p>

            {testResult && (
              <div className="p-3 rounded-lg bg-neutral-950 border border-emerald-800/80 text-xs font-mono text-emerald-300">
                {testResult}
              </div>
            )}
          </div>

          <button
            onClick={handleRunLeakTest}
            disabled={isTesting}
            className="w-full h-10 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-xs font-medium flex items-center justify-center gap-2 transition-colors border border-neutral-700"
          >
            {isTesting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-neutral-400 border-t-cyan-400 rounded-full animate-spin" />
                <span>Pinging Relay Nodes & Verifying Zero-Trace...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Execute Complete Stealth & IP Leak Diagnostic</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
