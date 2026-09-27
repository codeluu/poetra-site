/** One-time, revision-guarded move into the existing editorial notes field.
 * npx sanity exec scripts/move-kirmizi-note.ts --with-user-token
 */
import { getCliClient } from 'sanity/cli';
import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const client = getCliClient({ apiVersion: '2026-06-28' });
const noteText = 'Şiiri yazdığım tam tarihi bilemediğimden kız kardeşime atıfla 1 Ekim olarak ayarladım. Mutlu olsun!';
const docs = await client.fetch('*[_type == "poetry" && slug.current == "kirmizi"]');
if (!docs.length) throw new Error('Kırmızı was not found');
for (const doc of docs) {
  const isNote = (block: any) => block._type === 'block' &&
    block.children?.map((child: any) => child.text ?? '').join('').trim() === noteText;
  const matches = (doc.body ?? []).filter(isNote);
  if (!matches.length) {
    if (doc.notes?.some(isNote)) { console.log(`${doc._id}: already moved`); continue; }
    throw new Error(`${doc._id}: expected note not found`);
  }
  if (matches.length !== 1) throw new Error('Expected exactly one note');
  const backup = join(tmpdir(), `poetra-kirmizi-${doc._id}-${Date.now()}.json`);
  writeFileSync(backup, JSON.stringify(doc, null, 2), { mode: 0o600 });
  const notes = doc.notes ?? [];
  await client.patch(doc._id).ifRevisionId(doc._rev).set({
    body: doc.body.filter((block: any) => !isNote(block)),
    notes: notes.some(isNote) ? notes : [...notes, { ...matches[0], style: 'normal' }],
  }).commit();
  console.log(`${doc._id}: note moved; backup: ${backup}`);
}
