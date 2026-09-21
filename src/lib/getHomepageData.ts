import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@payload-config'

export const getHomepageData = cache(async () => {
  const payload = await getPayload({ config })

  const [site, contact, social, timings, whatsapp, homepage, seo, slides, videos, testimonials, posts, medicalKits] =
    await Promise.all([
      payload.findGlobal({ slug: 'site-settings' }),
      payload.findGlobal({ slug: 'contact-information' }),
      payload.findGlobal({ slug: 'social-media' }),
      payload.findGlobal({ slug: 'clinic-timings' }),
      payload.findGlobal({ slug: 'whatsapp-settings' }),
      payload.findGlobal({ slug: 'homepage-settings', depth: 1 }),
      payload.findGlobal({ slug: 'seo-defaults', depth: 1 }),
      payload.find({ collection: 'hero-slides', where: { active: { equals: true } }, sort: 'order', limit: 10, depth: 1 }),
      payload.find({ collection: 'videos', where: { featured: { equals: true } }, sort: '-publishedAt', limit: 3, depth: 1 }),
      payload.find({ collection: 'testimonials', where: { featured: { equals: true } }, sort: '-createdAt', limit: 6 }),
      payload.find({ collection: 'blog-posts', where: { _status: { equals: 'published' } }, sort: '-publishedAt', limit: 3, depth: 1 }),
      payload.find({ collection: 'medical-kits', where: { and: [{ active: { equals: true } }, { _status: { equals: 'published' } }] }, sort: 'order', limit: 6, depth: 0 }),
    ])

  return {
    site,
    contact,
    social,
    timings,
    whatsapp,
    homepage,
    seo,
    slides: slides.docs,
    videos: videos.docs,
    testimonials: testimonials.docs,
    posts: posts.docs,
    medicalKits: medicalKits.docs,
  }
})
