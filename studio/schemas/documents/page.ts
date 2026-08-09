import { defineField, defineType } from 'sanity';
import { languageLabels, pageTypeLabels, previewParts } from '../../lib/preview';

export const page = defineType({
  name: 'page',
  title: 'Pages / Sayfalar',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content / İçerik', default: true },
    { name: 'meta', title: 'Metadata / Bilgi' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title / Başlık',
      type: 'string',
      group: 'content',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Language / Dil',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          { title: 'Türkçe', value: 'tr' },
          { title: 'English', value: 'en' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'translationKey',
      title: 'Translation Group Key',
      type: 'string',
      group: 'meta',
    }),
    defineField({
      name: 'pageType',
      title: 'Page Type / Sayfa Türü',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          { title: 'About / Hakkında', value: 'about' },
          { title: 'Inquiries / Sorgular', value: 'inquiries' },
          { title: 'Manifesto', value: 'manifesto' },
          { title: 'Contact / İletişim', value: 'contact' },
          { title: 'Generic Page', value: 'generic' },
        ],
      },
    }),
    defineField({
      name: 'body',
      title: 'Body / İçerik',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      pageType: 'pageType',
      language: 'language',
    },
    prepare({ title, pageType, language }) {
      return {
        title,
        subtitle: previewParts([
          pageTypeLabels[pageType] ?? pageType,
          languageLabels[language] ?? language,
        ]),
      };
    },
  },
});
