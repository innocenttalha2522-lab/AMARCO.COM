import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  Radio, 
  Terminal, 
  Volume2, 
  Zap, 
  ShieldCheck, 
  CornerDownLeft,
  ChevronRight,
  Info
} from 'lucide-react';

interface VoiceCommandCenterProps {
  isListening: boolean;
  onToggleMic: () => void;
  onExecuteCommand: (command: string, isVoice?: boolean) => void;
  isExecuting: boolean;
  voiceTranscript: string;
  setVoiceTranscript: (val: string) => void;
  voiceFeedbackEnabled: boolean;
  lastAudioResponse: string;
}

export const VoiceCommandCenter: React.FC<VoiceCommandCenterProps> = ({
  isListening,
  onToggleMic,
  onExecuteCommand,
  isExecuting,
  voiceTranscript,
  setVoiceTranscript,
  voiceFeedbackEnabled,
  lastAudioResponse,
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [waveformBars, setWaveformBars] = useState<number[]>(Array(18).fill(12));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Suggested high-impact sovereign agent orders
  const quickOrders = [
    'Synthesize global campaign across X, LinkedIn, and Reddit for AMARCO sovereign deployment',
    'Execute worldwide cloud database audit and pull encrypted intelligence vectors',
    'Engage stealth tunnel routing through Swiss node and cloak all network telemetry',
    'Deconstruct local desktop automation pipeline with automated error recovery',
  ];

  // Visualizer loop when listening
  useEffect(() => {
    if (isListening) {
      try {
        navigator.mediaDevices?.getUserMedia({ audio: true }).then((stream) => {
          streamRef.current = stream;
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const ctx = new AudioContextClass();
            audioContextRef.current = ctx;
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 64;
            analyserRef.current = analyser;
            const source = ctx.createMediaStreamSource(stream);
            source.connect(analyser);

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const updateWaveform = () => {
              analyser.getByteFrequencyData(dataArray);
              const bars: number[] = [];
              for (let i = 0; i < 18; i++) {
                const val = dataArray[i * 2] || 0;
                bars.push(Math.max(8, (val / 255) * 44));
              }
              setWaveformBars(bars);
              animationFrameRef.current = requestAnimationFrame(updateWaveform);
            };
            updateWaveform();
          }
        }).catch(() => {
          // If mic permission blocked, simulate subtle wave
          const interval = setInterval(() => {
            setWaveformBars(Array.from({ length: 18 }, () => Math.floor(Math.random() * 28) + 8));
          }, 100);
          return () => clearInterval(interval);
        });
      } catch (e) {
        // Fallback
      }
    } else {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      setWaveformBars(Array(18).fill(8));
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [isListening]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputPrompt.trim() || voiceTranscript.trim();
    if (!cmd) return;
    onExecuteCommand(cmd, false);
    setInputPrompt('');
    setVoiceTranscript('');
  };

  const handleSelectQuick = (order: string) => {
    setInputPrompt(order);
    onExecuteCommand(order, false);
  };

  return (
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 backdrop-blur-md relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-28 bg-cyan-500/5 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-10 w-72 h-20 bg-blue-600/5 blur-2xl pointer-events-none rounded-full" />

      <div className="relative z-10 flex flex-col gap-4">
        {/* Top header row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-neutral-800/90 border border-neutral-700/80 text-cyan-400 shadow-sm">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold tracking-wide text-neutral-100 uppercase">
                  AMARCO Executive Voice & Command Deck
                </h2>
                <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Speak commands directly with wake word &ldquo;AMARCO&rdquo; or dispatch high-accuracy workflows below.
              </p>
            </div>
          </div>

          {/* Voice status pill-less telemetry */}
          <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>ChaCha20 Tunnel Active</span>
            </span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>Zero-Trace IP Cloak</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-neutral-300">Local Daemon Ready</span>
          </div>
        </div>

        {/* Real-time Voice Waveform Visualizer & Live Transcript Area */}
        <div className={`p-4 rounded-lg border transition-all ${
          isListening 
            ? 'bg-neutral-950/80 border-cyan-500/40 shadow-lg shadow-cyan-950/20' 
            : 'bg-neutral-950/40 border-neutral-800/80'
        }`}>
          <div className="flex items-center justify-between gap-4">
            {/* Mic button and state */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onToggleMic}
                className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 ring-4 ring-rose-500/20 animate-pulse'
                    : 'bg-neutral-800 text-cyan-400 hover:bg-neutral-700 hover:text-cyan-300 border border-neutral-700'
                }`}
                title={isListening ? 'Click to stop listening' : 'Click to speak to AMARCO'}
              >
                {isListening ? <Radio className="w-6 h-6 animate-spin" /> : <Mic className="w-6 h-6" />}
              </button>

              <div className="flex flex-col">
                <span className="text-xs font-semibold text-neutral-200">
                  {isListening ? 'Listening to voice stream...' : 'Voice input standby'}
                </span>
                <span className="text-[11px] text-neutral-400 font-mono">
                  {isListening ? 'Say "AMARCO, execute..."' : 'Wake word: "Hey AMARCO" or click mic'}
                </span>
              </div>
            </div>

            {/* Dynamic Waveform Visualizer */}
            <div className="flex items-end gap-1.5 h-12 px-3 py-1 bg-neutral-900/60 rounded-md border border-neutral-800/60">
              {waveformBars.map((height, idx) => (
                <div
                  key={idx}
                  style={{ height: `${height}px` }}
                  className={`w-1 rounded-full transition-all duration-75 ${
                    isListening
                      ? 'bg-gradient-to-t from-cyan-500 to-emerald-400'
                      : 'bg-neutral-700/60'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Live Transcript / Feedback */}
          {(voiceTranscript || isListening) && (
            <div className="mt-3 pt-3 border-t border-neutral-800/60 flex items-start gap-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
              <div className="flex-1 text-xs">
                <span className="text-neutral-400 font-mono">LIVE SPEECH: </span>
                <span className="text-neutral-100 font-medium font-mono">
                  {voiceTranscript || 'Waiting for spoken order...'}
                </span>
              </div>
              {voiceTranscript && (
                <button
                  type="button"
                  onClick={() => {
                    onExecuteCommand(voiceTranscript, true);
                    setVoiceTranscript('');
                  }}
                  className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium font-sans flex items-center gap-1 transition-colors"
                >
                  <Send className="w-3 h-3" />
                  <span>Execute Order</span>
                </button>
              )}
            </div>
          )}

          {/* Last Spoken Agent Acknowledgment */}
          {lastAudioResponse && !isListening && (
            <div className="mt-2.5 pt-2.5 border-t border-neutral-800/60 flex items-center gap-2 text-xs text-neutral-300">
              <Volume2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="text-neutral-400 font-mono">AMARCO AUDIO RESPONSE:</span>
              <span className="text-neutral-200 italic font-mono truncate">{lastAudioResponse}</span>
            </div>
          )}
        </div>

        {/* Command Input Form with instant execute */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Command AMARCO... (e.g. 'Launch multi-channel social campaign and query global cloud database')"
              disabled={isExecuting}
              className="w-full h-11 px-4 pr-10 rounded-lg bg-neutral-950/80 border border-neutral-800 focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/50 text-neutral-100 text-sm placeholder:text-neutral-500 outline-none transition-all font-sans"
            />
            {inputPrompt && (
              <button
                type="button"
                onClick={() => setInputPrompt('')}
                className="absolute right-3 top-3 text-xs text-neutral-500 hover:text-neutral-300"
              >
                Clear
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isExecuting || (!inputPrompt.trim() && !voiceTranscript.trim())}
            className={`h-11 px-5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
              isExecuting
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                : 'bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white shadow-md shadow-cyan-600/20'
            }`}
          >
            {isExecuting ? (
              <>
                <div className="w-4 h-4 border-2 border-neutral-400 border-t-cyan-400 rounded-full animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <span>Execute</span>
                <CornerDownLeft className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Quick order triggers */}
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
            Quick Autonomous Operational Commands
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickOrders.map((order, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectQuick(order)}
                disabled={isExecuting}
                className="text-left p-2.5 rounded-lg bg-neutral-950/60 hover:bg-neutral-800/80 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white transition-all text-xs flex items-center justify-between group"
              >
                <span className="truncate pr-2 font-mono">{order}</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
