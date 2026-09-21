import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_patients_status" AS ENUM('prospective', 'active', 'inactive', 'archived');
  CREATE TYPE "public"."enum_patients_preferred_consultation" AS ENUM('video', 'physical', 'not-specified');
  CREATE TYPE "public"."enum_patient_inquiries_inquiry_type" AS ENUM('video-consultation', 'physical-consultation', 'general-inquiry', 'medical-kit');
  CREATE TYPE "public"."enum_patient_inquiries_status" AS ENUM('new', 'contacted', 'converted', 'closed');
  CREATE TABLE "patients" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"whatsapp_number" varchar NOT NULL,
  	"location" varchar NOT NULL,
  	"status" "enum_patients_status" DEFAULT 'prospective' NOT NULL,
  	"preferred_consultation" "enum_patients_preferred_consultation",
  	"source" varchar DEFAULT 'website' NOT NULL,
  	"consent_to_contact" boolean DEFAULT false NOT NULL,
  	"last_inquiry_at" timestamp(3) with time zone,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "patient_inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"patient_id" integer NOT NULL,
  	"inquiry_type" "enum_patient_inquiries_inquiry_type" NOT NULL,
  	"source" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"product_name" varchar,
  	"quantity" numeric,
  	"status" "enum_patient_inquiries_status" DEFAULT 'new' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "patients_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "patient_inquiries_id" integer;
  ALTER TABLE "patient_inquiries" ADD CONSTRAINT "patient_inquiries_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "patients_full_name_idx" ON "patients" USING btree ("full_name");
  CREATE UNIQUE INDEX "patients_whatsapp_number_idx" ON "patients" USING btree ("whatsapp_number");
  CREATE INDEX "patients_location_idx" ON "patients" USING btree ("location");
  CREATE INDEX "patients_status_idx" ON "patients" USING btree ("status");
  CREATE INDEX "patients_source_idx" ON "patients" USING btree ("source");
  CREATE INDEX "patients_last_inquiry_at_idx" ON "patients" USING btree ("last_inquiry_at");
  CREATE INDEX "patients_updated_at_idx" ON "patients" USING btree ("updated_at");
  CREATE INDEX "patients_created_at_idx" ON "patients" USING btree ("created_at");
  CREATE INDEX "patient_inquiries_patient_idx" ON "patient_inquiries" USING btree ("patient_id");
  CREATE INDEX "patient_inquiries_inquiry_type_idx" ON "patient_inquiries" USING btree ("inquiry_type");
  CREATE INDEX "patient_inquiries_source_idx" ON "patient_inquiries" USING btree ("source");
  CREATE INDEX "patient_inquiries_status_idx" ON "patient_inquiries" USING btree ("status");
  CREATE INDEX "patient_inquiries_updated_at_idx" ON "patient_inquiries" USING btree ("updated_at");
  CREATE INDEX "patient_inquiries_created_at_idx" ON "patient_inquiries" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_patients_fk" FOREIGN KEY ("patients_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_patient_inquiries_fk" FOREIGN KEY ("patient_inquiries_id") REFERENCES "public"."patient_inquiries"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_patients_id_idx" ON "payload_locked_documents_rels" USING btree ("patients_id");
  CREATE INDEX "payload_locked_documents_rels_patient_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("patient_inquiries_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "patients" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "patient_inquiries" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "patients" CASCADE;
  DROP TABLE "patient_inquiries" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_patients_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_patient_inquiries_fk";
  
  DROP INDEX "payload_locked_documents_rels_patients_id_idx";
  DROP INDEX "payload_locked_documents_rels_patient_inquiries_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "patients_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "patient_inquiries_id";
  DROP TYPE "public"."enum_patients_status";
  DROP TYPE "public"."enum_patients_preferred_consultation";
  DROP TYPE "public"."enum_patient_inquiries_inquiry_type";
  DROP TYPE "public"."enum_patient_inquiries_status";`)
}
