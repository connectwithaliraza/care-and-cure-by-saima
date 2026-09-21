import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "expenses" ALTER COLUMN "currency" SET DATA TYPE text;
  ALTER TABLE "expenses" ALTER COLUMN "currency" SET DEFAULT 'PKR'::text;
  DROP TYPE "public"."enum_expenses_currency";
  CREATE TYPE "public"."enum_expenses_currency" AS ENUM('PKR');
  ALTER TABLE "expenses" ALTER COLUMN "currency" SET DEFAULT 'PKR'::"public"."enum_expenses_currency";
  ALTER TABLE "expenses" ALTER COLUMN "currency" SET DATA TYPE "public"."enum_expenses_currency" USING "currency"::"public"."enum_expenses_currency";
  ALTER TABLE "expenses" ALTER COLUMN "title" DROP NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_expenses_currency" ADD VALUE 'USD';
  ALTER TYPE "public"."enum_expenses_currency" ADD VALUE 'GBP';
  ALTER TYPE "public"."enum_expenses_currency" ADD VALUE 'AED';
  ALTER TABLE "expenses" ALTER COLUMN "title" SET NOT NULL;`)
}
