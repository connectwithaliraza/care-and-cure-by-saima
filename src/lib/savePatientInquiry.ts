export type InquiryType = 'video-consultation' | 'physical-consultation' | 'general-inquiry' | 'medical-kit'

export async function savePatientInquiry(data: {
  fullName: string
  whatsappNumber: string
  location: string
  inquiryType: InquiryType
  source: string
  message: string
  consentToContact: boolean
  productName?: string
  quantity?: number
}) {
  const response = await fetch('/api/website-inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, website: '' }) })
  if (!response.ok) { const result = await response.json().catch(() => null); throw new Error(result?.error || 'Unable to save your request.') }
}
