import { test } from 'node:test';
import assert from 'node:assert/strict';
import { portableTextToHtml } from '../src/lib/portableText';

const block = (text: string) => ({ _type: 'block', _key: text, style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 's', marks: [], text }] });
const render = (data: Record<string, unknown>) => portableTextToHtml([{ _type: 'poemEmbed', _key: 'poem', ...data }]);

test('text poems retain line breaks, blank lines, indentation and escape HTML', () => {
  const html = render({ source: 'text', title: '<Başlık>', author: '<Şair>', text: '  ilk dize\nikinci\n\n<script>alert(1)</script>', language: 'en' });
  assert(html.includes('  ilk dize\nikinci\n\n&lt;script&gt;'));
  assert(html.includes('&lt;Başlık&gt;'));
  assert(html.includes('&lt;Şair&gt;'));
  assert(html.includes('lang="en"'));
  assert(!html.includes('<script>'));
});

test('archive poems include full verses and a safe canonical link', () => {
  const html = render({ source: 'reference', poem: { _type: 'poetry', title: 'Hatırla', originalLanguage: 'tr', slug: { current: 'hatirla' }, body: [block('ilk'), block('son')] } });
  assert(html.includes('<p>ilk</p><p>son</p>'));
  assert(html.includes('href="/poetry/tr/hatirla"'));
});

test('missing and unpublished references are omitted', () => {
  for (const poem of [null, undefined, { _ref: 'drafts.poem' }, { _type: 'writing', body: [block('draft')] }]) {
    assert.equal(render({ source: 'reference', poem }), '');
  }
});

test('switching sources does not expose the inactive text', () => {
  assert(!render({ source: 'text', text: 'visible', poem: { _type: 'poetry', body: [block('hidden')] } }).includes('hidden'));
  assert(!render({ source: 'reference', text: 'hidden', poem: { _type: 'poetry', body: [block('visible')] } }).includes('hidden'));
});

test('empty content and unknown modes render nothing', () => {
  assert.equal(render({ source: 'text', text: '   ' }), '');
  assert.equal(render({ source: 'unexpected', text: 'hidden' }), '');
});

test('poems stay between the surrounding prose', () => {
  const html = portableTextToHtml([block('before'), { _key: 'poem', _type: 'poemEmbed', source: 'text', text: 'verse' }, block('after')]);
  assert(html.indexOf('before') < html.indexOf('verse'));
  assert(html.indexOf('</figure>') < html.indexOf('after'));
});
