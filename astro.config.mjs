// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Public site origin — used for canonical URLs (BaseLayout) and future
  // sitemap/OG work. Framework metadata only; deployment is unchanged.
  site: 'https://poetra.art',
});
