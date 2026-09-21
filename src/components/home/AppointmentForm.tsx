'use client'

import { FormEvent, useState } from 'react'
import { savePatientInquiry } from '@/lib/savePatientInquiry'

type Props = {
  appointmentType: 'Video Consultation' | 'Physical Clinic Visit'
  buttonLabel: string
  whatsappNumber: string
  introMessage?: string | null
  variant?: 'primary' | 'outline'
}

export function AppointmentForm({ appointmentType, buttonLabel, whatsappNumber, introMessage, variant = 'primary' }: Props) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') || '').trim()
    const location = String(form.get('location') || '').trim()
    const patientWhatsapp = String(form.get('whatsappNumber') || '').trim()
    const number = whatsappNumber.replace(/\D/g, '')
    const message = [
      introMessage || 'Hello, I would like to book an appointment at Care and Cure.',
      '',
      `Appointment type: ${appointmentType}`,
      `Name: ${name}`,
      `Location: ${location}`,
      `Patient WhatsApp: ${patientWhatsapp}`,
    ].join('\n')
    try {
      await savePatientInquiry({ fullName: name, whatsappNumber: patientWhatsapp, location, inquiryType: appointmentType === 'Video Consultation' ? 'video-consultation' : 'physical-consultation', source: 'website-appointment', message, consentToContact: form.get('consent') === 'on' })
      window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to save your request.') } finally { setSubmitting(false) }
  }

  return (
    <div className="appointment-form-wrap">
      <button className={variant === 'outline' ? 'button button-outline' : 'button'} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        {open ? 'Close booking form' : buttonLabel}
      </button>
      {open ? (
        <form className="appointment-form" onSubmit={submit}>
          <p className="appointment-form-title">Book: {appointmentType}</p>
          <label>Your name<input name="name" type="text" autoComplete="name" maxLength={80} required placeholder="Enter your full name" /></label>
          <label>Your WhatsApp number<input name="whatsappNumber" type="tel" autoComplete="tel" maxLength={30} required placeholder="e.g. +92 322 4853915" /></label>
          <label>Your location<input name="location" type="text" autoComplete="address-level2" maxLength={100} required placeholder="City, country" /></label>
          <label className="consent-field"><input name="consent" type="checkbox" required />I agree that Care and Cure may save these details and contact me about this request.</label>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <button className="button appointment-submit" type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Continue on WhatsApp'}</button>
          <small>WhatsApp will open with your appointment details. You can review the message before sending it.</small>
        </form>
      ) : null}
    </div>
  )
}
