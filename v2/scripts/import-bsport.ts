/**
 * Bsport → V2 migration CLI.
 *
 * Usage:
 *   npx tsx scripts/import-bsport.ts --source=fixture --dry-run
 *   npx tsx scripts/import-bsport.ts --source=fixture            # write to DB
 *   npx tsx scripts/import-bsport.ts --source=api --dry-run
 *   npx tsx scripts/import-bsport.ts --source=api --with-bookings --send-emails
 *
 * Flags:
 *   --source=fixture|api|csv     (default: fixture)
 *   --dir=path                    (where fixtures or csv live; default ./scripts/bsport-fixtures)
 *   --dry-run                     (no writes; print what would change)
 *   --only=clients,cards,bookings (subset; default: clients,cards)
 *   --with-bookings               (shorthand to add bookings to default --only)
 *   --send-emails                 (send "Activate your account" emails — default OFF)
 *   --batch-id=xxx                (override; default: auto-generated)
 *   --limit=N                     (stop after N records per resource — for testing)
 *   --reset                       (DESTRUCTIVE: deletes ALL Bsport-imported
 *                                  users + their cards before re-creating from
 *                                  source. V2-native users are NEVER touched.
 *                                  Useful when re-importing fixtures during
 *                                  development OR when re-running the real
 *                                  import after fixing data quality issues.)
 *
 * Output: prints a summary table, writes a MigrationBatch row with stats/errors,
 * and writes a JSON report to ./migration-report-{batchId}.json.
 */
import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"
import {
  BsportClientSchema,
  BsportClientPassSchema,
  BsportBookingSchema,
  BsportPassTemplateSchema,
  normalizeClient,
  normalizeClientPass,
  normalizePassTemplate,
  type BsportClient,
  type BsportClientPass,
  type BsportBooking,
  type BsportPassTemplate,
} from "../src/lib/bsport-schemas"
import { bsportFromEnv, BsportClient as BsportApiClient } from "../src/lib/bsport"

type Resource = "clients" | "cards" | "bookings"
interface Args {
  source: "fixture" | "api" | "csv"
  dir: string
  dryRun: boolean
  only: Set<Resource>
  sendEmails: boolean
  batchId: string
  limit: number | null
  reset: boolean
}

function parseArgs(): Args {
  const argv = process.argv.slice(2)
  const get = (name: string): string | undefined => {
    const eq = argv.find((a) => a.startsWith(`--${name}=`))
    if (eq) return eq.slice(name.length + 3)
    const idx = argv.indexOf(`--${name}`)
    return idx >= 0 ? "true" : undefined
  }
  const source = (get("source") ?? "fixture") as Args["source"]
  if (!["fixture", "api", "csv"].includes(source)) throw new Error(`Invalid --source: ${source}`)
  const onlyRaw = get("only")
  const withBookings = get("with-bookings") === "true"
  const only: Set<Resource> = onlyRaw
    ? new Set(onlyRaw.split(",").map((s) => s.trim() as Resource))
    : new Set<Resource>(["clients", "cards"])
  if (withBookings) only.add("bookings")
  return {
    source,
    dir: get("dir") ?? path.resolve(__dirname, "bsport-fixtures"),
    dryRun: get("dry-run") === "true",
    only,
    sendEmails: get("send-emails") === "true",
    batchId: get("batch-id") ?? `bsport_${source}_${new Date().toISOString().slice(0, 10)}_${crypto.randomBytes(3).toString("hex")}`,
    limit: get("limit") ? parseInt(get("limit")!, 10) : null,
    reset: get("reset") === "true",
  }
}

/**
 * DESTRUCTIVE: delete every Bsport-imported user (and their cards/bookings,
 * which cascade) so the next import is a clean slate. V2-native users
 * (migrationSource = "V2_NATIVE" or NULL) are NEVER touched.
 *
 * Skipped automatically in --dry-run mode.
 */
