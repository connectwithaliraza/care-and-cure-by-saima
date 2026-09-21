import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const Expenses: CollectionConfig = {
  slug: 'expenses',
  labels: { singular: 'Expense', plural: 'Expenses' },
  admin: {
    group: 'Expense Management',
    useAsTitle: 'title',
    defaultColumns: ['expenseDate', 'title', 'category', 'amount', 'currency', 'status', 'paymentMethod'],
    listSearchableFields: ['title', 'vendor', 'referenceNumber', 'notes'],
    description: 'Record and organize clinic operating expenses. Use filters to review expenses by date, category, status, or payment method.',
    components: { views: { list: { Component: '@/components/admin/ExpenseReport#ExpenseReport' } } },
  },
  access: { read: authenticated, create: authenticated, update: authenticated, delete: authenticated },
  defaultSort: '-expenseDate',
  fields: [
    { name: 'title', label: 'Expense title (optional)', type: 'text', index: true, maxLength: 120 },
    {
      name: 'category', type: 'relationship', relationTo: 'expense-categories', required: true, index: true,
      filterOptions: { active: { equals: true } },
    },
    { name: 'expenseDate', label: 'Expense date', type: 'date', required: true, index: true, admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd MMM yyyy' } } },
    { name: 'amount', type: 'number', required: true, min: 0.01, index: true },
    { name: 'currency', type: 'select', required: true, defaultValue: 'PKR', options: ['PKR'], admin: { readOnly: true } },
    {
      name: 'status', type: 'select', required: true, defaultValue: 'paid', index: true,
      options: [
        { label: 'Paid', value: 'paid' },
        { label: 'Pending', value: 'pending' },
        { label: 'Reimbursed', value: 'reimbursed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'paymentMethod', label: 'Payment method', type: 'select', required: true, defaultValue: 'cash', index: true,
      options: [
        { label: 'Cash', value: 'cash' },
        { label: 'Bank transfer', value: 'bank-transfer' },
        { label: 'Debit / credit card', value: 'card' },
        { label: 'EasyPaisa', value: 'easypaisa' },
        { label: 'JazzCash', value: 'jazzcash' },
        { label: 'Cheque', value: 'cheque' },
        { label: 'Other', value: 'other' },
      ],
    },
    { name: 'vendor', label: 'Vendor / paid to', type: 'text', maxLength: 120, index: true },
    { name: 'referenceNumber', label: 'Invoice / reference number', type: 'text', maxLength: 100, index: true },
    { name: 'receipt', label: 'Receipt or invoice', type: 'upload', relationTo: 'media' },
    { name: 'recurring', type: 'checkbox', required: true, defaultValue: false },
    {
      name: 'recurrence', label: 'Recurring frequency', type: 'select',
      admin: { condition: (_, siblingData) => Boolean(siblingData?.recurring) },
      options: [
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Quarterly', value: 'quarterly' },
        { label: 'Yearly', value: 'yearly' },
      ],
    },
    { name: 'notes', type: 'textarea', maxLength: 1000 },
  ],
}
