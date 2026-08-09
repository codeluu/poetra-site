import { createClient } from '@sanity/client';
import type { YouTubeEmbedBlock } from './youtube';

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
} | YouTubeEmbedBlock;

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
  youtubeOpenInNewTab?: boolean;
  spotifyUrl?: string;
  spotifyOpenInNewTab?: boolean;
  soundCloudUrl?: string;
  soundCloudOpenInNewTab?: boolean;
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

export type DailyQuoteItem = {
  text: string;
  source?: string;
  date?: string;
};

export type HomeWorkCard = {
  title: string;
  kind?: string;
  note?: string;
  url?: string;
  openInNewTab?: boolean;
};

export type NavigationItem = {
  label?: string;
  href?: string;
  enabled?: boolean;
  openInNewTab?: boolean;
};

export type SiteSettings = {
  headerNavigation?: NavigationItem[];
  footerText?: string;
  copyrightText?: string;
  footerNavigation?: NavigationItem[];
};

export type HomePageSettings = {
  heroKicker?: string;
  heroTitle?: string;
  heroTitleEmphasis?: string;
  heroLede?: string;
  dailyQuotes?: DailyQuoteItem[];
  featured?: ContentSummary[];
  shelfHeading?: string;
  works?: HomeWorkCard[];
  seo?: {
    title?: string;
    description?: string;
  };
};
