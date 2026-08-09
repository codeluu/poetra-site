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
            // Pinned singletons: one fixed document for global/home settings.
            S.listItem()
              .title('Site Settings / Site Ayarları')
              .id('siteSettings')
              .child(
                S.document().schemaType('siteSettings').documentId('siteSettings'),
              ),
            S.listItem()
              .title('Home Page / Ana Sayfa')
              .id('homePage')
              .child(
                S.document().schemaType('homePage').documentId('homePage'),
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) =>
                !['homePage', 'siteSettings'].includes(item.getId() ?? ''),
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
