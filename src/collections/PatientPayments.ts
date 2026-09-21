import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const PatientPayments: CollectionConfig = {
  slug: 'patient-payments', labels: { singular: 'Patient Payment', plural: 'Patient Payments' },
  admin: { group: 'Patient Management', useAsTitle: 'invoiceNumber', defaultColumns: ['paymentDate', 'patient', 'invoiceNumber', 'totalAmount', 'paidAmount', 'status'] },
  access: { read: authenticated, create: authenticated, update: authenticated, delete: authenticated }, defaultSort: '-paymentDate',
  fields: [
    { name: 'patient', type: 'relationship', relationTo: 'patients', required: true, index: true }, { name: 'appointment', type: 'relationship', relationTo: 'patient-appointments' },
    { name: 'invoiceNumber', type: 'text', maxLength: 80, index: true }, { name: 'description', type: 'text', maxLength: 200 },
    { name: 'totalAmount', type: 'number', required: true, min: 0 }, { name: 'paidAmount', type: 'number', required: true, min: 0, defaultValue: 0 }, { name: 'currency', type: 'select', required: true, defaultValue: 'PKR', options: ['PKR'], admin: { readOnly: true } },
    { name: 'status', type: 'select', required: true, defaultValue: 'unpaid', index: true, options: ['unpaid', 'partial', 'paid', 'refunded'] },
    { name: 'paymentMethod', type: 'select', options: ['cash', 'bank-transfer', 'card', 'easypaisa', 'jazzcash', 'other'] }, { name: 'paymentDate', type: 'date', index: true },
    { name: 'receipt', type: 'upload', relationTo: 'media' }, { name: 'notes', type: 'textarea', maxLength: 1000 },
  ],
}
