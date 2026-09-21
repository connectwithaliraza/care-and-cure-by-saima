import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig } from 'payload'

import { Users } from '@/collections/Users'
import { BlogCategories } from '@/collections/BlogCategories'
import { BlogPosts } from '@/collections/BlogPosts'
import { FAQs } from '@/collections/FAQs'
import { Gallery } from '@/collections/Gallery'
import { HeroSlides } from '@/collections/HeroSlides'
import { Media } from '@/collections/Media'
import { Testimonials } from '@/collections/Testimonials'
import { Treatments } from '@/collections/Treatments'
import { Videos } from '@/collections/Videos'
import { Pages } from '@/collections/Pages'
import { SupportTopics } from '@/collections/SupportTopics'
import { MedicalKits } from '@/collections/MedicalKits'
import { ExpenseCategories } from '@/collections/ExpenseCategories'
import { Expenses } from '@/collections/Expenses'
import { Patients } from '@/collections/Patients'
import { PatientInquiries } from '@/collections/PatientInquiries'
import { PatientAppointments } from '@/collections/PatientAppointments'
import { ConsultationRecords } from '@/collections/ConsultationRecords'
import { TreatmentPlans } from '@/collections/TreatmentPlans'
import { PatientMedicines } from '@/collections/PatientMedicines'
import { PatientPayments } from '@/collections/PatientPayments'
import { ClinicTimings } from '@/globals/ClinicTimings'
import { ContactInformation } from '@/globals/ContactInformation'
import { HomepageSettings } from '@/globals/HomepageSettings'
import { SEODefaults } from '@/globals/SEODefaults'
import { SiteSettings } from '@/globals/SiteSettings'
import { SocialMedia } from '@/globals/SocialMedia'
import { WhatsAppSettings } from '@/globals/WhatsAppSettings'
import { AboutDoctor } from '@/globals/AboutDoctor'

const databaseURL = process.env.DATABASE_URL
const payloadSecret = process.env.PAYLOAD_SECRET

if (!databaseURL) throw new Error('DATABASE_URL is required')
if (!payloadSecret) throw new Error('PAYLOAD_SECRET is required')

export default buildConfig({
  admin: {
    user: Users.slug,
    suppressHydrationWarning: true,
    meta: {
      titleSuffix: '– Care and Cure',
    },
  },
  collections: [
    Users,
    Media,
    HeroSlides,
    Treatments,
    Testimonials,
    Videos,
    BlogCategories,
    BlogPosts,
    Gallery,
    FAQs,
    SupportTopics,
    Pages,
    MedicalKits,
    ExpenseCategories,
    Expenses,
    Patients,
    PatientInquiries,
    PatientAppointments,
    ConsultationRecords,
    TreatmentPlans,
    PatientMedicines,
    PatientPayments,
  ],
  globals: [
    SiteSettings,
    ContactInformation,
    SocialMedia,
    ClinicTimings,
    WhatsAppSettings,
    HomepageSettings,
    SEODefaults,
    AboutDoctor,
  ],
  db: postgresAdapter({
    pool: { connectionString: databaseURL },
  }),
  secret: payloadSecret,
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  typescript: {
    outputFile: `${process.cwd()}/src/payload-types.ts`,
  },
})
