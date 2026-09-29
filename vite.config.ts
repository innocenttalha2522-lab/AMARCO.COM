import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { processAmarcoCommand } from './src/server/agentEngine';

function amarcoApiPlugin(): Plugin {
  return {
    name: 'amarco-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/amarco')) {
          return next();
        }

        // Endpoint: POST /api/amarco/execute
        if (req.url === '/api/amarco/execute' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const params = body ? JSON.parse(body) : {};
              const result = await processAmarcoCommand(params);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
            } catch (err: any) {
              console.error('API error in /api/amarco/execute:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Execution error' }));
            }
          });
          return;
        }

        // Endpoint: GET /api/amarco/tunnel-status
        if (req.url === '/api/amarco/tunnel-status' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              status: 'online',
              protocol: 'AES-256-GCM / WireGuard v2',
              activeNode: {
                city: 'Zurich',
                country: 'Switzerland',
                flag: '🇨🇭',
                ip: '185.220.101.42',
                latencyMs: 18,
              },
              maskedIp: '185.220.101.42',
              realIpHidden: true,
              killSwitchArmed: true,
              dnsLeakProtected: true,
              stealthScore: 100,
            })
          );
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), amarcoApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
