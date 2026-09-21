import type { GlobalConfig } from 'payload'

import { publicGlobalAccess } from '@/access/publicReadAuthenticatedWrite'
import { seoFields } from '@/fields/seoFields'

export const AboutDoctor: GlobalConfig = {
  slug: 'about-doctor',
  label: 'About Dr. Saima',
  admin: { group: 'Content' },
  access: publicGlobalAccess,
  fields: [
    { name: 'pageTitle', type: 'text', required: true, defaultValue: 'About Dr. Saima Absar', maxLength: 90 },
    { name: 'doctorName', type: 'text', required: true, defaultValue: 'Dr. Saima Absar', maxLength: 80 },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'intro', type: 'textarea', required: true, maxLength: 320 },
    { name: 'biography', type: 'textarea', required: true, maxLength: 4000 },
    { name: 'qualifications', type: 'textarea', required: true, maxLength: 800, admin: { description: 'Only publish verified qualifications and professional memberships.' } },
    {
      name: 'areasOfFocus', label: 'Areas of focus', type: 'array', dbName: 'doctor_focus_areas', minRows: 1, maxRows: 15,
      fields: [{ name: 'area', type: 'text', required: true, maxLength: 100 }],
    },
    { name: 'keywords', type: 'text', admin: { description: 'Internal editorial keywords. Search engines do not use a meta-keywords tag.' } },
    { name: 'mapHeading', type: 'text', defaultValue: 'Visit Care and Cure in Johar Town', maxLength: 100 },
    { name: 'mapQuery', type: 'text', defaultValue: '679 A F2, Phase 1, Johar Town, Lahore, Pakistan', admin: { description: 'Address or place query used to create the embedded Google map.' } },
    seoFields,
  ],
}
