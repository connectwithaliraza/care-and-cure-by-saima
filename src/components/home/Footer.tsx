import type { ClinicTiming, ContactInformation, SiteSetting, SocialMedia } from '@/payload-types'

type Props = { site: SiteSetting; contact: ContactInformation; social: SocialMedia; timings: ClinicTiming }

export function Footer({ site, contact, social, timings }: Props) {
  const links = [
    ['Facebook', social.facebookURL], ['Instagram', social.instagramURL], ['YouTube', social.youtubeURL], ['TikTok', social.tiktokURL],
  ].filter((item): item is [string, string] => Boolean(item[1]))

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div><p className="footer-title">{site.siteName}</p><p>{site.doctorName}</p><p className="muted">{site.clinicType}</p></div>
        <div><h3>Contact</h3><a href={`tel:${contact.phone}`}>{contact.phone}</a>{contact.email ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : null}<p>{contact.address}</p></div>
        <div><h3>Clinic hours</h3>{timings.schedule?.map((row) => <p key={row.id || row.days}><span>{row.days}</span> {row.closed ? 'Closed' : row.hours}</p>)}<p className="muted">{timings.appointmentNote}</p></div>
        <div><h3>Follow</h3>{links.length ? links.map(([label, url]) => <a href={url} target="_blank" rel="noreferrer" key={label}>{label}</a>) : <p className="muted">Social links coming soon</p>}</div>
      </div>
      <div className="container footer-legal"><a href="/privacy-policy">Privacy</a><a href="/terms">Terms</a><a href="/medical-disclaimer">Medical disclaimer</a></div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} {site.siteName}</span><span>Information on this website does not replace medical advice.</span></div>
    </footer>
  )
}
