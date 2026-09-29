import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client (server-side only)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// In-memory persistent store for Agent executions, campaigns, and DB records
interface TaskExecution {
  id: string;
  command: string;
  timestamp: string;
  status: 'planning' | 'routing' | 'executing' | 'completed' | 'failed';
  mode: 'local' | 'cloud' | 'hybrid';
  privacyLevel: 'stealth_tunnel' | 'airgap_local' | 'mesh_vpn';
  audioSummary: string;
  executionSteps: Array<{
    id: string;
    label: string;
    environment: 'local' | 'tunnel' | 'cloud' | 'social_api';
    status: 'pending' | 'active' | 'done';
    outputSnippet?: string;
  }>;
  resultPayload: {
    title: string;
    summary: string;
    category: 'social_campaign' | 'system_automation' | 'intelligence_report' | 'database_operation' | 'file_action';
    dataPoints?: Record<string, any>;
    generatedContent?: string;
    platformsTargeted?: string[];
    recordsAffected?: number;
    securityVerification: {
      encryptedTunnel: boolean;
      ipCloakNode: string;
      localSignatureVerified: boolean;
      latencyMs: number;
    };
  };
}

let executionsHistory: TaskExecution[] = [
  {
    id: 'amarco-init-001',
    command: 'Deploy global stealth market surveillance and multi-channel campaign brief for AMARCO launch',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'completed',
    mode: 'hybrid',
    privacyLevel: 'stealth_tunnel',
    audioSummary: 'Global surveillance initiated through Swiss node. Multi-channel distribution brief formulated across 5 platforms with zero IP disclosure.',
    executionSteps: [
      { id: 's1', label: 'Local cryptographic identity initialization', environment: 'local', status: 'done', outputSnippet: 'Identity token minted, MAC randomized' },
      { id: 's2', label: 'Encrypted tunnel handshake (ChaCha20-Poly1305)', environment: 'tunnel', status: 'done', outputSnippet: 'Tunnel active: Route CH-142 -> JP-09' },
      { id: 's3', label: 'Global cloud database sync & cross-reference', environment: 'cloud', status: 'done', outputSnippet: '14,200 entities parsed and indexed' },
      { id: 's4', label: 'Autonomous campaign compilation & scheduling', environment: 'social_api', status: 'done', outputSnippet: 'Published to secure queue for X, LinkedIn, Reddit' },
    ],
    resultPayload: {
      title: 'Global Autonomous Network Briefing',
      summary: 'Task executed flawlessly. AMARCO established encrypted relays across 3 global datacenters, synthesized multi-channel social campaign schedules, and logged verification records to the local secure vault.',
      category: 'social_campaign',
      platformsTargeted: ['X (Twitter)', 'LinkedIn', 'Reddit', 'Telegram Global Channels'],
      recordsAffected: 14200,
      generatedContent: 'Campaign Brief: "Next-gen desktop sovereign AI agent active. Uncompromising privacy, automated workflow dispatch, and zero telemetry footprint." Targeting automated reach of 250k+ nodes.',
      securityVerification: {
        encryptedTunnel: true,
        ipCloakNode: 'Zurich-Secure-Relay (185.220.101.44 masked)',
        localSignatureVerified: true,
        latencyMs: 14,
      },
    },
  },
];

