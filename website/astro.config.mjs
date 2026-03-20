import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://rainnoon.github.io',
  base: '/oc-claw',
  output: 'static',
  integrations: [sitemap()],
});
