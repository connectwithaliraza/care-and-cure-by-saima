import type { Field } from 'payload'

export const seoFields: Field = {
  name: 'seo',
  label: 'Search & Social',
  type: 'group',
  fields: [
    { name: 'title', type: 'text', maxLength: 60, admin: { description: 'Recommended: 50–60 characters.' } },
    { name: 'description', type: 'textarea', maxLength: 160, admin: { description: 'Recommended: 140–160 characters.' } },
    { name: 'canonicalURL', label: 'Canonical URL', type: 'text' },
    { name: 'shareImage', type: 'upload', relationTo: 'media' },
    { name: 'noIndex', label: 'Hide from search engines', type: 'checkbox', defaultValue: false },
  ],
}
