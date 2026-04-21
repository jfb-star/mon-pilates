/**
 * Rate limiter for API routes.
 *
 * Uses Upstash Redis when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 * are set (production / multi-instance). Falls back to in-memory Map otherwise
 * (dev, CI, single-instance).
 */

import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

interface RateLimitOptions {
  maxRequests?: number
  windowMs?: number
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

// ---------- In-memory fallback ----------

const memoryStore = new Map<string, { count: number; resetAt: number }>()

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now()
    for (const [key, value] of memoryStore) {
      if (value.resetAt < now) memoryStore.delete(key)
    }
  }, 5 * 60 * 1000)
}

function memoryRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const entry = memoryStore.get(key)

  if (!entry || entry.resetAt < now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs }
  }

  entry.count++
  return {
    allowed: entry.count <= maxRequests,
    remaining: Math.max(0, maxRequests - entry.count),
    resetAt: entry.resetAt,
  }
}

// ---------- Upstash Redis backend ----------

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN
const upstashEnabled = Boolean(upstashUrl && upstashToken)

const redis = upstashEnabled
  ? new Redis({ url: upstashUrl!, token: upstashToken! })
  : null

// Cache Ratelimit instances per (maxRequests, windowMs) combo.
const limiterCache = new Map<string, Ratelimit>()

function getLimiter(maxRequests: number, windowMs: number): Ratelimit | null {
  if (!redis) return null
  const cacheKey = `${maxRequests}:${windowMs}`
  let limiter = limiterCache.get(cacheKey)
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(maxRequests, `${windowMs} ms`),
      prefix: "mp:rl",
      analytics: false,
    })
    limiterCache.set(cacheKey, limiter)
  }
  return limiter
}

// ---------- Public API ----------

/**
 * Async rate-limit check. Prefer this in new code: it transparently uses
 * Upstash in production and falls back to in-memory in dev / CI.
 */
export async function checkRateLimit(
  key: string,
  { maxRequests = 5, windowMs = 60_000 }: RateLimitOptions = {}
): Promise<RateLimitResult> {
  const limiter = getLimiter(maxRequests, windowMs)
  if (limiter) {
    try {
      const result = await limiter.limit(key)
      return {
        allowed: result.success,
        remaining: result.remaining,
        resetAt: result.reset,
      }
    } catch (err) {
      // If Upstash is unreachable, fail open to memory store rather than
      // locking users out of the site.
      console.error("[rate-limit] Upstash error, falling back to memory:", err)
    }
  }
  return memoryRateLimit(key, maxRequests, windowMs)
}

