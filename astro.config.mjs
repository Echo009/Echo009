import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import fs from 'node:fs';
import path from 'node:path';

function slidevSpaFallback() {
  return {
    name: 'slidev-spa-fallback',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] || '';
        if (path.extname(url)) return next();
        const match = url.match(/^\/slides\/([^/]+)\/\d+$/);
        if (match) {
          const slideName = match[1];
          const indexPath = path.resolve('public', 'slides', slideName, 'index.html');
          if (fs.existsSync(indexPath)) {
            res.setHeader('Content-Type', 'text/html');
            fs.createReadStream(indexPath).pipe(res);
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  output: 'static',
  outDir: './dist',
  integrations: [tailwind()],
  site: 'https://echo009.github.io',
  vite: {
    plugins: [slidevSpaFallback()],
  },
});
