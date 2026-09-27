import { defineField, defineType } from 'sanity';
import { languageLabels, previewDate, previewParts } from '../../lib/preview';

export const poetry = defineType({
  name: 'poetry',
  title: 'Poetry / Şiir Sanatı',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content / İçerik', default: true },
    { name: 'meta', title: 'Metadata / Bilgi' },
    { name: 'media', title: 'Media / Görsel' },
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
      name: 'originalLanguage',
      title: 'Original Language / Orijinal Dil',
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
      name: 'body',
      title: 'Poem Body / Şiir Metni',
      type: 'blockContent',
      group: 'content',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'writtenAt',
      title: 'Written At / Yazım Tarihi',
      type: 'datetime',
      group: 'meta',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At / Yayın Tarihi',
      type: 'datetime',
      group: 'meta',
    }),
    defineField({
      name: 'collection',
      title: 'Collection / Koleksiyon',
      type: 'reference',
      group: 'meta',
      to: [{ type: 'collection' }],
    }),
    defineField({
      name: 'tags',
      title: 'Tags / Etiketler',
      type: 'array',
      group: 'meta',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'mood',
      title: 'Mood / Ruh Hali',
      type: 'array',
      group: 'meta',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image / Kapak Görseli',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt text', type: 'string' },
      ],
    }),
    defineField({
      name: 'notes',
      title: 'Poet’s Note / Şairin Notu',
      description: 'Şiirin hikâyesi, yazım süreci veya tarihine ilişkin notlar. Şiir sayfasında künyenin üstündeki ayrı kâğıt kutuda gösterilir.',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'footnoteVideo',
      title: 'Artist’s Footnote / Sanatçının Dipnotu',
      description: 'Şairin Notu kutusunda çerçeveli oynatıcı olarak gösterilecek YouTube videosu.',
      type: 'youtubeEmbed',
      group: 'content',
    }),
    defineField({
      name: 'featured',
      title: 'Featured / Öne Çıkan',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
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
      language: 'originalLanguage',
      publishedAt: 'publishedAt',
      writtenAt: 'writtenAt',
      featured: 'featured',
      media: 'heroImage',
    },
    prepare({ title, language, publishedAt, writtenAt, featured, media }) {
      return {
        title,
        subtitle: previewParts([
          languageLabels[language] ?? language,
          previewDate(publishedAt ?? writtenAt),
          featured && 'Featured',
        ]),
        media,
      };
    },
  },
});
