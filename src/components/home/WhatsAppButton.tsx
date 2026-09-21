import type { WhatsappSetting } from '@/payload-types'
import { GeneralInquiryForm } from './GeneralInquiryForm'

export function getWhatsAppURL(settings: WhatsappSetting) {
  const number = settings.number.replace(/\D/g, '')
  return `https://wa.me/${number}?text=${encodeURIComponent(settings.prefilledMessage || '')}`
}

export function WhatsAppButton({ settings }: { settings: WhatsappSetting }) {
  if (!settings.enabled) return null
  return <GeneralInquiryForm clinicWhatsApp={settings.number} buttonLabel={settings.buttonLabel} introMessage={settings.prefilledMessage} floating />
}
