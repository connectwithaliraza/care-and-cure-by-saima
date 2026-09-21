import type { CollectionConfig } from 'payload'

import { publicReadAuthenticatedWrite } from '@/access/publicReadAuthenticatedWrite'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: { group: 'Clinical Content', useAsTitle: 'question', defaultColumns: ['question', 'category', 'order'] },
  access: publicReadAuthenticatedWrite,
  defaultSort: 'order',
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
    { name: 'category', type: 'text' },
    { name: 'order', type: 'number', required: true, defaultValue: 0 },
    { name: 'active', type: 'checkbox', required: true, defaultValue: true },
  ],
}
