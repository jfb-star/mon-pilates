/**
 * Bsport admin scraper — extracts your studio data without an API key.
 *
 * HOW IT WORKS
 *   1. Launches Chromium VISIBLE
 *   2. Opens Bsport admin (https://pro.bsport.io by default)
 *   3. YOU log in manually (with email/password + 2FA if any)
 *   4. While you navigate, the script intercepts EVERY JSON response
 *      from any *.bsport.io endpoint
 *   5. After you press ENTER, the script auto-paginates: for every
 *      paginated response it captured (with a `next` URL field), it
 *      follows the chain in the background using your session cookies
 *   6. Saves the deduped data to scripts/bsport-fixtures/*.json
 *      + scripts/bsport-fixtures/_scrape-debug.log (every URL it saw)
 *
 * USAGE
 *   npx tsx scripts/scrape-bsport.ts                    # default everything
 *   npx tsx scripts/scrape-bsport.ts --url=https://your-bsport-admin.fr
 *   npx tsx scripts/scrape-bsport.ts --reuse-session    # skip login (cookies still valid)
 *   npx tsx scripts/scrape-bsport.ts --headless         # no visible browser (only with --reuse-session)
 *
 * AFTER SCRAPING
 *   npx tsx scripts/import-bsport.ts --source=fixture --reset
 */
import puppeteer, { Browser, Page, HTTPResponse } from "puppeteer"
import fs from "node:fs"
import path from "node:path"
import readline from "node:readline"

interface Args {
  url: string
  outDir: string
  headless: boolean
  reuseSession: boolean
  loginTimeoutSec: number
  /** Auto-pagination concurrency limit (parallel fetch of `next` URLs). */
  paginateConcurrency: number
  /** Hard cap on auto-paginated pages per starting URL (safety). */
  paginateMaxPages: number
}
function parseArgs(): Args {
  const argv = process.argv.slice(2)
  const get = (n: string) => {
    const eq = argv.find((a) => a.startsWith(`--${n}=`))
    if (eq) return eq.slice(n.length + 3)
    return argv.includes(`--${n}`) ? "true" : undefined
  }
  return {
    url: get("url") ?? "https://pro.bsport.io",
    outDir: get("out") ?? path.resolve(__dirname, "bsport-fixtures"),
    headless: get("headless") === "true",
    reuseSession: get("reuse-session") === "true",
    loginTimeoutSec: parseInt(get("login-timeout") ?? "300", 10),
    paginateConcurrency: parseInt(get("paginate-concurrency") ?? "3", 10),
    paginateMaxPages: parseInt(get("paginate-max-pages") ?? "200", 10),
  }
}

interface Captured {
  url: string
  method: string
  status: number
  body: unknown
  /** Number of items extracted (if body had a list). */
  itemCount: number
  /** Bsport `next` page URL if paginated DRF-style. */
  nextUrl: string | null
  /** Total `count` reported by Bsport DRF pagination, if present. */
  totalCount: number | null
}
const captured = new Map<string, Captured>()
let liveLog: fs.WriteStream | null = null

/**
 * Lenient: accept any JSON response served by *.bsport.io. We try to be
 * permissive at capture time and filter at extraction time, since we don't
 * know in advance which subdomain hosts which resource.
 */
function isBsportUrl(url: string): boolean {
  return /\bbsport\.io\b/i.test(url)
}

/** Quick body shape inspection — used both to count items and to find pagination. */
function inspectBody(body: unknown): { itemCount: number; nextUrl: string | null; totalCount: number | null } {
  if (Array.isArray(body)) return { itemCount: body.length, nextUrl: null, totalCount: null }
  if (body && typeof body === "object") {
    const o = body as { results?: unknown; next?: unknown; count?: unknown }
    if (Array.isArray(o.results)) {
      return {
        itemCount: o.results.length,
        nextUrl: typeof o.next === "string" && o.next.length > 0 ? o.next : null,
        totalCount: typeof o.count === "number" ? o.count : null,
      }
    }
  }
  return { itemCount: 0, nextUrl: null, totalCount: null }
}

