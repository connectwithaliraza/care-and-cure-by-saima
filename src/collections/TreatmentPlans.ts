import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const TreatmentPlans: CollectionConfig = {
  slug: 'treatment-plans', labels: { singular: 'Treatment Plan', plural: 'Treatment Plans' },
  admin: { group: 'Patient Management', useAsTitle: 'title', defaultColumns: ['title', 'patient', 'startDate', 'status', 'reviewDate'] },
  access: { read: authenticated, create: authenticated, update: authenticated, delete: authenticated }, defaultSort: '-startDate',
  fields: [
    { name: 'patient', type: 'relationship', relationTo: 'patients', required: true, index: true }, { name: 'consultation', type: 'relationship', relationTo: 'consultation-records' },
    { name: 'title', type: 'text', required: true, maxLength: 140 }, { name: 'startDate', type: 'date', index: true },
    { name: 'status', type: 'select', defaultValue: 'active', index: true, options: ['active', 'completed', 'paused', 'discontinued'] },
    { name: 'objectives', type: 'textarea', maxLength: 2000 }, { name: 'instructions', type: 'textarea', maxLength: 3000 }, { name: 'reviewDate', type: 'date', index: true }, { name: 'outcomeNotes', type: 'textarea', maxLength: 2000 },
  ],
}
