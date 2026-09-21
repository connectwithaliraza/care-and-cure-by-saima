import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const PatientInquiries: CollectionConfig = {
  slug: 'patient-inquiries',
  labels: { singular: 'Patient Inquiry', plural: 'Patient Inquiries' },
  admin: {
    group: 'Patient Management',
    useAsTitle: 'inquiryType',
    defaultColumns: ['createdAt', 'patient', 'inquiryType', 'source', 'status'],
  },
  access: { read: authenticated, create: authenticated, update: authenticated, delete: authenticated },
  defaultSort: '-createdAt',
  fields: [
    { name: 'patient', type: 'relationship', relationTo: 'patients', required: true, index: true },
    {
      name: 'inquiryType', type: 'select', required: true, index: true,
      options: [
        { label: 'Video consultation', value: 'video-consultation' },
        { label: 'Physical clinic visit', value: 'physical-consultation' },
        { label: 'General WhatsApp inquiry', value: 'general-inquiry' },
        { label: 'Medical kit inquiry', value: 'medical-kit' },
      ],
    },
    { name: 'source', type: 'text', required: true, index: true, maxLength: 80 },
    { name: 'message', type: 'textarea', required: true, maxLength: 2000 },
    { name: 'productName', type: 'text', maxLength: 120 },
    { name: 'quantity', type: 'number', min: 1, max: 100 },
    {
      name: 'status', type: 'select', required: true, defaultValue: 'new', index: true,
      options: [{ label: 'New', value: 'new' }, { label: 'Contacted', value: 'contacted' }, { label: 'Converted', value: 'converted' }, { label: 'Closed', value: 'closed' }],
    },
  ],
}
