import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? 'mcbpzste',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION ?? '2026-06-28',
  useCdn: false,
});

export type PortableTextBlock = {
  _key: string;
  _type: string;
  [key: string]: unknown;
};

export type Slug = {
  current: string;
};

export type ContentSummary = {
  _id: string;
  _type: string;
  title: string;
  slug: Slug;
  language?: 'tr' | 'en';
  originalLanguage?: 'tr' | 'en';
  publishedAt?: string;
  tags?: string[];
  format?: string;
  kind?: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  soundCloudUrl?: string;
  excerpt?: string;
  seo?: {
    title?: string;
    description?: string;
  };
};

export type ContentDocument = ContentSummary & {
  body?: PortableTextBlock[];
  pageType?: string;
};
