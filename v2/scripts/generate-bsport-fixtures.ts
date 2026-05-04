/**
 * Generate realistic Bsport-shaped test fixtures.
 *
 * Creates `scripts/bsport-fixtures/clients.json` + `client-passes.json`
 * with N synthetic clients (default 280) using French names and varied
 * card states (empty, half-used, full, expired). Output is shaped EXACTLY
 * like the real Bsport API responses — so the import CLI runs the same
 * code path against fake or real data.
 *
 * Usage:
 *   npx tsx scripts/generate-bsport-fixtures.ts             # default 280 clients
 *   npx tsx scripts/generate-bsport-fixtures.ts --count=50  # smaller for fast tests
 *   npx tsx scripts/generate-bsport-fixtures.ts --seed=42   # deterministic output (reproducible runs)
 *
 * After generating: npx tsx scripts/import-bsport.ts --source=fixture
 */
import fs from "node:fs"
import path from "node:path"

const FIRST_NAMES_F = [
  "Marie", "Sophie", "Pauline", "Céline", "Anne", "Camille", "Julie", "Léa",
  "Marion", "Aurélie", "Sandrine", "Valérie", "Émilie", "Charlotte", "Inès",
  "Manon", "Clara", "Élise", "Margaux", "Audrey", "Hélène", "Nathalie",
  "Christine", "Caroline", "Florence", "Isabelle", "Catherine", "Sylvie",
  "Stéphanie", "Cécile", "Laurence", "Véronique", "Patricia", "Anne-Laure",
  "Marie-Claire", "Lucie", "Élodie", "Mathilde", "Justine", "Anaïs", "Chloé",
  "Sarah", "Eva", "Zoé", "Louise", "Emma", "Alice", "Romane", "Lola", "Jade",
]
const FIRST_NAMES_M = [
  "Pierre", "Jean", "Antoine", "Thomas", "Nicolas", "Julien", "Maxime",
  "Sébastien", "Olivier", "Romain", "Lucas", "Hugo", "Théo", "Arthur",
  "Vincent", "Étienne", "Mathieu", "Benjamin", "Alexandre", "Florian",
  "Guillaume", "François", "Bertrand", "Bruno", "Christophe", "Damien",
  "Fabien", "Frédéric", "Gilles", "Henri", "Laurent", "Marc", "Pascal",
]
const LAST_NAMES = [
  "Martin", "Bernard", "Dubois", "Thomas", "Robert", "Richard", "Petit",
  "Durand", "Leroy", "Moreau", "Simon", "Laurent", "Lefebvre", "Michel",
  "Garcia", "David", "Bertrand", "Roux", "Vincent", "Fournier", "Morel",
  "Girard", "André", "Mercier", "Dupont", "Lambert", "Bonnet", "François",
  "Martinez", "Legrand", "Rolland", "Lemoine", "Faure", "Henry", "Marchand",
  "Le Goff", "Le Roux", "Le Gall", "Tanguy", "Riou", "Guillou", "Quéré",
  "Le Bras", "Pennec", "Cariou", "Le Bihan", "Mahé", "Le Floch", "Le Roy",
]
const LARMOR_DOMAINS = [
  "gmail.com", "outlook.fr", "free.fr", "orange.fr", "yahoo.fr", "laposte.net",
  "wanadoo.fr", "sfr.fr", "icloud.com", "hotmail.fr",
]

interface Args {
  count: number
  seed: number
  outDir: string
}
function parseArgs(): Args {
  const argv = process.argv.slice(2)
  const get = (name: string) => {
    const eq = argv.find((a) => a.startsWith(`--${name}=`))
    return eq ? eq.slice(name.length + 3) : undefined
  }
  return {
    count: parseInt(get("count") ?? "280", 10),
    seed: parseInt(get("seed") ?? String(Date.now()), 10),
    outDir: get("out") ?? path.resolve(__dirname, "bsport-fixtures"),
  }
}

/**
 * Deterministic PRNG (mulberry32) — same seed = same output. Lets us
 * regenerate a stable fixture set across test runs without committing
 * thousands of lines of JSON noise.
 */
function makeRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]!
}
function int(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min
}
/** Slugify a French name for email local-part (strips accents). */
function slug(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z]/g, "")
}
function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}
function addDays(d: Date, n: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

function main() {
  const args = parseArgs()
  const rng = makeRng(args.seed)
  console.log(`Generating ${args.count} clients (seed=${args.seed}) → ${args.outDir}`)
  fs.mkdirSync(args.outDir, { recursive: true })

  /* ---------- clients ---------- */
  const clients = []
  const usedEmails = new Set<string>()
  for (let i = 0; i < args.count; i++) {
    // 90% female (Pilates studio reality), 10% male
    const isF = rng() < 0.9
    const firstname = pick(rng, isF ? FIRST_NAMES_F : FIRST_NAMES_M)
    const lastname = pick(rng, LAST_NAMES)
    // Build a unique-ish email
    let email = `${slug(firstname)}.${slug(lastname)}@${pick(rng, LARMOR_DOMAINS)}`
    let suffix = 1
    while (usedEmails.has(email)) {
      email = `${slug(firstname)}.${slug(lastname)}${++suffix}@${pick(rng, LARMOR_DOMAINS)}`
    }
    usedEmails.add(email)

    // Bsport id: arbitrary 5-digit space starting at 10000
    const id = 10000 + i

    // 5% archived (left the studio), 95% active
    const isArchived = rng() < 0.05
    // Joined date: spread across last 3 years
    const today = new Date()
    const joined = addDays(today, -int(rng, 30, 1095))

    clients.push({
      id,
      email,
      firstname,
      lastname,
      fullname: `${firstname} ${lastname}`,
      phone_number: rng() < 0.85 ? `+336${int(rng, 10000000, 99999999)}` : null,
      birth_date: isoDate(addDays(today, -int(rng, 365 * 20, 365 * 70))),
      gender: isF ? "F" : "M",
      is_archived: isArchived,
      is_email_accepted: rng() < 0.9,
      is_sms_accepted: rng() < 0.4,
      joined_date: isoDate(joined),
      membership_id: null,
      total_unpaid_amount: rng() < 0.05 ? "20.00" : "0.00",
      payment_backend_customer_id: null,
    })
  }

  /* ---------- pass templates (5/10/20 cours) ---------- */
  const passes = [
    { id: 5, name: "Carte 5 cours tapis", credits_amount: 5, duration_in_days: 90 },
    { id: 10, name: "Carte 10 cours tapis", credits_amount: 10, duration_in_days: 180 },
    { id: 20, name: "Carte 20 cours tapis", credits_amount: 20, duration_in_days: 365 },
  ]

  /* ---------- client-passes ---------- *
   * Distribution realistic for an established studio:
   *  - ~60% of active clients have a current card with credits remaining
   *  - ~25% of active clients have only OLD expired/empty cards (lapsed)
   *  - ~15% never bought a card (only paid à l'unité)
   * Some clients have 1 card; a few have 2 (one current + one old).
   */
  const clientPasses = []
  let passIdSeq = 50000
  const today = new Date()
  for (const c of clients) {
    if (c.is_archived) continue
    const r = rng()

    // Old/empty card history (25% of clients — they pause)
    if (r < 0.25) {
      const oldTpl = pick(rng, passes)
      const oldStart = addDays(today, -int(rng, 200, 600))
      const oldEnd = addDays(oldStart, oldTpl.duration_in_days ?? 180)
      clientPasses.push({
        id: passIdSeq++,
        client_id: c.id,
        pass_id: oldTpl.id,
        available_credits_amount: 0,
        used_credits_amount: oldTpl.credits_amount,
        starting_date: isoDate(oldStart),
        ending_date: isoDate(oldEnd),
        purchased_date: isoDate(oldStart),
        is_disabled: false,
      })
      continue
    }

    // No card at all (15% — pay-per-unit only)
    if (r < 0.40) continue

    // Current active card (60%)
    const tpl = pick(rng, passes)
    // Days since purchase: 0 to (duration - 30) so we still have validity
    const dur = tpl.duration_in_days ?? 180
    const daysSincePurchase = int(rng, 0, Math.max(0, dur - 30))
    const start = addDays(today, -daysSincePurchase)
    const end = addDays(start, dur)
    // Credits used: weighted toward "some used" — most clients are mid-card
    // 20% just bought (0-1 used), 60% mid-way, 20% almost finished
    const u = rng()
    let used: number
    if (u < 0.2) used = int(rng, 0, 1)
    else if (u < 0.8) used = int(rng, Math.floor(tpl.credits_amount * 0.3), Math.floor(tpl.credits_amount * 0.7))
    else used = int(rng, Math.floor(tpl.credits_amount * 0.7), tpl.credits_amount - 1)

    clientPasses.push({
      id: passIdSeq++,
      client_id: c.id,
      pass_id: tpl.id,
      available_credits_amount: tpl.credits_amount - used,
      used_credits_amount: used,
      starting_date: isoDate(start),
      ending_date: isoDate(end),
      purchased_date: isoDate(start),
      is_disabled: false,
    })

    // 10% chance also has a previous expired card (loyal client)
    if (rng() < 0.1) {
      const oldStart = addDays(start, -dur - int(rng, 30, 180))
      const oldEnd = addDays(oldStart, dur)
      clientPasses.push({
        id: passIdSeq++,
        client_id: c.id,
        pass_id: tpl.id,
        available_credits_amount: 0,
        used_credits_amount: tpl.credits_amount,
        starting_date: isoDate(oldStart),
        ending_date: isoDate(oldEnd),
        purchased_date: isoDate(oldStart),
        is_disabled: false,
      })
    }
  }

  /* ---------- bookings: empty (we'll seed those separately on V2 sessions) ---------- */
  const bookings: unknown[] = []

  /* ---------- write ---------- */
  fs.writeFileSync(path.join(args.outDir, "clients.json"), JSON.stringify(clients, null, 2))
  fs.writeFileSync(path.join(args.outDir, "passes.json"), JSON.stringify(passes, null, 2))
  fs.writeFileSync(path.join(args.outDir, "client-passes.json"), JSON.stringify(clientPasses, null, 2))
  fs.writeFileSync(path.join(args.outDir, "bookings.json"), JSON.stringify(bookings, null, 2))

  // Stats
  const active = clients.filter((c) => !c.is_archived).length
  const withCards = new Set(clientPasses.filter((p) => p.available_credits_amount > 0).map((p) => p.client_id)).size
  console.log(`\n✓ ${clients.length} clients (${active} active, ${clients.length - active} archived)`)
  console.log(`✓ ${clientPasses.length} client passes (${withCards} clients with a current card)`)
  console.log(`✓ Files written to ${args.outDir}`)
  console.log(`\nNext: npx tsx scripts/import-bsport.ts --source=fixture`)
}

main()
