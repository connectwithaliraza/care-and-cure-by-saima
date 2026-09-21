import type { GlobalConfig } from 'payload'

import { publicGlobalAccess } from '@/access/publicReadAuthenticatedWrite'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Settings',
  },
  access: publicGlobalAccess,
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'Care and Cure',
    },
    {
      name: 'doctorName',
      type: 'text',
      required: true,
      defaultValue: 'Dr. Saima Absar',
    },
    {
      name: 'clinicType',
      type: 'text',
      required: true,
      defaultValue: 'Homeopathic Clinic',
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Compassionate care. Thoughtful support.',
    },
    {
      name: 'domain',
      type: 'text',
      required: true,
      defaultValue: 'careandcurebysaima.com',
    },
  ],
}
