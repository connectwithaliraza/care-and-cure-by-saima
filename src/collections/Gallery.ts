import type { CollectionConfig } from 'payload'

import { publicReadAuthenticatedWrite } from '@/access/publicReadAuthenticatedWrite'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: { group: 'Content', useAsTitle: 'title', defaultColumns: ['title', 'category', 'order'] },
  access: publicReadAuthenticatedWrite,
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'textarea' },
    { name: 'category', type: 'text' },
    { name: 'order', type: 'number', required: true, defaultValue: 0 },
    { name: 'active', type: 'checkbox', required: true, defaultValue: true },
  ],
}
