import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';
import { rehypeLogGallery } from './src/plugins/rehype-log-gallery.ts';

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
  integrations: [tailwind(), icon(), sitemap()],
  site: 'https://me.echo0.cn',
  markdown: {
    rehypePlugins: [rehypeLogGallery],
  },
  vite: {
    plugins: [slidevSpaFallback()],
  },
});
