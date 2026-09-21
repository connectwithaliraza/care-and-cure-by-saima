import type { GlobalConfig } from 'payload'

import { publicGlobalAccess } from '@/access/publicReadAuthenticatedWrite'

export const SEODefaults: GlobalConfig = {
  slug: 'seo-defaults',
  label: 'SEO Defaults',
  admin: { group: 'Settings' },
  access: publicGlobalAccess,
  fields: [
    { name: 'metaTitle', type: 'text', required: true, defaultValue: 'Care and Cure | Dr. Saima Absar' },
    {
      name: 'metaDescription',
      type: 'textarea',
      required: true,
      maxLength: 160,
      defaultValue: 'Care and Cure is a homeopathic clinic led by Dr. Saima Absar in Johar Town, Lahore.',
    },
    { name: 'shareImage', type: 'upload', relationTo: 'media' },
    { name: 'noIndex', type: 'checkbox', defaultValue: false },
  ],
}
