import { defineField, defineType } from 'sanity';

export const collection = defineType({
  name: 'collection',
  title: 'Collections / Koleksiyonlar',
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
      name: 'kind',
      title: 'Kind / Tür',
      type: 'string',
      options: {
        list: [
          { title: 'Poetry Collection', value: 'poetry' },
          { title: 'Artwork Series', value: 'artwork' },
          { title: 'Writing Theme', value: 'writing' },
          { title: 'Mixed Archive', value: 'mixed' },
        ],
      },
    }),
    defineField({
      name: 'language',
      title: 'Language / Dil',
      type: 'string',
      options: {
        list: [
          { title: 'Türkçe', value: 'tr' },
          { title: 'English', value: 'en' },
          { title: 'Language Neutral', value: 'neutral' },
        ],
      },
      initialValue: 'neutral',
    }),
    defineField({
      name: 'description',
      title: 'Description / Açıklama',
      type: 'blockContent',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image / Kapak Görseli',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'featured',
      title: 'Featured / Öne Çıkan',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});
