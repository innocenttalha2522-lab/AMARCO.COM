export interface ExecutionStep {
  id: string;
  label: string;
  environment: 'local' | 'tunnel' | 'cloud' | 'social_api';
  status: 'pending' | 'active' | 'done';
  outputSnippet?: string;
}

export interface SecurityVerification {
  encryptedTunnel: boolean;
  ipCloakNode: string;
  localSignatureVerified: boolean;
  latencyMs: number;
}

export interface ResultPayload {
  title: string;
  summary: string;
  category: 'social_campaign' | 'system_automation' | 'intelligence_report' | 'database_operation' | 'file_action';
  dataPoints?: Record<string, any>;
  generatedContent?: string;
  platformsTargeted?: string[];
  recordsAffected?: number;
  securityVerification: SecurityVerification;
}

export interface TaskExecution {
  id: string;
  command: string;
  timestamp: string;
  status: 'planning' | 'routing' | 'executing' | 'completed' | 'failed';
  mode: 'local' | 'cloud' | 'hybrid';
  privacyLevel: 'stealth_tunnel' | 'airgap_local' | 'mesh_vpn';
  audioSummary: string;
  executionSteps: ExecutionStep[];
  resultPayload: ResultPayload;
}

export interface SystemStatus {
  status: string;
  agentName: string;
  version: string;
  tunnel: {
    connected: boolean;
    protocol: string;
    cipher: string;
    cloakNode: string;
    exitNode: string;
    realIpMasked: boolean;
    encryptionStrength: string;
    latencyMs: number;
    packetsSec: number;
  };
  localEngine: {
    runningLocally: true;
    airgapCapable: true;
    voiceEngineReady: true;
    daemonProcess: string;
    cpuUtilization: string;
    memoryUsed: string;
  };
  cloudSync: {
    status: string;
    endpointsConnected: number;
    lastSync: string;
    pendingQueued: number;
  };
}

export interface DatabaseRecord {
  id: string;
  source: string;
  category: string;
  title: string;
  status: 'synced' | 'pending' | 'isolated';
  confidentiality: 'Top-Secret' | 'Restricted' | 'Encrypted';
  updatedAt: string;
  details: string;
  metrics?: Record<string, string | number>;
}

export interface WorkflowRecipe {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'Intelligence' | 'Social Automation' | 'Local Operations' | 'Security';
  triggerType: 'Voice Command' | 'Autonomous Event' | 'Scheduled Cron';
  commandPrompt: string;
  platforms: string[];
  estimatedRuntime: string;
  stealthLevel: 'High' | 'Maximum Stealth' | 'Airgap';
}
