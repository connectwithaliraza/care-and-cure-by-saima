import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { MediaImage } from '@/components/home/MediaImage'
import { KitBuyForm } from '@/components/kits/KitBuyForm'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { PageShell } from '@/components/site/PageShell'
import { createMetadata } from '@/lib/seo'
import { getMediaURL } from '@/lib/media'
import { getSiteData } from '@/lib/siteData'

type Props = { params: Promise<{ slug: string }> }
async function getKit(slug: string) { const payload = await getPayload({ config }); const result = await payload.find({ collection: 'medical-kits', where: { and: [{ slug: { equals: slug } }, { active: { equals: true } }, { _status: { equals: 'published' } }] }, limit: 1, depth: 1 }); return result.docs[0] }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const [kit, data] = await Promise.all([getKit(slug), getSiteData()]); if (!kit) return {}; return createMetadata(kit.seo, { title: `${kit.title} | ${data.site.siteName}`, description: kit.description.slice(0, 160), path: `/medical-kits/${slug}`, domain: data.site.domain }) }

export default async function MedicalKitPage({ params }: Props) {
  const { slug } = await params; const [kit, data] = await Promise.all([getKit(slug), getSiteData()]); if (!kit) notFound()
  const url = `https://${data.site.domain}/medical-kits/${slug}`; const image = getMediaURL(kit.image)
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Product', name: kit.title, description: kit.description, image: image || undefined, url, offers: { '@type': 'Offer', price: kit.price, priceCurrency: kit.currency, availability: 'https://schema.org/InStock', url } }
  return <PageShell {...data}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} /><article className="content-page"><div className="container"><Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Medical Kits', href: '/medical-kits' }, { label: kit.title }]} /></div><header className="container kit-detail-hero"><MediaImage media={kit.image} className="kit-detail-image" fallbackLabel="Medical kit image" /><div className="kit-detail-summary"><p className="eyebrow">Medical kit</p><h1>{kit.title}</h1><p>{kit.description}</p><div className="kit-price"><span>Price</span><strong>{kit.currency} {kit.price.toLocaleString('en-PK')}</strong></div><KitBuyForm kitTitle={kit.title} price={kit.price} currency={kit.currency} whatsappNumber={data.whatsapp.number} /></div></header><div className="container kit-benefits"><div><h2>Potential benefits</h2><ul>{kit.benefits.map((item) => <li key={item.id || item.benefit}>{item.benefit}</li>)}</ul></div><aside className="medical-note"><strong>Safety information</strong><p>{kit.safetyNotice}</p><p>Contact a qualified clinician for diagnosis and treatment. Never delay emergency care or stop prescribed medicine because of a kit.</p></aside></div></article></PageShell>
}
