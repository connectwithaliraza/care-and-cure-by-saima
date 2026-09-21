import type { CollectionConfig } from 'payload'
import { randomBytes } from 'node:crypto'

import { authenticated } from '@/access/authenticated'

export const Patients: CollectionConfig = {
  slug: 'patients',
  admin: {
    group: 'Patient Management',
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'whatsappNumber', 'location', 'status', 'lastInquiryAt'],
    listSearchableFields: ['fullName', 'whatsappNumber', 'location'],
    components: { views: { list: { Component: '@/components/admin/PatientDashboard#PatientDashboard' } } },
  },
  access: { read: authenticated, create: authenticated, update: authenticated, delete: authenticated },
  defaultSort: '-lastInquiryAt',
  hooks: {
    beforeValidate: [({ data, operation }) => {
      if (operation === 'create' && data && !data.patientCode) data.patientCode = `CC-${new Date().getFullYear()}-${randomBytes(3).toString('hex').toUpperCase()}`
      return data
    }],
  },
  fields: [
    { name: 'patientCode', label: 'Patient ID', type: 'text', unique: true, index: true, admin: { readOnly: true } },
    { name: 'fullName', type: 'text', required: true, index: true, maxLength: 100 },
    { name: 'whatsappNumber', label: 'WhatsApp number', type: 'text', required: true, unique: true, index: true, maxLength: 30 },
    { name: 'location', type: 'text', required: true, index: true, maxLength: 120 },
    { name: 'dateOfBirth', type: 'date', admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd MMM yyyy' } } },
    { name: 'gender', type: 'select', options: [{ label: 'Female', value: 'female' }, { label: 'Male', value: 'male' }, { label: 'Other / prefer not to say', value: 'other' }] },
    { name: 'address', type: 'textarea', maxLength: 500 },
    { name: 'guardianName', label: 'Parent / guardian name', type: 'text', maxLength: 100 },
    { name: 'guardianRelationship', label: 'Relationship to patient', type: 'text', maxLength: 80 },
    { name: 'emergencyContact', type: 'text', maxLength: 100 },
    {
      name: 'status', type: 'select', required: true, defaultValue: 'prospective', index: true,
      options: [{ label: 'Prospective patient', value: 'prospective' }, { label: 'Active patient', value: 'active' }, { label: 'Inactive', value: 'inactive' }, { label: 'Archived', value: 'archived' }],
    },
    {
      name: 'preferredConsultation', type: 'select',
      options: [{ label: 'Video consultation', value: 'video' }, { label: 'Physical clinic visit', value: 'physical' }, { label: 'Not specified', value: 'not-specified' }],
    },
    { name: 'source', type: 'text', required: true, defaultValue: 'website', index: true, maxLength: 80 },
    { name: 'consentToContact', label: 'Consent to be contacted', type: 'checkbox', required: true, defaultValue: false },
    { name: 'lastInquiryAt', type: 'date', index: true },
    { name: 'reportedAllergies', label: 'Reported allergies', type: 'textarea', maxLength: 1200 },
    { name: 'reportedDiagnoses', label: 'Reported diagnoses / medical history', type: 'textarea', maxLength: 2500 },
    { name: 'currentPrescribedMedicines', label: 'Current prescribed medicines', type: 'textarea', maxLength: 2000 },
    { name: 'internalNotes', type: 'textarea', maxLength: 2000 },
  ],
}
