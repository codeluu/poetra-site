/**
 * Preview: npx sanity exec scripts/move-hatirla-to-poetry.ts --with-user-token
 * Apply: POETRA_APPLY=1 npx sanity exec scripts/move-hatirla-to-poetry.ts --with-user-token
 * Sanity document types are immutable: create a poem, update references, and
 * remove the old writing together in a revision-guarded transaction.
 */
import { getCliClient } from 'sanity/cli';
import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const client = getCliClient({ apiVersion: '2026-06-28' }).withConfig({ useCdn: false, perspective: 'raw' });
const oldId = 'wp-writing-311';
const newId = 'wp-poetry-311';
const ids = [oldId, `drafts.${oldId}`];
const docs = await client.fetch('*[slug.current == "hatirla" || _id in $ids]', { ids });
const sources = docs.filter((doc: any) => ids.includes(doc._id));
if (!sources.length) {
  assert(docs.some((doc: any) => doc._id === newId && doc._type === 'poetry'), 'Hatırla source not found');
  console.log('Hatırla is already in poetry. No changes.');
} else {
  assert(sources.some((doc: any) => doc._id === oldId), 'Published source is missing');
  assert.equal(docs.length, sources.length, 'Another Hatırla document exists; inspect before moving');
  assert.equal(await client.fetch('count(*[_id in $ids])', { ids: [newId, `drafts.${newId}`] }), 0, 'Destination already exists');
  const refs = await client.fetch('*[references($ids)]', { ids });
  let tx = client.transaction();
  for (const source of sources) {
    assert.equal(source._type, 'writing');
    assert.equal(source.slug?.current, 'hatirla');
    assert.equal(source.language, 'tr');
    assert(source.body?.length > 0, 'Source body is empty');
    const { _id, _type, _rev, _updatedAt, _system, format, language, translationKey, ...content } = source;
    tx = tx.create({ ...content, _id: _id.replace(oldId, newId), _type: 'poetry', originalLanguage: language });
    // A no-op patch makes deletion conditional on the revision we backed up.
    tx = tx.patch(_id, patch => patch.ifRevisionId(_rev).set({ title: source.title }));
  }
  for (const ref of refs) {
    assert.equal(ref._type, 'homePage', `Unexpected reference: ${ref._id}`);
    const moved = (ref.featuredWritings ?? []).filter((item: any) => ids.includes(item._ref));
    assert(moved.length > 0, `Unexpected reference field in ${ref._id}`);
    const featuredWritings = ref.featuredWritings.filter((item: any) => !ids.includes(item._ref));
    const featuredPoems = [...(ref.featuredPoems ?? [])];
    for (const item of moved) {
      if (!featuredPoems.some((poem: any) => poem._ref === newId)) {
        featuredPoems.push({ ...item, _key: 'hatirla-poetry', _ref: newId });
      }
    }
    // Refuse to silently leave additional references in an unexpected field.
    const remaining = JSON.stringify({ ...ref, featuredWritings, featuredPoems });
    assert(!ids.some(id => remaining.includes(`"_ref":"${id}"`)), 'Unexpected remaining reference');
    tx = tx.patch(ref._id, patch => patch.ifRevisionId(ref._rev).set({ featuredWritings, featuredPoems }));
  }
  for (const source of sources) tx = tx.delete(source._id);
  console.log(JSON.stringify({ action: 'Move Hatırla from writings to poetry', sources: sources.map((d: any) => d._id), references: refs.map((d: any) => d._id), destination: newId, apply: process.env.POETRA_APPLY === '1' }));
  if (process.env.POETRA_APPLY === '1') {
    const backup = join(tmpdir(), `poetra-hatirla-${Date.now()}.json`);
    writeFileSync(backup, JSON.stringify({ sources, references: refs }, null, 2), { mode: 0o600 });
    await tx.commit();
    for (const source of sources) {
      const result = await client.getDocument(source._id.replace(oldId, newId));
      assert.equal(result?._type, 'poetry');
      assert.deepEqual(result?.body, source.body);
      assert.equal(result?.publishedAt, source.publishedAt);
      assert.equal(result?.title, source.title);
      assert.deepEqual(result?.seo, source.seo);
      assert.deepEqual(result?.tags, source.tags);
    }
    assert.equal(await client.fetch('count(*[_id in $ids])', { ids }), 0);
    console.log(`Moved and verified. Backup: ${backup}`);
  }
}
