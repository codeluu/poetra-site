export function formatDate(value?: string) {
  if (!value) return '';

  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value));
}

export function languageLabel(value?: string) {
  if (value === 'tr') return 'Türkçe';
  if (value === 'en') return 'English';
  return '';
}

export function formatLabel(value?: string) {
  const labels: Record<string, string> = {
    essay: 'Deneme',
    fragment: 'Kısa Parça',
    diary: 'Günlük',
    inquiry: 'Sorgu',
    spiritualPath: 'Spiritüel Yol',
    music: 'Müzik',
    video: 'Video',
  };

  return value ? labels[value] ?? value : '';
}

export function contentTypeLabel(value?: string) {
  const labels: Record<string, string> = {
    poetry: 'Poem',
    writing: 'Writing',
    mediaEntry: 'Media',
    page: 'Page',
  };

  return value ? labels[value] ?? value : '';
}
