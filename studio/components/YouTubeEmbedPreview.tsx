import type { CSSProperties } from 'react';
import { PlayIcon } from '@sanity/icons/Play';
import { getYouTubeThumbnailUrl, getYouTubeVideoId } from '../lib/youtube';

type YouTubeEmbedPreviewProps = {
  title?: string;
  subtitle?: string;
};

const cardStyle: CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  gap: 12,
  minWidth: 0,
};

const thumbnailStyle: CSSProperties = {
  alignItems: 'center',
  aspectRatio: '16 / 9',
  background: '#261817',
  borderRadius: 4,
  color: '#fff',
  display: 'flex',
  flex: '0 0 112px',
  justifyContent: 'center',
  overflow: 'hidden',
};

const imageStyle: CSSProperties = {
  display: 'block',
  height: '100%',
  objectFit: 'cover',
  width: '100%',
};

const contentStyle: CSSProperties = {
  minWidth: 0,
};

const titleStyle: CSSProperties = {
  color: 'inherit',
  fontSize: 14,
  fontWeight: 600,
  lineHeight: 1.3,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const metaStyle: CSSProperties = {
  color: 'inherit',
  fontSize: 12,
  lineHeight: 1.4,
  opacity: 0.65,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export function YouTubeEmbedPreview(props: YouTubeEmbedPreviewProps) {
  const videoId = getYouTubeVideoId(props.subtitle);
  const thumbnailUrl = getYouTubeThumbnailUrl(videoId);
  const title = props.title || 'YouTube Video';
  const subtitle = videoId
    ? `YouTube video · ${videoId}`
    : props.subtitle
      ? 'Invalid YouTube URL'
      : 'YouTube URL missing';

  return (
    <div style={cardStyle}>
      <div style={thumbnailStyle}>
        {thumbnailUrl ? (
          <img alt="" loading="lazy" src={thumbnailUrl} style={imageStyle} />
        ) : (
          <PlayIcon aria-hidden="true" />
        )}
      </div>
      <div style={contentStyle}>
        <div style={titleStyle}>{title}</div>
        <div style={metaStyle}>{subtitle}</div>
      </div>
    </div>
  );
}