async function resetBsportData(): Promise<{ usersDeleted: number; cardsDeleted: number; paymentsDeleted: number }> {
  // Cards + bookings cascade with the user (onDelete: Cascade in schema).
  // We count BEFORE deletion to report accurately.
  const [usersCount, cardsCount, paymentsCount] = await Promise.all([
    PRISMA.user.count({ where: { migrationSource: "BSPORT_IMPORT" } }),
    PRISMA.courseCard.count({ where: { bsportId: { not: null } } }),
    PRISMA.payment.count({ where: { bsportId: { not: null } } }),
  ])
  if (usersCount === 0 && cardsCount === 0) {
    return { usersDeleted: 0, cardsDeleted: 0, paymentsDeleted: 0 }
  }
  // Delete in a single transaction so a failure doesn't leave the DB in a
  // half-wiped state.
  await PRISMA.$transaction([
    PRISMA.user.deleteMany({ where: { migrationSource: "BSPORT_IMPORT" } }),
    // Orphan cards (without a Bsport-imported user but still tagged) — defensive
    PRISMA.courseCard.deleteMany({ where: { bsportId: { not: null } } }),
    PRISMA.payment.deleteMany({ where: { bsportId: { not: null } } }),
  ])
  return { usersDeleted: usersCount, cardsDeleted: cardsCount, paymentsDeleted: paymentsCount }
}

/* ---------- Source loaders ---------- */

interface SourceData {
  clients: BsportClient[]
  passTemplates: BsportPassTemplate[]
  clientPasses: BsportClientPass[]
  bookings: BsportBooking[]
}

async function loadFromFixtures(dir: string, limit: number | null): Promise<SourceData> {
  const readJson = <T>(name: string, schema: z.ZodSchema<T>): T[] => {
    const file = path.join(dir, name)
    if (!fs.existsSync(file)) {
      console.warn(`  ⚠ no ${name} fixture found at ${file} — using []`)
      return []
    }
    const raw = JSON.parse(fs.readFileSync(file, "utf8"))
    const arr = Array.isArray(raw) ? raw : [raw]
    return arr.map((r, i) => {
      const parsed = schema.safeParse(r)
      if (!parsed.success) {
        throw new Error(`Invalid ${name}[${i}]: ${parsed.error.message}`)
      }
      return parsed.data
    })
  }
  const clients = readJson("clients.json", BsportClientSchema)
  const passTemplates = readJson("passes.json", BsportPassTemplateSchema)
  const clientPasses = readJson("client-passes.json", BsportClientPassSchema)
  const bookings = readJson("bookings.json", BsportBookingSchema)
  return {
    clients: limit ? clients.slice(0, limit) : clients,
    passTemplates,
    clientPasses: limit ? clientPasses.slice(0, limit) : clientPasses,
    bookings: limit ? bookings.slice(0, limit) : bookings,
  }
}

async function loadFromApi(limit: number | null): Promise<SourceData> {
  const client = bsportFromEnv()
  if (!client) {
    throw new Error("BSPORT_API_KEY / BSPORT_CLIENT_ID / BSPORT_COMPANY_ID missing in env. See README.")
  }
  console.log("→ fetching from Bsport API…")
  const collect = async <T>(label: string, path: string, schema: z.ZodSchema<T>): Promise<T[]> => {
    const out: T[] = []
    let i = 0
    for await (const raw of client.listAll(path)) {
      const parsed = schema.safeParse(raw)
      if (!parsed.success) {
        console.warn(`  ⚠ skipping invalid ${label} record: ${parsed.error.issues[0]?.message}`)
        continue
      }
      out.push(parsed.data)
      i++
      if (limit && i >= limit) break
    }
    console.log(`  ✓ ${out.length} ${label}`)
    return out
  }
  const clients = await collect("clients", "/api/v1/management/clients/", BsportClientSchema)
  const passTemplates = await collect("pass templates", "/api/v1/management/passes/", BsportPassTemplateSchema)
  const clientPasses = await collect("client passes", "/api/v1/management/client-passes/", BsportClientPassSchema)
  const bookings = await collect("bookings", "/api/v1/management/bookings/", BsportBookingSchema)
  return { clients, passTemplates, clientPasses, bookings }
}

async function loadFromCsv(_dir: string, _limit: number | null): Promise<SourceData> {
  // CSV parser deferred — see scripts/parse-bsport-csv.ts (TODO).
  // CSVs from a Bsport admin export typically come as one file per resource
  // (clients.csv, passes.csv, bookings.csv). We'll add a Papaparse-based
  // converter once the user shares an example export.
  throw new Error("--source=csv not implemented yet. Use --source=fixture or --source=api for now.")
}

