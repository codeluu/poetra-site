import { blockContent } from './objects/blockContent';
import { writingBody } from './objects/writingBody';
import { poemEmbed } from './objects/poemEmbed';
import { seo } from './objects/seo';
import { youtubeEmbed } from './objects/youtubeEmbed';

import { poetry } from './documents/poetry';
import { writing } from './documents/writing';
import { mediaEntry } from './documents/mediaEntry';
import { artwork } from './documents/artwork';
import { collection } from './documents/collection';
import { page } from './documents/page';
import { homePage } from './documents/homePage';
import { siteSettings } from './documents/siteSettings';

export const schemaTypes = [
  blockContent,
  writingBody,
  poemEmbed,
  seo,
  youtubeEmbed,
  homePage,
  siteSettings,
  poetry,
  writing,
  mediaEntry,
  artwork,
  collection,
  page,
];
