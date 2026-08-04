import { blockContent } from './objects/blockContent';
import { seo } from './objects/seo';

import { poetry } from './documents/poetry';
import { writing } from './documents/writing';
import { mediaEntry } from './documents/mediaEntry';
import { artwork } from './documents/artwork';
import { collection } from './documents/collection';
import { page } from './documents/page';
import { homePage } from './documents/homePage';

export const schemaTypes = [
  blockContent,
  seo,
  homePage,
  poetry,
  writing,
  mediaEntry,
  artwork,
  collection,
  page,
];
