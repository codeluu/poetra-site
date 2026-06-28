import { defineField, defineType } from 'sanity';

export const writing = defineType({
  name: 'writing',
  title: 'Writings / Yazılar',
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
      description: 'TR/EN eş içerikleri aynı anahtarla grupla. Örn: korkuyu-yenmek',
      type: 'string',
    }),
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
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
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At / Yayın Tarihi',
      type: 'datetime',
    }),
    defineField({
      name: 'tags',
      title: 'Tags / Etiketler',
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
