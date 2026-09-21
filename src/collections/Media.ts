import type { CollectionConfig } from 'payload'

import { publicReadAuthenticatedWrite } from '@/access/publicReadAuthenticatedWrite'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media' },
  admin: { group: 'Content', useAsTitle: 'alt' },
  access: publicReadAuthenticatedWrite,
  upload: {
    mimeTypes: ['image/*'],
    staticDir: 'media',
  },
  fields: [
    { name: 'alt', type: 'text', required: true },
    { name: 'caption', type: 'text' },
  ],
}
