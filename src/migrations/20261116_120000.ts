import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "whatsapp_settings"
      ADD COLUMN IF NOT EXISTS "button_label_urdu" varchar DEFAULT 'کنسلٹنٹ سے بات کریں' NOT NULL,
      ADD COLUMN IF NOT EXISTS "button_color" varchar DEFAULT '#25D366' NOT NULL,
      ADD COLUMN IF NOT EXISTS "button_text_color" varchar DEFAULT '#FFFFFF' NOT NULL;

    UPDATE "whatsapp_settings"
    SET "button_label" = 'Talk with Consultant';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "whatsapp_settings"
      DROP COLUMN "button_label_urdu",
      DROP COLUMN "button_color",
      DROP COLUMN "button_text_color";
  `)
}
