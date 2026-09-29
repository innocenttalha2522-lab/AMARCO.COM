import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Mic, 
  Radio, 
  Terminal, 
  CornerDownLeft, 
  ShieldCheck, 
  Globe, 
  Database, 
  X,
  Sparkles
} from 'lucide-react';

interface QuickCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteCommand: (command: string, isVoice?: boolean) => void;
  isListening: boolean;
  onToggleMic: () => void;
  isExecuting: boolean;
  voiceTranscript: string;
}

export const QuickCommandModal: React.FC<QuickCommandModalProps> = ({
  isOpen,
  onClose,
  onExecuteCommand,
  isListening,
  onToggleMic,
  isExecuting,
  voiceTranscript,
}) => {
  const [commandText, setCommandText] = useState('');

  useEffect(() => {
    if (voiceTranscript) {
      setCommandText(voiceTranscript);
    }
  }, [voiceTranscript]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandText.trim()) return;
    onExecuteCommand(commandText.trim(), false);
    setCommandText('');
    onClose();
  };

  const quickShortcuts = [
    { label: 'Syndicate Global Campaign', cmd: 'Execute multi-platform social campaign across X, LinkedIn, and Reddit for AMARCO release' },
    { label: 'Reconnaissance Cloud Database', cmd: 'Perform deep reconnaissance across global cloud database and extract threat & market vectors' },
    { label: 'Rotate WireGuard Keys', cmd: 'Rotate ephemeral ChaCha20 tunnel keys and verify zero-trace IP cloaking' },
    { label: 'Audit Local Air-Gap', cmd: 'Run sovereign security audit on local daemon and enforce strict offline isolation' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150">
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col gap-0">
        {/* Top Header */}
        <div className="p-4 bg-neutral-950/90 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              A
            </div>
            <span className="text-xs font-bold tracking-wider text-neutral-100 uppercase">
              AMARCO Taskbar Quick Summon
            </span>
            <span className="text-[10px] text-emerald-400 font-mono ml-2">
              TUNNEL: MASKED
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-neutral-500">ESC to dismiss</span>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Input box */}
        <form onSubmit={handleSubmit} className="p-4 flex items-center gap-3 bg-neutral-900">
          <button
            type="button"
            onClick={onToggleMic}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-500/20'
                : 'bg-neutral-800 text-cyan-400 hover:bg-neutral-700 border border-neutral-700'
            }`}
            title="Toggle Voice Order"
          >
            {isListening ? <Radio className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            autoFocus
            value={commandText}
            onChange={(e) => setCommandText(e.target.value)}
            placeholder={isListening ? 'Listening to voice order...' : 'Issue any order to AMARCO...'}
            disabled={isExecuting}
            className="flex-1 bg-transparent text-sm text-neutral-100 placeholder:text-neutral-500 outline-none font-sans"
          />

          <button
            type="submit"
            disabled={isExecuting || !commandText.trim()}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
          >
            <span>Execute</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick presets */}
        <div className="p-3 bg-neutral-950/60 border-t border-neutral-800/80 flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-neutral-500 uppercase">
            Suggested Sovereign Actions:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
            {quickShortcuts.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  onExecuteCommand(s.cmd, false);
                  onClose();
                }}
                className="text-left p-2 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white transition-all text-xs font-mono truncate"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
