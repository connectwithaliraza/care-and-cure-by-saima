import { getPayload } from 'payload'

import config from '@payload-config'

async function findMediaID(payload: Awaited<ReturnType<typeof getPayload>>, filename: string) {
  const result = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const media = result.docs[0]
  if (!media) throw new Error(`Required media file is missing: ${filename}`)
  return media.id
}

async function seedHeroSlides() {
  const payload = await getPayload({ config })
  const [consultationImage, clinicImage, familyImage] = await Promise.all([
    findMediaID(payload, 'hero-consultation.png'),
    findMediaID(payload, 'hero-clinic-interior.png'),
    findMediaID(payload, 'hero-family-support.png'),
  ])

  const slides = [
    {
      eyebrow: 'Developmental support for families',
      heading: 'Support for autism-related developmental concerns',
      description: 'Discuss communication, behaviour, sleep and daily routines through complementary support that does not replace evidence-based autism care.',
      image: familyImage,
      ctaLabel: 'Discuss your concerns',
      ctaLink: '#appointments',
      order: 1,
      active: true,
    },
    {
      eyebrow: 'Attention and behaviour',
      heading: 'Support for ADHD-related concerns and daily routines',
      description: 'An individual consultation focused on wellbeing, routines and family concerns alongside appropriate pediatric and behavioral care.',
      image: consultationImage,
      ctaLabel: 'Book a consultation',
      ctaLink: '#appointments',
      order: 2,
      active: true,
    },
    {
      eyebrow: 'Children’s wellbeing',
      heading: 'Child health, growth and nutrition conversations',
      description: 'Discuss appetite, daily wellbeing, height and weight concerns while continuing regular growth monitoring with a qualified pediatrician.',
      image: clinicImage,
      ctaLabel: 'Arrange a consultation',
      ctaLink: '#appointments',
      order: 3,
      active: true,
    },
    {
      eyebrow: 'Women’s health and wellbeing',
      heading: 'Complementary support for PCOS-related concerns',
      description: 'A careful consultation for menstrual and wellbeing concerns alongside assessment and ongoing care from a qualified gynecologist.',
      image: consultationImage,
      ctaLabel: 'Book a consultation',
      ctaLink: '#appointments',
      order: 4,
      active: true,
    },
    {
      eyebrow: 'Fertility wellbeing',
      heading: 'Supportive consultations for fertility concerns',
      description: 'Discuss general wellbeing during your fertility journey without replacing evaluation or treatment from a qualified fertility specialist.',
      image: clinicImage,
      ctaLabel: 'Talk to the clinic',
      ctaLink: '#appointments',
      order: 5,
      active: true,
    },
  ]

  for (const slide of slides) {
    const existing = await payload.find({
      collection: 'hero-slides',
      where: { order: { equals: slide.order } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    if (existing.docs[0]) {
      await payload.update({ collection: 'hero-slides', id: existing.docs[0].id, data: slide, overrideAccess: true })
    } else {
      await payload.create({ collection: 'hero-slides', data: slide, overrideAccess: true })
    }
  }

  payload.logger.info('Five homepage hero slides updated successfully.')
}

seedHeroSlides()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
