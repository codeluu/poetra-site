import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './studio/schemas';

export default defineConfig({
  name: 'poetra',
  title: 'Poetra Studio',

  projectId: 'mcbpzste',
  dataset: 'production',
  basePath: '/studio',

  plugins: [
    structureTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
