import type { CollectionConfig } from 'payload'

import { publicReadAuthenticatedWrite } from '@/access/publicReadAuthenticatedWrite'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { group: 'Homepage', useAsTitle: 'patientName', defaultColumns: ['patientName', 'rating', 'featured'] },
  access: publicReadAuthenticatedWrite,
  defaultSort: '-createdAt',
  fields: [
    { name: 'patientName', type: 'text', required: true },
    { name: 'testimonial', type: 'textarea', required: true, maxLength: 400 },
    { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5 },
    { name: 'location', type: 'text' },
    { name: 'featured', type: 'checkbox', defaultValue: true, index: true },
  ],
}
