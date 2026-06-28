import { defineField, defineType } from 'sanity';

export const page = defineType({
  name: 'page',
  title: 'Pages / Sayfalar',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title / Başlık',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Language / Dil',
      type: 'string',
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
    }),
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
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
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
});
