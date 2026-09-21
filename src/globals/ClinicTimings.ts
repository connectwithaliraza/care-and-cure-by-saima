import type { GlobalConfig } from 'payload'

import { publicGlobalAccess } from '@/access/publicReadAuthenticatedWrite'

export const ClinicTimings: GlobalConfig = {
  slug: 'clinic-timings',
  label: 'Clinic Timings',
  admin: { group: 'Settings' },
  access: publicGlobalAccess,
  fields: [
    {
      name: 'schedule',
      type: 'array',
      labels: { singular: 'Schedule row', plural: 'Schedule' },
      fields: [
        { name: 'days', type: 'text', required: true },
        { name: 'hours', type: 'text', required: true },
        { name: 'closed', type: 'checkbox', defaultValue: false },
      ],
    },
    { name: 'appointmentNote', type: 'text', defaultValue: 'Appointments are recommended.' },
  ],
}