function recordCaptured(c: Captured): void {
  captured.set(c.url, c)
  if (liveLog) {
    liveLog.write(
      `${new Date().toISOString()}  ${c.method.padEnd(6)} ${c.status}  items=${String(c.itemCount).padStart(4)}  total=${c.totalCount ?? "?"}  next=${c.nextUrl ? "Y" : "n"}  ${c.url}\n`
    )
  }
}

async function waitForLogin(args: Args): Promise<void> {
  console.log(`\n👋 A browser window has just opened.`)
  console.log(`   1. Log in to Bsport (email + password, 2FA if any)`)
  console.log(`   2. Once you see your studio dashboard, come back HERE`)
  console.log(`   3. Press ENTER below to confirm you're logged in`)
  console.log(`\n   (Login timeout: ${args.loginTimeoutSec}s)`)

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const enterPress = new Promise<void>((resolve) => rl.question("\n   ➜ Logged in? Press ENTER: ", () => { rl.close(); resolve() }))
  const timeout = new Promise<void>((_, reject) =>
    setTimeout(() => reject(new Error("Login timeout — re-run the script")), args.loginTimeoutSec * 1000)
  )
  await Promise.race([enterPress, timeout])
}

/** Live status updater — refreshes a single line in the terminal with the current capture count. */
function startLiveCounter(): { stop: () => void } {
  let stopped = false
  let lastCount = -1
  const tick = setInterval(() => {
    if (stopped) return
    if (captured.size === lastCount) return
    lastCount = captured.size
    process.stdout.write(`\r   📡 captured: ${captured.size} responses, ${[...captured.values()].reduce((s, c) => s + c.itemCount, 0)} items so far…    `)
  }, 500)
  return {
    stop: () => {
      stopped = true
      clearInterval(tick)
      process.stdout.write("\n")
    },
  }
}

async function captureAdminNavigation(): Promise<void> {
  console.log(`\n🕵 Now navigate through your Bsport admin to load the data:`)
  console.log(`   ⚠ IMPORTANT: visit ONE LIST page per resource — don't worry about pagination,`)
  console.log(`     the script auto-fetches the missing pages in the background.`)
  console.log(``)
  console.log(`   ✅ MEMBRES (most important): the "Members" / "Membres" / "Clients" full LIST page`)
  console.log(`      → triggers /customer-data-platform/v1/member/ — gives all 280 in pages of 100`)
  console.log(``)
  console.log(`   ✅ CARTES VENDUES: open the "Cartes" / "Forfaits" / "Passes" section, then`)
  console.log(`      CLICK ON EACH PACK TYPE one by one (5/10/20 cours, etc.) so the admin loads`)
  console.log(`      the consumer-payment-pack list per template.`)
  console.log(``)
  console.log(`   ✅ RÉSERVATIONS (optional, for archive): "Réservations" / "Bookings" full LIST page`)
  console.log(``)
  console.log(`   When done navigating, press ENTER to start auto-pagination.\n`)
  const live = startLiveCounter()
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  await new Promise<void>((resolve) => rl.question("   ➜ Done navigating? Press ENTER: ", () => { rl.close(); resolve() }))
  live.stop()
}

/**
 * Auto-paginate captured responses. Bsport supports two pagination modes:
 *   1. DRF cursor: response has a `next` URL → follow the chain
 *   2. Page number: response has `?page=N&page_size=Y` + a `total` field → we
 *      walk pages 1..ceil(total/items_per_page) ourselves
 *
 * For mode 2 we use the request URL as a template and increment `?page=`.
 * fetch() runs in the page context so cookies + auth headers are reused.
 */
