import { toHTML } from '@portabletext/to-html';
import type { PortableTextBlock } from './sanity';
import { youtubeEmbedToHtml } from './renderYouTubeEmbed';
import type { YouTubeEmbedBlock } from './youtube';

export function portableTextToHtml(blocks?: PortableTextBlock[]) {
  if (!blocks?.length) return '';

  return toHTML(blocks, {
    components: {
      types: {
        youtubeEmbed: ({ value }) =>
          youtubeEmbedToHtml(value as YouTubeEmbedBlock),
      },
      marks: {
        link: ({ children, value }) => {
          const href = typeof value?.href === 'string' ? value.href : '#';
          return `<a href="${href}" rel="noreferrer">${children}</a>`;
        },
      },
    },
  });
}
