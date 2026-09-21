'use client'

import { FormEvent, useState } from 'react'
import { savePatientInquiry } from '@/lib/savePatientInquiry'

type Props = { kitTitle: string; price: number; currency: string; whatsappNumber: string }

export function KitBuyForm({ kitTitle, price, currency, whatsappNumber }: Props) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true); setError('')
    const data = new FormData(event.currentTarget)
    const message = ['Hello, I would like to ask about buying a medical kit.', '', `Kit: ${kitTitle}`, `Listed price: ${currency} ${price.toLocaleString('en-PK')}`, `Name: ${data.get('name')}`, `Location: ${data.get('location')}`, `Patient WhatsApp: ${data.get('whatsappNumber')}`, `Quantity: ${data.get('quantity')}`, '', 'Please confirm suitability, availability, final price and delivery options.'].join('\n')
    try {
      await savePatientInquiry({ fullName: String(data.get('name')), whatsappNumber: String(data.get('whatsappNumber')), location: String(data.get('location')), inquiryType: 'medical-kit', source: 'website-medical-kit', message, consentToContact: data.get('consent') === 'on', productName: kitTitle, quantity: Number(data.get('quantity')) })
      window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to save your request.') } finally { setSubmitting(false) }
  }
  return <div className="kit-buy-wrap"><button className="button kit-buy-button" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>{open ? 'Close order form' : 'Buy now'}</button>{open ? <form className="appointment-form kit-buy-form" onSubmit={submit}><label>Your name<input name="name" required maxLength={80} autoComplete="name" placeholder="Enter your full name" /></label><label>Your WhatsApp number<input name="whatsappNumber" type="tel" required maxLength={30} autoComplete="tel" placeholder="e.g. +92 322 4853915" /></label><label>Your location<input name="location" required maxLength={100} autoComplete="address-level2" placeholder="City, country" /></label><label>Quantity<input name="quantity" type="number" min={1} max={10} defaultValue={1} required /></label><label className="consent-field"><input name="consent" type="checkbox" required />I agree that Care and Cure may save these details and contact me about this request.</label>{error ? <p className="form-error" role="alert">{error}</p> : null}<button className="button appointment-submit" type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Continue on WhatsApp'}</button><small>The clinic will confirm suitability, availability, price and delivery before an order is finalized.</small></form> : null}</div>
}
