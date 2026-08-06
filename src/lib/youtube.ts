const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{11}$/;

export type YouTubeEmbedBlock = {
  _type: 'youtubeEmbed';
  url?: string;
  title?: string;
  caption?: string;
  credit?: string;
  displayStyle?: 'editorial' | 'minimal';
};

export function extractYouTubeVideoId(input?: string): string | null {
  if (!input) return null;

  try {
    const url = new URL(input);
    const hostname = url.hostname.replace(/^www\./, '');
    const pathParts = url.pathname.split('/').filter(Boolean);

    if (hostname === 'youtu.be') {
      return validVideoId(pathParts[0]);
    }

    if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      if (url.pathname === '/watch') {
        return validVideoId(url.searchParams.get('v'));
      }

      if (pathParts[0] === 'embed' || pathParts[0] === 'shorts') {
        return validVideoId(pathParts[1]);
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function getYouTubeEmbedUrl(input?: string): string | null {
  const videoId = extractYouTubeVideoId(input);
  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
}

function validVideoId(value?: string | null) {
  return value && YOUTUBE_ID_RE.test(value) ? value : null;
}
