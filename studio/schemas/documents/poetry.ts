import { defineField, defineType } from 'sanity';

export const poetry = defineType({
  name: 'poetry',
  title: 'Poetry / Şiir Sanatı',
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
      name: 'originalLanguage',
      title: 'Original Language / Orijinal Dil',
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
      name: 'body',
      title: 'Poem Body / Şiir Metni',
      type: 'blockContent',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'writtenAt',
      title: 'Written At / Yazım Tarihi',
      type: 'datetime',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At / Yayın Tarihi',
      type: 'datetime',
    }),
    defineField({
      name: 'collection',
      title: 'Collection / Koleksiyon',
      type: 'reference',
      to: [{ type: 'collection' }],
    }),
    defineField({
      name: 'tags',
      title: 'Tags / Etiketler',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'mood',
      title: 'Mood / Ruh Hali',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image / Kapak Görseli',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt text', type: 'string' },
      ],
    }),
    defineField({
      name: 'notes',
      title: 'Artist Notes / Sanatçı Notları',
      type: 'blockContent',
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
  preview: {
    select: {
      title: 'title',
      subtitle: 'originalLanguage',
      media: 'heroImage',
    },
  },
});
