import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { PageShell } from '@/components/site/PageShell'
import { createMetadata } from '@/lib/seo'
import { getSiteData } from '@/lib/siteData'

type Props = { params: Promise<{ slug: string }> }
async function getPage(slug: string) { const payload = await getPayload({ config }); const result = await payload.find({ collection: 'pages', where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] }, limit: 1, depth: 1 }); return result.docs[0] }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const [page, data] = await Promise.all([getPage(slug), getSiteData()]); if (!page) return {}; return createMetadata(page.seo, { title: `${page.title} | ${data.site.siteName}`, description: page.summary, path: `/${slug}`, domain: data.site.domain }) }

export default async function ContentPage({ params }: Props) {
  const { slug } = await params; const [page, data] = await Promise.all([getPage(slug), getSiteData()]); if (!page) notFound()
  return <PageShell {...data}><article className="content-page"><div className="container"><Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: page.title }]} /></div><header className="container simple-content-hero"><p className="eyebrow">{page.pageType === 'legal' ? 'Important information' : 'Care and Cure'}</p><h1>{page.title}</h1><p>{page.summary}</p></header><div className="container content-layout"><div className="prose">{page.content.split(/\n\n+/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{page.highlights?.length ? <><h2>Key information</h2><ul>{page.highlights.map((item) => <li key={item.id || item.highlight}>{item.highlight}</li>)}</ul></> : null}</div>{page.showAppointmentCTA ? <aside className="page-cta"><h2>Book a consultation</h2><p>Choose an online consultation or visit the clinic in Lahore.</p><a className="button" href="/#appointments">View appointment options</a></aside> : null}</div></article></PageShell>
}