async function autoPaginate(page: Page, args: Args): Promise<void> {
  const queue: string[] = []
  const visited = new Set<string>([...captured.keys()])
  let totalNew = 0

  /** Replace or add `?page=N` in a URL. */
  function setPage(url: string, n: number): string {
    if (/[?&]page=\d+/.test(url)) return url.replace(/([?&])page=\d+/, `$1page=${n}`)
    return url + (url.includes("?") ? "&" : "?") + `page=${n}`
  }
  /** Strip pagination params for a "chain key" used to dedupe. */
  function chainKey(url: string): string {
    return url.replace(/([?&])(page|cursor|offset)=[^&]*&?/g, "$1").replace(/[?&]$/, "")
  }

  // Mode 1: DRF cursor
  for (const c of captured.values()) {
    if (c.nextUrl) queue.push(c.nextUrl)
  }
  // Mode 2: total-based pagination — for each captured response with total > items
  // and a `?page=` param, queue up the missing pages.
  for (const c of captured.values()) {
    if (c.totalCount === null) continue
    if (c.totalCount <= c.itemCount) continue
    const u = new URL(c.url)
    const pageSize = parseInt(u.searchParams.get("page_size") ?? String(c.itemCount), 10)
    if (pageSize <= 0) continue
    const totalPages = Math.ceil(c.totalCount / pageSize)
    const currentPage = parseInt(u.searchParams.get("page") ?? "1", 10)
    for (let p = 1; p <= totalPages; p++) {
      if (p === currentPage) continue
      const candidate = setPage(c.url, p)
      if (!visited.has(candidate)) queue.push(candidate)
    }
  }

  if (queue.length === 0) {
    console.log(`\n📄 Auto-pagination: nothing to follow (all captured pages already complete).`)
    return
  }

  // Dedupe queue
  const uniqueQueue = [...new Set(queue)]
  console.log(`\n📄 Auto-pagination: fetching ${uniqueQueue.length} additional page(s)…`)

  const chainCount = new Map<string, number>()
  for (const c of captured.values()) {
    const k = chainKey(c.url)
    chainCount.set(k, (chainCount.get(k) ?? 0) + 1)
  }

  async function fetchOne(url: string): Promise<void> {
    if (visited.has(url)) return
    visited.add(url)

    const k = chainKey(url)
    const cur = chainCount.get(k) ?? 0
    if (cur >= args.paginateMaxPages) {
      console.warn(`\n   ⚠ paginateMaxPages reached for chain ${k} — stopping`)
      return
    }
    chainCount.set(k, cur + 1)

    try {
      const data = await page.evaluate(async (u) => {
        const r = await fetch(u, { credentials: "include" })
        if (!r.ok) return { __err: r.status }
        const ct = r.headers.get("content-type") ?? ""
        if (!ct.includes("application/json")) return { __err: "non-json" }
        return await r.json()
      }, url)

      if (!data || (typeof data === "object" && data !== null && "__err" in data)) return

      const inspect = inspectBody(data)
      recordCaptured({
        url,
        method: "GET",
        status: 200,
        body: data,
        itemCount: inspect.itemCount,
        nextUrl: inspect.nextUrl,
        totalCount: inspect.totalCount,
      })
      totalNew += inspect.itemCount
      process.stdout.write(`\r   📡 paginating: ${visited.size} URLs visited, +${totalNew} new items so far…    `)
      if (inspect.nextUrl) queue.push(inspect.nextUrl)
    } catch {
      /* swallow — best-effort */
    }
  }

  // Drain queue with bounded concurrency
  const pending = [...uniqueQueue]
  while (pending.length > 0) {
    const batch = pending.splice(0, args.paginateConcurrency)
    await Promise.all(batch.map(fetchOne))
  }
  console.log(`\n   ✓ auto-pagination done: +${totalNew} items across all chains`)
}

