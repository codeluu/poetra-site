import { toHTML } from '@portabletext/to-html';
import { linkAttributesToHtml } from './link';
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
          const openInNewTab = value?.openInNewTab === true;

          return `<a href="${escapeHtmlAttribute(href)}"${linkAttributesToHtml(openInNewTab)}>${children}</a>`;
        },
      },
    },
  });
}

function escapeHtmlAttribute(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
