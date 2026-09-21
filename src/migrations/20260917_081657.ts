import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "homepage_settings" ADD COLUMN "about_secondary_c_t_a_label" varchar DEFAULT 'Book appointment';
  ALTER TABLE "homepage_settings" ADD COLUMN "about_secondary_c_t_a_link" varchar DEFAULT '#appointments';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "homepage_settings" DROP COLUMN "about_secondary_c_t_a_label";
  ALTER TABLE "homepage_settings" DROP COLUMN "about_secondary_c_t_a_link";`)
}
