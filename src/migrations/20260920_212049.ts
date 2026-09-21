import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_patients_gender" AS ENUM('female', 'male', 'other');
  CREATE TYPE "public"."enum_patient_appointments_appointment_type" AS ENUM('physical', 'video');
  CREATE TYPE "public"."enum_patient_appointments_status" AS ENUM('requested', 'scheduled', 'completed', 'cancelled', 'no-show');
  CREATE TYPE "public"."enum_consultation_records_consultation_type" AS ENUM('physical', 'video');
  CREATE TYPE "public"."enum_treatment_plans_status" AS ENUM('active', 'completed', 'paused', 'discontinued');
  CREATE TYPE "public"."enum_patient_medicines_source_type" AS ENUM('clinic-recommendation', 'external-prescription', 'supplement', 'medical-kit');
  CREATE TYPE "public"."enum_patient_medicines_status" AS ENUM('active', 'completed', 'stopped');
  CREATE TYPE "public"."enum_patient_medicines_fulfilment" AS ENUM('pending', 'dispensed', 'collected', 'delivered');
  CREATE TYPE "public"."enum_patient_payments_currency" AS ENUM('PKR');
  CREATE TYPE "public"."enum_patient_payments_status" AS ENUM('unpaid', 'partial', 'paid', 'refunded');
  CREATE TYPE "public"."enum_patient_payments_payment_method" AS ENUM('cash', 'bank-transfer', 'card', 'easypaisa', 'jazzcash', 'other');
  CREATE TABLE "patient_appointments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"patient_id" integer NOT NULL,
  	"appointment_date" timestamp(3) with time zone NOT NULL,
  	"appointment_type" "enum_patient_appointments_appointment_type" DEFAULT 'physical' NOT NULL,
  	"status" "enum_patient_appointments_status" DEFAULT 'scheduled' NOT NULL,
  	"reason" varchar,
  	"meeting_details" varchar,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "consultation_records" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"patient_id" integer NOT NULL,
  	"appointment_id" integer,
  	"consultation_date" timestamp(3) with time zone NOT NULL,
  	"consultation_type" "enum_consultation_records_consultation_type" DEFAULT 'physical',
  	"main_concerns" varchar,
  	"history_reported" varchar,
  	"observations" varchar,
  	"guidance_provided" varchar,
  	"private_clinical_notes" varchar,
  	"follow_up_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "consultation_records_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "treatment_plans" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"patient_id" integer NOT NULL,
  	"consultation_id" integer,
  	"title" varchar NOT NULL,
  	"start_date" timestamp(3) with time zone,
  	"status" "enum_treatment_plans_status" DEFAULT 'active',
  	"objectives" varchar,
  	"instructions" varchar,
  	"review_date" timestamp(3) with time zone,
  	"outcome_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "patient_medicines" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"patient_id" integer NOT NULL,
  	"consultation_id" integer,
  	"medicine_name" varchar NOT NULL,
  	"source_type" "enum_patient_medicines_source_type" DEFAULT 'clinic-recommendation',
  	"strength_or_form" varchar,
  	"instructions" varchar,
  	"frequency" varchar,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"status" "enum_patient_medicines_status" DEFAULT 'active',
  	"fulfilment" "enum_patient_medicines_fulfilment",
  	"safety_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "patient_payments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"patient_id" integer NOT NULL,
  	"appointment_id" integer,
  	"invoice_number" varchar,
  	"description" varchar,
  	"total_amount" numeric NOT NULL,
  	"paid_amount" numeric DEFAULT 0 NOT NULL,
  	"currency" "enum_patient_payments_currency" DEFAULT 'PKR' NOT NULL,
  	"status" "enum_patient_payments_status" DEFAULT 'unpaid' NOT NULL,
  	"payment_method" "enum_patient_payments_payment_method",
  	"payment_date" timestamp(3) with time zone,
  	"receipt_id" integer,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "patients" ADD COLUMN "patient_code" varchar;
  ALTER TABLE "patients" ADD COLUMN "date_of_birth" timestamp(3) with time zone;
  ALTER TABLE "patients" ADD COLUMN "gender" "enum_patients_gender";
  ALTER TABLE "patients" ADD COLUMN "address" varchar;
  ALTER TABLE "patients" ADD COLUMN "guardian_name" varchar;
  ALTER TABLE "patients" ADD COLUMN "guardian_relationship" varchar;
  ALTER TABLE "patients" ADD COLUMN "emergency_contact" varchar;
  ALTER TABLE "patients" ADD COLUMN "reported_allergies" varchar;
  ALTER TABLE "patients" ADD COLUMN "reported_diagnoses" varchar;
  ALTER TABLE "patients" ADD COLUMN "current_prescribed_medicines" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "patient_appointments_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "consultation_records_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "treatment_plans_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "patient_medicines_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "patient_payments_id" integer;
  ALTER TABLE "patient_appointments" ADD CONSTRAINT "patient_appointments_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "consultation_records" ADD CONSTRAINT "consultation_records_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "consultation_records" ADD CONSTRAINT "consultation_records_appointment_id_patient_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."patient_appointments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "consultation_records_rels" ADD CONSTRAINT "consultation_records_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."consultation_records"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "consultation_records_rels" ADD CONSTRAINT "consultation_records_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treatment_plans" ADD CONSTRAINT "treatment_plans_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "treatment_plans" ADD CONSTRAINT "treatment_plans_consultation_id_consultation_records_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "public"."consultation_records"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "patient_medicines" ADD CONSTRAINT "patient_medicines_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "patient_medicines" ADD CONSTRAINT "patient_medicines_consultation_id_consultation_records_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "public"."consultation_records"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "patient_payments" ADD CONSTRAINT "patient_payments_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "patient_payments" ADD CONSTRAINT "patient_payments_appointment_id_patient_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."patient_appointments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "patient_payments" ADD CONSTRAINT "patient_payments_receipt_id_media_id_fk" FOREIGN KEY ("receipt_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "patient_appointments_patient_idx" ON "patient_appointments" USING btree ("patient_id");
  CREATE INDEX "patient_appointments_appointment_date_idx" ON "patient_appointments" USING btree ("appointment_date");
  CREATE INDEX "patient_appointments_status_idx" ON "patient_appointments" USING btree ("status");
  CREATE INDEX "patient_appointments_updated_at_idx" ON "patient_appointments" USING btree ("updated_at");
  CREATE INDEX "patient_appointments_created_at_idx" ON "patient_appointments" USING btree ("created_at");
  CREATE INDEX "consultation_records_patient_idx" ON "consultation_records" USING btree ("patient_id");
  CREATE INDEX "consultation_records_appointment_idx" ON "consultation_records" USING btree ("appointment_id");
  CREATE INDEX "consultation_records_consultation_date_idx" ON "consultation_records" USING btree ("consultation_date");
  CREATE INDEX "consultation_records_follow_up_date_idx" ON "consultation_records" USING btree ("follow_up_date");
  CREATE INDEX "consultation_records_updated_at_idx" ON "consultation_records" USING btree ("updated_at");
  CREATE INDEX "consultation_records_created_at_idx" ON "consultation_records" USING btree ("created_at");
  CREATE INDEX "consultation_records_rels_order_idx" ON "consultation_records_rels" USING btree ("order");
  CREATE INDEX "consultation_records_rels_parent_idx" ON "consultation_records_rels" USING btree ("parent_id");
  CREATE INDEX "consultation_records_rels_path_idx" ON "consultation_records_rels" USING btree ("path");
  CREATE INDEX "consultation_records_rels_media_id_idx" ON "consultation_records_rels" USING btree ("media_id");
  CREATE INDEX "treatment_plans_patient_idx" ON "treatment_plans" USING btree ("patient_id");
  CREATE INDEX "treatment_plans_consultation_idx" ON "treatment_plans" USING btree ("consultation_id");
  CREATE INDEX "treatment_plans_start_date_idx" ON "treatment_plans" USING btree ("start_date");
  CREATE INDEX "treatment_plans_status_idx" ON "treatment_plans" USING btree ("status");
  CREATE INDEX "treatment_plans_review_date_idx" ON "treatment_plans" USING btree ("review_date");
  CREATE INDEX "treatment_plans_updated_at_idx" ON "treatment_plans" USING btree ("updated_at");
  CREATE INDEX "treatment_plans_created_at_idx" ON "treatment_plans" USING btree ("created_at");
  CREATE INDEX "patient_medicines_patient_idx" ON "patient_medicines" USING btree ("patient_id");
  CREATE INDEX "patient_medicines_consultation_idx" ON "patient_medicines" USING btree ("consultation_id");
  CREATE INDEX "patient_medicines_start_date_idx" ON "patient_medicines" USING btree ("start_date");
  CREATE INDEX "patient_medicines_status_idx" ON "patient_medicines" USING btree ("status");
  CREATE INDEX "patient_medicines_updated_at_idx" ON "patient_medicines" USING btree ("updated_at");
  CREATE INDEX "patient_medicines_created_at_idx" ON "patient_medicines" USING btree ("created_at");
  CREATE INDEX "patient_payments_patient_idx" ON "patient_payments" USING btree ("patient_id");
  CREATE INDEX "patient_payments_appointment_idx" ON "patient_payments" USING btree ("appointment_id");
  CREATE INDEX "patient_payments_invoice_number_idx" ON "patient_payments" USING btree ("invoice_number");
  CREATE INDEX "patient_payments_status_idx" ON "patient_payments" USING btree ("status");
  CREATE INDEX "patient_payments_payment_date_idx" ON "patient_payments" USING btree ("payment_date");
  CREATE INDEX "patient_payments_receipt_idx" ON "patient_payments" USING btree ("receipt_id");
  CREATE INDEX "patient_payments_updated_at_idx" ON "patient_payments" USING btree ("updated_at");
  CREATE INDEX "patient_payments_created_at_idx" ON "patient_payments" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_patient_appointments_fk" FOREIGN KEY ("patient_appointments_id") REFERENCES "public"."patient_appointments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_consultation_records_fk" FOREIGN KEY ("consultation_records_id") REFERENCES "public"."consultation_records"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_treatment_plans_fk" FOREIGN KEY ("treatment_plans_id") REFERENCES "public"."treatment_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_patient_medicines_fk" FOREIGN KEY ("patient_medicines_id") REFERENCES "public"."patient_medicines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_patient_payments_fk" FOREIGN KEY ("patient_payments_id") REFERENCES "public"."patient_payments"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "patients_patient_code_idx" ON "patients" USING btree ("patient_code");
  CREATE INDEX "payload_locked_documents_rels_patient_appointments_id_idx" ON "payload_locked_documents_rels" USING btree ("patient_appointments_id");
  CREATE INDEX "payload_locked_documents_rels_consultation_records_id_idx" ON "payload_locked_documents_rels" USING btree ("consultation_records_id");
  CREATE INDEX "payload_locked_documents_rels_treatment_plans_id_idx" ON "payload_locked_documents_rels" USING btree ("treatment_plans_id");
  CREATE INDEX "payload_locked_documents_rels_patient_medicines_id_idx" ON "payload_locked_documents_rels" USING btree ("patient_medicines_id");
  CREATE INDEX "payload_locked_documents_rels_patient_payments_id_idx" ON "payload_locked_documents_rels" USING btree ("patient_payments_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "patient_appointments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "consultation_records" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "consultation_records_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "treatment_plans" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "patient_medicines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "patient_payments" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "patient_appointments" CASCADE;
  DROP TABLE "consultation_records" CASCADE;
  DROP TABLE "consultation_records_rels" CASCADE;
  DROP TABLE "treatment_plans" CASCADE;
  DROP TABLE "patient_medicines" CASCADE;
  DROP TABLE "patient_payments" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_patient_appointments_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_consultation_records_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_treatment_plans_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_patient_medicines_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_patient_payments_fk";
  
  DROP INDEX "patients_patient_code_idx";
  DROP INDEX "payload_locked_documents_rels_patient_appointments_id_idx";
  DROP INDEX "payload_locked_documents_rels_consultation_records_id_idx";
  DROP INDEX "payload_locked_documents_rels_treatment_plans_id_idx";
  DROP INDEX "payload_locked_documents_rels_patient_medicines_id_idx";
  DROP INDEX "payload_locked_documents_rels_patient_payments_id_idx";
  ALTER TABLE "patients" DROP COLUMN "patient_code";
  ALTER TABLE "patients" DROP COLUMN "date_of_birth";
  ALTER TABLE "patients" DROP COLUMN "gender";
  ALTER TABLE "patients" DROP COLUMN "address";
  ALTER TABLE "patients" DROP COLUMN "guardian_name";
  ALTER TABLE "patients" DROP COLUMN "guardian_relationship";
  ALTER TABLE "patients" DROP COLUMN "emergency_contact";
  ALTER TABLE "patients" DROP COLUMN "reported_allergies";
  ALTER TABLE "patients" DROP COLUMN "reported_diagnoses";
  ALTER TABLE "patients" DROP COLUMN "current_prescribed_medicines";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "patient_appointments_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "consultation_records_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "treatment_plans_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "patient_medicines_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "patient_payments_id";
  DROP TYPE "public"."enum_patients_gender";
  DROP TYPE "public"."enum_patient_appointments_appointment_type";
  DROP TYPE "public"."enum_patient_appointments_status";
  DROP TYPE "public"."enum_consultation_records_consultation_type";
  DROP TYPE "public"."enum_treatment_plans_status";
  DROP TYPE "public"."enum_patient_medicines_source_type";
  DROP TYPE "public"."enum_patient_medicines_status";
  DROP TYPE "public"."enum_patient_medicines_fulfilment";
  DROP TYPE "public"."enum_patient_payments_currency";
  DROP TYPE "public"."enum_patient_payments_status";
  DROP TYPE "public"."enum_patient_payments_payment_method";`)
}
