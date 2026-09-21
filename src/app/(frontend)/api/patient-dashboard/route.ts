import { NextResponse } from 'next/server'
import type { Where } from 'payload'
import { getPayload } from 'payload'

import config from '@payload-config'

export async function GET(request: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(request.url)
  const search = (url.searchParams.get('search') || '').trim().slice(0, 100)
  const status = url.searchParams.get('status') || ''
  const conditions: Where[] = []
  if (status && ['prospective', 'active', 'inactive', 'archived'].includes(status)) conditions.push({ status: { equals: status } })
  if (search) conditions.push({ or: [{ fullName: { contains: search } }, { whatsappNumber: { contains: search } }, { location: { contains: search } }] })
  const where: Where = conditions.length ? { and: conditions } : {}

  const [patients, allPatients, inquiries] = await Promise.all([
    payload.find({ collection: 'patients', where, sort: '-lastInquiryAt', limit: 500, pagination: false, depth: 0, overrideAccess: true }),
    payload.find({ collection: 'patients', limit: 1000, pagination: false, depth: 0, overrideAccess: true }),
    payload.find({ collection: 'patient-inquiries', sort: '-createdAt', limit: 2000, pagination: false, depth: 0, overrideAccess: true }),
  ])
  const inquiryCounts = new Map<string, number>()
  for (const inquiry of inquiries.docs) {
    const patientID = typeof inquiry.patient === 'object' ? inquiry.patient.id : inquiry.patient
    inquiryCounts.set(String(patientID), (inquiryCounts.get(String(patientID)) || 0) + 1)
  }
  const docs = patients.docs.map((patient) => ({ ...patient, inquiryCount: inquiryCounts.get(String(patient.id)) || 0 }))
  const stats = {
    total: allPatients.docs.length,
    prospective: allPatients.docs.filter((patient) => patient.status === 'prospective').length,
    active: allPatients.docs.filter((patient) => patient.status === 'active').length,
    inquiries: inquiries.docs.length,
  }
  return NextResponse.json({ patients: docs, stats }, { headers: { 'Cache-Control': 'no-store' } })
}
