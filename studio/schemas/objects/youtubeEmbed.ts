import { defineField, defineType } from 'sanity';

const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{11}$/;

function getYouTubeVideoId(input?: string): string | null {
  if (!input) return null;

  try {
    const url = new URL(input);
    const hostname = url.hostname.replace(/^www\./, '');
    const pathParts = url.pathname.split('/').filter(Boolean);

    if (hostname === 'youtu.be') {
      const [id] = pathParts;
      return id && YOUTUBE_ID_RE.test(id) ? id : null;
    }

    if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      if (url.pathname === '/watch') {
        const id = url.searchParams.get('v');
        return id && YOUTUBE_ID_RE.test(id) ? id : null;
      }

      if (pathParts[0] === 'embed' || pathParts[0] === 'shorts') {
        const id = pathParts[1];
        return id && YOUTUBE_ID_RE.test(id) ? id : null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export const youtubeEmbed = defineType({
  name: 'youtubeEmbed',
  title: 'YouTube Video',
  type: 'object',
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
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'credit',
      title: 'Credit',
      type: 'string',
    }),
    defineField({
      name: 'displayStyle',
      title: 'Display Style',
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
