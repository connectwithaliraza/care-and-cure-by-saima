import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const ExpenseCategories: CollectionConfig = {
  slug: 'expense-categories',
  labels: { singular: 'Expense Category', plural: 'Expense Categories' },
  admin: {
    group: 'Expense Management',
    useAsTitle: 'name',
    defaultColumns: ['name', 'monthlyBudget', 'active', 'order'],
  },
  access: { read: authenticated, create: authenticated, update: authenticated, delete: authenticated },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true, unique: true, index: true, maxLength: 80 },
    { name: 'slug', type: 'text', required: true, unique: true, index: true, maxLength: 80 },
    { name: 'description', type: 'textarea', maxLength: 300 },
    { name: 'monthlyBudget', label: 'Monthly budget (optional)', type: 'number', min: 0 },
    { name: 'active', type: 'checkbox', required: true, defaultValue: true, index: true },
    { name: 'order', type: 'number', required: true, defaultValue: 0, index: true },
  ],
}
