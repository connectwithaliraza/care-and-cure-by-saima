import type { Metadata } from 'next'
import type { Media } from '@/payload-types'
import { getAbsoluteMediaURL } from './media'

type SEO = { title?: string | null; description?: string | null; canonicalURL?: string | null; shareImage?: number | Media | null; noIndex?: boolean | null }

export function createMetadata(seo: SEO | null | undefined, fallback: { title: string; description: string; path: string; domain: string }): Metadata {
  const title = seo?.title || fallback.title
  const description = seo?.description || fallback.description
  const origin = `https://${fallback.domain}`
  const canonical = seo?.canonicalURL || `${origin}${fallback.path}`
  const image = getAbsoluteMediaURL(seo?.shareImage, origin)
  return {
    metadataBase: new URL(origin),
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots: seo?.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: { title, description, url: canonical, type: 'website', images: image ? [{ url: image }] : undefined },
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : undefined },
  }
}
