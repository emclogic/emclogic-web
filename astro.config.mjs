import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { remarkPostImages } from './src/plugins/remarkPostImages.mjs';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkPostImages],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});