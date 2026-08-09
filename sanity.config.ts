import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { media } from 'sanity-plugin-media';
import { tableOfContentsPlugin } from 'sanity-plugin-table-of-contents';
import { poetraTheme } from './studio/poetraTheme';
import { schemaTypes } from './studio/schemas';
import { structure, withoutSingletonTemplates } from './studio/structure';

export default defineConfig({
  name: 'poetra',
  title: 'Poetra Studio',
  theme: poetraTheme,

  projectId: 'mcbpzste',
  dataset: 'production',
  basePath: '/studio',

  plugins: [
    structureTool({ structure }),
    media(),
    tableOfContentsPlugin({
      fieldNames: ['body', 'notes'],
      documentTypes: ['page', 'writing', 'poetry'],
    }),
    visionTool(),
  ],

  document: {
    newDocumentOptions: withoutSingletonTemplates,
  },

  schema: {
    types: schemaTypes,
  },
});
