import type { CollectionConfig, GlobalConfig } from 'payload'

import { authenticated } from './authenticated'

export const publicReadAuthenticatedWrite: NonNullable<CollectionConfig['access']> = {
  read: () => true,
  create: authenticated,
  update: authenticated,
  delete: authenticated,
}

export const publicGlobalAccess: NonNullable<GlobalConfig['access']> = {
  read: () => true,
  update: authenticated,
}
