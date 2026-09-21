import type { Media } from '@/payload-types'
import { getMedia, getMediaURL } from '@/lib/media'

type Props = {
  media: number | Media | null | undefined
  className?: string
  fallbackLabel?: string
  priority?: boolean
}

export function MediaImage({ media, className = '', fallbackLabel = 'Image to be added', priority = false }: Props) {
  const asset = getMedia(media)
  const src = getMediaURL(media)

  if (!src) {
    return <div className={`image-placeholder ${className}`} aria-label={fallbackLabel}><span>{fallbackLabel}</span></div>
  }

  return <img src={src} alt={asset?.alt || fallbackLabel} className={className} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} />
}