async function loadSource(args: Args): Promise<SourceData> {
  if (args.source === "fixture") return loadFromFixtures(args.dir, args.limit)
  if (args.source === "api") return loadFromApi(args.limit)
  return loadFromCsv(args.dir, args.limit)
}

/* ---------- Importer ---------- */

interface Stats {
  created: number
  updated: number
  skipped: number
  errored: number
}
interface ImportError {
  resource: Resource
  sourceId: number | string
  message: string
}

const PRISMA = new PrismaClient()

/**
 * Map a Bsport client → V2 User, idempotent on bsportId (then email as
 * fallback). Imported users get a placeholder password hash and
 * needsActivation=true; they MUST go through the email reset flow.
 */
async function importClients(
  clients: BsportClient[],
  args: Args,
  stats: Stats,
  errors: ImportError[],
): Promise<Map<number, string>> {
  // Returns: bsportClientId → V2 userId
  const idMap = new Map<number, string>()
  console.log(`\n[clients] processing ${clients.length} records…`)
  for (const c of clients) {
    try {
      // normalizeClient resolves snake_case (prod) vs camelCase (OpenAPI)
      // field name variants and synthesizes a fullname when only first/last
      // are present.
      const n = normalizeClient(c)
      // Skip clients without a valid email — V2 users require non-null
      // unique email and these are usually walk-ins / POS-created members
      // that never registered online. Tracked in errors[] for visibility.
      if (!n.email) {
        stats.skipped++
        errors.push({ resource: "clients", sourceId: c.id, message: `no valid email — skipped (likely a POS walk-in)` })
        continue
      }
      // Birthday: Bsport returns ISO date string ("1985-03-12") or null.
      // Convert to a Date object only if valid; otherwise leave undefined
      // so Prisma keeps the column NULL.
      const birthdayRaw = c.birthday ?? c.birth_date ?? null
      const birthday = birthdayRaw && /^\d{4}-\d{2}-\d{2}/.test(birthdayRaw) ? new Date(birthdayRaw) : undefined
      const data = {
        email: n.email.toLowerCase().trim(),
        name: n.fullname || n.email,
        phone: n.phone,
        birthday,
        bsportId: n.id,
        // Webhooks (booking/invoice) reference the consumer id, not the
        // per-studio member id. Store both so webhook lookups work.
        bsportConsumerId: c.consumer ?? null,
        migratedAt: new Date(),
        migrationSource: "BSPORT_IMPORT",
        needsActivation: true,
      }
      if (args.dryRun) {
        const existing = await PRISMA.user.findFirst({ where: { OR: [{ bsportId: c.id }, { email: data.email }] } })
        if (existing) {
          stats.updated++
          idMap.set(c.id, existing.id)
        } else {
          stats.created++
          idMap.set(c.id, `dry-${c.id}`)
        }
        continue
      }
      // Upsert: prefer bsportId (already-migrated) over email (V2-native).
      const existing = await PRISMA.user.findFirst({ where: { OR: [{ bsportId: c.id }, { email: data.email }] } })
      if (existing) {
        // CRITICAL: never overwrite migrationSource on an existing user.
        // The first ever import of a V2-native user (admin/instructor with
        // a matching email) sets bsportId for webhook routing, but their
        // migrationSource MUST stay V2_NATIVE so the next --reset doesn't
        // wipe them. We only update profile fields + bsport linkage —
        // migrationSource is set ONLY on CREATE below.
        const { migrationSource: _drop, ...updateData } = data
        void _drop
        const updated = await PRISMA.user.update({
          where: { id: existing.id },
          data: existing.bsportId === c.id
            ? updateData                                  // pure profile/link update
            : { bsportId: c.id, migratedAt: new Date() }, // first link from email match
        })
        idMap.set(c.id, updated.id)
        stats.updated++
      } else {
        // Random placeholder hash — user can never log in until they reset password
        const placeholderHash = `migrated:${crypto.randomBytes(16).toString("hex")}`
        const created = await PRISMA.user.create({
          data: { ...data, passwordHash: placeholderHash },
        })
        idMap.set(c.id, created.id)
        stats.created++
      }
    } catch (e) {
      stats.errored++
      errors.push({ resource: "clients", sourceId: c.id, message: (e as Error).message })
    }
  }
  console.log(`  → ${stats.created} created, ${stats.updated} updated, ${stats.errored} errored`)
  return idMap
}

