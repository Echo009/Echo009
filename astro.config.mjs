import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  outDir: './docs',
  integrations: [tailwind()],
  site: 'https://echo009.github.io',
});
