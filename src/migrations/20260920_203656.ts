import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_expenses_currency" AS ENUM('PKR', 'USD', 'GBP', 'AED');
  CREATE TYPE "public"."enum_expenses_status" AS ENUM('paid', 'pending', 'reimbursed', 'cancelled');
  CREATE TYPE "public"."enum_expenses_payment_method" AS ENUM('cash', 'bank-transfer', 'card', 'easypaisa', 'jazzcash', 'cheque', 'other');
  CREATE TYPE "public"."enum_expenses_recurrence" AS ENUM('weekly', 'monthly', 'quarterly', 'yearly');
  CREATE TABLE "expense_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"monthly_budget" numeric,
  	"active" boolean DEFAULT true NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "expenses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"category_id" integer NOT NULL,
  	"expense_date" timestamp(3) with time zone NOT NULL,
  	"amount" numeric NOT NULL,
  	"currency" "enum_expenses_currency" DEFAULT 'PKR' NOT NULL,
  	"status" "enum_expenses_status" DEFAULT 'paid' NOT NULL,
  	"payment_method" "enum_expenses_payment_method" DEFAULT 'cash' NOT NULL,
  	"vendor" varchar,
  	"reference_number" varchar,
  	"receipt_id" integer,
  	"recurring" boolean DEFAULT false NOT NULL,
  	"recurrence" "enum_expenses_recurrence",
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "expense_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "expenses_id" integer;
  ALTER TABLE "expenses" ADD CONSTRAINT "expenses_category_id_expense_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."expense_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "expenses" ADD CONSTRAINT "expenses_receipt_id_media_id_fk" FOREIGN KEY ("receipt_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "expense_categories_name_idx" ON "expense_categories" USING btree ("name");
  CREATE UNIQUE INDEX "expense_categories_slug_idx" ON "expense_categories" USING btree ("slug");
  CREATE INDEX "expense_categories_active_idx" ON "expense_categories" USING btree ("active");
  CREATE INDEX "expense_categories_order_idx" ON "expense_categories" USING btree ("order");
  CREATE INDEX "expense_categories_updated_at_idx" ON "expense_categories" USING btree ("updated_at");
  CREATE INDEX "expense_categories_created_at_idx" ON "expense_categories" USING btree ("created_at");
  CREATE INDEX "expenses_title_idx" ON "expenses" USING btree ("title");
  CREATE INDEX "expenses_category_idx" ON "expenses" USING btree ("category_id");
  CREATE INDEX "expenses_expense_date_idx" ON "expenses" USING btree ("expense_date");
  CREATE INDEX "expenses_amount_idx" ON "expenses" USING btree ("amount");
  CREATE INDEX "expenses_status_idx" ON "expenses" USING btree ("status");
  CREATE INDEX "expenses_payment_method_idx" ON "expenses" USING btree ("payment_method");
  CREATE INDEX "expenses_vendor_idx" ON "expenses" USING btree ("vendor");
  CREATE INDEX "expenses_reference_number_idx" ON "expenses" USING btree ("reference_number");
  CREATE INDEX "expenses_receipt_idx" ON "expenses" USING btree ("receipt_id");
  CREATE INDEX "expenses_updated_at_idx" ON "expenses" USING btree ("updated_at");
  CREATE INDEX "expenses_created_at_idx" ON "expenses" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_expense_categories_fk" FOREIGN KEY ("expense_categories_id") REFERENCES "public"."expense_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_expenses_fk" FOREIGN KEY ("expenses_id") REFERENCES "public"."expenses"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_expense_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("expense_categories_id");
  CREATE INDEX "payload_locked_documents_rels_expenses_id_idx" ON "payload_locked_documents_rels" USING btree ("expenses_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "expense_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "expenses" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "expense_categories" CASCADE;
  DROP TABLE "expenses" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_expense_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_expenses_fk";
  
  DROP INDEX "payload_locked_documents_rels_expense_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_expenses_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "expense_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "expenses_id";
  DROP TYPE "public"."enum_expenses_currency";
  DROP TYPE "public"."enum_expenses_status";
  DROP TYPE "public"."enum_expenses_payment_method";
  DROP TYPE "public"."enum_expenses_recurrence";`)
}
