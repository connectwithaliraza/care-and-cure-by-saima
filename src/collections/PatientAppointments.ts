import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const PatientAppointments: CollectionConfig = {
  slug: 'patient-appointments', labels: { singular: 'Appointment', plural: 'Appointments' },
  admin: { group: 'Patient Management', useAsTitle: 'appointmentType', defaultColumns: ['appointmentDate', 'patient', 'appointmentType', 'status'] },
  access: { read: authenticated, create: authenticated, update: authenticated, delete: authenticated }, defaultSort: '-appointmentDate',
  fields: [
    { name: 'patient', type: 'relationship', relationTo: 'patients', required: true, index: true },
    { name: 'appointmentDate', type: 'date', required: true, index: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'appointmentType', type: 'select', required: true, defaultValue: 'physical', options: [{ label: 'Physical clinic visit', value: 'physical' }, { label: 'Video consultation', value: 'video' }] },
    { name: 'status', type: 'select', required: true, defaultValue: 'scheduled', index: true, options: ['requested', 'scheduled', 'completed', 'cancelled', 'no-show'] },
    { name: 'reason', type: 'textarea', maxLength: 800 }, { name: 'meetingDetails', type: 'text', maxLength: 300 }, { name: 'notes', type: 'textarea', maxLength: 1200 },
  ],
}