/**
 * Map a Bsport client_pass → V2 CourseCard. We require the pass template
 * (passes.json) so we can compute totalSessions correctly. If a card is
 * disabled in Bsport, we set V2 status implicitly via remainingSessions=0.
 */
async function importCards(
  clientPasses: BsportClientPass[],
  passTemplates: BsportPassTemplate[],
  userIdMap: Map<number, string>,
  args: Args,
  stats: Stats,
  errors: ImportError[],
): Promise<void> {
  // Build a lookup map from normalized templates (prod uses `credits` not `credits_amount`)
  const templateMap = new Map<number, ReturnType<typeof normalizePassTemplate>>()
  for (const t of passTemplates) {
    const norm = normalizePassTemplate(t)
    templateMap.set(norm.id, norm)
  }
  console.log(`\n[cards] processing ${clientPasses.length} records…`)
  for (const p of clientPasses) {
    try {
      const np = normalizeClientPass(p)
      const userId = userIdMap.get(np.memberId)
      if (!userId) {
        stats.skipped++
        errors.push({ resource: "cards", sourceId: p.id, message: `unknown member_id ${np.memberId} (parent client not imported or archived)` })
        continue
      }
      const tpl = templateMap.get(np.passTemplateId)
      const totalSessions = tpl?.credits ?? (np.availableCredits + np.usedCredits)
      // Skip "unlimited" / 0-credit templates — they don't map to V2 CourseCard model
      if (totalSessions === 0) {
        stats.skipped++
        errors.push({ resource: "cards", sourceId: p.id, message: `pass template ${np.passTemplateId} has 0 credits (unlimited or wellpass-style)` })
        continue
      }
      const cardType = String(totalSessions)
      const data = {
        userId,
        type: cardType,
        totalSessions,
        remainingSessions: np.availableCredits,
        purchasedAt: new Date(np.purchasedDate),
        expiresAt: new Date(np.endingDate),
        bsportId: np.id,
      }
      if (args.dryRun) {
        const existing = await PRISMA.courseCard.findUnique({ where: { bsportId: p.id } })
        if (existing) stats.updated++
        else stats.created++
        continue
      }
      const existing = await PRISMA.courseCard.findUnique({ where: { bsportId: p.id } })
      if (existing) {
        await PRISMA.courseCard.update({ where: { id: existing.id }, data })
        stats.updated++
      } else {
        await PRISMA.courseCard.create({ data })
        stats.created++
      }
    } catch (e) {
      stats.errored++
      errors.push({ resource: "cards", sourceId: p.id, message: (e as Error).message })
    }
  }
  console.log(`  → ${stats.created} created, ${stats.updated} updated, ${stats.skipped} skipped, ${stats.errored} errored`)
}

/* ---------- Bookings: deferred (needs Schedule/Session mapping logic) ---------- */
async function importBookings(
  _bookings: BsportBooking[],
  _userIdMap: Map<number, string>,
  _args: Args,
  stats: Stats,
  errors: ImportError[],
): Promise<void> {
  // Booking import requires Session+Schedule reconstruction from session_start_at.
  // V2 Sessions are generated from Schedules; importing historical bookings
  // requires either (a) creating placeholder Sessions, or (b) matching to
  // existing V2 Sessions by date+time. Both paths need the V2 schedule to be
  // seeded first. Implementing in a follow-up pass once the user confirms
  // they want historical bookings vs. just future ones.
  console.log(`\n[bookings] not implemented yet (needs Schedule mapping). Skipped.`)
  stats.skipped += _bookings.length
  errors.push({ resource: "bookings", sourceId: "*", message: "booking import not implemented (TODO: Schedule reconstruction)" })
}

/* ---------- Entry point ---------- */

