import { BookIcon } from '@sanity/icons/Book';
import { CogIcon } from '@sanity/icons/Cog';
import { ComposeIcon } from '@sanity/icons/Compose';
import { DocumentIcon } from '@sanity/icons/Document';
import { DocumentsIcon } from '@sanity/icons/Documents';
import { FolderIcon } from '@sanity/icons/Folder';
import { HomeIcon } from '@sanity/icons/Home';
import { ImageIcon } from '@sanity/icons/Image';
import { PlayIcon } from '@sanity/icons/Play';
import { SparklesIcon } from '@sanity/icons/Sparkles';
import type { StructureResolver } from 'sanity/structure';

const singletonTypes = ['homePage', 'siteSettings'];

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Poetra Studio')
    .items([
      S.listItem()
        .title('Home / Global')
        .icon(HomeIcon)
        .child(
          S.list()
            .title('Home / Global')
            .items([
              S.listItem()
                .title('Home Page / Ana Sayfa')
                .id('homePage')
                .icon(HomeIcon)
                .child(S.document().schemaType('homePage').documentId('homePage')),
              S.listItem()
                .title('Site Settings / Site Ayarları')
                .id('siteSettings')
                .icon(CogIcon)
                .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Content')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Content')
            .items([
              S.documentTypeListItem('poetry').title('Şiirler').icon(BookIcon),
              S.documentTypeListItem('writing').title('Yazılar').icon(ComposeIcon),
              S.listItem()
                .title('Sorgular')
                .icon(SparklesIcon)
                .child(
                  S.list()
                    .title('Sorgular')
                    .items([
                      S.listItem()
                        .title('Sorgu Sayfaları')
                        .icon(DocumentIcon)
                        .child(
                          S.documentList()
                            .title('Sorgu Sayfaları')
                            .schemaType('page')
                            .filter('_type == "page" && pageType == "inquiries"'),
                        ),
                      S.listItem()
                        .title('Sorgu Yazıları')
                        .icon(ComposeIcon)
                        .child(
                          S.documentList()
                            .title('Sorgu Yazıları')
                            .schemaType('writing')
                            .filter('_type == "writing" && format == "inquiry"'),
                        ),
                    ]),
                ),
              S.listItem()
                .title('Diğer Sayfalar')
                .icon(DocumentIcon)
                .child(
                  S.documentList()
                    .title('Diğer Sayfalar')
                    .schemaType('page')
                    .filter('_type == "page" && (!defined(pageType) || pageType != "inquiries")'),
                ),
            ]),
        ),
      S.listItem()
        .title('Media & Works')
        .icon(PlayIcon)
        .child(
          S.list()
            .title('Media & Works')
            .items([
              S.documentTypeListItem('mediaEntry').title('Müzik / Media').icon(PlayIcon),
              S.documentTypeListItem('artwork').title('Artwork').icon(ImageIcon),
              S.documentTypeListItem('collection').title('Collections').icon(FolderIcon),
            ]),
        ),
    ]);

export function withoutSingletonTemplates(
  previousOptions: Array<{ templateId?: string; id?: string }>,
) {
  return previousOptions.filter(
    (option) =>
      !singletonTypes.includes(option.templateId ?? '') &&
      !singletonTypes.includes(option.id ?? ''),
  );
}
