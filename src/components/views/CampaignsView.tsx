import React, { useState } from 'react';
import {
  Share2,
  Plus,
  Send,
  Eye,
  Heart,
  Repeat2,
  CheckCircle,
  Clock,
  Shield,
  Lock,
  Globe,
  Sparkles,
} from 'lucide-react';
import { SocialCampaign, SocialPost } from '../../types/amarco';
import { soundManager } from '../../utils/audio';

interface CampaignsViewProps {
  campaigns: SocialCampaign[];
  onDeployCampaign: (campaignId: string) => void;
  onGenerateNewCampaign: (topic: string, platforms: string[]) => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({
  campaigns,
  onDeployCampaign,
  onGenerateNewCampaign,
}) => {
  const [topicInput, setTopicInput] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    'X / Twitter',
    'LinkedIn',
    'Reddit',
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const availablePlatforms = [
    'X / Twitter',
    'LinkedIn',
    'Instagram',
    'TikTok',
    'Reddit',
    'YouTube',
  ];

  const togglePlatform = (p: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim() || isGenerating) return;
    setIsGenerating(true);
    soundManager.playActivate();
    onGenerateNewCampaign(topicInput.trim(), selectedPlatforms);
    setTimeout(() => {
      setIsGenerating(false);
      setTopicInput('');
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-neutral-900/60 border border-neutral-800 rounded-3xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-cyan-400 font-semibold uppercase tracking-wider">
              WORLDWIDE SOCIAL MEDIA CAMPAIGN MATRIX
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">· Cloaked Residential Proxies</span>
          </div>
          <h1 className="text-lg font-bold text-neutral-100 mt-1">
            Global Social Campaign Orchestration
          </h1>
          <p className="text-xs text-neutral-400 max-w-xl mt-0.5">
            AMARCO accesses all major social media platforms secretly without exposing user IP address, automatically crafting, scheduling, and deploying viral campaigns.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-2 text-neutral-300">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Proxy: Zurich Residential</span>
          </div>
        </div>
      </div>

      {/* Campaign Generator Box */}
      <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-mono font-bold text-neutral-200 uppercase tracking-wider">
              AUTONOMOUS CAMPAIGN SYNTHESIZER
            </h2>
          </div>
          <span className="text-[11px] text-neutral-500 font-mono">Real-time Generation</span>
        </div>

        <form onSubmit={handleCreate} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="Enter campaign subject, product launch, or market message to broadcast..."
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-2xl text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-cyan-500/60"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Platform toggles */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono text-neutral-500 mr-1">PLATFORMS:</span>
              {availablePlatforms.map((p) => {
                const active = selectedPlatforms.includes(p);
                return (
                  <button
                    type="button"
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                      active
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-neutral-200'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={!topicInput.trim() || isGenerating}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 disabled:opacity-40 disabled:pointer-events-none text-neutral-950 font-semibold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all font-mono"
            >
              {isGenerating ? (
                <span>Synthesizing...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Synthesize & Queue Campaign</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Campaigns List */}
      <div className="space-y-6">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="p-5 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-4"
          >
            {/* Campaign Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 uppercase">
                    {camp.status}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    Total Reach: <strong className="text-neutral-200">{camp.totalReach}</strong>
                  </span>
                </div>
                <h2 className="text-base font-bold text-neutral-100 mt-1">
                  {camp.name}
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {camp.targetObjective}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundManager.playActivate();
                    onDeployCampaign(camp.id);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-mono font-semibold text-neutral-200 rounded-xl border border-neutral-700 transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Broadcast Updates</span>
                </button>
              </div>
            </div>

            {/* Campaign Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {camp.posts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col justify-between p-4 rounded-2xl bg-neutral-950 border border-neutral-850 hover:border-neutral-750 transition-all space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {post.platform}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-850 text-neutral-400">
                        {post.status}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed font-sans italic">
                      "{post.content}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-850/80 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                      <span>Proxy Route:</span>
                      <span className="text-emerald-400">{post.stealthProxy}</span>
                    </div>
                    {post.engagement && (
                      <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-neutral-500" /> {post.engagement.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-rose-500/80" /> {post.engagement.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Repeat2 className="w-3 h-3 text-cyan-400/80" /> {post.engagement.reposts}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer security info */}
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-2 border-t border-neutral-850">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Encrypted Tunnel: {camp.encryptedTunnelUsed}</span>
              </div>
              <span>Updated {camp.lastUpdated}</span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
