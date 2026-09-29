import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Cpu,
  Share2,
  Database,
  ShieldCheck,
  FileText,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Search,
  Lock,
} from 'lucide-react';
import { ViewType, TunnelState } from '../types/amarco';
import { soundManager } from '../utils/audio';

export interface TaskbarProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  tunnel: TunnelState;
  isListening: boolean;
  onToggleVoice: () => void;
  onOpenCommandPalette: () => void;
  voiceAudioEnabled: boolean;
  onToggleVoiceAudio: () => void;
  isExecuting: boolean;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  currentView,
  onSelectView,
  tunnel,
  isListening,
  onToggleVoice,
  onOpenCommandPalette,
  voiceAudioEnabled,
  onToggleVoiceAudio,
  isExecuting,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { view: ViewType; label: string; icon: React.ReactNode; hint: string }[] = [
    { view: 'terminal', label: 'Command Hub', icon: <Terminal className="w-4 h-4" />, hint: 'Live execution & commands' },
    { view: 'workflows', label: 'Workflows', icon: <Cpu className="w-4 h-4" />, hint: 'Cross-app automations' },
    { view: 'campaigns', label: 'Campaigns', icon: <Share2 className="w-4 h-4" />, hint: 'Social media orchestrator' },
    { view: 'databases', label: 'Cloud DBs', icon: <Database className="w-4 h-4" />, hint: 'Worldwide data matrix' },
    { view: 'tunnel', label: 'Stealth Tunnel', icon: <ShieldCheck className="w-4 h-4" />, hint: 'Encrypted privacy shield' },
    { view: 'audit', label: 'Audit Log', icon: <FileText className="w-4 h-4" />, hint: 'Immutable operation ledger' },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-3 pointer-events-none">
      <div className="max-w-6xl mx-auto pointer-events-auto">
        <div className="relative flex items-center justify-between px-3 py-2 bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl shadow-black/80">
          
          {/* Left: AMARCO Quick Launcher & Voice Orb */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleVoice}
              title="AMARCO Voice Activation (Click or say orders)"
              className={`relative group flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-300 ${
                isListening
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 ring-2 ring-rose-500/30 animate-pulse'
                  : isExecuting
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              }`}
            >
              <div className="relative flex items-center justify-center w-6 h-6">
                <span
                  className={`absolute inset-0 rounded-full ${
                    isListening ? 'bg-rose-500 animate-ping opacity-75' : isExecuting ? 'bg-amber-400 animate-pulse' : 'bg-cyan-400/40'
                  }`}
                />
                <span className="relative w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
              </div>
              <span className="font-mono text-xs font-bold tracking-wider text-neutral-100">
                AMARCO
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-neutral-800/80 text-cyan-400 border border-neutral-700">
                {isListening ? 'LISTENING' : isExecuting ? 'RUNNING' : 'ONLINE'}
              </span>
            </button>

            {/* Quick Command Bar Trigger */}
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/60 rounded-xl transition-colors"
              title="Command Palette (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden sm:inline">Order AMARCO...</span>
              <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-400">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Center: Desktop Navigation Dock */}
          <nav className="flex items-center gap-1 bg-neutral-950/70 p-1 rounded-xl border border-neutral-800/80">
            {navItems.map((item) => {
              const active = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => {
                    soundManager.playActivate();
                    onSelectView(item.view);
                  }}
                  title={item.hint}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    active
                      ? 'bg-neutral-800 text-cyan-400 shadow-sm border border-cyan-500/30'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                  }`}
                >
                  <span className={active ? 'text-cyan-400' : 'text-neutral-400'}>
                    {item.icon}
                  </span>
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: System Tray & Tunnel Security Monitor */}
          <div className="flex items-center gap-2">
            {/* Encrypted Tunnel Quick Pill */}
            <button
              onClick={() => onSelectView('tunnel')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                tunnel.enabled
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/60'
                  : 'bg-rose-950/40 border-rose-500/30 text-rose-400 hover:bg-rose-950/60'
              }`}
              title={`Tunnel: ${tunnel.protocol} | Node: ${tunnel.activeNode.city} | Masked IP: ${tunnel.maskedIp}`}
            >
              <Lock className="w-3 h-3 text-emerald-400" />
              <span className="hidden lg:inline">{tunnel.activeNode.flag} {tunnel.activeNode.city}</span>
              <span className="text-[10px] text-emerald-400/80 hidden sm:inline">
                {tunnel.activeNode.latencyMs}ms
              </span>
            </button>

            {/* Voice Audio Feedback Toggle */}
            <button
              onClick={onToggleVoiceAudio}
              className={`p-1.5 rounded-xl border transition-colors ${
                voiceAudioEnabled
                  ? 'bg-neutral-800 text-cyan-400 border-neutral-700 hover:bg-neutral-700'
                  : 'bg-neutral-900 text-neutral-500 border-neutral-800 hover:text-neutral-300'
              }`}
              title={voiceAudioEnabled ? 'Voice Feedback: Active' : 'Voice Feedback: Muted'}
            >
              {voiceAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Quick Mic Action */}
            <button
              onClick={onToggleVoice}
              className={`p-1.5 rounded-xl border transition-colors ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/30 animate-pulse'
                  : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white hover:bg-neutral-700'
              }`}
              title="Toggle Voice Command Input"
            >
              {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            {/* Desktop Time */}
            <div className="hidden xl:flex flex-col text-right pl-1 border-l border-neutral-800 font-mono text-[11px] text-neutral-400">
              <span className="font-semibold text-neutral-200">{currentTime || '12:00:00'}</span>
              <span className="text-[9px] text-neutral-500">OFFLINE READY</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