/** Pretty-print a list of captured URLs grouped by path segment. */
function summarizeCaptured(): void {
  console.log(`\n📊 Captured ${captured.size} API responses (${[...captured.values()].reduce((s, c) => s + c.itemCount, 0)} items):`)
  // Group by path segments (last meaningful segment)
  const groups = new Map<string, { count: number; items: number }>()
  for (const c of captured.values()) {
    // Strip query string, take last path segment
    const u = new URL(c.url)
    const segs = u.pathname.split("/").filter(Boolean)
    const key = segs[segs.length - 1] || u.pathname
    const cur = groups.get(key) ?? { count: 0, items: 0 }
    cur.count++
    cur.items += c.itemCount
    groups.set(key, cur)
  }
  for (const [k, v] of [...groups.entries()].sort((a, b) => b[1].items - a[1].items)) {
    console.log(`  • ${k.padEnd(30)} ${String(v.count).padStart(4)} responses, ${String(v.items).padStart(5)} items`)
  }
}

/**
 * Inspect captured responses and write the ones we recognize as Bsport
 * resources to disk in the format expected by import-bsport.ts.
 */
async function persistCaptured(outDir: string): Promise<void> {
  fs.mkdirSync(outDir, { recursive: true })

  // Group items by their resource type. We try multiple URL patterns
  // because Bsport endpoint paths vary across their API namespaces.
  const byResource = new Map<string, unknown[]>()

  // Patterns to identify resources, ordered by specificity. First match wins.
  // Patterns derived from real Bsport admin API URLs observed in the wild
  // (see scripts/bsport-fixtures/_scrape-debug.log on a fresh scrape).
  // Bsport uses microservice-style URLs:
  //   /customer-data-platform/v1/member/         → clients
  //   /buyable/v1/payment-pack/payment-pack/     → pass templates (5/10/20)
  //   /book/v1/booking/                          → bookings
  //   /book/v1/offer/                            → sessions/offers (skipped — V2 has its own)
  // The "management" prefix the OpenAPI spec mentions is NOT used in prod.
  const RES_PATTERNS: Array<{ name: string; rx: RegExp; minItems?: number }> = [
    // Clients: prod is /customer-data-platform/v1/member/ — but we exclude
    // the per-offer member fetches (?offer=N filter) which return only the
    // members of one session, not the studio roster.
    {
      name: "clients",
      rx: /\/customer-data-platform\/v[0-9]+\/member\/(?!.*[?&]offer=)/i,
    },
    // Pass templates (5/10/20 cours catalog)
    {
      name: "passes",
      rx: /\/buyable\/v[0-9]+\/payment-pack\/payment-pack\//i,
    },
    // Active client passes / cards (= "consumer payment pack" in Bsport speak)
    // Real prod URL: /buyable/v1/payment-pack/consumer-payment-pack/?payment_pack=N
    {
      name: "client-passes",
      rx: /\/buyable\/v[0-9]+\/payment-pack\/consumer-payment-pack\b/i,
    },
    // Bookings — exclude per-offer filter (planning view) which is repeated
    {
      name: "bookings",
      rx: /\/book\/v[0-9]+\/booking\/(?!.*[?&]in_offer=)/i,
    },
    // Invoices (sales)
    {
      name: "invoices",
      rx: /\/(billing|invoices?|sale|orders?)\/v[0-9]+\/.*\/(invoice|order|sale)\b/i,
    },
  ]

  for (const c of captured.values()) {
    if (c.status !== 200) continue
    if (c.itemCount === 0) continue

    let resource: string | null = null
    for (const { name, rx } of RES_PATTERNS) {
      if (rx.test(c.url)) { resource = name; break }
    }
    if (!resource) continue

    const body = c.body as { results?: unknown[] } | unknown[] | null
    const items = Array.isArray(body) ? body : Array.isArray(body?.results) ? body.results : null
    if (!items) continue

    const list = byResource.get(resource) ?? []
    list.push(...items)
    byResource.set(resource, list)
  }

  // Map → fixture filenames expected by import-bsport.ts
  const FILE_MAP: Record<string, string> = {
    clients: "clients.json",
    "client-passes": "client-passes.json",
    "client-subscriptions": "client-subscriptions.json",
    passes: "passes.json",
    bookings: "bookings.json",
    invoices: "invoices.json",
  }

  let totalWritten = 0
  for (const [resource, items] of byResource) {
    const filename = FILE_MAP[resource]
    if (!filename) {
      console.log(`  ⊘ ${resource}: ${items.length} items (no fixture mapping — skipped)`)
      continue
    }
    // Dedupe by id (Bsport int id)
    const dedup = new Map<unknown, unknown>()
    for (const it of items) {
      const id = (it as { id?: unknown }).id
      if (id !== undefined) dedup.set(id, it)
    }
    const finalArr = [...dedup.values()]
    const out = path.join(outDir, filename)
    fs.writeFileSync(out, JSON.stringify(finalArr, null, 2))
    console.log(`  ✓ ${resource.padEnd(25)} → ${filename} (${finalArr.length} items, deduped from ${items.length})`)
    totalWritten += finalArr.length
  }
  console.log(`\n✅ Wrote ${totalWritten} total items to ${outDir}`)

  if (totalWritten === 0) {
    console.log(`\n⚠ Nothing recognized. The debug log shows EVERY URL captured:`)
    console.log(`   ${path.join(outDir, "_scrape-debug.log")}`)
    console.log(`\n   Open that file, find the URL that lists your members, and tell me the URL pattern`)
    console.log(`   so I can add it to RES_PATTERNS in scripts/scrape-bsport.ts.`)
  } else {
    console.log(`\n📋 Debug log: ${path.join(outDir, "_scrape-debug.log")}`)
  }
}

