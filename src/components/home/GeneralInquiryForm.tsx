'use client'

import { FormEvent, useState } from 'react'
import { savePatientInquiry } from '@/lib/savePatientInquiry'

type Props = { clinicWhatsApp: string; buttonLabel: string; introMessage?: string | null; floating?: boolean }

export function GeneralInquiryForm({ clinicWhatsApp, buttonLabel, introMessage, floating = false }: Props) {
  const [open, setOpen] = useState(false); const [submitting, setSubmitting] = useState(false); const [error, setError] = useState('')
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSubmitting(true); setError('')
    const data = new FormData(event.currentTarget)
    const message = [introMessage || 'Hello, I would like to contact Care and Cure.', '', `Name: ${data.get('name')}`, `Location: ${data.get('location')}`, `Patient WhatsApp: ${data.get('whatsappNumber')}`, `Message: ${data.get('message')}`].join('\n')
    try {
      await savePatientInquiry({ fullName: String(data.get('name')), whatsappNumber: String(data.get('whatsappNumber')), location: String(data.get('location')), inquiryType: 'general-inquiry', source: floating ? 'website-floating-whatsapp' : 'website-contact', message, consentToContact: data.get('consent') === 'on' })
      window.open(`https://wa.me/${clinicWhatsApp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
      setOpen(false)
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to save your request.') } finally { setSubmitting(false) }
  }
  return <div className={floating ? 'general-inquiry general-inquiry-floating' : 'general-inquiry'}>
    <button className={floating ? 'whatsapp-float' : 'button'} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={buttonLabel}>{floating ? 'WA' : buttonLabel}</button>
    {open ? <form className={floating ? 'appointment-form floating-inquiry-panel' : 'appointment-form contact-inquiry-form'} onSubmit={submit}>
      <p className="appointment-form-title">Contact Care and Cure</p>
      <label>Your name<input name="name" required maxLength={100} autoComplete="name" placeholder="Enter your full name" /></label>
      <label>Your WhatsApp number<input name="whatsappNumber" type="tel" required maxLength={30} autoComplete="tel" placeholder="e.g. +92 322 4853915" /></label>
      <label>Your location<input name="location" required maxLength={120} autoComplete="address-level2" placeholder="City, country" /></label>
      <label>Your message<textarea name="message" required maxLength={1000} rows={3} placeholder="How can the clinic help?" /></label>
      <label className="consent-field"><input name="consent" type="checkbox" required />I agree that Care and Cure may save these details and contact me about this request.</label>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <button className="button appointment-submit" type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Continue on WhatsApp'}</button>
      <small>Your details are saved as a prospective patient inquiry before WhatsApp opens.</small>
    </form> : null}
  </div>
}
