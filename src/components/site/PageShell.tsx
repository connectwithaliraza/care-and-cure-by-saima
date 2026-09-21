import type { ReactNode } from 'react'
import { Footer } from '@/components/home/Footer'
import { Header } from '@/components/home/Header'
import { WhatsAppButton } from '@/components/home/WhatsAppButton'
import type { ClinicTiming, ContactInformation, MedicalKit, SiteSetting, SocialMedia, WhatsappSetting } from '@/payload-types'

type Props = { children: ReactNode; site: SiteSetting; contact: ContactInformation; social: SocialMedia; timings: ClinicTiming; whatsapp: WhatsappSetting; medicalKits?: MedicalKit[] }

export function PageShell({ children, site, contact, social, timings, whatsapp, medicalKits }: Props) {
  return <main id="top"><Header site={site} contact={contact} medicalKits={medicalKits} />{children}<Footer site={site} contact={contact} social={social} timings={timings} /><WhatsAppButton settings={whatsapp} /></main>
}
