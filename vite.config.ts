import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
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
    }
  ],
  base: '/lf10/',
})
