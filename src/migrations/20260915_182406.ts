import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "homepage_settings" DROP COLUMN "treatments_section_heading";
  ALTER TABLE "homepage_settings" DROP COLUMN "treatments_section_intro";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "homepage_settings" ADD COLUMN "treatments_section_heading" varchar DEFAULT 'Areas of Support' NOT NULL;
  ALTER TABLE "homepage_settings" ADD COLUMN "treatments_section_intro" varchar DEFAULT 'Explore the concerns discussed during individual consultations.';`)
}
