import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { MediaImage } from '@/components/home/MediaImage'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { PageShell } from '@/components/site/PageShell'
import { getSiteData } from '@/lib/siteData'

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getSiteData(); const url = `https://${site.domain}/medical-kits`
  return { title: { absolute: `Medical Kits | ${site.siteName}` }, description: 'Browse Care and Cure medical kits and contact the clinic to confirm suitability, availability and delivery.', alternates: { canonical: url }, openGraph: { title: `Medical Kits | ${site.siteName}`, description: 'Browse available Care and Cure medical kits.', url } }
}

export default async function MedicalKitsPage() {
  const payload = await getPayload({ config }); const data = await getSiteData()
  const result = await payload.find({ collection: 'medical-kits', where: { and: [{ active: { equals: true } }, { _status: { equals: 'published' } }] }, sort: 'order', limit: 100, depth: 1 })
  return <PageShell {...data}><article className="content-page kit-listing"><div className="container"><Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Medical Kits' }]} /></div><header className="container simple-content-hero"><p className="eyebrow">Care and Cure</p><h1>Medical Kits</h1><p>Browse prepared kits and contact the clinic to confirm suitability, current availability, final price and delivery for your location.</p></header><div className="container kit-grid">{result.docs.map((kit) => <article className="card kit-card" key={kit.id}><a href={`/medical-kits/${kit.slug}`}><MediaImage media={kit.image} className="kit-card-image" fallbackLabel="Medical kit image" /><div className="card-body"><h2>{kit.title}</h2><p>{kit.description}</p><div className="kit-card-footer"><strong>{kit.currency} {kit.price.toLocaleString('en-PK')}</strong><span className="text-link">View kit →</span></div></div></a></article>)}</div><div className="container"><aside className="medical-note"><strong>Important</strong><p>These kits are not emergency treatment and do not replace diagnosis, prescribed medicine or care from a qualified clinician. Suitability should be confirmed before purchase.</p></aside></div></article></PageShell>
}
