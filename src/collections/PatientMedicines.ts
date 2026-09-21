import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const PatientMedicines: CollectionConfig = {
  slug: 'patient-medicines', labels: { singular: 'Patient Medicine', plural: 'Patient Medicines' },
  admin: { group: 'Patient Management', useAsTitle: 'medicineName', defaultColumns: ['medicineName', 'patient', 'sourceType', 'startDate', 'status'] },
  access: { read: authenticated, create: authenticated, update: authenticated, delete: authenticated }, defaultSort: '-startDate',
  fields: [
    { name: 'patient', type: 'relationship', relationTo: 'patients', required: true, index: true }, { name: 'consultation', type: 'relationship', relationTo: 'consultation-records' },
    { name: 'medicineName', type: 'text', required: true, maxLength: 140 },
    { name: 'sourceType', label: 'Type / source', type: 'select', defaultValue: 'clinic-recommendation', options: [{ label: 'Clinic recommendation', value: 'clinic-recommendation' }, { label: 'Prescribed by another clinician', value: 'external-prescription' }, { label: 'Supplement', value: 'supplement' }, { label: 'Medical kit', value: 'medical-kit' }] },
    { name: 'strengthOrForm', type: 'text', maxLength: 120 }, { name: 'instructions', type: 'textarea', maxLength: 1200 }, { name: 'frequency', type: 'text', maxLength: 120 },
    { name: 'startDate', type: 'date', index: true }, { name: 'endDate', type: 'date' }, { name: 'status', type: 'select', defaultValue: 'active', index: true, options: ['active', 'completed', 'stopped'] },
    { name: 'fulfilment', type: 'select', options: ['pending', 'dispensed', 'collected', 'delivered'] }, { name: 'safetyNotes', type: 'textarea', maxLength: 1200 },
  ],
}
