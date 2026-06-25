import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { remarkPostImages } from './src/plugins/remarkPostImages.mjs';

export default defineConfig({
  site: 'https://emclogic.github.io/emclogic-web',
  base: '/emclogic-web',
  markdown: {
    remarkPlugins: [remarkPostImages],
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'pt',
        locales: {
          pt: 'pt-BR',
          en: 'en-US'
        }
      }
    })
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en'],
    routing: {
      prefixDefaultLocale: false
    }
  }
});