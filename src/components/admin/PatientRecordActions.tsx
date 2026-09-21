'use client'

export function PatientRecordActions({ patientID }: { patientID: string | number }) {
  return <div className="patient-record-actions"><button type="button" className="patient-action patient-action-print" onClick={() => window.print()}>Print / Save PDF</button><a className="patient-action patient-action-download" href={`/api/patient-record/${patientID}`} download>Download patient data</a></div>
}
