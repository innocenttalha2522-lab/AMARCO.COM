import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Sparkles, Shield, Zap, ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface VoiceHUDProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteCommand: (command: string, voiceTriggered: boolean) => void;
  isListening: boolean;
  setIsListening: (val: boolean) => void;
}

export const VoiceHUD: React.FC<VoiceHUDProps> = ({
  isOpen,
  onClose,
  onExecuteCommand,
  isListening,
  setIsListening,
}) => {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [waveHeights, setWaveHeights] = useState<number[]>([20, 45, 75, 30, 90, 50, 60, 30, 80, 40]);
  const recognitionRef = useRef<any>(null);

  const sampleVoiceCommands = [
    'Deploy global viral campaign across X and LinkedIn',
    'Sync worldwide cloud databases with local encrypted vault',
    'Run stealth intelligence scan on unrestricted global news',
    'Purge local telemetry and rotate encrypted tunnel to Reykjavik',
    'Execute autonomous daily operations workflow',
  ];

  // Web Speech Recognition
  useEffect(() => {
    if (!isOpen) return;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      try {
        const recognition = new SpeechRec();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          soundManager.playActivate();
        };

        recognition.onresult = (event: any) => {
          let interim = '';
          let final = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          if (final) {
            setTranscript((prev) => (prev ? `${prev} ${final}` : final));
            setInterimTranscript('');
          } else {
            setInterimTranscript(interim);
          }
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition error:', err);
        };

        recognition.onend = () => {
          // If still open and listening was intended, auto-restart
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (e) {
        console.warn('Speech recognition start failed:', e);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [isOpen]);

  // Audio wave animation
  useEffect(() => {
    if (!isOpen || !isListening) return;
    const interval = setInterval(() => {
      setWaveHeights((prev) =>
        prev.map(() => Math.floor(Math.random() * 70) + 15)
      );
    }, 120);
    return () => clearInterval(interval);
  }, [isOpen, isListening]);

  if (!isOpen) return null;

  const handleSubmit = (cmdToRun?: string) => {
    const textToRun = cmdToRun || transcript || interimTranscript;
    if (!textToRun.trim()) return;

    soundManager.playActivate();
    onExecuteCommand(textToRun.trim(), true);
    setTranscript('');
    setInterimTranscript('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-500/10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-xl bg-neutral-800/80 hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold">
            AMARCO Real-Time Voice Protocol
          </span>
          <span className="text-[11px] text-neutral-400">· Offline Local Ready</span>
        </div>

        {/* Voice Frequency Waveform Visualizer */}
        <div className="flex items-center justify-center gap-1.5 h-20 mb-6 bg-neutral-950/80 rounded-2xl border border-neutral-800 px-6">
          {waveHeights.map((h, i) => (
            <div
              key={i}
              className="w-2 rounded-full bg-gradient-to-t from-cyan-600 via-cyan-400 to-emerald-400 transition-all duration-100"
              style={{ height: `${isListening ? h : 6}%` }}
            />
          ))}
        </div>

        {/* Transcript Box */}
        <div className="relative mb-6">
          <label className="block text-xs font-mono text-neutral-400 mb-2">
            VOICE INPUT CAPTURE:
          </label>
          <div className="min-h-[72px] p-4 bg-neutral-950 border border-neutral-800 rounded-2xl text-sm font-sans text-neutral-100 flex items-center justify-between">
            <span className={transcript || interimTranscript ? 'text-neutral-100 font-medium' : 'text-neutral-500 italic'}>
              {transcript || interimTranscript || 'Speak your command clearly into the microphone... (or pick a fast order below)'}
            </span>
            {isListening && (
              <span className="flex h-3 w-3 relative ml-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
              </span>
            )}
          </div>
        </div>

        {/* Quick Voice Orders list */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-neutral-400">
              OR TRANSMIT INSTANT VOICE DIRECTIVE:
            </span>
            <span className="text-[11px] text-neutral-500">1-Click Execution</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {sampleVoiceCommands.slice(0, 3).map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => handleSubmit(cmd)}
                className="group flex items-center justify-between px-3 py-2 text-left text-xs bg-neutral-800/60 hover:bg-neutral-800 hover:border-cyan-500/40 border border-neutral-700/60 rounded-xl text-neutral-300 hover:text-cyan-300 transition-all"
              >
                <span className="truncate pr-2">"{cmd}"</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Encrypted Tunnel Route: Zurich (CH)</span>
          </div>
          <button
            onClick={() => handleSubmit()}
            disabled={!transcript && !interimTranscript}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 disabled:opacity-40 disabled:pointer-events-none text-neutral-950 font-semibold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Zap className="w-4 h-4" />
            <span>Execute Order</span>
          </button>
        </div>

      </div>
    </div>
  );
};