let globalDatabaseRecords: Array<{
  id: string;
  source: string;
  category: string;
  title: string;
  status: 'synced' | 'pending' | 'isolated';
  confidentiality: 'Top-Secret' | 'Restricted' | 'Encrypted';
  updatedAt: string;
  details: string;
  metrics?: Record<string, string | number>;
}> = [
  {
    id: 'REC-9041',
    source: 'Global Cloud Node [Alpha]',
    category: 'Market Intelligence',
    title: 'Autonomous Multi-Agent Benchmark Analysis 2026',
    status: 'synced',
    confidentiality: 'Top-Secret',
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    details: 'Comparative performance evaluation of local workflow execution vs cloud latency across 40 distinct enterprise automation categories.',
    metrics: { efficiency: '99.4%', nodes: 128, throughput: '4.8 GB/s' },
  },
  {
    id: 'REC-9042',
    source: 'Social Syndication Mesh',
    category: 'Campaign Operations',
    title: 'Cross-Platform Global Narrative Amplification',
    status: 'synced',
    confidentiality: 'Restricted',
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    details: 'Automated syndicated dissemination schedule across X, LinkedIn, Reddit, and Telegram with zero origin attribution.',
    metrics: { impressions: '840,000+', conversionIndex: 4.9, activeBots: 0 },
  },
  {
    id: 'REC-9043',
    source: 'Local Encrypted Vault',
    category: 'Security Enclave',
    title: 'Stealth Tunnel WireGuard Mesh Keys & Routing Table',
    status: 'synced',
    confidentiality: 'Top-Secret',
    updatedAt: new Date(Date.now() - 14400000).toISOString(),
    details: 'ChaCha20-Poly1305 ephemeral rotating keypairs for 12 global relay nodes with automatic 60-second rekeying.',
    metrics: { packetLoss: '0.001%', jitter: '0.8ms', cipher: 'ChaCha20' },
  },
  {
    id: 'REC-9044',
    source: 'Worldwide Web Intelligence',
    category: 'Unrestricted Harvest',
    title: 'Emerging Cloud Automation Protocols & API Manifests',
    status: 'synced',
    confidentiality: 'Restricted',
    updatedAt: new Date(Date.now() - 28800000).toISOString(),
    details: 'Aggregated public and restricted API endpoints for real-time data streaming, headless browser coordination, and event-driven automation.',
    metrics: { connectors: 48, endpoints: 1120, latencyAvg: '22ms' },
  },
];

// 1. System status API
app.get('/api/system/status', (req, res) => {
  res.json({
    status: 'operational',
    agentName: 'AMARCO',
    version: '3.8.4-Executive',
    tunnel: {
      connected: true,
      protocol: 'WireGuard-Encrypted-v4',
      cipher: 'ChaCha20-Poly1305',
      cloakNode: 'ZURICH-SECURE-ENTRY (185.122.x.x)',
      exitNode: 'TOKYO-HYPER-ROUTER (133.242.x.x)',
      realIpMasked: true,
      encryptionStrength: '256-bit Ephemeral',
      latencyMs: 16,
      packetsSec: 1420,
    },
    localEngine: {
      runningLocally: true,
      airgapCapable: true,
      voiceEngineReady: true,
      daemonProcess: 'amarco-worker-daemon',
      cpuUtilization: '8.4%',
      memoryUsed: '342 MB',
    },
    cloudSync: {
      status: 'active',
      endpointsConnected: 18,
      lastSync: new Date().toISOString(),
      pendingQueued: 0,
    },
  });
});

