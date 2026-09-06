import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
import os from 'os';

function vaultSyncPlugin(): Plugin {
  return {
    name: 'vault-sync-api',
    configureServer(server) {
      const dataDir = path.resolve(process.cwd(), 'data');
      const vaultFile = path.join(dataDir, 'vault.json');

      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Endpoint: Get laptop local network IP for mobile device access
      server.middlewares.use('/api/network-info', (_req, res) => {
        const interfaces = os.networkInterfaces();
        let localIp = 'localhost';

        for (const name of Object.keys(interfaces)) {
          const lowerName = name.toLowerCase();
          if (lowerName.includes('vmware') || lowerName.includes('virtual') || lowerName.includes('vethernet')) {
            continue;
          }
          for (const iface of interfaces[name] || []) {
            if (iface.family === 'IPv4' && !iface.internal) {
              if (localIp === 'localhost' || lowerName.includes('wi-fi') || lowerName.includes('wlan') || lowerName.includes('wireless')) {
                localIp = iface.address;
              }
            }
          }
        }

        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            ip: localIp,
            port: 5173,
            url: `http://${localIp}:5173`,
            hostname: os.hostname(),
          })
        );
      });

      // Endpoint: Read shared vault data (GET /api/vault-sync)
      server.middlewares.use('/api/vault-sync', (req, res, next) => {
        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          if (fs.existsSync(vaultFile)) {
            try {
              const content = fs.readFileSync(vaultFile, 'utf-8');
              res.end(content);
              return;
            } catch (e) {
              console.error('Error reading vault file:', e);
            }
          }
          res.end(JSON.stringify({ empty: true }));
          return;
        }

        // Endpoint: Save shared vault data (POST /api/vault-sync)
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              fs.writeFileSync(vaultFile, body, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, savedAt: new Date().toISOString() }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), vaultSyncPlugin()],
  server: {
    host: true, // Listen on all local IP addresses (0.0.0.0) so phone can connect
    port: 5173,
    strictPort: true,
  },
});
