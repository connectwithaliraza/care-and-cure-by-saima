import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const ConsultationRecords: CollectionConfig = {
  slug: 'consultation-records', labels: { singular: 'Consultation Record', plural: 'Consultation Records' },
  admin: { group: 'Patient Management', useAsTitle: 'consultationDate', defaultColumns: ['consultationDate', 'patient', 'consultationType', 'followUpDate'] },
  access: { read: authenticated, create: authenticated, update: authenticated, delete: authenticated }, defaultSort: '-consultationDate',
  fields: [
    { name: 'patient', type: 'relationship', relationTo: 'patients', required: true, index: true },
    { name: 'appointment', type: 'relationship', relationTo: 'patient-appointments' },
    { name: 'consultationDate', type: 'date', required: true, index: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'consultationType', type: 'select', defaultValue: 'physical', options: [{ label: 'Physical', value: 'physical' }, { label: 'Video', value: 'video' }] },
    { name: 'mainConcerns', type: 'textarea', maxLength: 2500 }, { name: 'historyReported', type: 'textarea', maxLength: 4000 }, { name: 'observations', type: 'textarea', maxLength: 3000 },
    { name: 'guidanceProvided', type: 'textarea', maxLength: 3000 }, { name: 'privateClinicalNotes', type: 'textarea', maxLength: 4000 },
    { name: 'followUpDate', type: 'date', index: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'documents', type: 'upload', relationTo: 'media', hasMany: true },
  ],
}