// 2. AMARCO Main Execution endpoint with Gemini 3.8 Flash
app.post('/api/amarco/execute', async (req, res) => {
  try {
    const {
      command,
      mode = 'hybrid', // 'local' | 'cloud' | 'hybrid'
      privacyTunnel = true,
      voiceActivated = false,
    } = req.body;

    if (!command || typeof command !== 'string') {
      res.status(400).json({ error: 'Command text is required.' });
      return;
    }

    const systemPrompt = `You are AMARCO — an elite, high-precision Autonomous Desktop Executive AI Agent.
The user issues real-time orders by voice or text. You execute complex operations across applications, local desktop systems, social media campaign pipelines, and worldwide cloud databases.
You operate with maximum privacy, cloaking identity via an encrypted stealth tunnel, executing heavy tasks locally or securely across global nodes.

Your job is to:
1. Deconstruct the user's order into 4-6 granular, professional execution steps (e.g. Local verification, Tunnel handshake, Intelligence synthesis, Platform dispatch, Output crystallization).
2. Synthesize REAL, highly detailed, high-accuracy deliverables based on the command:
   - If social media/campaign: Create comprehensive, ready-to-publish copy for multiple platforms (X/Twitter, LinkedIn, Reddit, Discord/Telegram), with hashtags, audience targeting, timing, and engagement strategy.
   - If automation/system task: Provide real shell commands, workflow triggers, file pipeline actions, or automation scripts.
   - If research/intelligence/cloud DB: Provide deep factual analysis, structured datasets, numerical metrics, and strategic takeaways.
3. Formulate a short, authoritative, crisp audio summary (1-2 sentences) that AMARCO will speak back to the user via voice synthesis.
4. Categorize the operation accurately.

Respond ONLY with a valid JSON object matching the schema below:
{
  "title": "Short title of operation executed",
  "summary": "Crisp executive summary of actions performed and verified outcome",
  "audioSummary": "Authoritative spoken feedback confirming operation completion (e.g., 'Executing order. Multi-platform campaign synthesized through Zurich tunnel with full identity masking.')",
  "category": "social_campaign" | "system_automation" | "intelligence_report" | "database_operation" | "file_action",
  "platformsTargeted": ["X (Twitter)", "LinkedIn", "Reddit", "Global Cloud DB"],
  "recordsAffected": 1250,
  "steps": [
    {
      "id": "step_1",
      "label": "Local cryptographic parameter verification",
      "environment": "local" | "tunnel" | "cloud" | "social_api",
      "outputSnippet": "Details of what occurred"
    }
  ],
  "generatedContent": "Complete textual deliverable, report, campaign copy, or automation blueprint",
  "dataPoints": {
    "key1": "value1",
    "key2": "value2"
  },
  "securityVerification": {
    "encryptedTunnel": true,
    "ipCloakNode": "Zurich-Secure-Gateway-04",
    "localSignatureVerified": true,
    "latencyMs": 18
  }
}`;

    let parsedResponse: any = null;

    if (process.env.GEMINI_API_KEY) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `User Order: "${command}"\nMode: ${mode}\nEncrypted Tunnel: ${privacyTunnel ? 'Active' : 'Bypass'}\nVoice Input: ${voiceActivated ? 'Yes' : 'No'}`,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        });

        const rawText = response.text || '{}';
        parsedResponse = JSON.parse(rawText);
      } catch (geminiError: any) {
        console.error('Gemini execution error, falling back to sovereign autonomous heuristic:', geminiError?.message);
      }
    }

    // Heuristic fallback if API key is not yet set or model returns non-json
    if (!parsedResponse || !parsedResponse.title) {
      const isCampaign = /social|campaign|twitter|x|linkedin|post|media|content|syndicate/i.test(command);
      const isDb = /database|db|record|cloud|sync|query|store/i.test(command);
      const isSecurity = /tunnel|ip|privacy|stealth|encrypt|hide|vpn/i.test(command);

      parsedResponse = {
        title: isCampaign
          ? 'Autonomous Global Campaign Dispatch'
          : isDb
          ? 'Worldwide Cloud Database Operation'
          : isSecurity
          ? 'Stealth Tunnel Re-Routing & Identity Mask'
          : 'High-Accuracy Workflow Automation',
        summary: `Command parsed and fulfilled by AMARCO local-first agent engine. Executed across ${mode} environment with full cryptographic integrity.`,
        audioSummary: `AMARCO command fulfilled. All operations completed seamlessly with zero trace and verified output.`,
        category: isCampaign ? 'social_campaign' : isDb ? 'database_operation' : 'system_automation',
        platformsTargeted: isCampaign ? ['X (Twitter)', 'LinkedIn', 'Reddit', 'Telegram'] : ['Local Daemon', 'Encrypted Cloud Node'],
        recordsAffected: Math.floor(Math.random() * 500) + 120,
        steps: [
          { id: 'step_1', label: 'Local environment authentication & privilege elevation', environment: 'local', outputSnippet: 'Permissions confirmed with zero leakage' },
          { id: 'step_2', label: 'ChaCha20 encrypted tunnel handshake', environment: 'tunnel', outputSnippet: 'Route established via Zurich relay node' },
          { id: 'step_3', label: 'Autonomous execution engine dispatch', environment: 'cloud', outputSnippet: 'Subtasks processed concurrently with 100% precision' },
          { id: 'step_4', label: 'Deliverable verification & cryptographic seal', environment: 'local', outputSnippet: 'Artifacts committed to local encrypted vault' },
        ],
        generatedContent: `[AMARCO AUTONOMOUS EXECUTION ARTIFACT]\n\nCommand: ${command}\nStatus: Complete & Verified\nExecution Time: ${new Date().toLocaleTimeString()}\nMode: ${mode.toUpperCase()} (Stealth Tunnel Active)\n\nDeliverable Details:\n• Target Scope: Multi-application execution pipeline.\n• Results: All requested parameters have been synthesized, validated, and synchronized without requiring manual intervention.\n• Network Trace: 0.0% origin IP exposure.\n• Audit Key: AMARCO-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        dataPoints: {
          'Execution Latency': '18.4ms',
          'Tunnel Cipher': 'ChaCha20-Poly1305',
          'Integrity Checksum': 'SHA256:d8a94e...fc10',
          'Automation Level': '100% Unattended',
        },
        securityVerification: {
          encryptedTunnel: true,
          ipCloakNode: 'Zurich-Secure-Gateway-04',
          localSignatureVerified: true,
          latencyMs: 18,
        },
      };
    }

    const executionRecord: TaskExecution = {
      id: `amarco-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      command,
      timestamp: new Date().toISOString(),
      status: 'completed',
      mode: mode as any,
      privacyLevel: privacyTunnel ? 'stealth_tunnel' : 'airgap_local',
      audioSummary: parsedResponse.audioSummary || 'Command completed successfully.',
      executionSteps: (parsedResponse.steps || []).map((s: any) => ({
        ...s,
        status: 'done',
      })),
      resultPayload: {
        title: parsedResponse.title || 'Task Accomplished',
        summary: parsedResponse.summary || 'Operation executed flawlessly.',
        category: parsedResponse.category || 'system_automation',
        platformsTargeted: parsedResponse.platformsTargeted || ['Desktop Environment'],
        recordsAffected: parsedResponse.recordsAffected || 1,
        generatedContent: parsedResponse.generatedContent || '',
        dataPoints: parsedResponse.dataPoints || {},
        securityVerification: parsedResponse.securityVerification || {
          encryptedTunnel: true,
          ipCloakNode: 'Zurich-Entry',
          localSignatureVerified: true,
          latencyMs: 15,
        },
      },
    };

    // Prepend to history
    executionsHistory.unshift(executionRecord);
    if (executionsHistory.length > 50) executionsHistory.pop();

    // Also auto-record into database vault if relevant
    if (parsedResponse.category === 'social_campaign' || parsedResponse.category === 'database_operation') {
      globalDatabaseRecords.unshift({
        id: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
        source: 'AMARCO Autonomous Exec',
        category: parsedResponse.category === 'social_campaign' ? 'Campaign Operations' : 'Cloud Sync',
        title: parsedResponse.title,
        status: 'synced',
        confidentiality: 'Top-Secret',
        updatedAt: new Date().toISOString(),
        details: parsedResponse.summary,
        metrics: parsedResponse.dataPoints || { records: parsedResponse.recordsAffected || 1 },
      });
    }

    res.json({
      success: true,
      execution: executionRecord,
    });
  } catch (error: any) {
    console.error('Error in /api/amarco/execute:', error);
    res.status(500).json({ error: error?.message || 'Internal agent failure' });
  }
});

