import {
  getYouTubeEmbedUrl,
  type YouTubeEmbedBlock,
} from './youtube';

export function youtubeEmbedToHtml(value: YouTubeEmbedBlock) {
  const embedUrl = getYouTubeEmbedUrl(value.url);
  const style = value.displayStyle === 'minimal' ? 'minimal' : 'editorial';
  const title = value.title?.trim() || 'Poetra YouTube videosu';
  const caption = value.caption?.trim();
  const credit = value.credit?.trim();
  const hasMeta = caption || credit;

  if (!embedUrl) {
    return `
      <figure class="youtube-embed youtube-embed--invalid">
        <p>Video bağlantısı geçersiz.</p>
      </figure>
    `;
  }

  return `
    <figure class="youtube-embed youtube-embed--${style}">
      <div class="youtube-embed__frame">
        ${style === 'editorial' ? '<span class="youtube-embed__label">Hareketli imge</span>' : ''}
        <iframe
          src="${embedUrl}"
          title="${escapeHtml(title)}"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
      ${
        hasMeta
          ? `<figcaption class="youtube-embed__caption">
              ${caption ? `<span>${escapeHtml(caption)}</span>` : ''}
              ${credit ? `<cite>${escapeHtml(credit)}</cite>` : ''}
            </figcaption>`
          : ''
      }
    </figure>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
