import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@payload-config'

const attempts = new Map<string, { count: number; resetAt: number }>()
const allowedTypes = new Set(['video-consultation', 'physical-consultation', 'general-inquiry', 'medical-kit'])

export async function POST(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const key = forwarded || 'local'
  const now = Date.now()
  const current = attempts.get(key)
  if (current && current.resetAt > now && current.count >= 10) return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  attempts.set(key, current && current.resetAt > now ? { ...current, count: current.count + 1 } : { count: 1, resetAt: now + 15 * 60_000 })

  const body = await request.json().catch(() => null) as Record<string, unknown> | null
  if (!body || body.website) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  const fullName = String(body.fullName || '').trim()
  const whatsappNumber = String(body.whatsappNumber || '').replace(/\D/g, '')
  const location = String(body.location || '').trim()
  const inquiryType = String(body.inquiryType || '') as 'video-consultation' | 'physical-consultation' | 'general-inquiry' | 'medical-kit'
  const source = String(body.source || 'website').trim().slice(0, 80)
  const message = String(body.message || '').trim()
  const consentToContact = body.consentToContact === true
  if (fullName.length < 2 || fullName.length > 100 || location.length < 2 || location.length > 120 || whatsappNumber.length < 7 || whatsappNumber.length > 18 || !allowedTypes.has(inquiryType) || !message || !consentToContact) {
    return NextResponse.json({ error: 'Please provide valid patient details and consent.' }, { status: 400 })
  }

  const payload = await getPayload({ config })
  const existing = await payload.find({ collection: 'patients', where: { whatsappNumber: { equals: whatsappNumber } }, limit: 1, depth: 0, overrideAccess: true })
  const preferredConsultation = inquiryType === 'video-consultation' ? 'video' : inquiryType === 'physical-consultation' ? 'physical' : 'not-specified'
  const patient = existing.docs[0]
    ? await payload.update({ collection: 'patients', id: existing.docs[0].id, data: { fullName, location, source, consentToContact, lastInquiryAt: new Date().toISOString(), preferredConsultation }, overrideAccess: true })
    : await payload.create({ collection: 'patients', data: { fullName, whatsappNumber, location, status: 'prospective', source, consentToContact, lastInquiryAt: new Date().toISOString(), preferredConsultation }, overrideAccess: true })

  await payload.create({
    collection: 'patient-inquiries', overrideAccess: true,
    data: {
      patient: patient.id, inquiryType, source, message: message.slice(0, 2000), status: 'new',
      productName: body.productName ? String(body.productName).slice(0, 120) : undefined,
      quantity: body.quantity ? Math.max(1, Math.min(100, Number(body.quantity))) : undefined,
    },
  })
  return NextResponse.json({ success: true, patientId: patient.id })
}
