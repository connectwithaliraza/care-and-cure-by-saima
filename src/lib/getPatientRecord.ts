import { getPayload } from 'payload'
import config from '@payload-config'

export async function getPatientRecord(id: string) {
  const payload = await getPayload({ config })
  const patient = await payload.findByID({ collection: 'patients', id, depth: 0, overrideAccess: true })
  const related = { patient: { equals: id } }
  const [appointments, consultations, plans, medicines, payments, inquiries] = await Promise.all([
    payload.find({ collection: 'patient-appointments', where: related, sort: '-appointmentDate', limit: 200, pagination: false, depth: 1, overrideAccess: true }),
    payload.find({ collection: 'consultation-records', where: related, sort: '-consultationDate', limit: 200, pagination: false, depth: 1, overrideAccess: true }),
    payload.find({ collection: 'treatment-plans', where: related, sort: '-startDate', limit: 200, pagination: false, depth: 1, overrideAccess: true }),
    payload.find({ collection: 'patient-medicines', where: related, sort: '-startDate', limit: 300, pagination: false, depth: 1, overrideAccess: true }),
    payload.find({ collection: 'patient-payments', where: related, sort: '-paymentDate', limit: 300, pagination: false, depth: 1, overrideAccess: true }),
    payload.find({ collection: 'patient-inquiries', where: related, sort: '-createdAt', limit: 300, pagination: false, depth: 0, overrideAccess: true }),
  ])
  return { patient, appointments: appointments.docs, consultations: consultations.docs, plans: plans.docs, medicines: medicines.docs, payments: payments.docs, inquiries: inquiries.docs }
}
