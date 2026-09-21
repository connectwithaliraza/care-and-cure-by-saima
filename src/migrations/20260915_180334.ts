import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_support_topics_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__support_topics_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pages_page_type" AS ENUM('general', 'consultation', 'legal');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_page_type" AS ENUM('general', 'consultation', 'legal');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "support_discussion_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"point" varchar
  );
  
  CREATE TABLE "support_topics" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"eyebrow" varchar DEFAULT 'Developmental and behavioral support',
  	"summary" varchar,
  	"overview" varchar,
  	"when_to_seek_care" varchar,
  	"featured_image_id" integer,
  	"order" numeric DEFAULT 0,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_canonical_u_r_l" varchar,
  	"seo_share_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_support_topics_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_support_discussion_points_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"point" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_support_topics_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_eyebrow" varchar DEFAULT 'Developmental and behavioral support',
  	"version_summary" varchar,
  	"version_overview" varchar,
  	"version_when_to_seek_care" varchar,
  	"version_featured_image_id" integer,
  	"version_order" numeric DEFAULT 0,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_canonical_u_r_l" varchar,
  	"version_seo_share_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__support_topics_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "page_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"highlight" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"page_type" "enum_pages_page_type" DEFAULT 'general',
  	"summary" varchar,
  	"content" varchar,
  	"show_appointment_c_t_a" boolean DEFAULT false,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_canonical_u_r_l" varchar,
  	"seo_share_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_page_highlights_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"highlight" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_page_type" "enum__pages_v_version_page_type" DEFAULT 'general',
  	"version_summary" varchar,
  	"version_content" varchar,
  	"version_show_appointment_c_t_a" boolean DEFAULT false,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_canonical_u_r_l" varchar,
  	"version_seo_share_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "blog_posts" ADD COLUMN "seo_canonical_u_r_l" varchar;
  ALTER TABLE "blog_posts" ADD COLUMN "seo_share_image_id" integer;
  ALTER TABLE "blog_posts" ADD COLUMN "seo_no_index" boolean DEFAULT false;
  ALTER TABLE "_blog_posts_v" ADD COLUMN "version_seo_canonical_u_r_l" varchar;
  ALTER TABLE "_blog_posts_v" ADD COLUMN "version_seo_share_image_id" integer;
  ALTER TABLE "_blog_posts_v" ADD COLUMN "version_seo_no_index" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "support_topics_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "development_concerns" ADD COLUMN "url" varchar;
  ALTER TABLE "support_discussion_points" ADD CONSTRAINT "support_discussion_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."support_topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "support_topics" ADD CONSTRAINT "support_topics_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "support_topics" ADD CONSTRAINT "support_topics_seo_share_image_id_media_id_fk" FOREIGN KEY ("seo_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_support_discussion_points_v" ADD CONSTRAINT "_support_discussion_points_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_support_topics_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_support_topics_v" ADD CONSTRAINT "_support_topics_v_parent_id_support_topics_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."support_topics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_support_topics_v" ADD CONSTRAINT "_support_topics_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_support_topics_v" ADD CONSTRAINT "_support_topics_v_version_seo_share_image_id_media_id_fk" FOREIGN KEY ("version_seo_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_highlights" ADD CONSTRAINT "page_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_share_image_id_media_id_fk" FOREIGN KEY ("seo_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_highlights_v" ADD CONSTRAINT "_page_highlights_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_seo_share_image_id_media_id_fk" FOREIGN KEY ("version_seo_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "support_discussion_points_order_idx" ON "support_discussion_points" USING btree ("_order");
  CREATE INDEX "support_discussion_points_parent_id_idx" ON "support_discussion_points" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "support_topics_slug_idx" ON "support_topics" USING btree ("slug");
  CREATE INDEX "support_topics_featured_image_idx" ON "support_topics" USING btree ("featured_image_id");
  CREATE INDEX "support_topics_order_idx" ON "support_topics" USING btree ("order");
  CREATE INDEX "support_topics_seo_seo_share_image_idx" ON "support_topics" USING btree ("seo_share_image_id");
  CREATE INDEX "support_topics_updated_at_idx" ON "support_topics" USING btree ("updated_at");
  CREATE INDEX "support_topics_created_at_idx" ON "support_topics" USING btree ("created_at");
  CREATE INDEX "support_topics__status_idx" ON "support_topics" USING btree ("_status");
  CREATE INDEX "_support_discussion_points_v_order_idx" ON "_support_discussion_points_v" USING btree ("_order");
  CREATE INDEX "_support_discussion_points_v_parent_id_idx" ON "_support_discussion_points_v" USING btree ("_parent_id");
  CREATE INDEX "_support_topics_v_parent_idx" ON "_support_topics_v" USING btree ("parent_id");
  CREATE INDEX "_support_topics_v_version_version_slug_idx" ON "_support_topics_v" USING btree ("version_slug");
  CREATE INDEX "_support_topics_v_version_version_featured_image_idx" ON "_support_topics_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_support_topics_v_version_version_order_idx" ON "_support_topics_v" USING btree ("version_order");
  CREATE INDEX "_support_topics_v_version_seo_version_seo_share_image_idx" ON "_support_topics_v" USING btree ("version_seo_share_image_id");
  CREATE INDEX "_support_topics_v_version_version_updated_at_idx" ON "_support_topics_v" USING btree ("version_updated_at");
  CREATE INDEX "_support_topics_v_version_version_created_at_idx" ON "_support_topics_v" USING btree ("version_created_at");
  CREATE INDEX "_support_topics_v_version_version__status_idx" ON "_support_topics_v" USING btree ("version__status");
  CREATE INDEX "_support_topics_v_created_at_idx" ON "_support_topics_v" USING btree ("created_at");
  CREATE INDEX "_support_topics_v_updated_at_idx" ON "_support_topics_v" USING btree ("updated_at");
  CREATE INDEX "_support_topics_v_latest_idx" ON "_support_topics_v" USING btree ("latest");
  CREATE INDEX "page_highlights_order_idx" ON "page_highlights" USING btree ("_order");
  CREATE INDEX "page_highlights_parent_id_idx" ON "page_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_seo_seo_share_image_idx" ON "pages" USING btree ("seo_share_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_page_highlights_v_order_idx" ON "_page_highlights_v" USING btree ("_order");
  CREATE INDEX "_page_highlights_v_parent_id_idx" ON "_page_highlights_v" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_seo_version_seo_share_image_idx" ON "_pages_v" USING btree ("version_seo_share_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_seo_share_image_id_media_id_fk" FOREIGN KEY ("seo_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_version_seo_share_image_id_media_id_fk" FOREIGN KEY ("version_seo_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_support_topics_fk" FOREIGN KEY ("support_topics_id") REFERENCES "public"."support_topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "blog_posts_seo_seo_share_image_idx" ON "blog_posts" USING btree ("seo_share_image_id");
  CREATE INDEX "_blog_posts_v_version_seo_version_seo_share_image_idx" ON "_blog_posts_v" USING btree ("version_seo_share_image_id");
  CREATE INDEX "payload_locked_documents_rels_support_topics_id_idx" ON "payload_locked_documents_rels" USING btree ("support_topics_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "support_discussion_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "support_topics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_support_discussion_points_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_support_topics_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_highlights_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "support_discussion_points" CASCADE;
  DROP TABLE "support_topics" CASCADE;
  DROP TABLE "_support_discussion_points_v" CASCADE;
  DROP TABLE "_support_topics_v" CASCADE;
  DROP TABLE "page_highlights" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_page_highlights_v" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_seo_share_image_id_media_id_fk";
  
  ALTER TABLE "_blog_posts_v" DROP CONSTRAINT "_blog_posts_v_version_seo_share_image_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_support_topics_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_fk";
  
  DROP INDEX "blog_posts_seo_seo_share_image_idx";
  DROP INDEX "_blog_posts_v_version_seo_version_seo_share_image_idx";
  DROP INDEX "payload_locked_documents_rels_support_topics_id_idx";
  DROP INDEX "payload_locked_documents_rels_pages_id_idx";
  ALTER TABLE "blog_posts" DROP COLUMN "seo_canonical_u_r_l";
  ALTER TABLE "blog_posts" DROP COLUMN "seo_share_image_id";
  ALTER TABLE "blog_posts" DROP COLUMN "seo_no_index";
  ALTER TABLE "_blog_posts_v" DROP COLUMN "version_seo_canonical_u_r_l";
  ALTER TABLE "_blog_posts_v" DROP COLUMN "version_seo_share_image_id";
  ALTER TABLE "_blog_posts_v" DROP COLUMN "version_seo_no_index";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "support_topics_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pages_id";
  ALTER TABLE "development_concerns" DROP COLUMN "url";
  DROP TYPE "public"."enum_support_topics_status";
  DROP TYPE "public"."enum__support_topics_v_version_status";
  DROP TYPE "public"."enum_pages_page_type";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_page_type";
  DROP TYPE "public"."enum__pages_v_version_status";`)
}
