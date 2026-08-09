const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{11}$/;

export function getYouTubeVideoId(input?: string): string | null {
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

export function getYouTubeThumbnailUrl(videoId?: string | null) {
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : undefined;
}
