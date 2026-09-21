# Care and Cure by Dr. Saima Absar

Production-oriented foundation for the Care and Cure website. The public frontend and Payload CMS live in one Next.js application; the CMS is mounted at `/admin` and persists data in PostgreSQL.

## Stack

- Next.js App Router and TypeScript
- Tailwind CSS
- Payload CMS with authenticated Users
- PostgreSQL through Payload's Drizzle-based adapter

## Local setup

Requirements: Node.js 20.9+ and PostgreSQL.

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and replace its placeholder values.
3. Create the database named in `DATABASE_URL`.
4. Start development: `npm run dev`
5. Visit `http://localhost:3000/admin` and create the first administrator.

The public placeholder homepage is available at `http://localhost:3000`.

## Project structure

```text
src/
├── access/              Shared access-control policies
├── app/
│   ├── (frontend)/      Public routes and styles
│   └── (payload)/       Admin panel and Payload API routes
├── collections/         Homepage, blog, gallery, FAQ, user and media models
├── components/home/     Reusable homepage sections and UI
├── globals/             Business, contact, homepage and SEO settings
├── lib/                 Server data access and media helpers
├── migrations/          Versioned PostgreSQL schema migrations
└── payload.config.ts    CMS, database, and admin configuration
```

## Production

Set `DATABASE_URL`, a unique high-entropy `PAYLOAD_SECRET`, and the canonical `NEXT_PUBLIC_SERVER_URL` in the hosting environment. Run `npm run build`, then `npm start`.

Payload can synchronize schema automatically during local development. For controlled production schema changes, create and commit migrations with `npm run migrate:create`, then run `npm run migrate` during deployment before starting the application.

## CMS content model

Collections: Users, Media, Hero Slides, Treatments, Testimonials, Videos, Blog Posts, Blog Categories, Gallery, FAQs, Support Topics, Pages, Medical Kits, Expenses, Expense Categories, Patients, Patient Inquiries, Appointments, Consultation Records, Treatment Plans, Patient Medicines, and Patient Payments.

Globals: Site Settings, Contact Information, Social Media, Clinic Timings, WhatsApp Settings, Homepage Settings, SEO Defaults, and About Dr. Saima.

The homepage reads these sources through Payload's Local API. Empty collections display neutral placeholders until editors publish real content. Business defaults are defined in the globals and can be reviewed and saved from `/admin`.

## Editorial notes

- Upload the doctor's portrait and all card images through Media.
- Add at least one active Hero Slide and Treatment for a complete homepage.
- Only published Blog Posts appear publicly.
- Videos accept YouTube and Instagram URLs.
- Medical content should remain informational and must not promise cures or replace evidence-based care.
- Configure a production email adapter before enabling password-reset or transactional email workflows.
- Local uploads are written to `media/`; configure an object-storage adapter before deploying to an ephemeral/serverless host.

## SEO foundation

- Individual search, canonical, social-image, and indexing controls are available on Support Topics, Pages, and Blog Posts.
- Public content routes include `/support/[slug]`, `/blog/[slug]`, and CMS-managed top-level pages.
- `/sitemap.xml` and `/robots.txt` are generated dynamically from published CMS content.
- The homepage includes `MedicalClinic` structured data; topic pages use `MedicalWebPage`, and posts use `Article` structured data.
- Privacy, terms, medical disclaimer, online consultation, and Lahore clinic consultation starter pages are included in the seed.
- Replace all demonstration legal copy, qualifications, service availability, and delivery information with verified content before launch.
- Medical Kits have listing and detail pages, structured product metadata, prices, safety notices, benefits, and a WhatsApp enquiry flow. All product descriptions and prices are demonstration content until clinically and commercially reviewed.
- Expense Management is private to authenticated CMS users and supports categories, dates, amounts, currencies, payment methods, statuses, vendors, recurring frequencies, receipt uploads, references, notes, search, and filtering.
- Patient Management is private to authenticated CMS users. Website appointment, contact, floating WhatsApp, and medical-kit forms upsert a prospective patient by normalized WhatsApp number and preserve every submission as a separate inquiry after explicit consent.
- Patient IDs are generated automatically. The authenticated read-only patient record combines personal details, reported medical history, appointments, consultations, plans, medicines, payments, inquiries, next visit, and balance, with separate edit controls plus JSON download and print-to-PDF support.
