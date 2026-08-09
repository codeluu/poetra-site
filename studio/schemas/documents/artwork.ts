import { defineField, defineType } from 'sanity';
import { languageLabels, previewParts } from '../../lib/preview';

export const artwork = defineType({
  name: 'artwork',
  title: 'Artworks / Sanat Eserleri',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content / İçerik', default: true },
    { name: 'meta', title: 'Metadata / Bilgi' },
    { name: 'media', title: 'Images / Görseller' },
    { name: 'relations', title: 'Relations / İlişkiler' },
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
      name: 'year',
      title: 'Year / Yıl',
      type: 'number',
      group: 'meta',
    }),
    defineField({
      name: 'medium',
      title: 'Medium / Teknik',
      type: 'string',
      group: 'meta',
    }),
    defineField({
      name: 'series',
      title: 'Series / Seri',
      type: 'reference',
      group: 'relations',
      to: [{ type: 'collection' }],
    }),
    defineField({
      name: 'statement',
      title: 'Artist Statement / Sanatçı Metni',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'images',
      title: 'Images / Görseller',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Alt text', type: 'string' },
            { name: 'caption', title: 'Caption', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'relatedPoetry',
      title: 'Related Poetry / İlgili Şiirler',
      type: 'array',
      group: 'relations',
      of: [{ type: 'reference', to: [{ type: 'poetry' }] }],
    }),
    defineField({
      name: 'relatedWritings',
      title: 'Related Writings / İlgili Yazılar',
      type: 'array',
      group: 'relations',
      of: [{ type: 'reference', to: [{ type: 'writing' }] }],
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
      year: 'year',
      medium: 'medium',
      language: 'language',
      featured: 'featured',
      media: 'images.0',
    },
    prepare({ title, year, medium, language, featured, media }) {
      return {
        title,
        subtitle: previewParts([
          year ? String(year) : undefined,
          medium,
          languageLabels[language] ?? language,
          featured && 'Featured',
        ]),
        media,
      };
    },
  },
});
