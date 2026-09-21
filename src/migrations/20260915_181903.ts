import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_medical_kits_currency" AS ENUM('PKR', 'USD', 'GBP', 'AED');
  CREATE TYPE "public"."enum_medical_kits_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__medical_kits_v_version_currency" AS ENUM('PKR', 'USD', 'GBP', 'AED');
  CREATE TYPE "public"."enum__medical_kits_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "kit_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"benefit" varchar
  );
  
  CREATE TABLE "medical_kits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"keywords" varchar,
  	"image_id" integer,
  	"price" numeric,
  	"currency" "enum_medical_kits_currency" DEFAULT 'PKR',
  	"safety_notice" varchar,
  	"featured" boolean DEFAULT false,
  	"active" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_canonical_u_r_l" varchar,
  	"seo_share_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_medical_kits_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_kit_benefits_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"benefit" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_medical_kits_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_keywords" varchar,
  	"version_image_id" integer,
  	"version_price" numeric,
  	"version_currency" "enum__medical_kits_v_version_currency" DEFAULT 'PKR',
  	"version_safety_notice" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_active" boolean DEFAULT true,
  	"version_order" numeric DEFAULT 0,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_canonical_u_r_l" varchar,
  	"version_seo_share_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__medical_kits_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "medical_kits_id" integer;
  ALTER TABLE "kit_benefits" ADD CONSTRAINT "kit_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."medical_kits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medical_kits" ADD CONSTRAINT "medical_kits_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medical_kits" ADD CONSTRAINT "medical_kits_seo_share_image_id_media_id_fk" FOREIGN KEY ("seo_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_kit_benefits_v" ADD CONSTRAINT "_kit_benefits_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_medical_kits_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_medical_kits_v" ADD CONSTRAINT "_medical_kits_v_parent_id_medical_kits_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."medical_kits"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_medical_kits_v" ADD CONSTRAINT "_medical_kits_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_medical_kits_v" ADD CONSTRAINT "_medical_kits_v_version_seo_share_image_id_media_id_fk" FOREIGN KEY ("version_seo_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "kit_benefits_order_idx" ON "kit_benefits" USING btree ("_order");
  CREATE INDEX "kit_benefits_parent_id_idx" ON "kit_benefits" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "medical_kits_slug_idx" ON "medical_kits" USING btree ("slug");
  CREATE INDEX "medical_kits_image_idx" ON "medical_kits" USING btree ("image_id");
  CREATE INDEX "medical_kits_featured_idx" ON "medical_kits" USING btree ("featured");
  CREATE INDEX "medical_kits_active_idx" ON "medical_kits" USING btree ("active");
  CREATE INDEX "medical_kits_order_idx" ON "medical_kits" USING btree ("order");
  CREATE INDEX "medical_kits_seo_seo_share_image_idx" ON "medical_kits" USING btree ("seo_share_image_id");
  CREATE INDEX "medical_kits_updated_at_idx" ON "medical_kits" USING btree ("updated_at");
  CREATE INDEX "medical_kits_created_at_idx" ON "medical_kits" USING btree ("created_at");
  CREATE INDEX "medical_kits__status_idx" ON "medical_kits" USING btree ("_status");
  CREATE INDEX "_kit_benefits_v_order_idx" ON "_kit_benefits_v" USING btree ("_order");
  CREATE INDEX "_kit_benefits_v_parent_id_idx" ON "_kit_benefits_v" USING btree ("_parent_id");
  CREATE INDEX "_medical_kits_v_parent_idx" ON "_medical_kits_v" USING btree ("parent_id");
  CREATE INDEX "_medical_kits_v_version_version_slug_idx" ON "_medical_kits_v" USING btree ("version_slug");
  CREATE INDEX "_medical_kits_v_version_version_image_idx" ON "_medical_kits_v" USING btree ("version_image_id");
  CREATE INDEX "_medical_kits_v_version_version_featured_idx" ON "_medical_kits_v" USING btree ("version_featured");
  CREATE INDEX "_medical_kits_v_version_version_active_idx" ON "_medical_kits_v" USING btree ("version_active");
  CREATE INDEX "_medical_kits_v_version_version_order_idx" ON "_medical_kits_v" USING btree ("version_order");
  CREATE INDEX "_medical_kits_v_version_seo_version_seo_share_image_idx" ON "_medical_kits_v" USING btree ("version_seo_share_image_id");
  CREATE INDEX "_medical_kits_v_version_version_updated_at_idx" ON "_medical_kits_v" USING btree ("version_updated_at");
  CREATE INDEX "_medical_kits_v_version_version_created_at_idx" ON "_medical_kits_v" USING btree ("version_created_at");
  CREATE INDEX "_medical_kits_v_version_version__status_idx" ON "_medical_kits_v" USING btree ("version__status");
  CREATE INDEX "_medical_kits_v_created_at_idx" ON "_medical_kits_v" USING btree ("created_at");
  CREATE INDEX "_medical_kits_v_updated_at_idx" ON "_medical_kits_v" USING btree ("updated_at");
  CREATE INDEX "_medical_kits_v_latest_idx" ON "_medical_kits_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_medical_kits_fk" FOREIGN KEY ("medical_kits_id") REFERENCES "public"."medical_kits"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_medical_kits_id_idx" ON "payload_locked_documents_rels" USING btree ("medical_kits_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "kit_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "medical_kits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_kit_benefits_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_medical_kits_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "kit_benefits" CASCADE;
  DROP TABLE "medical_kits" CASCADE;
  DROP TABLE "_kit_benefits_v" CASCADE;
  DROP TABLE "_medical_kits_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_medical_kits_fk";
  
  DROP INDEX "payload_locked_documents_rels_medical_kits_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "medical_kits_id";
  DROP TYPE "public"."enum_medical_kits_currency";
  DROP TYPE "public"."enum_medical_kits_status";
  DROP TYPE "public"."enum__medical_kits_v_version_currency";
  DROP TYPE "public"."enum__medical_kits_v_version_status";`)
}
