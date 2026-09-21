import type { Metadata } from 'next'
import { getPayload } from 'payload'

import config from '@payload-config'
import { ConsultationOptions } from '@/components/home/ConsultationOptions'
import { MediaImage } from '@/components/home/MediaImage'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { PageShell } from '@/components/site/PageShell'
import { createMetadata } from '@/lib/seo'
import { getSiteData } from '@/lib/siteData'

async function getAboutData() {
  const payload = await getPayload({ config })
  const [about, homepage] = await Promise.all([
    payload.findGlobal({ slug: 'about-doctor', depth: 1 }),
    payload.findGlobal({ slug: 'homepage-settings', depth: 1 }),
  ])
  return { about, homepage }
}

export async function generateMetadata(): Promise<Metadata> {
  const [{ about }, data] = await Promise.all([getAboutData(), getSiteData()])
  return createMetadata(about.seo, { title: `${about.pageTitle} | ${data.site.siteName}`, description: about.intro, path: '/about', domain: data.site.domain })
}

export default async function AboutPage() {
  const [{ about, homepage }, data] = await Promise.all([getAboutData(), getSiteData()])
  const mapQuery = about.mapQuery || data.contact.address
  const mapURL = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Person', name: about.doctorName,
    description: about.intro, image: typeof about.image === 'object' ? about.image?.url : undefined,
    worksFor: { '@type': 'MedicalClinic', name: data.site.siteName, url: `https://${data.site.domain}` },
    url: `https://${data.site.domain}/about`,
  }

  return <PageShell {...data}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    <article className="content-page about-page">
      <div className="container"><Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About Dr. Saima' }]} /></div>
      <header className="container about-page-hero">
        <MediaImage media={about.image} className="about-page-image" fallbackLabel="Dr. Saima Absar portrait" />
        <div><p className="eyebrow">About the doctor</p><h1>{about.pageTitle}</h1><p className="about-page-intro">{about.intro}</p><div className="about-focus-tags">{about.areasOfFocus?.map((item) => <span key={item.id || item.area}>{item.area}</span>)}</div><a className="button" href="#book-appointment">Book an appointment</a></div>
      </header>

      <section className="container about-story">
        <div className="prose"><p className="eyebrow">Meet {about.doctorName}</p>{about.biography.split(/\n\n+/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        <aside className="qualification-card"><p className="eyebrow">Qualifications</p><h2>Professional information</h2><p>{about.qualifications}</p><small>Only verified qualifications and memberships should be published here.</small></aside>
      </section>

      <section className="container clinic-map-section">
        <div><p className="eyebrow">Clinic location</p><h2>{about.mapHeading}</h2><p>{data.contact.address}</p><p><a href={`tel:${data.contact.phone}`}>{data.contact.phone}</a>{data.contact.email ? <> · <a href={`mailto:${data.contact.email}`}>{data.contact.email}</a></> : null}</p><a className="button button-outline" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`} target="_blank" rel="noreferrer">Open in Google Maps</a></div>
        <iframe className="clinic-map" src={mapURL} title={`Map showing ${data.site.siteName}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </section>
    </article>

    <div id="book-appointment">
      <ConsultationOptions settings={homepage.consultationOptions} whatsappNumber={data.whatsapp.number} whatsappMessage={data.whatsapp.prefilledMessage} address={data.contact.address} />
    </div>
  </PageShell>
}
