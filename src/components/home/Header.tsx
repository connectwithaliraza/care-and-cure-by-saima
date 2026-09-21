import type { ContactInformation, MedicalKit, SiteSetting } from '@/payload-types'

type Props = { site: SiteSetting; contact: ContactInformation; medicalKits?: MedicalKit[] }

export function Header({ site, contact, medicalKits = [] }: Props) {
  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <a href={`tel:${contact.phone}`}>{contact.phone}</a>
          {contact.email ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : null}
          <span>{contact.address}</span>
        </div>
      </div>
      <header className="site-header">
        <div className="container nav-wrap">
          <a href="/" className="brand" aria-label={`${site.siteName} home`}>
            <span className="brand-mark">C+</span>
            <span><strong>{site.siteName}</strong><small>{site.doctorName}</small></span>
          </a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="/about">About</a>
            <a href="/#treatments">Treatments</a>
            <div className="nav-dropdown">
              <a href="/medical-kits">Medical kits <span aria-hidden="true">⌄</span></a>
              <div className="nav-dropdown-menu">
                <a className="nav-dropdown-all" href="/medical-kits">View all medical kits</a>
                {medicalKits.map((kit) => <a href={`/medical-kits/${kit.slug}`} key={kit.id}>{kit.title}</a>)}
              </div>
            </div>
            <a href="/#videos">Videos</a>
            <a href="/blog">Blog</a>
            <a href="/#appointments" className="button button-small">Book appointment</a>
          </nav>
          <details className="mobile-nav">
            <summary aria-label="Open navigation">Menu</summary>
            <nav>
              <a href="/about">About</a><a href="/#treatments">Treatments</a><a href="/#videos">Videos</a>
              <a href="/medical-kits">Medical kits</a>{medicalKits.map((kit) => <a className="mobile-sub-link" href={`/medical-kits/${kit.slug}`} key={kit.id}>{kit.title}</a>)}
              <a href="/blog">Blog</a><a href="/#appointments">Book appointment</a><a href="/#contact">Contact</a>
            </nav>
          </details>
        </div>
      </header>
    </>
  )
}
