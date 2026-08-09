import { defineField, defineType } from 'sanity';
import { languageLabels, mediaKindLabels, previewDate, previewParts } from '../../lib/preview';

export const mediaEntry = defineType({
  name: 'mediaEntry',
  title: 'Media / Video & Music',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content / İçerik', default: true },
    { name: 'links', title: 'Links / Bağlantılar' },
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
      name: 'kind',
      title: 'Kind / Tür',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Video', value: 'video' },
          { title: 'Music', value: 'music' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Language / Dil',
      type: 'string',
      group: 'content',
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
      group: 'content',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      group: 'links',
    }),
    defineField({
      name: 'youtubeOpenInNewTab',
      title: 'YouTube: Open in new tab / Yeni sekmede aç',
      description: 'Off by default. Enable only when the YouTube link should open a separate tab.',
      type: 'boolean',
      group: 'links',
      initialValue: false,
    }),
    defineField({
      name: 'spotifyUrl',
      title: 'Spotify URL',
      type: 'url',
      group: 'links',
    }),
    defineField({
      name: 'spotifyOpenInNewTab',
      title: 'Spotify: Open in new tab / Yeni sekmede aç',
      description: 'Off by default. Enable only when the Spotify link should open a separate tab.',
      type: 'boolean',
      group: 'links',
      initialValue: false,
    }),
    defineField({
      name: 'soundCloudUrl',
      title: 'SoundCloud URL',
      type: 'url',
      group: 'links',
    }),
    defineField({
      name: 'soundCloudOpenInNewTab',
      title: 'SoundCloud: Open in new tab / Yeni sekmede aç',
      description: 'Off by default. Enable only when the SoundCloud link should open a separate tab.',
      type: 'boolean',
      group: 'links',
      initialValue: false,
    }),
    defineField({
      name: 'body',
      title: 'Content / İçerik Yazısı',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At / Yayın Tarihi',
      type: 'datetime',
      group: 'content',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image / Kapak Görseli',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt text', type: 'string' },
      ],
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
      kind: 'kind',
      language: 'language',
      publishedAt: 'publishedAt',
      youtubeUrl: 'youtubeUrl',
      spotifyUrl: 'spotifyUrl',
      soundCloudUrl: 'soundCloudUrl',
      media: 'coverImage',
    },
    prepare({ title, kind, language, publishedAt, youtubeUrl, spotifyUrl, soundCloudUrl, media }) {
      const platforms = [
        youtubeUrl && 'YouTube',
        spotifyUrl && 'Spotify',
        soundCloudUrl && 'SoundCloud',
      ];

      return {
        title,
        subtitle: previewParts([
          mediaKindLabels[kind] ?? kind,
          languageLabels[language] ?? language,
          previewDate(publishedAt),
          previewParts(platforms) || 'No platform link',
        ]),
        media,
      };
    },
  },
});
