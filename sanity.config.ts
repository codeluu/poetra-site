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
    structureTool({
      structure: (S) =>
        S.list()
          .title('İçerik')
          .items([
            // Pinned singleton: one fixed document for homepage settings.
            S.listItem()
              .title('Home Page / Ana Sayfa')
              .id('homePage')
              .child(
                S.document().schemaType('homePage').documentId('homePage'),
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== 'homePage',
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
