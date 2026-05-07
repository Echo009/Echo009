import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import fs from 'node:fs';
import path from 'node:path';

function slidevSpaFallback() {
  return {
    name: 'slidev-spa-fallback',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0]?.split('#')[0] || '';
        if (path.extname(url)) return next();
        const exactMatch = url.match(/^\/slides\/([^/]+)\/?$/);
        if (exactMatch) {
          const indexPath = path.resolve('public', 'slides', exactMatch[1], 'index.html');
          if (fs.existsSync(indexPath)) {
            res.setHeader('Content-Type', 'text/html');
            fs.createReadStream(indexPath).pipe(res);
            return;
          }
        }
        const pageMatch = url.match(/^\/slides\/([^/]+)\/(\d+)$/);
        if (pageMatch) {
          const indexPath = path.resolve('public', 'slides', pageMatch[1], 'index.html');
          if (fs.existsSync(indexPath)) {
            res.writeHead(302, { Location: `/slides/${pageMatch[1]}/#/${pageMatch[2]}` });
            res.end();
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
