import type { CollectionConfig } from 'payload'

import { publicReadAuthenticatedWrite } from '@/access/publicReadAuthenticatedWrite'

export const HeroSlides: CollectionConfig = {
  slug: 'hero-slides',
  admin: { group: 'Homepage', useAsTitle: 'heading', defaultColumns: ['heading', 'order', 'active'] },
  access: publicReadAuthenticatedWrite,
  defaultSort: 'order',
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true, maxLength: 90 },
    { name: 'description', type: 'textarea', required: true, maxLength: 220 },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      type: 'row',
      fields: [
        { name: 'ctaLabel', label: 'CTA label', type: 'text' },
        { name: 'ctaLink', label: 'CTA link', type: 'text' },
      ],
    },
    { name: 'order', type: 'number', required: true, defaultValue: 0, index: true },
    { name: 'active', type: 'checkbox', required: true, defaultValue: true, index: true },
  ],
}
