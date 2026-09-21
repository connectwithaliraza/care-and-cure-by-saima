import type { CollectionConfig } from 'payload'

import { publicReadAuthenticatedWrite } from '@/access/publicReadAuthenticatedWrite'

export const BlogCategories: CollectionConfig = {
  slug: 'blog-categories',
  admin: { group: 'Blog', useAsTitle: 'name' },
  access: publicReadAuthenticatedWrite,
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'description', type: 'textarea' },
  ],
}
