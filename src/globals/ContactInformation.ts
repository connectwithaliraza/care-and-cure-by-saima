import type { GlobalConfig } from 'payload'

import { publicGlobalAccess } from '@/access/publicReadAuthenticatedWrite'

export const ContactInformation: GlobalConfig = {
  slug: 'contact-information',
  label: 'Contact Information',
  admin: { group: 'Settings' },
  access: publicGlobalAccess,
  fields: [
    { name: 'phone', type: 'text', required: true, defaultValue: '+92 322 4853915' },
    { name: 'email', type: 'email', defaultValue: 'hello@careandcurebysaima.com' },
    {
      name: 'address',
      type: 'textarea',
      required: true,
      defaultValue: '679 A F2, Phase 1, Johar Town, Lahore, Pakistan',
    },
    { name: 'mapURL', label: 'Map URL', type: 'text' },
  ],
}
