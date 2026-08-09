import { defineField, defineType } from 'sanity';
import { YouTubeEmbedPreview } from '../../components/YouTubeEmbedPreview';
import { getYouTubeVideoId } from '../../lib/youtube';

export const youtubeEmbed = defineType({
  name: 'youtubeEmbed',
  title: 'YouTube Video',
  type: 'object',
  components: {
    preview: YouTubeEmbedPreview,
  },
  fields: [
    defineField({
      name: 'url',
      title: 'YouTube URL',
      type: 'url',
      validation: (Rule) =>
        Rule.required().custom((value) =>
          getYouTubeVideoId(value)
            ? true
            : 'Use a valid YouTube watch, youtu.be, embed, or Shorts URL.',
        ),
    }),
    defineField({
      name: 'title',
      title: 'Title / Başlık',
      type: 'string',
    }),
    defineField({
      name: 'caption',
      title: 'Caption / Açıklama',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'credit',
      title: 'Credit / Kaynak',
      type: 'string',
    }),
    defineField({
      name: 'displayStyle',
      title: 'Display Style / Görünüm',
      type: 'string',
      options: {
        list: [
          { title: 'Editorial', value: 'editorial' },
          { title: 'Minimal', value: 'minimal' },
        ],
        layout: 'radio',
      },
      initialValue: 'editorial',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'url',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'YouTube Video',
        subtitle,
      };
    },
  },
});
