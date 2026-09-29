import React, { useState } from 'react';
import { 
  Globe, 
  Send, 
  Share2, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  Copy, 
  Check, 
  ShieldCheck, 
  Sparkles,
  BarChart3,
  Calendar,
  Zap,
  Radio
} from 'lucide-react';

interface CampaignItem {
  id: string;
  name: string;
  objective: string;
  platforms: string[];
  status: 'active' | 'scheduled' | 'syndicated';
  reachProjection: string;
  contentMap: Record<string, string>;
  tunnelRoute: string;
  lastUpdated: string;
}

interface CampaignOrchestratorProps {
  onDispatchCampaignOrder: (commandText: string) => void;
  isExecuting: boolean;
}

export const CampaignOrchestrator: React.FC<CampaignOrchestratorProps> = ({
  onDispatchCampaignOrder,
  isExecuting,
}) => {
  const [targetTopic, setTargetTopic] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    'X (Twitter)',
    'LinkedIn',
    'Reddit',
    'Telegram Global',
  ]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const availablePlatforms = [
    'X (Twitter)',
    'LinkedIn',
    'Reddit',
    'Telegram Global',
    'YouTube Community',
    'Discord Enterprise',
  ];

  const [campaigns, setCampaigns] = useState<CampaignItem[]>([
    {
      id: 'CAMP-881',
      name: 'AMARCO Autonomous Sovereign Agent Global Rollout',
      objective: 'Multi-platform announcement emphasizing local privacy, zero-trace encrypted tunnels, and voice automation.',
      platforms: ['X (Twitter)', 'LinkedIn', 'Reddit', 'Telegram Global'],
      status: 'syndicated',
      reachProjection: '480,000+ targeted nodes',
      tunnelRoute: 'Zurich -> Tokyo Encrypted Tunnel (Zero Origin Exposure)',
      lastUpdated: '18 minutes ago',
      contentMap: {
        'X (Twitter)':
          'Say goodbye to clunky assistants. Meet AMARCO: your sovereign desktop executive AI agent. Offline local computing, real-time voice activation, and WireGuard encrypted stealth tunnels. Fulfilling complex cross-app commands with zero human intervention. #AutonomousAI #Privacy #AMARCO #Tech2026',
        LinkedIn:
          'Announcing the next paradigm in executive workstation orchestration: AMARCO.\n\nAMARCO bridges local desktop operating system efficiency with worldwide cloud intelligence. By utilizing an automated encrypted tunnel, operations are executed with zero identity leakage and 100% mathematical precision.\n\nKey capabilities:\n- Real-time voice command fulfillment\n- Seamless cross-platform campaign syndication\n- Local air-gap & cloud database replication\n\nThe future of sovereign autonomous compute is here.',
        Reddit:
          '[Release] AMARCO: Sovereign Desktop AI Orchestrator with real-time voice commands, local offline execution, and encrypted mesh routing. No telemetry, full workflow automation. Open architecture details in thread.',
        'Telegram Global':
          '🚀 [BROADCAST] AMARCO autonomous agent active on global relays. Encrypted tunnel confirmed. Worldwide syndication operational.',
      },
    },
    {
      id: 'CAMP-882',
      name: 'Worldwide Tech Intelligence & Unrestricted Trend Brief',
      objective: 'Syndicate deep-dive analytical synthesis of edge AI computing and cryptographic sovereign workflows.',
      platforms: ['X (Twitter)', 'LinkedIn', 'YouTube Community'],
      status: 'active',
      reachProjection: '290,000+ impressions',
      tunnelRoute: 'Reykjavik Node Mesh Relay',
      lastUpdated: '2 hours ago',
      contentMap: {
        'X (Twitter)':
          'Edge compute analysis: Local offline models combined with stealth tunnel routing reduce enterprise latency by 74% while eliminating third-party tracking. Full operational breakdown compiled by AMARCO. #DataSovereignty',
        LinkedIn:
          'Deep Dive: Why autonomous workflow automation is shifting toward local-first architecture with encrypted relays. AMARCO analyzed 14,000 enterprise datapoints this quarter to reveal the core shift.',
        'YouTube Community':
          'New system briefing live: See how AMARCO fulfills voice orders in real time across local apps and global databases.',
      },
    },
  ]);

  const togglePlatform = (p: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTopic.trim()) return;

    const fullCommand = `Launch autonomous multi-platform campaign for: "${targetTopic}". Target platforms: ${selectedPlatforms.join(
      ', '
    )}. Formulate customized copy for each channel, engagement triggers, and schedule delivery through the encrypted stealth tunnel with zero IP disclosure.`;

    onDispatchCampaignOrder(fullCommand);
    setTargetTopic('');
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Top Banner & Fast Dispatch */}
      <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-5 backdrop-blur-md flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-neutral-800 border border-neutral-700 text-cyan-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-neutral-100 uppercase">
                Global Social Media & Multi-Platform Syndication
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                AMARCO coordinates campaigns across global networks with encrypted origin masking and high-accuracy delivery.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Identity Cloak Engaged</span>
            </span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>Worldwide Mesh Dispatch</span>
          </div>
        </div>

        {/* Campaign Creation Form */}
        <form onSubmit={handleLaunchCampaign} className="flex flex-col gap-3 pt-2 border-t border-neutral-800/80">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-300">
              Campaign Objective or Announcement Brief:
            </label>
            <input
              type="text"
              value={targetTopic}
              onChange={(e) => setTargetTopic(e.target.value)}
              placeholder="e.g. 'Announce new enterprise cybersecurity breakthrough with high virality and engagement hooks'"
              disabled={isExecuting}
              className="w-full h-11 px-4 rounded-lg bg-neutral-950/80 border border-neutral-800 focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/50 text-neutral-100 text-sm placeholder:text-neutral-500 outline-none transition-all font-sans"
            />
          </div>

          {/* Platform selection chips (interactive buttons) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-400 font-mono">Target Platforms:</span>
            {availablePlatforms.map((plat) => {
              const isSelected = selectedPlatforms.includes(plat);
              return (
                <button
                  key={plat}
                  type="button"
                  onClick={() => togglePlatform(plat)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-700/80 shadow-sm'
                      : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-neutral-200'
                  }`}
                >
                  {plat}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isExecuting || !targetTopic.trim() || selectedPlatforms.length === 0}
              className={`h-10 px-5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                isExecuting
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Synthesize & Syndicate with AMARCO</span>
            </button>
          </div>
        </form>
      </div>

      {/* Active Campaign Cards */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
            Active Global Campaigns & Syndication Manifests
          </h3>
          <span className="text-xs text-neutral-500 font-mono">
            {campaigns.length} Automated Campaigns Running
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 backdrop-blur-md flex flex-col gap-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-neutral-100">{camp.name}</span>
                    <span className="text-[11px] font-mono text-emerald-400">
                      {camp.status.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400">{camp.objective}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono">
                  <span>Reach: <strong className="text-neutral-200">{camp.reachProjection}</strong></span>
                  <span aria-hidden="true" className="text-neutral-600">·</span>
                  <span>{camp.lastUpdated}</span>
                </div>
              </div>

              {/* Tunnel Route Telemetry */}
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800/80">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-neutral-500">ENCRYPTED ROUTE:</span>
                <span className="text-neutral-300 truncate">{camp.tunnelRoute}</span>
              </div>

              {/* Multi-platform Copy Accordions / Previews */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(camp.contentMap).map(([platform, text]) => {
                  const key = `${camp.id}-${platform}`;
                  return (
                    <div
                      key={platform}
                      className="p-3 rounded-lg bg-neutral-950/80 border border-neutral-800/90 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-neutral-200 font-mono">{platform}</span>
                        <button
                          onClick={() => handleCopy(key, text)}
                          className="text-neutral-400 hover:text-cyan-400 transition-colors p-1"
                          title="Copy copy to clipboard"
                        >
                          {copiedKey === key ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-neutral-300 font-sans leading-relaxed whitespace-pre-line line-clamp-4 select-text">
                        {text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
