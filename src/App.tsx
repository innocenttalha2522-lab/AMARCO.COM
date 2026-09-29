/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ViewType, ExecutionMode, TunnelState, TunnelNode, CommandExecution, AutomationWorkflow, SocialCampaign } from './types/amarco';
import {
  INITIAL_TUNNEL_NODES,
  INITIAL_CAMPAIGNS,
  INITIAL_DATABASES,
  INITIAL_WORKFLOWS,
  INITIAL_AUDIT_LOGS,
  INITIAL_EXECUTION,
} from './utils/initialData';
import { soundManager } from './utils/audio';
import { Taskbar } from './components/Taskbar';
import { VoiceHUD } from './components/VoiceHUD';
import { CommandPalette } from './components/CommandPalette';
import { CommandTerminalView } from './components/views/CommandTerminalView';
import { WorkflowsView } from './components/views/WorkflowsView';
import { CampaignsView } from './components/views/CampaignsView';
import { DatabasesView } from './components/views/DatabasesView';
import { StealthTunnelView } from './components/views/StealthTunnelView';
import { AuditLogView } from './components/views/AuditLogView';
import { generateFallbackAutonomousExecution } from './server/agentEngine';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('terminal');
  const [availableNodes] = useState<TunnelNode[]>(INITIAL_TUNNEL_NODES);

  // Encrypted Tunnel State
  const [tunnel, setTunnel] = useState<TunnelState>({
    enabled: true,
    protocol: 'AES-256-GCM',
    activeNode: INITIAL_TUNNEL_NODES[0],
    maskedIp: INITIAL_TUNNEL_NODES[0].ip,
    realIpHidden: true,
    killSwitch: true,
    dnsLeakProtection: true,
    stealthScore: 100,
    bytesEncrypted: 48920194,
  });

  // Autonomous Execution State
  const [execution, setExecution] = useState<CommandExecution | null>(INITIAL_EXECUTION);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [history, setHistory] = useState<CommandExecution[]>([INITIAL_EXECUTION]);

  // Voice & Modals
  const [isVoiceHUDOpen, setIsVoiceHUDOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [voiceAudioEnabled, setVoiceAudioEnabled] = useState(true);

  // Multi-Application Data Stores
  const [campaigns, setCampaigns] = useState<SocialCampaign[]>(INITIAL_CAMPAIGNS);
  const [databases, setDatabases] = useState(INITIAL_DATABASES);
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>(INITIAL_WORKFLOWS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  // Global hotkeys (Cmd+K for palette, Alt+V for voice)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.altKey && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        setIsVoiceHUDOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Main autonomous execution dispatcher
  const executeCommand = useCallback(
    async (cmd: string, mode: ExecutionMode = 'cloud-neural', voiceTriggered: boolean = false) => {
      setIsExecuting(true);
      setCurrentView('terminal');
      soundManager.playActivate();

      try {
        const response = await fetch('/api/amarco/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            command: cmd,
            voiceTriggered,
            mode,
            tunnelProtocol: tunnel.protocol,
            exitNode: `${tunnel.activeNode.city} (${tunnel.activeNode.country})`,
            maskedIp: tunnel.maskedIp,
          }),
        });

        let data: CommandExecution;
        if (response.ok) {
          const raw = await response.json();
          if (raw.steps && raw.artifact) {
            data = raw;
          } else if (raw.execution) {
            const ex = raw.execution;
            data = {
              id: ex.id || `exec-${Date.now()}`,
              timestamp: ex.timestamp || new Date().toISOString(),
              command: ex.command || cmd,
              voiceTriggered,
              mode,
              status: 'completed',
              thought: ex.thought || ex.resultPayload?.summary || 'Autonomous task dispatched through encrypted tunnel.',
              securityProfile: {
                tunnelProtocol: tunnel.protocol,
                exitNode: `${tunnel.activeNode.city} (${tunnel.activeNode.country})`,
                maskedIp: tunnel.maskedIp,
                identityProtection: '100% Encrypted & Anonymous (Zero Trace)',
              },
              steps: (ex.executionSteps || ex.steps || []).map((s: any, idx: number) => ({
                id: s.id || `step-${idx}`,
                title: s.label || s.title || `Execute Subtask ${idx + 1}`,
                application: s.environment || s.application || 'AMARCO Engine',
                action: s.outputSnippet || s.action || 'Executed with zero leakage',
                status: 'completed',
                detail: s.outputSnippet || s.detail || 'Verified and sealed',
                durationMs: s.durationMs || 180,
              })),
              artifact: {
                type: (ex.resultPayload?.category as any) || 'automation',
                title: ex.resultPayload?.title || 'Autonomous Execution Deliverable',
                summary: ex.resultPayload?.summary || 'Completed autonomously without manual intervention.',
                content: ex.resultPayload?.generatedContent || ex.resultPayload?.summary || '',
                metrics: ex.resultPayload?.dataPoints
                  ? Object.entries(ex.resultPayload.dataPoints).map(([label, value]) => ({ label, value: String(value) }))
                  : undefined,
              },
              spokenResponse: ex.audioSummary || ex.spokenResponse || 'Command fulfilled autonomously with zero trace.',
              executionTimeMs: ex.executionTimeMs || 540,
            };
          } else {
            data = raw;
          }
        } else {
          // Graceful fallback to rich local deterministic engine
          data = generateFallbackAutonomousExecution(
            cmd,
            voiceTriggered,
            mode,
            tunnel.protocol,
            `${tunnel.activeNode.city} (${tunnel.activeNode.country})`,
            tunnel.maskedIp
          );
        }

        setExecution(data);
        setHistory((prev) => [data, ...prev.filter((item) => item.id !== data.id)]);

        // Log to immutable audit ledger
        const newLog = {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          commandSnippet: cmd,
          operator: 'Master Executive',
          executionMode: mode,
          durationMs: data.executionTimeMs || 640,
          tunnelNode: `${tunnel.activeNode.city} (${tunnel.maskedIp})`,
          status: 'SUCCESS' as const,
          hashSignature: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
        };
        setAuditLogs((prev) => [newLog, ...prev]);

        // Voice Feedback
        if (voiceAudioEnabled && data.spokenResponse) {
          soundManager.speak(data.spokenResponse);
        }

        soundManager.playTaskSuccess();
      } catch (err) {
        console.error('Execution request error:', err);
        const fallback = generateFallbackAutonomousExecution(
          cmd,
          voiceTriggered,
          mode,
          tunnel.protocol,
          `${tunnel.activeNode.city} (${tunnel.activeNode.country})`,
          tunnel.maskedIp
        );
        setExecution(fallback);
        setHistory((prev) => [fallback, ...prev]);

        if (voiceAudioEnabled && fallback.spokenResponse) {
          soundManager.speak(fallback.spokenResponse);
        }
      } finally {
        setIsExecuting(false);
      }
    },
    [tunnel, voiceAudioEnabled]
  );

  // Workflow trigger handler
  const handleTriggerWorkflow = (wf: AutomationWorkflow) => {
    executeCommand(`Execute autonomous workflow: ${wf.title}`, 'local-stealth', false);
  };

  // Social Campaign creation & deployment
  const handleGenerateNewCampaign = (topic: string, platforms: string[]) => {
    executeCommand(
      `Synthesize and schedule multi-platform campaign for: "${topic}" across ${platforms.join(', ')} with stealth residential proxies`,
      'cloud-neural',
      false
    );

    // Also add to active campaigns list
    const newCamp: SocialCampaign = {
      id: `camp-${Date.now()}`,
      name: topic.length > 30 ? topic.slice(0, 30) + '...' : topic,
      targetObjective: `Autonomous engagement broadcast on ${topic}`,
      platforms,
      status: 'active',
      totalReach: '64,200 impressions',
      encryptedTunnelUsed: `${tunnel.activeNode.city} Residential Gateway`,
      lastUpdated: 'Just now',
      posts: platforms.map((p, i) => ({
        id: `post-${Date.now()}-${i}`,
        platform: p as any,
        content: `Autonomous intelligence update: Delivering breakthroughs in ${topic}. Executed via encrypted zero-trace protocols. #AMARCO #Tech2026`,
        scheduledTime: 'Queued for optimal distribution',
        status: 'published',
        stealthProxy: `${tunnel.maskedIp} (${tunnel.activeNode.city})`,
        engagement: { views: '1.2K', likes: '94', reposts: '31' },
      })),
    };
    setCampaigns((prev) => [newCamp, ...prev]);
  };

  const handleDeployCampaign = (campaignId: string) => {
    const target = campaigns.find((c) => c.id === campaignId);
    if (!target) return;
    executeCommand(`Broadcast updates and scale distribution for campaign: ${target.name}`, 'cloud-neural', false);
  };

  // Database operations
  const handleTriggerDbSync = (dbId: string) => {
    const target = databases.find((d) => d.id === dbId);
    executeCommand(
      `Synchronize database partition ${target ? target.name : dbId} with local encrypted vault`,
      'local-stealth',
      false
    );
  };

  const handleExecuteQuery = (query: string, targetDb: string) => {
    executeCommand(`Execute encrypted SQL query: "${query}" on target database`, 'local-stealth', false);
  };

  // Tunnel controls
  const handleSelectTunnelNode = (node: TunnelNode) => {
    setTunnel((prev) => ({
      ...prev,
      activeNode: node,
      maskedIp: node.ip,
    }));
  };

  const handleToggleTunnel = () => {
    setTunnel((prev) => ({
      ...prev,
      enabled: !prev.enabled,
    }));
    soundManager.playActivate();
  };

  const handleToggleKillSwitch = () => {
    setTunnel((prev) => ({
      ...prev,
      killSwitch: !prev.killSwitch,
    }));
    soundManager.playActivate();
  };

  const handleToggleDnsProtection = () => {
    setTunnel((prev) => ({
      ...prev,
      dnsLeakProtection: !prev.dnsLeakProtection,
    }));
    soundManager.playActivate();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Desktop App Bar */}
      <header className="sticky top-0 z-30 w-full px-4 py-2.5 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-900">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Brand & Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
              </span>
              <span className="font-mono text-xs font-bold tracking-widest text-neutral-100">
                AMARCO
              </span>
              <span className="hidden sm:inline text-[10px] font-mono text-neutral-500">
                / AUTONOMOUS AGENT WORKSTATION
              </span>
            </div>
          </div>

          {/* Quick Voice Bar & Hotkey Hint */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsVoiceHUDOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-mono transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Voice Ready</span>
              <kbd className="hidden md:inline text-[9px] bg-neutral-900 px-1 py-0.2 rounded border border-neutral-800 text-neutral-400">
                Alt+V
              </kbd>
            </button>

            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 border border-neutral-800 rounded-xl text-xs font-mono transition-all"
            >
              <span>Command Bar</span>
              <kbd className="hidden md:inline text-[9px] bg-neutral-950 px-1 py-0.2 rounded border border-neutral-750 text-neutral-400">
                ⌘K
              </kbd>
            </button>
          </div>

        </div>
      </header>

      {/* Main Workspace Canvas */}
      <main className="flex-1 w-full px-4 pt-6">
        {currentView === 'terminal' && (
          <CommandTerminalView
            execution={execution}
            isExecuting={isExecuting}
            onExecute={executeCommand}
            onOpenVoice={() => setIsVoiceHUDOpen(true)}
            tunnel={tunnel}
            history={history}
            onSelectHistory={(h) => setExecution(h)}
          />
        )}

        {currentView === 'workflows' && (
          <WorkflowsView
            workflows={workflows}
            onTriggerWorkflow={handleTriggerWorkflow}
            onAddWorkflow={(wf) => setWorkflows((prev) => [wf, ...prev])}
          />
        )}

        {currentView === 'campaigns' && (
          <CampaignsView
            campaigns={campaigns}
            onDeployCampaign={handleDeployCampaign}
            onGenerateNewCampaign={handleGenerateNewCampaign}
          />
        )}

        {currentView === 'databases' && (
          <DatabasesView
            databases={databases}
            onTriggerSync={handleTriggerDbSync}
            onExecuteQuery={handleExecuteQuery}
          />
        )}

        {currentView === 'tunnel' && (
          <StealthTunnelView
            tunnel={tunnel}
            availableNodes={availableNodes}
            onSelectNode={handleSelectTunnelNode}
            onToggleTunnel={handleToggleTunnel}
            onToggleKillSwitch={handleToggleKillSwitch}
            onToggleDnsProtection={handleToggleDnsProtection}
          />
        )}

        {currentView === 'audit' && (
          <AuditLogView logs={auditLogs} />
        )}
      </main>

      {/* Voice Recognition & HUD Overlay */}
      <VoiceHUD
        isOpen={isVoiceHUDOpen}
        onClose={() => {
          setIsVoiceHUDOpen(false);
          setIsListening(false);
        }}
        onExecuteCommand={(cmd, voice) => executeCommand(cmd, 'cloud-neural', voice)}
        isListening={isListening}
        setIsListening={setIsListening}
      />

      {/* Quick Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onExecuteCommand={(cmd, mode) => executeCommand(cmd, mode, false)}
        onOpenVoice={() => {
          setIsCommandPaletteOpen(false);
          setIsVoiceHUDOpen(true);
        }}
      />

      {/* Persistent Desktop Taskbar */}
      <Taskbar
        currentView={currentView}
        onSelectView={(v) => setCurrentView(v)}
        tunnel={tunnel}
        isListening={isListening || isVoiceHUDOpen}
        onToggleVoice={() => setIsVoiceHUDOpen((prev) => !prev)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        voiceAudioEnabled={voiceAudioEnabled}
        onToggleVoiceAudio={() => setVoiceAudioEnabled((prev) => !prev)}
        isExecuting={isExecuting}
      />

    </div>
  );
}
