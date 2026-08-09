import { defineArrayMember, defineField, defineType } from 'sanity';

const navigationItem = defineArrayMember({
  type: 'object',
  name: 'navigationItem',
  fields: [
    defineField({
      name: 'label',
      title: 'Label / Etiket',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'string',
      description: 'Existing route or external URL. Examples: /poetry, /about',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'enabled',
      title: 'Enabled / Aktif',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab / Yeni sekmede aç',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'href',
    },
  },
});

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings / Site Ayarları',
  type: 'document',
  fields: [
    defineField({
      name: 'headerNavigation',
      title: 'Header Navigation / Üst Menü',
      description: 'Public header menu. The order here is the public menu order.',
      type: 'array',
      of: [navigationItem],
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Text / Alt Bilgi Metni',
      type: 'string',
      description: 'Example: Şiir, yazı ve müzik arşivi',
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright Text / Telif Metni',
      type: 'string',
      description: 'Example: © 2026 Poetra.art',
    }),
    defineField({
      name: 'footerNavigation',
      title: 'Footer Navigation / Alt Menü',
      description:
        'Optional footer menu. If empty, the footer uses the header menu plus the existing YouTube link.',
      type: 'array',
      of: [navigationItem],
    }),
  ],
  preview: {
    prepare: () => ({
      title: 'Site Ayarları',
      subtitle: 'Header and footer settings',
    }),
  },
});
