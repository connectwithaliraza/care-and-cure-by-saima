import type { Media } from '@/payload-types'

export function getMedia(value: number | Media | null | undefined): Media | null {
  return value && typeof value === 'object' ? value : null
}

export function getMediaURL(value: number | Media | null | undefined): string | null {
  const media = getMedia(value)
  if (!media?.url) return null
  if (media.url.startsWith('http')) return media.url

  const origin = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  return new URL(media.url, origin).toString()
}

export function getAbsoluteMediaURL(value: number | Media | null | undefined, origin: string): string | null {
  const media = getMedia(value)
  if (!media?.url) return null
  return new URL(media.url, origin).toString()
}
