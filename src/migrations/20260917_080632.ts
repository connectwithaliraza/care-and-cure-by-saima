import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "doctor_focus_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"area" varchar NOT NULL
  );
  
  CREATE TABLE "about_doctor" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"page_title" varchar DEFAULT 'About Dr. Saima Absar' NOT NULL,
  	"doctor_name" varchar DEFAULT 'Dr. Saima Absar' NOT NULL,
  	"image_id" integer,
  	"intro" varchar NOT NULL,
  	"biography" varchar NOT NULL,
  	"qualifications" varchar NOT NULL,
  	"keywords" varchar,
  	"map_heading" varchar DEFAULT 'Visit Care and Cure in Johar Town',
  	"map_query" varchar DEFAULT '679 A F2, Phase 1, Johar Town, Lahore, Pakistan',
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_canonical_u_r_l" varchar,
  	"seo_share_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "homepage_settings" ALTER COLUMN "blog_heading" SET DEFAULT 'Latest Health Articles';
  ALTER TABLE "doctor_focus_areas" ADD CONSTRAINT "doctor_focus_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_doctor"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_doctor" ADD CONSTRAINT "about_doctor_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_doctor" ADD CONSTRAINT "about_doctor_seo_share_image_id_media_id_fk" FOREIGN KEY ("seo_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "doctor_focus_areas_order_idx" ON "doctor_focus_areas" USING btree ("_order");
  CREATE INDEX "doctor_focus_areas_parent_id_idx" ON "doctor_focus_areas" USING btree ("_parent_id");
  CREATE INDEX "about_doctor_image_idx" ON "about_doctor" USING btree ("image_id");
  CREATE INDEX "about_doctor_seo_seo_share_image_idx" ON "about_doctor" USING btree ("seo_share_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "doctor_focus_areas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_doctor" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "doctor_focus_areas" CASCADE;
  DROP TABLE "about_doctor" CASCADE;
  ALTER TABLE "homepage_settings" ALTER COLUMN "blog_heading" SET DEFAULT 'Latest from the Clinic';`)
}
