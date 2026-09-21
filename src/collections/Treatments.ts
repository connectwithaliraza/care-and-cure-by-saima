import type { CollectionConfig } from 'payload'

import { publicReadAuthenticatedWrite } from '@/access/publicReadAuthenticatedWrite'

export const Treatments: CollectionConfig = {
  slug: 'treatments',
  admin: { group: 'Clinical Content', useAsTitle: 'title', defaultColumns: ['title', 'order', 'active'] },
  access: publicReadAuthenticatedWrite,
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'summary', type: 'textarea', required: true, maxLength: 180 },
    { name: 'iconLabel', type: 'text', admin: { description: 'Short initials or symbol shown on the card.' } },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'order', type: 'number', required: true, defaultValue: 0, index: true },
    { name: 'active', type: 'checkbox', required: true, defaultValue: true, index: true },
  ],
}
