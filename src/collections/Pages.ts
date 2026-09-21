import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { seoFields } from '@/fields/seoFields'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { group: 'Content', useAsTitle: 'title', defaultColumns: ['title', 'slug', 'pageType', '_status'] },
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, maxLength: 90 },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'pageType', type: 'select', required: true, defaultValue: 'general',
      options: [{ label: 'General', value: 'general' }, { label: 'Consultation', value: 'consultation' }, { label: 'Legal / Policy', value: 'legal' }],
    },
    { name: 'summary', type: 'textarea', required: true, maxLength: 260 },
    { name: 'content', type: 'textarea', required: true, maxLength: 6000 },
    {
      name: 'highlights', type: 'array', dbName: 'page_highlights', maxRows: 10,
      fields: [{ name: 'highlight', type: 'text', required: true, maxLength: 180 }],
    },
    { name: 'showAppointmentCTA', type: 'checkbox', defaultValue: false },
    seoFields,
  ],
}
