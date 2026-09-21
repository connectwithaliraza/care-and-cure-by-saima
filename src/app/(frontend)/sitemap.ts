import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  const site = await payload.findGlobal({ slug: 'site-settings' })
  const base = `https://${site.domain}`
  const [topics, pages, posts, kits] = await Promise.all([
    payload.find({ collection: 'support-topics', where: { _status: { equals: 'published' } }, limit: 100, pagination: false }),
    payload.find({ collection: 'pages', where: { and: [{ _status: { equals: 'published' } }, { 'seo.noIndex': { not_equals: true } }] }, limit: 100, pagination: false }),
    payload.find({ collection: 'blog-posts', where: { and: [{ _status: { equals: 'published' } }, { 'seo.noIndex': { not_equals: true } }] }, limit: 100, pagination: false }),
    payload.find({ collection: 'medical-kits', where: { and: [{ _status: { equals: 'published' } }, { active: { equals: true } }, { 'seo.noIndex': { not_equals: true } }] }, limit: 100, pagination: false }),
  ])
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: .9 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: .8 },
    ...topics.docs.filter((item) => !item.seo?.noIndex).map((item) => ({ url: `${base}/support/${item.slug}`, lastModified: item.updatedAt, changeFrequency: 'monthly' as const, priority: .8 })),
    ...pages.docs.map((item) => ({ url: `${base}/${item.slug}`, lastModified: item.updatedAt, changeFrequency: 'monthly' as const, priority: item.pageType === 'consultation' ? .9 : .5 })),
    ...posts.docs.map((item) => ({ url: `${base}/blog/${item.slug}`, lastModified: item.updatedAt, changeFrequency: 'monthly' as const, priority: .7 })),
    { url: `${base}/medical-kits`, lastModified: new Date(), changeFrequency: 'weekly', priority: .8 },
    ...kits.docs.map((item) => ({ url: `${base}/medical-kits/${item.slug}`, lastModified: item.updatedAt, changeFrequency: 'weekly' as const, priority: .8 })),
  ]
}
