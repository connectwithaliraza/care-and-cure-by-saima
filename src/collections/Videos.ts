import type { CollectionConfig } from 'payload'

import { publicReadAuthenticatedWrite } from '@/access/publicReadAuthenticatedWrite'

const videoURL = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|instagram\.com)\/.+/i

export const Videos: CollectionConfig = {
  slug: 'videos',
  admin: { group: 'Content', useAsTitle: 'title', defaultColumns: ['title', 'platform', 'featured'] },
  access: publicReadAuthenticatedWrite,
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'url',
      type: 'text',
      required: true,
      validate: (value: null | string | undefined) => !value || videoURL.test(value) || 'Enter a valid YouTube or Instagram URL.',
    },
    {
      name: 'platform',
      type: 'select',
      required: true,
      options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'Instagram', value: 'instagram' },
      ],
    },
    { name: 'thumbnail', type: 'upload', relationTo: 'media' },
    { name: 'publishedAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'featured', type: 'checkbox', defaultValue: true, index: true },
  ],
}
