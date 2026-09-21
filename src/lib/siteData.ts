import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@payload-config'

export const getSiteData = cache(async () => {
  const payload = await getPayload({ config })
  const [site, contact, social, timings, whatsapp, seo, medicalKits] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings' }),
    payload.findGlobal({ slug: 'contact-information' }),
    payload.findGlobal({ slug: 'social-media' }),
    payload.findGlobal({ slug: 'clinic-timings' }),
    payload.findGlobal({ slug: 'whatsapp-settings' }),
    payload.findGlobal({ slug: 'seo-defaults', depth: 1 }),
    payload.find({ collection: 'medical-kits', where: { and: [{ active: { equals: true } }, { _status: { equals: 'published' } }] }, sort: 'order', limit: 6, depth: 0 }),
  ])
  return { site, contact, social, timings, whatsapp, seo, medicalKits: medicalKits.docs }
})
