import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "development_concerns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"concern" varchar NOT NULL
  );
  
  ALTER TABLE "development_concerns" ADD CONSTRAINT "development_concerns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "development_concerns_order_idx" ON "development_concerns" USING btree ("_order");
  CREATE INDEX "development_concerns_parent_id_idx" ON "development_concerns" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "development_concerns" CASCADE;`)
}
