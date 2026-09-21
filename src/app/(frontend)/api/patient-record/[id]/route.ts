import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getPatientRecord } from '@/lib/getPatientRecord'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getPayload({ config }); const { user } = await payload.auth({ headers: request.headers })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  try { const record = await getPatientRecord(id); return new Response(JSON.stringify({ exportedAt: new Date().toISOString(), ...record }, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Disposition': `attachment; filename="patient-${record.patient.patientCode || id}.json"`, 'Cache-Control': 'no-store' } }) }
  catch { return NextResponse.json({ error: 'Patient not found.' }, { status: 404 }) }
}
