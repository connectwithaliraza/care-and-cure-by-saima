import type { CollectionConfig, Where } from 'payload'

import { authenticated } from '@/access/authenticated'
import { seoFields } from '@/fields/seoFields'

export const MedicalKits: CollectionConfig = {
  slug: 'medical-kits',
  labels: { singular: 'Medical Kit', plural: 'Medical Kits' },
  admin: { group: 'Medical Kits', useAsTitle: 'title', defaultColumns: ['title', 'price', 'featured', '_status'] },
  access: {
    read: ({ req }) => (req.user ? true : { and: [{ _status: { equals: 'published' } }, { active: { equals: true } }] } as Where),
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: { drafts: true },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true, maxLength: 80 },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'description', type: 'textarea', required: true, maxLength: 1200 },
    { name: 'keywords', type: 'text', admin: { description: 'Internal editorial keywords, separated by commas. Do not stuff these into visible content.' } },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'price', type: 'number', required: true, min: 0 },
    { name: 'currency', type: 'select', required: true, defaultValue: 'PKR', options: ['PKR', 'USD', 'GBP', 'AED'] },
    {
      name: 'benefits', type: 'array', dbName: 'kit_benefits', required: true, minRows: 1, maxRows: 10,
      fields: [{ name: 'benefit', type: 'text', required: true, maxLength: 180 }],
    },
    { name: 'safetyNotice', type: 'textarea', required: true, maxLength: 700 },
    { name: 'featured', type: 'checkbox', required: true, defaultValue: false, index: true },
    { name: 'active', type: 'checkbox', required: true, defaultValue: true, index: true },
    { name: 'order', type: 'number', required: true, defaultValue: 0, index: true },
    seoFields,
  ],
}
