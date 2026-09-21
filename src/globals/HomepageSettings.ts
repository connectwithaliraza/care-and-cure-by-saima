import type { GlobalConfig } from 'payload'

import { publicGlobalAccess } from '@/access/publicReadAuthenticatedWrite'

const sectionHeading = (name: string, label: string, defaultValue: string) => ({
  name,
  label,
  type: 'text' as const,
  required: true,
  defaultValue,
})

const consultationOption = (name: string, label: string, defaults: { title: string; description: string; ctaLabel: string }) => ({
  name,
  label,
  type: 'group' as const,
  fields: [
    { name: 'title', type: 'text' as const, required: true, defaultValue: defaults.title, maxLength: 70 },
    { name: 'description', type: 'textarea' as const, required: true, defaultValue: defaults.description, maxLength: 260 },
    {
      name: 'benefits',
      dbName: name === 'videoConsultation' ? 'video_benefits' : 'clinic_benefits',
      type: 'array' as const,
      required: true,
      minRows: 2,
      maxRows: 6,
      fields: [{ name: 'benefit', type: 'text' as const, required: true, maxLength: 150 }],
    },
    { name: 'ctaLabel', label: 'CTA label', type: 'text' as const, required: true, defaultValue: defaults.ctaLabel, maxLength: 50 },
  ],
})

export const HomepageSettings: GlobalConfig = {
  slug: 'homepage-settings',
  label: 'Homepage Settings',
  admin: { group: 'Homepage' },
  access: publicGlobalAccess,
  fields: [
    {
      name: 'about',
      type: 'group',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        sectionHeading('heading', 'Heading', 'Meet Dr. Saima Absar'),
        {
          name: 'text',
          type: 'textarea',
          required: true,
          defaultValue: 'A thoughtful, patient-centred approach focused on listening carefully and supporting each person’s overall wellbeing.',
        },
        { name: 'qualifications', type: 'text', defaultValue: 'Qualifications and professional memberships to be added' },
        { name: 'ctaLabel', label: 'CTA label', type: 'text', defaultValue: 'Book a consultation' },
        { name: 'ctaLink', label: 'CTA link', type: 'text', defaultValue: '#contact' },
        { name: 'secondaryCTALabel', label: 'Second CTA label', type: 'text', defaultValue: 'Book appointment' },
        { name: 'secondaryCTALink', label: 'Second CTA link', type: 'text', defaultValue: '#appointments' },
      ],
    },
    {
      name: 'consultationOptions',
      label: 'Appointment Options',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Appointments', maxLength: 40 },
        sectionHeading('heading', 'Heading', 'Choose how you would like to consult'),
        {
          name: 'intro',
          type: 'textarea',
          defaultValue: 'Choose a convenient video consultation or visit Care and Cure in Lahore.',
          maxLength: 240,
        },
        consultationOption('videoConsultation', 'Video Consultation', {
          title: 'Video Consultation',
          description: 'Speak with Dr. Saima Absar from home through WhatsApp video or Google Meet.',
          ctaLabel: 'Book a video consultation',
        }),
        consultationOption('clinicVisit', 'Physical Clinic Visit', {
          title: 'Physical Clinic Visit',
          description: 'Meet Dr. Saima Absar at Care and Cure in Johar Town, Lahore.',
          ctaLabel: 'Book a clinic visit',
        }),
      ],
    },
    {
      name: 'developmentalSupport',
      type: 'group',
      fields: [
        sectionHeading('heading', 'Heading', 'Support for developmental and behavioral concerns'),
        {
          name: 'text',
          type: 'textarea',
          required: true,
          defaultValue: 'We offer supportive, individualised consultations for families navigating developmental and behavioral concerns. Homeopathy is not a cure for autism and should not replace evidence-based care or guidance from qualified medical and developmental professionals.',
        },
        {
          name: 'concerns',
          dbName: 'development_concerns',
          label: 'Concerns families may discuss',
          type: 'array',
          minRows: 1,
          maxRows: 15,
          fields: [
            { name: 'concern', type: 'text', required: true, maxLength: 100 },
            { name: 'url', label: 'Topic page URL', type: 'text' },
          ],
        },
        { name: 'ctaLabel', label: 'CTA label', type: 'text', defaultValue: 'Discuss your concerns' },
        { name: 'ctaLink', label: 'CTA link', type: 'text', defaultValue: '#contact' },
      ],
    },
    sectionHeading('videosHeading', 'Videos heading', 'Helpful Videos'),
    sectionHeading('testimonialsHeading', 'Testimonials heading', 'Patient Experiences'),
    sectionHeading('blogHeading', 'Blog heading', 'Latest Health Articles'),
    {
      name: 'contactCTA',
      label: 'Contact CTA',
      type: 'group',
      fields: [
        sectionHeading('heading', 'Heading', 'Ready to talk about your health concerns?'),
        { name: 'text', type: 'textarea', defaultValue: 'Contact the clinic to ask a question or arrange a consultation.' },
      ],
    },
  ],
}
