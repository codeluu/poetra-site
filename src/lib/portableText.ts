import { toHTML } from '@portabletext/to-html';
import type { PortableTextBlock } from './sanity';

export function portableTextToHtml(blocks?: PortableTextBlock[]) {
  if (!blocks?.length) return '';

  return toHTML(blocks, {
    components: {
      marks: {
        link: ({ children, value }) => {
          const href = typeof value?.href === 'string' ? value.href : '#';
          return `<a href="${href}" rel="noreferrer">${children}</a>`;
        },
      },
    },
  });
}
