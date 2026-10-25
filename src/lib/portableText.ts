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
        poemEmbed: ({ value }) => poemEmbedToHtml(value as PoemEmbed),
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

type PoemEmbed = {
  source?: 'reference' | 'text';
  title?: string;
  text?: string;
  author?: string;
  language?: string;
  poem?: {
    _type?: string;
    title?: string;
    slug?: { current?: string };
    originalLanguage?: string;
    body?: PortableTextBlock[];
  } | null;
};

function poemEmbedToHtml(value: PoemEmbed): string {
  const fromArchive = value.source === 'reference';
  if (!fromArchive && value.source !== 'text') return '';
  const poem = value.poem;
  // An unpublished reference must never leak draft text into the public page.
  if (fromArchive && poem?._type !== 'poetry') return '';
  const body = fromArchive
    ? portableTextToHtml(poem?.body?.filter(block => block._type !== 'poemEmbed'))
    : escapeHtmlAttribute(value.text ?? '');
  if (!body.trim()) return '';
  const title = fromArchive ? poem?.title : value.title;
  const language = fromArchive ? poem?.originalLanguage : value.language;
  const lang = language === 'tr' || language === 'en' ? ` lang="${language}"` : '';
  const href = fromArchive && poem?.slug?.current && (language === 'tr' || language === 'en')
    ? `/poetry/${language}/${encodeURIComponent(poem.slug.current)}` : '';
  const author = !fromArchive && value.author
    ? `<figcaption class="poem-embed__author">${escapeHtmlAttribute(value.author)}</figcaption>` : '';

  return `<figure class="poem-embed"${lang}>${title ? `<h2 class="poem-embed__title">${escapeHtmlAttribute(title)}</h2>` : ''}<div class="poem-embed__verse${fromArchive ? '' : ' poem-embed__verse--text'}">${body}</div>${author}${href ? `<a class="poem-embed__link" href="${escapeHtmlAttribute(href)}">Şiir arşivinde aç →</a>` : ''}</figure>`;
}

function escapeHtmlAttribute(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
