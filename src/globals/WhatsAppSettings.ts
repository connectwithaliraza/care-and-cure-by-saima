import type { GlobalConfig } from 'payload'

import { publicGlobalAccess } from '@/access/publicReadAuthenticatedWrite'

export const WhatsAppSettings: GlobalConfig = {
  slug: 'whatsapp-settings',
  label: 'WhatsApp Settings',
  admin: { group: 'Settings' },
  access: publicGlobalAccess,
  fields: [
    { name: 'enabled', type: 'checkbox', required: true, defaultValue: true },
    { name: 'number', type: 'text', required: true, defaultValue: '+92 322 4853915' },
    { name: 'buttonLabel', type: 'text', required: true, defaultValue: 'Chat on WhatsApp' },
    {
      name: 'prefilledMessage',
      type: 'textarea',
      defaultValue: 'Hello, I would like to book an appointment at Care and Cure.',
    },
  ],
}
