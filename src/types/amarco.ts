export type ViewType = 
  | 'terminal' 
  | 'workflows' 
  | 'campaigns' 
  | 'databases' 
  | 'tunnel' 
  | 'audit';

export type ExecutionMode = 'cloud-neural' | 'local-stealth' | 'offline-isolated';

export interface TunnelNode {
  id: string;
  city: string;
  country: string;
  flag: string;
  ip: string;
  latencyMs: number;
  cipher: string;
  loadPercent: number;
}

export interface TunnelState {
  enabled: boolean;
  protocol: 'WireGuard v2' | 'AES-256-GCM' | 'Shadowsocks-AEAD' | 'Tor-Onion-Relay';
  activeNode: TunnelNode;
  maskedIp: string;
  realIpHidden: boolean;
  killSwitch: boolean;
  dnsLeakProtection: boolean;
  stealthScore: number; // 0 - 100
  bytesEncrypted: number;
}

export interface TaskStep {
  id: string;
  title: string;
  application: string;
  action: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  detail: string;
  durationMs: number;
  iconName?: string;
}

export interface ExecutionArtifact {
  type: 'campaign' | 'database' | 'intelligence' | 'automation' | 'report' | 'code';
  title: string;
  summary: string;
  content: string;
  rawJson?: any;
  metrics?: { label: string; value: string | number }[];
  downloadName?: string;
}

export interface CommandExecution {
  id: string;
  timestamp: string;
  command: string;
  voiceTriggered: boolean;
  mode: ExecutionMode;
  status: 'idle' | 'running' | 'completed' | 'failed';
  thought: string;
  securityProfile: {
    tunnelProtocol: string;
    exitNode: string;
    maskedIp: string;
    identityProtection: string;
  };
  steps: TaskStep[];
  artifact?: ExecutionArtifact;
  spokenResponse?: string;
  executionTimeMs?: number;
}

export interface SocialPost {
  id: string;
  platform: 'X / Twitter' | 'LinkedIn' | 'Instagram' | 'TikTok' | 'Reddit' | 'YouTube';
  content: string;
  scheduledTime: string;
  status: 'published' | 'scheduled' | 'optimizing';
  stealthProxy: string;
  engagement?: {
    views?: string;
    likes?: string;
    reposts?: string;
  };
}

export interface SocialCampaign {
  id: string;
  name: string;
  targetObjective: string;
  platforms: string[];
  status: 'active' | 'scheduled' | 'completed' | 'paused';
  totalReach: string;
  posts: SocialPost[];
  encryptedTunnelUsed: string;
  lastUpdated: string;
}

export interface DatabaseNode {
  id: string;
  name: string;
  provider: 'PostgreSQL Cloud' | 'Google BigQuery' | 'Supabase Global' | 'AWS Aurora' | 'Encrypted Local SQLite';
  region: string;
  recordsCount: number;
  lastSynced: string;
  status: 'connected' | 'syncing' | 'offline' | 'error';
  tables: string[];
  stealthTunnelActive: boolean;
}

export interface AutomationWorkflow {
  id: string;
  title: string;
  category: 'social' | 'database' | 'intelligence' | 'security' | 'desktop';
  description: string;
  trigger: string;
  appsInvolved: string[];
  autoExecute: boolean;
  runsCount: number;
  lastRunTime: string;
  status: 'active' | 'standby';
  stepsPreview: string[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  commandSnippet: string;
  operator: string;
  executionMode: string;
  durationMs: number;
  tunnelNode: string;
  status: 'SUCCESS' | 'SECURE_COMPLETED' | 'ISOLATED';
  hashSignature: string;
}
