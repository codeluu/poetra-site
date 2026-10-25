import { defineArrayMember, defineType } from 'sanity';
import { blockContent } from './blockContent';

// Keep poem insertion specific to writings; existing body arrays need no migration.
export const writingBody = defineType({
  name: 'writingBody',
  title: 'Yazı içeriği',
  type: 'array',
  of: [...blockContent.of, defineArrayMember({ type: 'poemEmbed' })],
});
