/**
 * Bypass `prisma db push` (which falsely reports "in sync") and directly
 * apply the Bsport migration via raw SQL. Idempotent — uses IF NOT EXISTS.
 */
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

const statements = [
  // User columns
  `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "bsportId" INTEGER`,
  `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "migratedAt" TIMESTAMP(3)`,
  `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "migrationSource" TEXT DEFAULT 'V2_NATIVE'`,
  `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "needsActivation" BOOLEAN NOT NULL DEFAULT false`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "User_bsportId_key" ON "User"("bsportId")`,

  // Booking
  `ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "bsportId" INTEGER`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Booking_bsportId_key" ON "Booking"("bsportId")`,

  // CourseCard
  `ALTER TABLE "CourseCard" ADD COLUMN IF NOT EXISTS "bsportId" INTEGER`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "CourseCard_bsportId_key" ON "CourseCard"("bsportId")`,
  // paymentId nullable (it was required before)
  `ALTER TABLE "CourseCard" ALTER COLUMN "paymentId" DROP NOT NULL`,

  // Payment
  `ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "bsportId" INTEGER`,
  `ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "externalProvider" TEXT`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Payment_bsportId_key" ON "Payment"("bsportId")`,

  // MigrationBatch table
  `CREATE TABLE IF NOT EXISTS "MigrationBatch" (
     "id" TEXT NOT NULL,
     "source" TEXT NOT NULL,
     "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
     "finishedAt" TIMESTAMP(3),
     "status" TEXT NOT NULL DEFAULT 'RUNNING',
     "stats" TEXT NOT NULL DEFAULT '{}',
     "errors" TEXT NOT NULL DEFAULT '[]',
     "triggeredBy" TEXT,
     CONSTRAINT "MigrationBatch_pkey" PRIMARY KEY ("id")
   )`,

  // BsportWebhookEvent table
  `CREATE TABLE IF NOT EXISTS "BsportWebhookEvent" (
     "eventKey" TEXT NOT NULL,
     "eventType" TEXT NOT NULL,
     "payload" TEXT NOT NULL,
     "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
     "processedAt" TIMESTAMP(3),
     "status" TEXT NOT NULL DEFAULT 'RECEIVED',
     "error" TEXT,
     CONSTRAINT "BsportWebhookEvent_pkey" PRIMARY KEY ("eventKey")
   )`,

  // Bsport "consumer" id — separate from member id, used by webhook payloads
  `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "bsportConsumerId" INTEGER`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "User_bsportConsumerId_key" ON "User"("bsportConsumerId")`,

  // Optional profile fields — birthday + address (all nullable)
  `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "birthday" DATE`,
  `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "addressLine" TEXT`,
  `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "postalCode" TEXT`,
  `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "city" TEXT`,
  `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "country" TEXT DEFAULT 'France'`,
];

let applied = 0;
let skipped = 0;
for (const sql of statements) {
  try {
    await p.$executeRawUnsafe(sql);
    const summary = sql.replace(/\s+/g, " ").slice(0, 80);
    console.log(`✓ ${summary}…`);
    applied++;
  } catch (e) {
    const msg = (e instanceof Error ? e.message : String(e)).slice(0, 120);
    if (msg.includes("already exists")) {
      console.log(`· skipped (exists): ${sql.slice(0, 60)}…`);
      skipped++;
    } else {
      console.error(`✗ ${sql.slice(0, 60)}… → ${msg}`);
    }
  }
}

console.log(`\n${applied} applied, ${skipped} skipped`);

// Verify
const cols = await p.$queryRawUnsafe(`
  SELECT column_name FROM information_schema.columns
  WHERE table_name='User' AND column_name IN ('bsportId','migratedAt','migrationSource','needsActivation')
  ORDER BY column_name
`);
console.log("\nUser Bsport columns now:", cols.map(c => c.column_name));
const tables = await p.$queryRawUnsafe(`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema='public' AND (table_name='MigrationBatch' OR table_name='BsportWebhookEvent')
`);
console.log("Migration tables now:", tables.map(t => t.table_name));

await p.$disconnect();
