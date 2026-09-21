import { SectionHeading } from './SectionHeading'
import { AppointmentForm } from './AppointmentForm'

type Benefit = { benefit: string; id?: string | null }
type Option = {
  title?: string | null
  description?: string | null
  benefits?: Benefit[] | null
  ctaLabel?: string | null
}

type Props = {
  settings?: {
    eyebrow?: string | null
    heading?: string | null
    intro?: string | null
    videoConsultation?: Option | null
    clinicVisit?: Option | null
  } | null
  whatsappNumber: string
  whatsappMessage?: string | null
  address: string
}

function ConsultationCard({ option, kind, whatsappNumber, whatsappMessage, address }: { option?: Option | null; kind: 'video' | 'clinic'; whatsappNumber: string; whatsappMessage?: string | null; address?: string }) {
  if (!option) return null

  return (
    <article className={`consultation-card consultation-card-${kind}`}>
      <div className="consultation-card-top">
        <span className="consultation-icon" aria-hidden="true">{kind === 'video' ? '▶' : '+'}</span>
        <span className="consultation-label">{kind === 'video' ? 'Online appointment' : 'In-person appointment'}</span>
      </div>
      <h3>{option.title}</h3>
      <p>{option.description}</p>
      {kind === 'clinic' && address ? <p className="consultation-location">{address}</p> : null}
      <ul>
        {option.benefits?.map((item) => <li key={item.id || item.benefit}>{item.benefit}</li>)}
      </ul>
      {option.ctaLabel ? <AppointmentForm appointmentType={kind === 'video' ? 'Video Consultation' : 'Physical Clinic Visit'} buttonLabel={option.ctaLabel} whatsappNumber={whatsappNumber} introMessage={whatsappMessage} variant={kind === 'video' ? 'primary' : 'outline'} /> : null}
    </article>
  )
}

export function ConsultationOptions({ settings, whatsappNumber, whatsappMessage, address }: Props) {
  if (!settings) return null

  return (
    <section className="section consultation-section" id="appointments">
      <div className="container">
        <SectionHeading eyebrow={settings.eyebrow || 'Appointments'} title={settings.heading || ''} intro={settings.intro} align="center" />
        <div className="consultation-grid">
          <ConsultationCard option={settings.videoConsultation} kind="video" whatsappNumber={whatsappNumber} whatsappMessage={whatsappMessage} />
          <ConsultationCard option={settings.clinicVisit} kind="clinic" whatsappNumber={whatsappNumber} whatsappMessage={whatsappMessage} address={address} />
        </div>
      </div>
    </section>
  )
}