async function main(): Promise<void> {
  const args = parseArgs()
  console.log("=".repeat(60))
  console.log(`Bsport admin scraper`)
  console.log(`  url:        ${args.url}`)
  console.log(`  out:        ${args.outDir}`)
  console.log(`  headless:   ${args.headless}`)
  console.log(`  reuseSess:  ${args.reuseSession}`)
  console.log("=".repeat(60))

  // Open debug log file early so it accumulates from the very first response
  fs.mkdirSync(args.outDir, { recursive: true })
  liveLog = fs.createWriteStream(path.join(args.outDir, "_scrape-debug.log"), { flags: "w" })
  liveLog.write(`# Bsport scraper debug log — ${new Date().toISOString()}\n`)
  liveLog.write(`# Format: <iso-date>  <method>  <status>  items=N  total=N  next=Y/n  <url>\n\n`)

  const userDataDir = path.resolve(__dirname, ".puppeteer-bsport-profile")
  const browser: Browser = await puppeteer.launch({
    headless: args.headless,
    userDataDir,
    defaultViewport: null,
    args: ["--start-maximized"],
  })
  const page: Page = (await browser.pages())[0] ?? await browser.newPage()

  // Intercept every JSON response from any *.bsport.io endpoint (GET + POST).
  page.on("response", async (res: HTTPResponse) => {
    const url = res.url()
    if (!isBsportUrl(url)) return
    const ct = res.headers()["content-type"] ?? ""
    if (!ct.includes("application/json")) return
    const method = res.request().method()
    if (method !== "GET" && method !== "POST") return
    try {
      const body = await res.json()
      const inspect = inspectBody(body)
      recordCaptured({
        url,
        method,
        status: res.status(),
        body,
        itemCount: inspect.itemCount,
        nextUrl: inspect.nextUrl,
        totalCount: inspect.totalCount,
      })
    } catch {
      /* ignore non-JSON / failed reads */
    }
  })

  await page.goto(args.url, { waitUntil: "domcontentloaded" })

  if (!args.reuseSession) {
    await waitForLogin(args)
  }
  await captureAdminNavigation()

  // Pagination + summary + persist
  await autoPaginate(page, args)
  summarizeCaptured()
  await persistCaptured(args.outDir)

  liveLog.end()

  console.log(`\n👍 You can close the browser. Next step:`)
  console.log(`   npx tsx scripts/import-bsport.ts --source=fixture --reset --dry-run`)

  await browser.close()
}

main().catch((e) => {
  console.error("\n❌ FATAL:", e)
  liveLog?.end()
  process.exit(1)
})
