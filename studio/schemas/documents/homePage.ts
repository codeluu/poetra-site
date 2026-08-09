import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Singleton homepage settings ("Ana Sayfa" in the Studio sidebar).
 * Every field is optional: the Astro homepage falls back to its built-in
 * copy when this document (or any field) is missing, so the site always
 * builds. Created/edited only via the pinned singleton entry (documentId
 * "homePage") in the Studio structure.
 */
export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page / Ana Sayfa',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero / Giriş', default: true },
    { name: 'daily', title: 'Daily Quote / Günün Dizesi' },
    { name: 'archive', title: 'Archive / Arşiv' },
    { name: 'works', title: 'Works / Kitap & Müzik' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'heroKicker',
      title: 'Hero Kicker / Üst Etiket',
      description: 'Örn: "Poetra — kişisel bir edebiyat arşivi"',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title / Başlık',
      description: 'Örn: "Kelimeler için sakin bir mekân."',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroTitleEmphasis',
      title: 'Hero Title Emphasis / Vurgu',
      description:
        'Başlığın içinde italik ve bakır renkle vurgulanacak kelime/ifade. Başlıkta birebir geçmelidir (örn: "sakin").',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroLede',
      title: 'Hero Lede / Giriş Cümlesi',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),
    defineField({
      name: 'dailyQuotes',
      title: 'Daily Quotes / Günün Dizesi Havuzu',
      description:
        'Her gün havuzdan sırayla bir alıntı gösterilir. Satır sonları korunur.',
      type: 'array',
      group: 'daily',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'dailyQuote',
          fields: [
            defineField({
              name: 'text',
              title: 'Text / Alıntı',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: 'source', title: 'Source / Kaynak', type: 'string' }),
            defineField({ name: 'date', title: 'Date / Yıl', type: 'string' }),
          ],
          preview: {
            select: { title: 'text', subtitle: 'source' },
            prepare({ title, subtitle }) {
              return {
                title: title?.split('\n')[0] || 'Daily quote',
                subtitle,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'featuredPoems',
      title: 'Featured Poems / Arşivden — Seçili Şiirler',
      description:
        'Boş bırakılırsa "Arşivden" bloğu en yeni içerikleri otomatik gösterir.',
      type: 'array',
      group: 'archive',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'poetry' }] })],
    }),
    defineField({
      name: 'featuredWritings',
      title: 'Featured Writings / Arşivden — Seçili Yazılar',
      type: 'array',
      group: 'archive',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'writing' }] })],
    }),
    defineField({
      name: 'shelfHeading',
      title: 'Shelf Heading / Kitap-Müzik Bölüm Başlığı',
      description: 'Örn: "Kitaplar · Müzik"',
      type: 'string',
      group: 'works',
    }),
    defineField({
      name: 'works',
      title: 'Works / Kitap & Müzik Kartları',
      description:
        'Boş bırakılırsa mevcut kartlar gösterilir. "Müzik" türündeki kartlar koyu kapakla çizilir. URL verilmeyen kartlar tıklanamaz (örn. not: "Detaylar yakında").',
      type: 'array',
      group: 'works',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'workCard',
          fields: [
            defineField({
              name: 'title',
              title: 'Title / Başlık',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'kind',
              title: 'Kind / Tür',
              description: '"Kitap" veya "Müzik"',
              type: 'string',
            }),
            defineField({ name: 'note', title: 'Note / Not', type: 'string' }),
            defineField({ name: 'url', title: 'URL (opsiyonel)', type: 'url' }),
            defineField({
              name: 'openInNewTab',
              title: 'Open in new tab / Yeni sekmede aç',
              description:
                'Off by default. Enable only when this work card should open a separate tab.',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: 'title',
              kind: 'kind',
              note: 'note',
              url: 'url',
              openInNewTab: 'openInNewTab',
            },
            prepare({ title, kind, note, url, openInNewTab }) {
              return {
                title,
                subtitle: [
                  kind,
                  note,
                  url ? (openInNewTab ? 'New tab' : 'Same tab') : 'No link',
                ]
                  .filter(Boolean)
                  .join(' · '),
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Ana Sayfa', subtitle: 'Homepage settings' }),
  },
});
