import { defineField, defineType } from 'sanity';

export const artwork = defineType({
  name: 'artwork',
  title: 'Artworks / Sanat Eserleri',
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
      name: 'year',
      title: 'Year / Yıl',
      type: 'number',
    }),
    defineField({
      name: 'medium',
      title: 'Medium / Teknik',
      type: 'string',
    }),
    defineField({
      name: 'series',
      title: 'Series / Seri',
      type: 'reference',
      to: [{ type: 'collection' }],
    }),
    defineField({
      name: 'statement',
      title: 'Artist Statement / Sanatçı Metni',
      type: 'blockContent',
    }),
    defineField({
      name: 'images',
      title: 'Images / Görseller',
      type: 'array',
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
      of: [{ type: 'reference', to: [{ type: 'poetry' }] }],
    }),
    defineField({
      name: 'relatedWritings',
      title: 'Related Writings / İlgili Yazılar',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'writing' }] }],
    }),
    defineField({
      name: 'featured',
      title: 'Featured / Öne Çıkan',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
});
