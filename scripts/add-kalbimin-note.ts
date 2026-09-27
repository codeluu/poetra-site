/** npx sanity exec scripts/add-kalbimin-note.ts --with-user-token */
import { getCliClient } from 'sanity/cli';
import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const client = getCliClient({ apiVersion: '2026-06-28' });
const text = 'Şiiri bu müzik eşliğinde yavaşça okumanız halinde huzur etkisi yaratacaktır.';
const docs = await client.fetch('*[_type == "poetry" && slug.current == "kalbimin-kalbinden"]');
if (!docs.length) throw new Error('Poem not found');
for (const doc of docs) {
  const isNote = (b: any) => b._type === 'block' && b.children?.map((s: any) => s.text ?? '').join('').trim() === text;
  const matches = (doc.body ?? []).filter(isNote);
  if (matches.length > 1) throw new Error('Multiple matching notes');
  const backup = join(tmpdir(), `poetra-kalbimin-${doc._id}-${Date.now()}.json`);
  writeFileSync(backup, JSON.stringify(doc, null, 2), {mode:0o600});
  const notes = doc.notes ?? [];
  const note = matches[0] ?? {_type:'block',_key:'kalbimin-note',markDefs:[],children:[{_type:'span',_key:'note-text',text,marks:[]}]};
  await client.patch(doc._id).ifRevisionId(doc._rev).set({
    body: (doc.body ?? []).filter((b: any) => !isNote(b)),
    notes: notes.some(isNote) ? notes : [...notes,{...note,style:'normal'}],
    footnoteVideo: {_type:'youtubeEmbed',url:'https://www.youtube.com/watch?v=5jlRlKM7CxQ',title:'Kalbimin kalbinden — Sanatçının Dipnotu',displayStyle:'minimal'},
  }).commit();
  console.log(`${doc._id}: note and video saved; backup: ${backup}`);
}
