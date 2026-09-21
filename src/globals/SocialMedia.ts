import type { GlobalConfig } from 'payload'

import { publicGlobalAccess } from '@/access/publicReadAuthenticatedWrite'

export const SocialMedia: GlobalConfig = {
  slug: 'social-media',
  label: 'Social Media',
  admin: { group: 'Settings' },
  access: publicGlobalAccess,
  fields: [
    { name: 'facebookURL', label: 'Facebook URL', type: 'text' },
    { name: 'instagramURL', label: 'Instagram URL', type: 'text' },
    { name: 'youtubeURL', label: 'YouTube URL', type: 'text' },
    { name: 'tiktokURL', label: 'TikTok URL', type: 'text' },
  ],
}
