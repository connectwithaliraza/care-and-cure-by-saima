'use client'

import { CSSProperties, FormEvent, useState } from 'react'
import { savePatientInquiry } from '@/lib/savePatientInquiry'

type Props = {
  clinicWhatsApp: string
  buttonLabel: string
  buttonLabelUrdu?: string | null
  buttonColor?: string | null
  buttonTextColor?: string | null
  introMessage?: string | null
  floating?: boolean
}

export function GeneralInquiryForm({ clinicWhatsApp, buttonLabel, buttonLabelUrdu, buttonColor, buttonTextColor, introMessage, floating = false }: Props) {
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
  const floatingStyle = floating ? {
    '--whatsapp-button-color': buttonColor || '#25D366',
    '--whatsapp-text-color': buttonTextColor || '#FFFFFF',
  } as CSSProperties : undefined

  return <div className={floating ? 'general-inquiry general-inquiry-floating' : 'general-inquiry'}>
    <button className={floating ? 'whatsapp-float' : 'button'} style={floatingStyle} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={buttonLabel}>
      {floating ? <>
        <span className="whatsapp-chat-icon" aria-hidden="true"><svg viewBox="0 0 24 24" role="img"><path d="M20 11.4a8 8 0 0 1-8.3 8L7 21l1.4-3.9A8 8 0 1 1 20 11.4Z"/><path d="M8 10h8M8 14h5"/></svg></span>
        <span className="whatsapp-button-labels"><span>{buttonLabel}</span>{buttonLabelUrdu ? <span lang="ur" dir="rtl">{buttonLabelUrdu}</span> : null}</span>
      </> : buttonLabel}
    </button>
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
