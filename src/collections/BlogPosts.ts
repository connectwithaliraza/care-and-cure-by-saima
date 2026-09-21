import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { seoFields } from '@/fields/seoFields'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: { group: 'Blog', useAsTitle: 'title', defaultColumns: ['title', '_status', 'publishedAt'] },
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: { drafts: true },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'excerpt', type: 'textarea', required: true, maxLength: 240 },
    { name: 'content', type: 'textarea', required: true },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'category', type: 'relationship', relationTo: 'blog-categories' },
    { name: 'publishedAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } }, index: true },
    seoFields,
  ],
}
