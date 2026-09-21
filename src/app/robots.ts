import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://careandcurebysaima.com'
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/patient-record'] },
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  }
}
