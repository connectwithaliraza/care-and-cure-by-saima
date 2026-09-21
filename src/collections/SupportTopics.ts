import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { seoFields } from '@/fields/seoFields'

export const SupportTopics: CollectionConfig = {
  slug: 'support-topics',
  labels: { singular: 'Support Topic', plural: 'Support Topics' },
  admin: { group: 'Content', useAsTitle: 'title', defaultColumns: ['title', 'slug', '_status'] },
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, maxLength: 80 },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'eyebrow', type: 'text', defaultValue: 'Developmental and behavioral support', maxLength: 60 },
    { name: 'summary', type: 'textarea', required: true, maxLength: 240 },
    { name: 'overview', type: 'textarea', required: true, maxLength: 1200 },
    {
      name: 'discussionPoints',
      label: 'What may be discussed',
      type: 'array',
      dbName: 'support_discussion_points',
      minRows: 2,
      maxRows: 8,
      fields: [{ name: 'point', type: 'text', required: true, maxLength: 160 }],
    },
    { name: 'whenToSeekCare', label: 'When to seek qualified medical care', type: 'textarea', required: true, maxLength: 700 },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'order', type: 'number', defaultValue: 0, index: true },
    seoFields,
  ],
}
