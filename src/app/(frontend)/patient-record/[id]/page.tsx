import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { PatientRecordActions } from '@/components/admin/PatientRecordActions'
import { getPatientRecord } from '@/lib/getPatientRecord'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Patient Record | Care and Cure', robots: { index: false, follow: false } }
const date = (value?: string | null, includeTime = false) => value ? new Intl.DateTimeFormat('en-PK', includeTime ? { dateStyle: 'medium', timeStyle: 'short' } : { dateStyle: 'medium' }).format(new Date(value)) : '—'
const text = (value?: string | null) => value || 'Not recorded'

export default async function PatientRecordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const payload = await getPayload({ config }); const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect(`/admin/login?redirect=${encodeURIComponent(`/patient-record/${id}`)}`)
  let data: Awaited<ReturnType<typeof getPatientRecord>>
  try { data = await getPatientRecord(id) } catch { notFound() }
  const { patient } = data
  const future = data.appointments.filter((item) => item.status !== 'cancelled' && item.status !== 'completed' && new Date(item.appointmentDate) >= new Date()).sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())[0]
  const balance = data.payments.reduce((sum, item) => sum + Math.max(0, item.totalAmount - item.paidAmount), 0)
  return <main className="patient-record-page">
    <header className="patient-record-top"><div><a href="/admin/collections/patients" className="patient-back">← Patient dashboard</a><p className="eyebrow">Patient record</p><h1>{patient.fullName}</h1><p>{patient.patientCode || 'Patient ID pending'}</p></div><PatientRecordActions patientID={patient.id} /></header>
    <section className="patient-summary-grid"><div><span>Status</span><strong>{patient.status}</strong></div><div><span>WhatsApp</span><strong>{patient.whatsappNumber}</strong></div><div><span>Location</span><strong>{patient.location}</strong></div><div><span>Next visit</span><strong>{future ? date(future.appointmentDate, true) : 'Not scheduled'}</strong></div><div><span>Outstanding balance</span><strong>PKR {balance.toLocaleString('en-PK')}</strong></div></section>
    <section className="patient-record-section"><h2>Personal details</h2><div className="patient-detail-grid"><p><span>Date of birth</span>{date(patient.dateOfBirth)}</p><p><span>Gender</span>{text(patient.gender)}</p><p><span>Address</span>{text(patient.address)}</p><p><span>Parent / guardian</span>{text(patient.guardianName)}</p><p><span>Relationship</span>{text(patient.guardianRelationship)}</p><p><span>Emergency contact</span>{text(patient.emergencyContact)}</p></div></section>
    <section className="patient-record-section"><h2>Medical history</h2><div className="patient-medical-grid"><article><h3>Reported allergies</h3><p>{text(patient.reportedAllergies)}</p></article><article><h3>Reported diagnoses and history</h3><p>{text(patient.reportedDiagnoses)}</p></article><article><h3>Current prescribed medicines</h3><p>{text(patient.currentPrescribedMedicines)}</p></article><article><h3>Internal notes</h3><p>{text(patient.internalNotes)}</p></article></div></section>
    <RecordTable title="Appointments" addHref={`/admin/collections/patient-appointments/create?patient=${patient.id}`} headings={['Date', 'Type', 'Status', 'Reason']} rows={data.appointments.map((item) => [date(item.appointmentDate, true), item.appointmentType, item.status, text(item.reason)])} />
    <RecordTable title="Consultations" addHref={`/admin/collections/consultation-records/create?patient=${patient.id}`} headings={['Date', 'Type', 'Main concerns', 'Follow-up']} rows={data.consultations.map((item) => [date(item.consultationDate, true), text(item.consultationType), text(item.mainConcerns), date(item.followUpDate, true)])} />
    <RecordTable title="Treatment plans" addHref={`/admin/collections/treatment-plans/create?patient=${patient.id}`} headings={['Plan', 'Start', 'Status', 'Review']} rows={data.plans.map((item) => [item.title, date(item.startDate), text(item.status), date(item.reviewDate)])} />
    <RecordTable title="Medicines and recommendations" addHref={`/admin/collections/patient-medicines/create?patient=${patient.id}`} headings={['Medicine / item', 'Type', 'Instructions', 'Status']} rows={data.medicines.map((item) => [item.medicineName, text(item.sourceType), text(item.instructions), text(item.status)])} />
    <RecordTable title="Payments" addHref={`/admin/collections/patient-payments/create?patient=${patient.id}`} headings={['Date', 'Description', 'Total', 'Paid', 'Status']} rows={data.payments.map((item) => [date(item.paymentDate), text(item.description), `PKR ${item.totalAmount.toLocaleString('en-PK')}`, `PKR ${item.paidAmount.toLocaleString('en-PK')}`, item.status])} />
    <RecordTable title="Inquiries" headings={['Date', 'Type', 'Status', 'Message']} rows={data.inquiries.map((item) => [date(item.createdAt, true), item.inquiryType, item.status, item.message])} />
  </main>
}

function RecordTable({ title, headings, rows, addHref }: { title: string; headings: string[]; rows: string[][]; addHref?: string }) {
  return <section className="patient-record-section"><div className="patient-section-heading"><h2>{title}</h2>{addHref ? <a href={addHref}>Add record</a> : null}</div><div className="patient-table-wrap"><table><thead><tr>{headings.map((heading) => <th key={heading}>{heading}</th>)}</tr></thead><tbody>{rows.length ? rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>) : <tr><td colSpan={headings.length}>No records added.</td></tr>}</tbody></table></div></section>
}
