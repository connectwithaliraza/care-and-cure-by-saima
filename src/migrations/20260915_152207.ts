import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "video_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"benefit" varchar NOT NULL
  );
  
  CREATE TABLE "clinic_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"benefit" varchar NOT NULL
  );
  
  ALTER TABLE "homepage_settings" ADD COLUMN "consultation_options_eyebrow" varchar DEFAULT 'Appointments';
  ALTER TABLE "homepage_settings" ADD COLUMN "consultation_options_heading" varchar DEFAULT 'Choose how you would like to consult' NOT NULL;
  ALTER TABLE "homepage_settings" ADD COLUMN "consultation_options_intro" varchar DEFAULT 'Choose a convenient video consultation or visit Care and Cure in Lahore.';
  ALTER TABLE "homepage_settings" ADD COLUMN "consultation_options_video_consultation_title" varchar DEFAULT 'Video Consultation' NOT NULL;
  ALTER TABLE "homepage_settings" ADD COLUMN "consultation_options_video_consultation_description" varchar DEFAULT 'Speak with Dr. Saima Absar from home through WhatsApp video or Google Meet.' NOT NULL;
  ALTER TABLE "homepage_settings" ADD COLUMN "consultation_options_video_consultation_cta_label" varchar DEFAULT 'Book a video consultation' NOT NULL;
  ALTER TABLE "homepage_settings" ADD COLUMN "consultation_options_clinic_visit_title" varchar DEFAULT 'Physical Clinic Visit' NOT NULL;
  ALTER TABLE "homepage_settings" ADD COLUMN "consultation_options_clinic_visit_description" varchar DEFAULT 'Meet Dr. Saima Absar at Care and Cure in Johar Town, Lahore.' NOT NULL;
  ALTER TABLE "homepage_settings" ADD COLUMN "consultation_options_clinic_visit_cta_label" varchar DEFAULT 'Book a clinic visit' NOT NULL;
  ALTER TABLE "video_benefits" ADD CONSTRAINT "video_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clinic_benefits" ADD CONSTRAINT "clinic_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "video_benefits_order_idx" ON "video_benefits" USING btree ("_order");
  CREATE INDEX "video_benefits_parent_id_idx" ON "video_benefits" USING btree ("_parent_id");
  CREATE INDEX "clinic_benefits_order_idx" ON "clinic_benefits" USING btree ("_order");
  CREATE INDEX "clinic_benefits_parent_id_idx" ON "clinic_benefits" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "video_benefits" CASCADE;
  DROP TABLE "clinic_benefits" CASCADE;
  ALTER TABLE "homepage_settings" DROP COLUMN "consultation_options_eyebrow";
  ALTER TABLE "homepage_settings" DROP COLUMN "consultation_options_heading";
  ALTER TABLE "homepage_settings" DROP COLUMN "consultation_options_intro";
  ALTER TABLE "homepage_settings" DROP COLUMN "consultation_options_video_consultation_title";
  ALTER TABLE "homepage_settings" DROP COLUMN "consultation_options_video_consultation_description";
  ALTER TABLE "homepage_settings" DROP COLUMN "consultation_options_video_consultation_cta_label";
  ALTER TABLE "homepage_settings" DROP COLUMN "consultation_options_clinic_visit_title";
  ALTER TABLE "homepage_settings" DROP COLUMN "consultation_options_clinic_visit_description";
  ALTER TABLE "homepage_settings" DROP COLUMN "consultation_options_clinic_visit_cta_label";`)
}
