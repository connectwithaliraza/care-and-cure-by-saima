import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { MediaImage } from '@/components/home/MediaImage'
import { PageShell } from '@/components/site/PageShell'
import { createMetadata } from '@/lib/seo'
import { getSiteData } from '@/lib/siteData'

type Props = { params: Promise<{ slug: string }> }
async function getPost(slug: string) { const payload = await getPayload({ config }); const result = await payload.find({ collection: 'blog-posts', where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] }, limit: 1, depth: 1 }); return result.docs[0] }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const [post, data] = await Promise.all([getPost(slug), getSiteData()]); if (!post) return {}; return createMetadata(post.seo, { title: `${post.title} | ${data.site.siteName}`, description: post.excerpt, path: `/blog/${slug}`, domain: data.site.domain }) }

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params; const [post, data] = await Promise.all([getPost(slug), getSiteData()]); if (!post) notFound()
  const url = `https://${data.site.domain}/blog/${slug}`
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.excerpt, datePublished: post.publishedAt, dateModified: post.updatedAt, url, author: { '@type': 'Person', name: data.site.doctorName }, publisher: { '@type': 'MedicalClinic', name: data.site.siteName } }
  return <PageShell {...data}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} /><article className="content-page"><div className="container"><Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/#blog' }, { label: post.title }]} /></div><header className="container simple-content-hero"><p className="eyebrow">Health information</p><h1>{post.title}</h1><p>{post.excerpt}</p>{post.publishedAt ? <time dateTime={post.publishedAt}>Published {new Intl.DateTimeFormat('en-PK', { dateStyle: 'long' }).format(new Date(post.publishedAt))}</time> : null}</header><div className="container article-width"><MediaImage media={post.featuredImage} className="article-image" fallbackLabel="Article image" /><div className="prose">{post.content.split(/\n\n+/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<aside className="medical-note"><strong>Medical information notice</strong><p>This general information does not replace diagnosis, treatment or advice from a qualified healthcare professional. Seek urgent care for emergencies.</p></aside></div></div></article></PageShell>
}
