import path from 'node:path'
import { randomBytes } from 'node:crypto'

import { getPayload } from 'payload'

import config from '@payload-config'

type SeedDocument = { id: number }
type SeedPayload = {
  find: (args: Record<string, unknown>) => Promise<{ docs: SeedDocument[] }>
  create: (args: Record<string, unknown>) => Promise<SeedDocument>
  update: (args: Record<string, unknown>) => Promise<SeedDocument>
}

const asset = (filename: string) => path.resolve(process.cwd(), 'public', 'demo-assets', filename)
const seoDescription = (value: string) => value.length <= 160 ? value : `${value.slice(0, 157).replace(/\s+\S*$/, '')}…`

async function upsert(
  db: SeedPayload,
  collection: string,
  matchField: string,
  matchValue: string,
  data: Record<string, unknown>,
) {
  const existing = await db.find({
    collection,
    where: { [matchField]: { equals: matchValue } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  if (existing.docs[0]) {
    return db.update({ collection, id: existing.docs[0].id, data, overrideAccess: true })
  }

  return db.create({ collection, data, overrideAccess: true })
}

async function upsertMedia(db: SeedPayload, filename: string, alt: string) {
  const existing = await db.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  if (existing.docs[0]) {
    return db.update({ collection: 'media', id: existing.docs[0].id, data: { alt }, overrideAccess: true })
  }

  return db.create({ collection: 'media', data: { alt }, filePath: asset(filename), overrideAccess: true })
}

async function seed() {
  const payload = await getPayload({ config })
  const db = payload as unknown as SeedPayload

  payload.logger.info('Seeding Care and Cure demo content…')

  const [heroConsultation, heroClinic, heroFamily, doctor, treatmentImage, videoImage, galleryImage] =
    await Promise.all([
      upsertMedia(db, 'hero-consultation.png', 'A healthcare practitioner listening to a patient in a bright clinic'),
      upsertMedia(db, 'hero-clinic-interior.png', 'A calm and welcoming modern clinic interior'),
      upsertMedia(db, 'hero-family-support.png', 'A family discussing developmental support with a practitioner'),
      upsertMedia(db, 'doctor-placeholder.png', 'Generic placeholder portrait for the doctor profile'),
      upsertMedia(db, 'treatment-consultation.png', 'A practitioner taking notes during a consultation'),
      upsertMedia(db, 'video-thumbnail.png', 'A practitioner presenting general health information'),
      upsertMedia(db, 'gallery-consultation.png', 'A supportive one-to-one clinic consultation'),
    ])

  await Promise.all([
    payload.updateGlobal({
      slug: 'site-settings',
      data: {
        siteName: 'Care and Cure',
        doctorName: 'Dr. Saima Absar',
        clinicType: 'Homeopathic Clinic',
        tagline: 'Compassionate care. Thoughtful support.',
        domain: 'careandcurebysaima.com',
      },
    }),
    payload.updateGlobal({
      slug: 'contact-information',
      data: {
        phone: '+92 322 4853915',
        email: 'hello@careandcurebysaima.com',
        address: '679 A F2, Phase 1, Johar Town, Lahore, Pakistan',
      },
    }),
    payload.updateGlobal({
      slug: 'social-media',
      data: {
        facebookURL: 'https://www.facebook.com/',
        instagramURL: 'https://www.instagram.com/',
        youtubeURL: 'https://www.youtube.com/',
      },
    }),
    payload.updateGlobal({
      slug: 'clinic-timings',
      data: {
        schedule: [
          { days: 'Monday – Saturday', hours: '10:00 AM – 7:00 PM', closed: false },
          { days: 'Sunday', hours: 'Closed', closed: true },
        ],
        appointmentNote: 'Appointments are recommended. Please call or message before visiting.',
      },
    }),
    payload.updateGlobal({
      slug: 'whatsapp-settings',
      data: {
        enabled: true,
        number: '+92 322 4853915',
        buttonLabel: 'Chat on WhatsApp',
        prefilledMessage: 'Hello, I would like to book an appointment at Care and Cure.',
      },
    }),
    payload.updateGlobal({
      slug: 'seo-defaults',
      data: {
        metaTitle: 'Care and Cure | Dr. Saima Absar',
        metaDescription: 'Care and Cure is a homeopathic clinic led by Dr. Saima Absar in Johar Town, Lahore.',
        shareImage: heroConsultation.id,
        noIndex: false,
      },
    }),
    payload.updateGlobal({
      slug: 'about-doctor',
      data: {
        pageTitle: 'About Dr. Saima Absar',
        doctorName: 'Dr. Saima Absar',
        image: doctor.id,
        intro: 'Dr. Saima Absar welcomes patients and families to Care and Cure for attentive, individualised homeopathic consultations in Lahore and online.',
        biography: 'Dr. Saima Absar’s consultation approach begins with careful listening. She takes time to understand the concerns, routines, previous care and wellbeing goals that each patient or family wishes to discuss.\n\nAt Care and Cure, complementary support is presented responsibly. Patients are encouraged to continue appropriate medical treatment and to work with qualified medical, developmental, speech, occupational, behavioural and educational professionals where relevant.\n\nVideo consultations are available through WhatsApp or Google Meet, while physical consultations take place at the Care and Cure clinic in Johar Town, Lahore.',
        qualifications: 'Qualifications and professional memberships must be verified and added before production launch.',
        areasOfFocus: [
          { area: 'Individual homeopathic consultations' },
          { area: 'Family wellbeing conversations' },
          { area: 'Developmental and behavioral concerns' },
          { area: 'Sleep and daily routines' },
          { area: 'Online video consultations' },
          { area: 'In-person consultations in Lahore' },
        ],
        keywords: 'Dr. Saima Absar, Care and Cure, homeopathic clinic Lahore, online consultation, Johar Town',
        mapHeading: 'Visit Care and Cure in Johar Town',
        mapQuery: '679 A F2, Phase 1, Johar Town, Lahore, Pakistan',
        seo: {
          title: 'About Dr. Saima Absar | Care and Cure',
          description: 'Learn about Dr. Saima Absar, her patient-centred consultation approach, areas of focus and Care and Cure clinic in Johar Town, Lahore.',
          canonicalURL: 'https://careandcurebysaima.com/about',
          shareImage: doctor.id,
          noIndex: false,
        },
      },
    }),
    payload.updateGlobal({
      slug: 'homepage-settings',
      data: {
        about: {
          image: doctor.id,
          heading: 'Meet Dr. Saima Absar',
          text: 'Dr. Saima Absar offers attentive, patient-centred consultations that consider each person’s concerns, routines and overall wellbeing. Every consultation begins with careful listening and clear, responsible guidance.',
          qualifications: 'Qualifications and professional memberships to be verified and added.',
          ctaLabel: 'Read more about Dr. Saima',
          ctaLink: '/about',
          secondaryCTALabel: 'Book appointment',
          secondaryCTALink: '#appointments',
        },
        consultationOptions: {
          eyebrow: 'Appointments',
          heading: 'Choose how you would like to consult',
          intro: 'Connect from wherever you are or meet Dr. Saima Absar at the Care and Cure clinic in Lahore.',
          videoConsultation: {
            title: 'Video Consultation',
            description: 'Speak with Dr. Saima Absar from home through WhatsApp video call or Google Meet.',
            benefits: [
              { benefit: 'Available for patients in Pakistan and internationally' },
              { benefit: 'No travel or clinic visit is required' },
              { benefit: 'Connect through WhatsApp video call or Google Meet' },
              { benefit: 'Where service is available, recommended products can be arranged for delivery after consultation' },
            ],
            ctaLabel: 'Book a video consultation',
          },
          clinicVisit: {
            title: 'Physical Clinic Visit',
            description: 'Meet Dr. Saima Absar at Care and Cure in Johar Town, Lahore.',
            benefits: [
              { benefit: 'A face-to-face consultation in a calm, private clinic' },
              { benefit: 'Direct discussion and review of your previous reports' },
              { benefit: 'Convenient for patients in Lahore and nearby areas' },
              { benefit: 'Collection or local delivery can be discussed where available' },
            ],
            ctaLabel: 'Book a clinic visit',
          },
        },
        developmentalSupport: {
          heading: 'Support for developmental and behavioral concerns',
          text: 'We offer supportive, individualised consultations for families navigating developmental and behavioral concerns. Homeopathy is not a cure for autism and should not replace evidence-based care or guidance from qualified medical and developmental professionals.',
          concerns: [
            { concern: 'Speech and language development', url: '/support/speech-and-language-development' },
            { concern: 'Eye contact and shared attention', url: '/support/eye-contact-and-shared-attention' },
            { concern: 'Difficulty understanding commands or instructions', url: '/support/understanding-commands-and-instructions' },
            { concern: 'Hyperactivity and restlessness', url: '/support/hyperactivity-and-restlessness' },
            { concern: 'Frequent jumping or repetitive movement', url: '/support/jumping-and-repetitive-movement' },
            { concern: 'Aggressive or hitting behaviours', url: '/support/aggressive-or-hitting-behaviours' },
            { concern: 'Social interaction', url: '/support/social-interaction-concerns' },
            { concern: 'Urination routines', url: '/support/urination-routines' },
            { concern: 'Bowel and stool routines', url: '/support/bowel-and-stool-routines' },
            { concern: 'Disturbed sleep', url: '/support/disturbed-sleep' },
          ],
          ctaLabel: 'Discuss your concerns',
          ctaLink: '#appointments',
        },
        videosHeading: 'Helpful Videos',
        testimonialsHeading: 'Patient Experiences',
        blogHeading: 'Latest Health Articles',
        contactCTA: {
          heading: 'Ready to talk about your health concerns?',
          text: 'Contact Care and Cure to ask a question or arrange a consultation with Dr. Saima Absar.',
        },
      },
    }),
  ])

  const slides = [
    {
      eyebrow: 'Care and Cure, Lahore',
      heading: 'Thoughtful care begins with listening',
      description: 'Book an individual consultation with Dr. Saima Absar in a calm, welcoming clinic environment.',
      image: heroConsultation.id,
      ctaLabel: 'Book a consultation',
      ctaLink: '#contact',
      order: 1,
      active: true,
    },
    {
      eyebrow: 'A welcoming clinic',
      heading: 'Personalised support for your wellbeing',
      description: 'Discuss your concerns, daily routines and health goals through a careful, patient-centred consultation.',
      image: heroClinic.id,
      ctaLabel: 'Explore areas of support',
      ctaLink: '#treatments',
      order: 2,
      active: true,
    },
    {
      eyebrow: 'Support for families',
      heading: 'Responsible guidance for developmental concerns',
      description: 'Supportive consultations designed to complement—not replace—evidence-based medical and developmental care.',
      image: heroFamily.id,
      ctaLabel: 'Talk to the clinic',
      ctaLink: '#contact',
      order: 3,
      active: true,
    },
  ]
  for (const slide of slides) await upsert(db, 'hero-slides', 'heading', slide.heading, slide)

  const treatments = [
    ['Digestive Wellbeing', 'Discuss recurring digestive discomfort, appetite changes and everyday habits during a personalised consultation.', 'DW'],
    ['Women’s Wellbeing', 'A private space to discuss menstrual, hormonal and general wellbeing concerns with attentive guidance.', 'WW'],
    ['Skin Concerns', 'Supportive consultations for recurring skin concerns alongside appropriate conventional medical assessment.', 'SC'],
    ['Stress and Sleep', 'Explore routines, stressors and sleep concerns as part of a broader wellbeing conversation.', 'SS'],
    ['Children’s Wellbeing', 'Family-centred consultations for common childhood health and wellbeing concerns.', 'CW'],
    ['Respiratory Concerns', 'Discuss seasonal and recurring respiratory concerns while continuing any necessary medical care.', 'RC'],
  ]
  for (const [index, item] of treatments.entries()) {
    await upsert(db, 'treatments', 'title', item[0], {
      title: item[0], summary: item[1], iconLabel: item[2], image: treatmentImage.id, order: index + 1, active: true,
    })
  }

  const testimonials = [
    ['Ayesha K.', 'The consultation felt calm and unhurried. I appreciated that my concerns were heard carefully and the guidance was explained clearly.', 5, 'Lahore'],
    ['Sana R.', 'The clinic environment was welcoming and the appointment process was simple. I felt comfortable asking questions.', 5, 'Johar Town'],
    ['Mariam H.', 'Dr. Saima took time to understand our family’s concerns and encouraged us to continue working with the relevant specialists.', 5, 'Lahore'],
  ]
  for (const item of testimonials) {
    await upsert(db, 'testimonials', 'patientName', item[0] as string, {
      patientName: item[0], testimonial: item[1], rating: item[2], location: item[3], featured: true,
    })
  }

  const videos = [
    ['Preparing for Your First Consultation', 'A short overview of what information to bring and what to expect.', 'youtube'],
    ['Building Healthy Daily Routines', 'Simple ideas for supporting sleep, hydration and balanced daily habits.', 'instagram'],
    ['When to Seek Medical Advice', 'Why complementary support should work alongside qualified medical care.', 'youtube'],
  ]
  for (const [index, item] of videos.entries()) {
    await upsert(db, 'videos', 'title', item[0], {
      title: item[0],
      description: item[1],
      platform: item[2],
      url: item[2] === 'youtube' ? 'https://www.youtube.com/@careandcuredemo' : 'https://www.instagram.com/careandcuredemo/',
      thumbnail: videoImage.id,
      publishedAt: new Date(Date.now() - index * 86400000).toISOString(),
      featured: true,
    })
  }

  const categoryData = [
    ['General Wellbeing', 'general-wellbeing'], ['Family Health', 'family-health'], ['Clinic Guidance', 'clinic-guidance'],
  ]
  const categories: SeedDocument[] = []
  for (const [name, slug] of categoryData) {
    categories.push(await upsert(db, 'blog-categories', 'slug', slug, { name, slug, description: `Articles about ${name.toLowerCase()}.` }))
  }

  const posts = [
    { title: 'How to Prepare for a Health Consultation', slug: 'prepare-for-health-consultation', excerpt: 'A short checklist can help you use your consultation time well and remember the concerns you want to discuss.', category: categories[2].id, content: 'Preparing a short timeline of symptoms and concerns can make a consultation more useful. Note when each concern began, what makes it better or worse, and how it affects everyday routines.\n\nBring a current list of medicines, supplements, allergies and relevant medical reports. For a child’s consultation, observations from school or existing therapists may also provide helpful context.\n\nWrite down the questions you want answered. Complementary consultation should work alongside appropriate medical care, so do not stop prescribed treatment unless the qualified clinician managing it advises you to do so.' },
    { title: 'Small Habits That Support Everyday Wellbeing', slug: 'small-habits-everyday-wellbeing', excerpt: 'Consistent sleep, hydration, movement and balanced meals form a practical foundation for everyday wellbeing.', category: categories[0].id, content: 'Wellbeing is often supported by small routines practiced consistently. Regular meals, suitable hydration, movement and a predictable sleep schedule provide a useful foundation.\n\nChoose changes that are realistic for your household instead of trying to change everything at once. Tracking one habit for a few weeks can make patterns easier to notice and discuss.\n\nPersistent fatigue, pain, unexpected weight change, disturbed sleep or other concerning symptoms should be assessed by a qualified healthcare professional.' },
    { title: 'Supporting Families with Responsible, Coordinated Care', slug: 'responsible-coordinated-family-care', excerpt: 'Complementary consultations should support—not replace—care from qualified medical and developmental professionals.', category: categories[1].id, content: 'Families navigating developmental or behavioural concerns may work with paediatricians, speech and language therapists, occupational therapists, psychologists, educators and other professionals. Sharing relevant recommendations can help keep support coordinated.\n\nA respectful approach considers communication, sensory comfort, sleep, daily routines and the child’s individual strengths. Harmless self-regulation should not automatically be treated as behaviour that must be removed.\n\nHomeopathy is not a cure for autism. It should not replace evidence-based developmental, medical, educational or therapeutic support.' },
  ]
  for (const [index, item] of posts.entries()) {
    await upsert(db, 'blog-posts', 'slug', item.slug, {
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.content,
      featuredImage: index === 2 ? heroFamily.id : galleryImage.id,
      category: item.category,
      publishedAt: new Date(Date.now() - index * 7 * 86400000).toISOString(),
      _status: 'published',
      seo: { title: item.title, description: item.excerpt, canonicalURL: `https://careandcurebysaima.com/blog/${item.slug}`, shareImage: index === 2 ? heroFamily.id : galleryImage.id, noIndex: false },
    })
  }

  const urgentCare = 'Seek advice from a qualified clinician when symptoms are new, persistent, worsening or affecting daily life. Seek urgent medical care for sudden or severe symptoms, injury, loss of consciousness, breathing difficulty or immediate safety concerns.'
  const supportTopics = [
    { title: 'Speech and Language Development', slug: 'speech-and-language-development', summary: 'A supportive consultation for families concerned about delayed words, communication or changes in speech and language development.', overview: 'Children develop communication skills at different rates. Limited words, loss of previously used language, unclear speech or difficulty expressing needs deserve careful discussion and may require assessment by a paediatrician and speech and language therapist.', points: ['Developmental history and communication milestones', 'Words, gestures and other ways the child communicates', 'Hearing, school and therapy assessments already completed', 'Current support from speech, developmental or educational professionals'] },
    { title: 'Eye Contact and Shared Attention', slug: 'eye-contact-and-shared-attention', summary: 'Discuss concerns about eye contact, shared attention and how a child connects with people and activities.', overview: 'Eye contact varies between individuals, cultures and situations and should not be forced. A broader developmental assessment considers shared attention, communication, sensory comfort and relationships rather than judging one behaviour in isolation.', points: ['When and with whom eye contact feels comfortable', 'Shared attention, pointing and response to name', 'Sensory triggers or environments that cause distress', 'Observations from family, school and developmental specialists'] },
    { title: 'Understanding Commands and Instructions', slug: 'understanding-commands-and-instructions', summary: 'Support for families noticing difficulty understanding, processing or following everyday instructions.', overview: 'Difficulty following instructions can relate to language processing, hearing, attention, memory, learning or the complexity of the request. Qualified developmental, hearing and speech-language assessment may help identify appropriate support.', points: ['Simple versus multi-step instructions', 'Understanding in quiet and busy environments', 'Hearing, attention and language-development history', 'Strategies already recommended by teachers or therapists'] },
    { title: 'Hyperactivity and Restlessness', slug: 'hyperactivity-and-restlessness', summary: 'A whole-person conversation about high activity levels, restlessness, routines and their impact on everyday life.', overview: 'Activity levels differ by age and setting. Persistent hyperactivity or impulsivity that affects safety, learning, sleep or relationships should be assessed by an appropriately qualified child-health or developmental professional.', points: ['When restlessness occurs and what seems to trigger it', 'Sleep, meals, movement and daily routines', 'Impact at home, school and in social settings', 'Existing medical, behavioural or educational care plans'] },
    { title: 'Jumping and Repetitive Movement', slug: 'jumping-and-repetitive-movement', summary: 'Discuss frequent jumping, repetitive movement, sensory needs and any effects on comfort or safety.', overview: 'Repetitive movements may help a child regulate, communicate excitement or respond to sensory needs. The aim is not to suppress harmless self-regulation, but to understand context and address pain, distress or safety risks with suitable professionals.', points: ['Patterns, triggers and the purpose the movement may serve', 'Sensory preferences and regulation strategies', 'Pain, injury or safety concerns', 'Advice from occupational, developmental or behavioural professionals'] },
    { title: 'Aggressive or Hitting Behaviours', slug: 'aggressive-or-hitting-behaviours', summary: 'Supportive discussion of hitting, aggression, distress, communication needs and family safety.', overview: 'Hitting or aggressive behaviour can be a sign of distress, pain, frustration, sensory overload or difficulty communicating. A compassionate assessment focuses on safety and underlying needs, not blame or punishment.', points: ['What happens before, during and after an incident', 'Pain, communication barriers or sensory overload', 'Immediate safety planning for the child and others', 'Coordination with paediatric, behavioural and mental-health professionals'] },
    { title: 'Social Interaction Concerns', slug: 'social-interaction-concerns', summary: 'Discuss how a child communicates, plays, relates to others and manages different social environments.', overview: 'Social interaction looks different for every child. Support should respect neurodiversity and individual comfort while helping families understand communication, play, friendships and situations that cause distress.', points: ['Preferred ways of playing and connecting', 'Comfort with groups, transitions and unfamiliar settings', 'Communication of needs, boundaries and emotions', 'School, therapy and family observations'] },
    { title: 'Urination Routines', slug: 'urination-routines', summary: 'A careful discussion of urination frequency, toileting routines, bedwetting or changes noticed by the family.', overview: 'Urination patterns can be influenced by hydration, routines, infection, constipation, diabetes and other medical issues. New or persistent changes require assessment by a qualified clinician rather than assumptions about behaviour.', points: ['Frequency, urgency, accidents and nighttime patterns', 'Fluid intake and toileting routine', 'Pain, fever, unusual thirst or changes in urine', 'Relevant medical testing and clinician advice'] },
    { title: 'Bowel and Stool Routines', slug: 'bowel-and-stool-routines', summary: 'Discuss constipation, stool frequency, toileting routines and digestive patterns with responsible medical guidance.', overview: 'Bowel patterns vary, but pain, persistent constipation, diarrhoea, blood in stool or significant changes should be medically assessed. Toileting concerns may also involve diet, hydration, sensory comfort and routine.', points: ['Stool frequency, consistency and discomfort', 'Food, fluid and movement routines', 'Withholding, toileting comfort and sensory factors', 'Medicines, investigations and advice already received'] },
    { title: 'Disturbed Sleep', slug: 'disturbed-sleep', summary: 'Explore bedtime routines, night waking and sleep difficulties while checking for issues that require medical care.', overview: 'Sleep can be affected by routines, environment, anxiety, pain, breathing problems, medicines and developmental needs. Persistent sleep difficulty deserves a broad assessment, especially when it affects daytime wellbeing.', points: ['Bedtime, waking and nap patterns', 'Screen use, environment and calming routines', 'Snoring, breathing pauses, pain or nighttime distress', 'Daytime tiredness, activity and current professional advice'] },
  ]
  for (const [index, topic] of supportTopics.entries()) {
    await upsert(db, 'support-topics', 'slug', topic.slug, {
      title: topic.title, slug: topic.slug, eyebrow: 'Developmental and behavioral support', summary: topic.summary,
      overview: topic.overview, discussionPoints: topic.points.map((point) => ({ point })), whenToSeekCare: urgentCare,
      featuredImage: heroFamily.id, order: index + 1, _status: 'published',
      seo: { title: `${topic.title} | Dr. Saima Absar`, description: seoDescription(topic.summary), canonicalURL: `https://careandcurebysaima.com/support/${topic.slug}`, shareImage: heroFamily.id, noIndex: false },
    })
  }

  const pages = [
    { title: 'Online Video Consultation', slug: 'online-consultation', type: 'consultation', summary: 'Book a remote consultation with Dr. Saima Absar using WhatsApp video or Google Meet from Pakistan or abroad.', content: 'Video consultations provide a convenient way to discuss concerns without travelling to Lahore. The clinic will confirm the appointment time, platform and information to prepare.\n\nAvailability, payment and delivery arrangements depend on the patient’s location. Products or medicines cannot be guaranteed for every country and are only discussed after consultation. Online consultations are not suitable for emergencies.', highlights: ['WhatsApp video call or Google Meet', 'Available for patients in Pakistan and internationally', 'Appointment time confirmed with your time zone', 'Delivery discussed only where legally and practically available'], cta: true },
    { title: 'Physical Clinic Consultation in Lahore', slug: 'clinic-consultation-lahore', type: 'consultation', summary: 'Visit Care and Cure in Johar Town, Lahore for a face-to-face consultation with Dr. Saima Absar.', content: 'Physical consultations take place at Care and Cure, 679 A F2, Phase 1, Johar Town, Lahore. Booking ahead helps the clinic reserve enough time for a careful discussion.\n\nBring current medicines, relevant reports and details of existing medical or developmental care. Do not stop prescribed treatment without consulting the clinician responsible for your care.', highlights: ['Johar Town, Lahore clinic location', 'Private face-to-face discussion', 'Review of relevant previous reports', 'Appointment confirmation through WhatsApp'], cta: true },
    { title: 'Privacy Policy', slug: 'privacy-policy', type: 'legal', summary: 'How Care and Cure handles information submitted through this website and WhatsApp.', content: 'This demonstration privacy policy must be reviewed before launch. When a visitor submits an appointment, contact or medical-kit form, the name, WhatsApp number, location, consent choice and enquiry details are stored in the private Care and Cure patient-management database. The information is used to respond to the request and maintain an enquiry history. The prepared message then opens in WhatsApp, which processes messages according to its own terms and privacy policy.\n\nAccess to patient and enquiry records is restricted to authenticated clinic administrators. A production policy must state the lawful basis, retention period, correction and deletion process, database and backup safeguards, hosting location, third-party processors and a privacy contact.\n\nDo not send highly sensitive medical information through an unsecured channel. Production analytics, cookies and any additional tracking must also be documented before launch.', highlights: [], cta: false, noIndex: false },
    { title: 'Website Terms', slug: 'terms', type: 'legal', summary: 'Important terms for using the Care and Cure website and its general information.', content: 'This website provides general information and a way to request an appointment. Content does not create a doctor-patient relationship, provide a diagnosis or replace individual medical advice.\n\nService availability, fees, appointment times and delivery arrangements must be confirmed directly with the clinic. These demonstration terms require legal review before production launch.', highlights: [], cta: false, noIndex: false },
    { title: 'Medical Disclaimer', slug: 'medical-disclaimer', type: 'legal', summary: 'The health information on this website is educational and does not replace qualified medical care.', content: 'Homeopathy is not a cure for autism and should not replace evidence-based medical, developmental, speech, occupational, behavioural, psychological or educational support. Never stop prescribed medicine without speaking with the qualified clinician managing your care.\n\nThis website is not an emergency service. For severe symptoms, breathing difficulty, loss of consciousness, serious injury, immediate danger or another emergency, contact local emergency services without delay.', highlights: ['No cure claims', 'Continue evidence-based and prescribed care', 'Seek qualified assessment for persistent or worsening concerns', 'Use emergency services for urgent or life-threatening situations'], cta: false, noIndex: false },
  ]
  for (const page of pages) {
    await upsert(db, 'pages', 'slug', page.slug, {
      title: page.title, slug: page.slug, pageType: page.type, summary: page.summary, content: page.content,
      highlights: page.highlights.map((highlight) => ({ highlight })), showAppointmentCTA: page.cta, _status: 'published',
      seo: { title: page.slug === 'clinic-consultation-lahore' ? 'Clinic Consultation Lahore | Care and Cure' : `${page.title} | Care and Cure`, description: seoDescription(page.summary), canonicalURL: `https://careandcurebysaima.com/${page.slug}`, noIndex: page.noIndex || false },
    })
  }

  const medicalKits = [
    {
      title: 'Home First-Aid Support Kit', slug: 'home-first-aid-support-kit', price: 4500,
      description: 'A general home-support kit intended for minor, non-urgent situations after the clinic has confirmed that it is appropriate for the household.',
      keywords: 'home support kit, first aid support, household kit, Care and Cure',
      benefits: ['Keeps commonly discussed home-support items organized', 'Includes clinic guidance about appropriate use and storage', 'Provides a convenient point of reference for minor, non-urgent situations'],
      safety: 'This is not an emergency kit and cannot treat medical emergencies. Call local emergency services immediately for breathing difficulty, unconsciousness, severe injury, poisoning, heavy bleeding, seizures or other urgent symptoms.',
    },
    {
      title: 'Fever Support Kit for Ages 1–3', slug: 'fever-support-kit-ages-1-to-3', price: 3200,
      description: 'A child fever-support kit that is supplied only after age, symptoms and suitability have been discussed with the clinic.',
      keywords: 'child fever support, ages 1 to 3, toddler care, fever kit Lahore',
      benefits: ['Age-specific discussion before purchase', 'Clear storage and usage guidance from the clinic', 'Convenient follow-up through the clinic’s contact channel'],
      safety: 'Fever in a young child can require prompt medical assessment. Seek urgent care for breathing difficulty, seizure, unusual drowsiness, stiff neck, dehydration, persistent vomiting, a non-fading rash, severe pain or if the child appears seriously unwell. Do not delay paediatric care.',
    },
    {
      title: 'Healthy Weight Support Kit', slug: 'healthy-weight-support-kit', price: 5500,
      description: 'A supportive wellbeing kit offered alongside an individual conversation about nutrition, activity, sleep, medical history and realistic goals.',
      keywords: 'healthy weight support, wellbeing kit, nutrition routines, weight management Lahore',
      benefits: ['Focuses on sustainable routines rather than rapid-loss promises', 'Encourages consideration of sleep, nutrition and activity together', 'Includes a suitability discussion before purchase'],
      safety: 'This kit does not guarantee fat or weight loss. Unexplained weight change, eating-disorder concerns, pregnancy, chronic illness or medicine-related weight changes require guidance from an appropriately qualified healthcare professional.',
    },
  ]
  for (const [index, kit] of medicalKits.entries()) {
    await upsert(db, 'medical-kits', 'slug', kit.slug, {
      title: kit.title, slug: kit.slug, description: kit.description, keywords: kit.keywords, image: treatmentImage.id,
      price: kit.price, currency: 'PKR', benefits: kit.benefits.map((benefit) => ({ benefit })), safetyNotice: kit.safety,
      featured: true, active: true, order: index + 1, _status: 'published',
      seo: { title: `${kit.title} | Care and Cure`, description: seoDescription(kit.description), canonicalURL: `https://careandcurebysaima.com/medical-kits/${kit.slug}`, shareImage: treatmentImage.id, noIndex: false },
    })
  }

  const expenseCategories = [
    ['Fuel and Transport', 'fuel-transport', 'Fuel, ride fares, parking and local travel costs.'],
    ['Clinic Rent', 'clinic-rent', 'Monthly clinic rent and related occupancy charges.'],
    ['Utility Bills', 'utility-bills', 'Electricity, gas, water, internet and telephone bills.'],
    ['Meals and Lunch', 'meals-lunch', 'Work-related meals, lunch and refreshments.'],
    ['Clinic Supplies', 'clinic-supplies', 'Stationery, disposable items and day-to-day clinic supplies.'],
    ['Medicines and Stock', 'medicines-stock', 'Medicines, kit contents and other inventory purchases.'],
    ['Repairs and Maintenance', 'repairs-maintenance', 'Cleaning, repairs, equipment service and clinic maintenance.'],
    ['Delivery and Courier', 'delivery-courier', 'Courier, delivery and postage expenses.'],
    ['Marketing and Advertising', 'marketing-advertising', 'Advertising, printing, promotions and marketing services.'],
    ['Salaries and Staff', 'salaries-staff', 'Staff salaries, wages and approved reimbursements.'],
    ['Software and Subscriptions', 'software-subscriptions', 'Software, hosting, domains and recurring digital services.'],
    ['Professional Fees', 'professional-fees', 'Accounting, legal, consulting and other professional services.'],
    ['Taxes and Government Fees', 'taxes-government-fees', 'Taxes, licences, registrations and government charges.'],
    ['Other', 'other', 'Expenses that do not fit another active category.'],
  ]
  for (const [index, category] of expenseCategories.entries()) {
    await upsert(db, 'expense-categories', 'slug', category[1], {
      name: category[0], slug: category[1], description: category[2], active: true, order: index + 1,
    })
  }

  const patientsWithoutCode = await db.find({ collection: 'patients', where: { patientCode: { exists: false } }, limit: 1000, depth: 0, overrideAccess: true })
  for (const patient of patientsWithoutCode.docs) {
    await db.update({ collection: 'patients', id: patient.id, data: { patientCode: `CC-${new Date().getFullYear()}-${randomBytes(3).toString('hex').toUpperCase()}` }, overrideAccess: true })
  }

  const gallery = [
    ['Care and Cure consultation room', heroClinic.id],
    ['Individual consultation', heroConsultation.id],
    ['Family support conversation', heroFamily.id],
    ['Patient-centred guidance', galleryImage.id],
  ]
  for (const [index, item] of gallery.entries()) {
    await upsert(db, 'gallery', 'title', item[0] as string, {
      title: item[0], image: item[1], caption: 'Demonstration gallery image.', category: 'Clinic', order: index + 1, active: true,
    })
  }

  const faqs = [
    ['How can I book an appointment?', 'Call or send a WhatsApp message to the clinic. The team will confirm an available time.', 'Appointments'],
    ['Where is the clinic located?', 'Care and Cure is located at 679 A F2, Phase 1, Johar Town, Lahore, Pakistan.', 'Clinic'],
    ['What should I bring to my consultation?', 'Bring a list of your concerns, current medicines, relevant reports and details of any ongoing medical care.', 'Appointments'],
    ['Does homeopathy replace medical treatment?', 'No. Do not stop prescribed treatment without speaking to the qualified clinician managing your care.', 'Responsible Care'],
    ['Can homeopathy cure autism?', 'No. Homeopathy is not a cure for autism. Families should continue evidence-based medical, developmental and educational support.', 'Responsible Care'],
    ['Do I need an appointment?', 'Appointments are recommended so the clinic can reserve enough time for your consultation.', 'Appointments'],
  ]
  for (const [index, item] of faqs.entries()) {
    await upsert(db, 'faqs', 'question', item[0], {
      question: item[0], answer: item[1], category: item[2], order: index + 1, active: true,
    })
  }

  payload.logger.info('Care and Cure demo content seeded successfully.')
  process.exit(0)
}

await seed()
