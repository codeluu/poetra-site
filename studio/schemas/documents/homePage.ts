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
  fields: [
    defineField({
      name: 'heroKicker',
      title: 'Hero Kicker / Üst Etiket',
      description: 'Örn: "Poetra — kişisel bir edebiyat arşivi"',
      type: 'string',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title / Başlık',
      description: 'Örn: "Kelimeler için sakin bir mekân."',
      type: 'string',
    }),
    defineField({
      name: 'heroTitleEmphasis',
      title: 'Hero Title Emphasis / Vurgu',
      description:
        'Başlığın içinde italik ve bakır renkle vurgulanacak kelime/ifade. Başlıkta birebir geçmelidir (örn: "sakin").',
      type: 'string',
    }),
    defineField({
      name: 'heroLede',
      title: 'Hero Lede / Giriş Cümlesi',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'dailyQuotes',
      title: 'Daily Quotes / Günün Dizesi Havuzu',
      description:
        'Her gün havuzdan sırayla bir alıntı gösterilir. Satır sonları korunur.',
      type: 'array',
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
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'poetry' }] })],
    }),
    defineField({
      name: 'featuredWritings',
      title: 'Featured Writings / Arşivden — Seçili Yazılar',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'writing' }] })],
    }),
    defineField({
      name: 'shelfHeading',
      title: 'Shelf Heading / Kitap-Müzik Bölüm Başlığı',
      description: 'Örn: "Kitaplar · Müzik"',
      type: 'string',
    }),
    defineField({
      name: 'works',
      title: 'Works / Kitap & Müzik Kartları',
      description:
        'Boş bırakılırsa mevcut kartlar gösterilir. "Müzik" türündeki kartlar koyu kapakla çizilir. URL verilmeyen kartlar tıklanamaz (örn. not: "Detaylar yakında").',
      type: 'array',
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
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'kind' },
          },
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Ana Sayfa', subtitle: 'Homepage settings' }),
  },
});
