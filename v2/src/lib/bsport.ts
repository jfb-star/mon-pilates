/**
 * Bsport API client.
 *
 * Spec source: https://api-docs.dev.bsport.io/schemas/openapi.yml
 * Production base URL confirmed via DevTools: https://api.production.bsport.io
 *
 * The schemas defined here mirror only the fields we care about for the
 * migration (clients, passes, bookings) — not every Bsport field is mapped.
 * If Bsport adds a field, missing fields are silently ignored by Zod.
 *
 * Auth: requires API key in `X-Api-Key` header. Set BSPORT_API_KEY in .env.
 * Tenant context: X-Client-ID (your studio slug), X-Company-ID (numeric).
 */

const PROD_BASE_URL = "https://api.production.bsport.io"

export interface BsportConfig {
  baseUrl?: string
  apiKey: string
  clientId: string
  companyId: string | number
  /** Override timezone if you need consistent date semantics across imports. */
  timezone?: string
  /** Min interval between requests in ms (default 1000 = 1 req/sec). */
  rateLimitMs?: number
  /** Page size for list endpoints (default 50). */
  pageSize?: number
}

/** Generic page envelope returned by Bsport list endpoints. */
export interface BsportPage<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

/**
 * Make a Bsport API request with rate limiting + retries on 429/5xx.
 * Throws on non-2xx after retries are exhausted.
 */
export class BsportClient {
  private cfg: Required<BsportConfig>
  private lastRequestAt = 0

  constructor(cfg: BsportConfig) {
    this.cfg = {
      baseUrl: cfg.baseUrl ?? PROD_BASE_URL,
      apiKey: cfg.apiKey,
      clientId: cfg.clientId,
      companyId: String(cfg.companyId),
      timezone: cfg.timezone ?? "Europe/Paris",
      rateLimitMs: cfg.rateLimitMs ?? 1000,
      pageSize: cfg.pageSize ?? 50,
    }
  }

  /** Rate limit by sleeping until the configured min-interval since last call. */
  private async throttle(): Promise<void> {
    const now = Date.now()
    const elapsed = now - this.lastRequestAt
    if (elapsed < this.cfg.rateLimitMs) {
      await new Promise((r) => setTimeout(r, this.cfg.rateLimitMs - elapsed))
    }
    this.lastRequestAt = Date.now()
  }

  /**
   * Low-level GET. Handles auth headers, throttling, and retries on
   * 429 (rate limited) / 5xx with exponential backoff (max 3 retries).
   */
  async get<T = unknown>(path: string, query: Record<string, string | number | undefined> = {}): Promise<T> {
    const url = new URL(path, this.cfg.baseUrl)
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined) url.searchParams.set(k, String(v))
    }
    const headers: Record<string, string> = {
      "X-Api-Key": this.cfg.apiKey,
      "X-Client-ID": this.cfg.clientId,
      "X-Company-ID": String(this.cfg.companyId),
      "X-Timezone-Name": this.cfg.timezone,
      Accept: "application/json",
    }

    let attempt = 0
    while (true) {
      await this.throttle()
      const res = await fetch(url, { headers })
      if (res.ok) return (await res.json()) as T

      // Retry-able statuses: 429 (rate limit), 5xx (server)
      const retryable = res.status === 429 || (res.status >= 500 && res.status < 600)
      if (!retryable || attempt >= 3) {
        const body = await res.text().catch(() => "")
        throw new Error(`[bsport] ${res.status} ${res.statusText} on ${url.pathname}: ${body.slice(0, 300)}`)
      }
      const retryAfter = parseInt(res.headers.get("Retry-After") ?? "0", 10)
      const wait = retryAfter > 0 ? retryAfter * 1000 : 1000 * 2 ** attempt
      await new Promise((r) => setTimeout(r, wait))
      attempt++
    }
  }

  /**
   * Iterate every page of a list endpoint. Yields results lazily so callers
   * can stop early or stream into a writer without buffering all pages.
   *
   *   for await (const client of bsport.listAll<ClientOutput>("/api/v1/management/clients/")) { ... }
   */
  async *listAll<T>(path: string, query: Record<string, string | number | undefined> = {}): AsyncGenerator<T> {
    let page = 1
    while (true) {
      const data = await this.get<BsportPage<T>>(path, { ...query, page, page_size: this.cfg.pageSize })
      for (const item of data.results) yield item
      if (!data.next) break
      page++
    }
  }

  /** Convenience: drain an entire list into an array (use sparingly for large endpoints). */
  async listAllArray<T>(path: string, query: Record<string, string | number | undefined> = {}): Promise<T[]> {
    const out: T[] = []
    for await (const item of this.listAll<T>(path, query)) out.push(item)
    return out
  }
}

/** Build a client from environment variables. Returns null if any are missing. */
export function bsportFromEnv(): BsportClient | null {
  const apiKey = process.env.BSPORT_API_KEY
  const clientId = process.env.BSPORT_CLIENT_ID
  const companyId = process.env.BSPORT_COMPANY_ID
  if (!apiKey || !clientId || !companyId) return null
  return new BsportClient({ apiKey, clientId, companyId })
}
