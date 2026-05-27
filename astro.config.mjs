import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { remarkPostImages } from './src/plugins/remarkPostImages.mjs';

export default defineConfig({
  site: 'https://emclogic.github.io/emclogic-web',
  base: '/emclogic-web',
  markdown: {
    remarkPlugins: [remarkPostImages],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});