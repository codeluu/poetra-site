import { defineField, defineType } from 'sanity';
import {
  languageLabels,
  previewDate,
  previewParts,
  writingFormatLabels,
} from '../../lib/preview';

export const writing = defineType({
  name: 'writing',
  title: 'Writings / Yazılar',
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
      description: 'TR/EN eş içerikleri aynı anahtarla grupla. Örn: korkuyu-yenmek',
      type: 'string',
      group: 'meta',
    }),
    defineField({
      name: 'format',
      title: 'Format / Tür',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          { title: 'Essay / Deneme', value: 'essay' },
          { title: 'Fragment / Kısa Parça', value: 'fragment' },
          { title: 'Diary / Günlük', value: 'diary' },
          { title: 'Inquiry / Sorgu', value: 'inquiry' },
          { title: 'Spiritual Path / Spiritüel Yol', value: 'spiritualPath' },
        ],
      },
      initialValue: 'essay',
    }),
    defineField({
      name: 'body',
      title: 'Body / İçerik',
      type: 'blockContent',
      group: 'content',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At / Yayın Tarihi',
      type: 'datetime',
      group: 'meta',
    }),
    defineField({
      name: 'tags',
      title: 'Tags / Etiketler',
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
      language: 'language',
      format: 'format',
      publishedAt: 'publishedAt',
      featured: 'featured',
      media: 'heroImage',
    },
    prepare({ title, language, format, publishedAt, featured, media }) {
      return {
        title,
        subtitle: previewParts([
          languageLabels[language] ?? language,
          writingFormatLabels[format] ?? format,
          previewDate(publishedAt),
          featured && 'Featured',
        ]),
        media,
      };
    },
  },
});
