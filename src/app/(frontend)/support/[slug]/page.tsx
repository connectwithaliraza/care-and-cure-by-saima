import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { PageShell } from '@/components/site/PageShell'
import { MediaImage } from '@/components/home/MediaImage'
import { createMetadata } from '@/lib/seo'
import { getSiteData } from '@/lib/siteData'

type Props = { params: Promise<{ slug: string }> }

async function getTopic(slug: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({ collection: 'support-topics', where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] }, limit: 1, depth: 1 })
  return result.docs[0]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [topic, data] = await Promise.all([getTopic(slug), getSiteData()])
  if (!topic) return {}
  return createMetadata(topic.seo, { title: `${topic.title} | ${data.site.siteName}`, description: topic.summary, path: `/support/${slug}`, domain: data.site.domain })
}

export default async function SupportTopicPage({ params }: Props) {
  const { slug } = await params
  const [topic, data] = await Promise.all([getTopic(slug), getSiteData()])
  if (!topic) notFound()
  const url = `https://${data.site.domain}/support/${slug}`
  const jsonLd = { '@context': 'https://schema.org', '@type': 'MedicalWebPage', name: topic.title, description: topic.summary, url, about: { '@type': 'Thing', name: topic.title }, reviewedBy: { '@type': 'Person', name: data.site.doctorName } }
  return <PageShell {...data}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    <article className="content-page">
      <div className="container"><Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Support', href: '/#treatments' }, { label: topic.title }]} /></div>
      <header className="container content-hero"><div><p className="eyebrow">{topic.eyebrow}</p><h1>{topic.title}</h1><p>{topic.summary}</p></div><MediaImage media={topic.featuredImage} className="content-hero-image" fallbackLabel="Support topic image" /></header>
      <div className="container content-layout"><div className="prose"><h2>Understanding this concern</h2><p>{topic.overview}</p><h2>What may be discussed</h2><ul>{topic.discussionPoints?.map((item) => <li key={item.id || item.point}>{item.point}</li>)}</ul><aside className="medical-note"><strong>Responsible care</strong><p>{topic.whenToSeekCare}</p><p>Complementary consultation does not replace assessment or treatment from qualified medical, developmental, speech, occupational, behavioural or educational professionals.</p></aside></div><aside className="page-cta"><h2>Discuss your concerns</h2><p>Choose a video consultation or a physical clinic visit in Lahore.</p><a className="button" href="/#appointments">Book an appointment</a></aside></div>
    </article>
  </PageShell>
}
