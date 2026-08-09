import { defineField, defineType } from 'sanity';
import { collectionKindLabels, languageLabels, previewParts } from '../../lib/preview';

export const collection = defineType({
  name: 'collection',
  title: 'Collections / Koleksiyonlar',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content / İçerik', default: true },
    { name: 'meta', title: 'Metadata / Bilgi' },
    { name: 'media', title: 'Media / Görsel' },
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
      name: 'kind',
      title: 'Kind / Tür',
      type: 'string',
      group: 'meta',
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
      group: 'meta',
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
      group: 'content',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image / Kapak Görseli',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
    }),
    defineField({
      name: 'featured',
      title: 'Featured / Öne Çıkan',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      kind: 'kind',
      language: 'language',
      featured: 'featured',
      media: 'coverImage',
    },
    prepare({ title, kind, language, featured, media }) {
      return {
        title,
        subtitle: previewParts([
          collectionKindLabels[kind] ?? kind,
          languageLabels[language] ?? language,
          featured && 'Featured',
        ]),
        media,
      };
    },
  },
});
