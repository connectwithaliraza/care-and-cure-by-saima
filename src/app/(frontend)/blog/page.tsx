import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { MediaImage } from '@/components/home/MediaImage'
import { PageShell } from '@/components/site/PageShell'
import { getSiteData } from '@/lib/siteData'

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getSiteData()
  const url = `https://${site.domain}/blog`
  return {
    title: 'Health Information',
    description: 'Read health and wellbeing information from Care and Cure by Dr. Saima Absar.',
    alternates: { canonical: url },
    openGraph: {
      title: `Health Information | ${site.siteName}`,
      description: 'Read health and wellbeing information from Care and Cure.',
      url,
      type: 'website',
    },
  }
}

export default async function BlogPage() {
  const payload = await getPayload({ config })
  const [data, posts] = await Promise.all([
    getSiteData(),
    payload.find({ collection: 'blog-posts', where: { _status: { equals: 'published' } }, sort: '-publishedAt', limit: 24, depth: 1 }),
  ])

  return <PageShell {...data}>
    <article className="content-page">
      <div className="container"><Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} /></div>
      <header className="container simple-content-hero">
        <p className="eyebrow">Care and Cure</p>
        <h1>Health information</h1>
        <p>General educational articles about health, wellbeing, and common concerns discussed at the clinic.</p>
      </header>
      <div className="container card-grid three-grid">
        {posts.docs.map((post) => <article className="card blog-card" key={post.id}>
          <a href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
            <MediaImage media={post.featuredImage} className="card-image" fallbackLabel={post.title} />
            <div className="card-body">
              {post.publishedAt ? <time dateTime={post.publishedAt}>{new Intl.DateTimeFormat('en-PK', { dateStyle: 'medium' }).format(new Date(post.publishedAt))}</time> : null}
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <span className="text-link">Read article →</span>
            </div>
          </a>
        </article>)}
      </div>
    </article>
  </PageShell>
}
