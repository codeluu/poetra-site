export const languageLabels: Record<string, string> = {
  tr: 'Türkçe',
  en: 'English',
  neutral: 'Language neutral',
};

export const writingFormatLabels: Record<string, string> = {
  essay: 'Essay / Deneme',
  fragment: 'Fragment / Kısa Parça',
  diary: 'Diary / Günlük',
  inquiry: 'Inquiry / Sorgu',
  spiritualPath: 'Spiritual Path / Spiritüel Yol',
};

export const pageTypeLabels: Record<string, string> = {
  about: 'About / Hakkında',
  inquiries: 'Inquiries / Sorgular',
  manifesto: 'Manifesto',
  contact: 'Contact / İletişim',
  generic: 'Generic Page',
};

export const collectionKindLabels: Record<string, string> = {
  poetry: 'Poetry Collection',
  artwork: 'Artwork Series',
  writing: 'Writing Theme',
  mixed: 'Mixed Archive',
};

export const mediaKindLabels: Record<string, string> = {
  video: 'Video',
  music: 'Music / Müzik',
};

export function previewDate(value?: string) {
  if (!value) return undefined;

  return value.slice(0, 10);
}

export function previewParts(parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(' · ');
}
