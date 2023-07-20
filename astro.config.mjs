import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.ozenc.io',
  integrations: [sitemap()],
  output: 'static',
  experimental: {
    assets: true
  }
});
