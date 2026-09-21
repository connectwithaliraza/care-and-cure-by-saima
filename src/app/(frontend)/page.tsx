import type { Metadata } from 'next'

import { Footer } from '@/components/home/Footer'
import { ConsultationOptions } from '@/components/home/ConsultationOptions'
import { Header } from '@/components/home/Header'
import { HeroSlider } from '@/components/home/HeroSlider'
import { MediaImage } from '@/components/home/MediaImage'
import { SectionHeading } from '@/components/home/SectionHeading'
import { WhatsAppButton } from '@/components/home/WhatsAppButton'
import { GeneralInquiryForm } from '@/components/home/GeneralInquiryForm'
import { getHomepageData } from '@/lib/getHomepageData'
import { getAbsoluteMediaURL } from '@/lib/media'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { seo, site } = await getHomepageData()
  const origin = `https://${site.domain}`
  const shareImage = getAbsoluteMediaURL(seo.shareImage, origin)
  return {
    title: { absolute: seo.metaTitle },
    description: seo.metaDescription,
    metadataBase: new URL(origin),
    alternates: { canonical: origin },
    openGraph: { title: seo.metaTitle, description: seo.metaDescription, url: origin, type: 'website', images: shareImage ? [{ url: shareImage }] : undefined },
    twitter: { card: 'summary_large_image', title: seo.metaTitle, description: seo.metaDescription, images: shareImage ? [shareImage] : undefined },
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
  }
}

function EmptyCards({ message }: { message: string }) {
  return <div className="empty-state cards-empty">{message}</div>
}

export default async function HomePage() {
  const data = await getHomepageData()
  const { homepage, whatsapp } = data
  const clinicJsonLd = {
    '@context': 'https://schema.org', '@type': 'MedicalClinic', name: data.site.siteName,
    url: `https://${data.site.domain}`, telephone: data.contact.phone, email: data.contact.email,
    address: { '@type': 'PostalAddress', streetAddress: '679 A F2, Phase 1, Johar Town', addressLocality: 'Lahore', addressCountry: 'PK' },
    founder: { '@type': 'Person', name: data.site.doctorName },
    medicalSpecialty: 'Complementary and Alternative Medicine',
  }

  return (
    <main id="top">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicJsonLd).replace(/</g, '\\u003c') }} />
      <Header site={data.site} contact={data.contact} medicalKits={data.medicalKits} />
      <HeroSlider slides={data.slides} />

      <section className="section" id="about">
        <div className="container about-grid">
          <MediaImage media={homepage.about?.image} className="about-image" fallbackLabel="Doctor portrait to be added" />
          <div className="about-copy">
            <p className="eyebrow">About the doctor</p>
            <h2>{homepage.about?.heading}</h2>
            <p>{homepage.about?.text}</p>
            {homepage.about?.qualifications ? <div className="qualification">{homepage.about.qualifications}</div> : null}
            <div className="about-actions">
              {homepage.about?.ctaLabel && homepage.about.ctaLink ? <a className="button" href={homepage.about.ctaLink}>{homepage.about.ctaLabel}</a> : null}
              {homepage.about?.secondaryCTALabel && homepage.about.secondaryCTALink ? <a className="button button-outline" href={homepage.about.secondaryCTALink}>{homepage.about.secondaryCTALabel}</a> : null}
            </div>
          </div>
        </div>
      </section>

      <ConsultationOptions
        settings={homepage.consultationOptions}
        whatsappNumber={whatsapp.number}
        whatsappMessage={whatsapp.prefilledMessage}
        address={data.contact.address}
      />

      <section className="section developmental-section" id="treatments">
        <div className="container developmental-card">
          <div className="developmental-content">
            <p className="eyebrow">Family-centred support</p><h2>{homepage.developmentalSupport?.heading}</h2><p>{homepage.developmentalSupport?.text}</p>
            {homepage.developmentalSupport?.concerns?.length ? (
              <div className="developmental-concerns" aria-label="Concerns families may discuss">
                {homepage.developmentalSupport.concerns.map((item) => item.url ? <a href={item.url} key={item.id || item.concern}>{item.concern}<b aria-hidden="true">→</b></a> : <span key={item.id || item.concern}>{item.concern}</span>)}
              </div>
            ) : null}
          </div>
          {homepage.developmentalSupport?.ctaLabel && homepage.developmentalSupport.ctaLink ? <a className="button button-light" href={homepage.developmentalSupport.ctaLink}>{homepage.developmentalSupport.ctaLabel}</a> : null}
        </div>
      </section>

      <section className="section" id="videos">
        <div className="container">
          <SectionHeading eyebrow="Watch and learn" title={homepage.videosHeading} align="center" />
          <div className="card-grid three-grid">
            {data.videos.length ? data.videos.map((video) => (
              <a className="card media-card" href={video.url} target="_blank" rel="noreferrer" key={video.id}>
                <MediaImage media={video.thumbnail} className="card-image" fallbackLabel={`${video.platform} video`} />
                <div className="card-body"><span className="tag">{video.platform}</span><h3>{video.title}</h3>{video.description ? <p>{video.description}</p> : null}<span className="text-link">Watch video →</span></div>
              </a>
            )) : <EmptyCards message="YouTube and Instagram videos can be added from the CMS." />}
          </div>
        </div>
      </section>

      <section className="section section-tint" id="testimonials">
        <div className="container">
          <SectionHeading eyebrow="Kind words" title={homepage.testimonialsHeading} align="center" />
          <div className="card-grid three-grid">
            {data.testimonials.length ? data.testimonials.map((item) => (
              <blockquote className="card quote-card" key={item.id}>
                <div className="stars" aria-label={`${item.rating || 5} out of 5 stars`}>{'★'.repeat(item.rating || 5)}</div>
                <p>“{item.testimonial}”</p><footer><strong>{item.patientName}</strong>{item.location ? <span>{item.location}</span> : null}</footer>
              </blockquote>
            )) : <EmptyCards message="Approved patient experiences can be added from the CMS." />}
          </div>
        </div>
      </section>

      <section className="section" id="blog">
        <div className="container">
          <SectionHeading eyebrow="Health information" title={homepage.blogHeading} align="center" />
          <div className="card-grid three-grid">
            {data.posts.length ? data.posts.map((post) => (
              <a className="card blog-card" href={`/blog/${post.slug}`} key={post.id} aria-label={`Read ${post.title}`}>
                <MediaImage media={post.featuredImage} className="card-image" fallbackLabel="Article image" />
                <div className="card-body">{post.publishedAt ? <time>{new Intl.DateTimeFormat('en-PK', { dateStyle: 'medium' }).format(new Date(post.publishedAt))}</time> : null}<h3>{post.title}</h3><p>{post.excerpt}</p><span className="text-link">Read article →</span></div>
              </a>
            )) : <EmptyCards message="Published articles will appear here." />}
          </div>
        </div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="container contact-card">
          <div><p className="eyebrow">Contact the clinic</p><h2>{homepage.contactCTA?.heading}</h2><p>{homepage.contactCTA?.text}</p><p className="contact-address">{data.contact.address}</p></div>
          <div className="contact-actions"><GeneralInquiryForm clinicWhatsApp={whatsapp.number} buttonLabel={whatsapp.buttonLabel} introMessage={whatsapp.prefilledMessage} /><a className="button button-outline" href={`tel:${data.contact.phone}`}>Call {data.contact.phone}</a></div>
        </div>
      </section>

      <Footer site={data.site} contact={data.contact} social={data.social} timings={data.timings} />
      <WhatsAppButton settings={whatsapp} />
    </main>
  )
}
