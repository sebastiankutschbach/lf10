import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    {
      name: 'save-loadout',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const isSaveApi = req.url && (req.url.includes('api/save-loadout') || req.url.endsWith('/api/save-loadout'));
          if (req.method === 'POST' && isSaveApi) {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                const data = JSON.parse(body);
                const filePath = path.resolve(process.cwd(), 'src/data/loadout.json');
                fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } catch (error) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: (error as Error).message }));
              }
            });
          } else {
            next();
          }
        });
      }
    },
    ViteImageOptimizer({
      // Du kannst hier die Standard-Einstellungen überschreiben
      webp: {
        quality: 80, // Qualität von 0-100, standard ist 75
        lossless: false, // Auf true setzen für verlustfreie Komprimierung
      },
      // Du kannst auch andere Formate konfigurieren
      jpg: {
        quality: 80,
      },
      png: {
        quality: 80,
      }
    }),
  ],
  base: '/lf10/',
})
