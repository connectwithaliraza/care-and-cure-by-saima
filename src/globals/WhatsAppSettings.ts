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
    { name: 'buttonLabel', label: 'Button text (English)', type: 'text', required: true, defaultValue: 'Talk with Consultant', maxLength: 40 },
    {
      name: 'buttonColor',
      label: 'Button background colour',
      type: 'text',
      required: true,
      defaultValue: '#25D366',
      admin: { description: 'Enter a hex colour, for example #25D366.' },
      validate: (value: string | null | undefined) => /^#[0-9a-f]{6}$/i.test(value || '') || 'Enter a valid six-digit hex colour, such as #25D366.',
    },
    {
      name: 'buttonTextColor',
      label: 'Button text colour',
      type: 'text',
      required: true,
      defaultValue: '#FFFFFF',
      admin: { description: 'Enter a hex colour, for example #FFFFFF.' },
      validate: (value: string | null | undefined) => /^#[0-9a-f]{6}$/i.test(value || '') || 'Enter a valid six-digit hex colour, such as #FFFFFF.',
    },
    {
      name: 'prefilledMessage',
      type: 'textarea',
      defaultValue: 'Hello, I would like to book an appointment at Care and Cure.',
    },
  ],
}
