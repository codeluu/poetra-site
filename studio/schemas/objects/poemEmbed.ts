import { defineField, defineType } from 'sanity';
import { BookIcon } from '@sanity/icons/Book';

export const poemEmbed = defineType({
  name: 'poemEmbed',
  title: 'Şiir / Poem',
  type: 'object',
  icon: BookIcon,
  initialValue: { source: 'reference' },
  fields: [
    defineField({
      name: 'source', title: 'Şiir kaynağı', type: 'string',
      options: {
        layout: 'radio',
        list: [
          { title: 'Arşivden şiir seç', value: 'reference' },
          { title: 'Şiir metni ekle', value: 'text' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'poem', title: 'Şiir', type: 'reference',
      to: [{ type: 'poetry' }],
      description: 'Şiirin tamamı yazının içinde gösterilir. Yeni şiiri buradan oluşturabilir, yayına almak için şiir kaydını açabilirsiniz.',
      hidden: ({ parent }) => parent?.source !== 'reference',
      validation: Rule => Rule.custom((value, context) =>
        (context.parent as { source?: string })?.source === 'reference' && !value?._ref
          ? 'Arşivden bir şiir seçin.' : true),
    }),
    defineField({
      name: 'title', title: 'Şiir başlığı (isteğe bağlı)', type: 'string',
      hidden: ({ parent }) => parent?.source !== 'text',
    }),
    defineField({
      name: 'text', title: 'Şiir metni', type: 'text', rows: 12,
      description: 'Her dizeyi yeni satıra yazın; kıtalar arasında boş satır bırakın. Satır düzeni korunur. Bu metin yalnızca bu yazıda gösterilir.',
      hidden: ({ parent }) => parent?.source !== 'text',
      validation: Rule => Rule.custom((value, context) =>
        (context.parent as { source?: string })?.source === 'text' && !value?.trim()
          ? 'Şiir metnini girin.' : true),
    }),
    defineField({
      name: 'author', title: 'Şair (isteğe bağlı)', type: 'string',
      hidden: ({ parent }) => parent?.source !== 'text',
    }),
    defineField({
      name: 'language', title: 'Şiirin dili (isteğe bağlı)', type: 'string',
      description: 'Boş bırakılırsa yazının dili kullanılır.',
      options: { list: [{ title: 'Türkçe', value: 'tr' }, { title: 'English', value: 'en' }] },
      hidden: ({ parent }) => parent?.source !== 'text',
    }),
  ],
  preview: {
    select: { source: 'source', title: 'title', poemTitle: 'poem.title', text: 'text', author: 'author' },
    prepare({ source, title, poemTitle, text, author }) {
      return {
        title: source === 'reference' ? poemTitle || 'Şiir seçin' : title || text?.split('\n')[0] || 'Şiir metni',
        subtitle: source === 'reference' ? 'Arşivden şiir' : author || 'Yazı içi şiir',
        media: BookIcon,
      };
    },
  },
});