async function main() {
  const args = parseArgs()
  console.log("=".repeat(60))
  console.log(`Bsport → V2 import`)
  console.log(`  source:    ${args.source} (${args.source === "fixture" || args.source === "csv" ? args.dir : "API"})`)
  console.log(`  resources: ${[...args.only].join(", ")}`)
  console.log(`  dry run:   ${args.dryRun ? "YES (no DB writes)" : "no"}`)
  console.log(`  batch id:  ${args.batchId}`)
  console.log(`  emails:    ${args.sendEmails ? "WILL SEND" : "off (use --send-emails to enable)"}`)
  console.log(`  reset:     ${args.reset ? "YES (will WIPE all Bsport-imported users first)" : "no"}`)
  console.log("=".repeat(60))

  const data = await loadSource(args)
  console.log(`\nLoaded: ${data.clients.length} clients, ${data.passTemplates.length} pass templates, ${data.clientPasses.length} client passes, ${data.bookings.length} bookings`)

  // RESET — wipe Bsport-imported data before re-creating
  if (args.reset && !args.dryRun) {
    console.log(`\n⚠ --reset: wiping existing Bsport-imported data…`)
    const wiped = await resetBsportData()
    console.log(`  → deleted ${wiped.usersDeleted} users, ${wiped.cardsDeleted} cards, ${wiped.paymentsDeleted} payments (V2-native data untouched)`)
  } else if (args.reset && args.dryRun) {
    const counts = await Promise.all([
      PRISMA.user.count({ where: { migrationSource: "BSPORT_IMPORT" } }),
      PRISMA.courseCard.count({ where: { bsportId: { not: null } } }),
    ])
    console.log(`\n[dry-run] --reset would delete ${counts[0]} users + ${counts[1]} cards`)
  }

  // MigrationBatch row (skip in dry-run)
  let batch: { id: string } | null = null
  if (!args.dryRun) {
    batch = await PRISMA.migrationBatch.create({
      data: { id: args.batchId, source: `bsport_${args.source}${args.reset ? "+reset" : ""}`, status: "RUNNING" },
    })
  }

  const allStats: Record<Resource, Stats> = {
    clients: { created: 0, updated: 0, skipped: 0, errored: 0 },
    cards: { created: 0, updated: 0, skipped: 0, errored: 0 },
    bookings: { created: 0, updated: 0, skipped: 0, errored: 0 },
  }
  const errors: ImportError[] = []

  let userIdMap = new Map<number, string>()
  try {
    if (args.only.has("clients")) {
      userIdMap = await importClients(data.clients, args, allStats.clients, errors)
    }
    if (args.only.has("cards")) {
      await importCards(data.clientPasses, data.passTemplates, userIdMap, args, allStats.cards, errors)
    }
    if (args.only.has("bookings")) {
      await importBookings(data.bookings, userIdMap, args, allStats.bookings, errors)
    }

    // Persist final batch state
    if (batch) {
      await PRISMA.migrationBatch.update({
        where: { id: batch.id },
        data: {
          status: "DONE",
          finishedAt: new Date(),
          stats: JSON.stringify(allStats),
          errors: JSON.stringify(errors),
        },
      })
    }
  } catch (e) {
    if (batch) {
      await PRISMA.migrationBatch.update({
        where: { id: batch.id },
        data: { status: "FAILED", finishedAt: new Date(), stats: JSON.stringify(allStats), errors: JSON.stringify([...errors, { resource: "fatal", sourceId: "-", message: (e as Error).message }]) },
      })
    }
    throw e
  }

  // Write JSON report
  const reportPath = path.resolve(`./migration-report-${args.batchId}.json`)
  fs.writeFileSync(reportPath, JSON.stringify({ args, stats: allStats, errors }, null, 2))

  console.log("\n" + "=".repeat(60))
  console.log("✅ Import complete" + (args.dryRun ? " (dry-run, no DB changes)" : ""))
  for (const [resource, s] of Object.entries(allStats)) {
    if (!args.only.has(resource as Resource)) continue
    console.log(`  ${resource.padEnd(10)} created:${s.created.toString().padStart(4)} updated:${s.updated.toString().padStart(4)} skipped:${s.skipped.toString().padStart(4)} errored:${s.errored.toString().padStart(4)}`)
  }
  if (errors.length > 0) console.log(`  ⚠ ${errors.length} errors — see report`)
  console.log(`  📄 Report: ${reportPath}`)

  await PRISMA.$disconnect()
}

main().catch((e) => {
  console.error("\n❌ FATAL:", e)
  PRISMA.$disconnect().finally(() => process.exit(1))
})