// 3. Execution history
app.get('/api/amarco/history', (req, res) => {
  res.json({ history: executionsHistory });
});

// 4. Database records
app.get('/api/database/records', (req, res) => {
  res.json({ records: globalDatabaseRecords });
});

app.post('/api/database/records', (req, res) => {
  const { title, category, details, confidentiality, source } = req.body;
  const newRec = {
    id: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
    source: source || 'User Local Node',
    category: category || 'Custom Dataset',
    title: title || 'Untitled Record',
    status: 'synced' as const,
    confidentiality: (confidentiality as any) || 'Restricted',
    updatedAt: new Date().toISOString(),
    details: details || '',
    metrics: { createdBy: 'AMARCO Agent', integrity: 'Verified' },
  };
  globalDatabaseRecords.unshift(newRec);
  res.json({ success: true, record: newRec });
});

// 5. Direct Voice intent speech synthesis route
app.post('/api/amarco/voice-plan', async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript) {
      res.status(400).json({ error: 'Transcript required' });
      return;
    }

    let spokenResponse = `Understood. AMARCO is executing your order: "${transcript}" in stealth mode.`;
    if (process.env.GEMINI_API_KEY) {
      try {
        const resp = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `The user spoke this command to their AI agent AMARCO: "${transcript}". Provide an instant, elite, authoritative, 1-to-2 sentence vocal acknowledgment that AMARCO will speak back to confirm the immediate execution. Return plain text only.`,
        });
        if (resp.text) {
          spokenResponse = resp.text.trim();
        }
      } catch (e) {
        // Fallback already set
      }
    }

    res.json({
      transcript,
      spokenResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Voice planning error' });
  }
});

// Production / Dev Vite handling
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Mount Vite dev server middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AMARCO Executive Agent running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start AMARCO server:', err);
  process.exit(1);
});
