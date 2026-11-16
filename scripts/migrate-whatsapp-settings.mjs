import pg from 'pg'

const { Client } = pg
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error('DATABASE_URL is required')
  process.exit(1)
}

const client = new Client({ connectionString })

try {
  await client.connect()
  await client.query('BEGIN')
  await client.query(`
    ALTER TABLE "whatsapp_settings"
      ADD COLUMN IF NOT EXISTS "button_label_urdu" varchar DEFAULT 'کنسلٹنٹ سے بات کریں' NOT NULL,
      ADD COLUMN IF NOT EXISTS "button_color" varchar DEFAULT '#25D366' NOT NULL,
      ADD COLUMN IF NOT EXISTS "button_text_color" varchar DEFAULT '#FFFFFF' NOT NULL
  `)
  await client.query(`
    UPDATE "whatsapp_settings"
    SET "button_label" = 'Talk with Consultant'
    WHERE "button_label" = 'Chat on WhatsApp'
  `)
  await client.query('COMMIT')
  console.log('WhatsApp settings database columns are ready.')
} catch (error) {
  await client.query('ROLLBACK').catch(() => undefined)
  console.error(error)
  process.exitCode = 1
} finally {
  await client.end().catch(() => undefined)
}
