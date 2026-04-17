/**
 * Simple in-memory rate limiter for API routes.
 * For production with multiple instances, use Redis or Upstash.
 */

const requests = new Map<string, { count: number; resetAt: number }>()

// Clean up old entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now()
    for (const [key, value] of requests) {
      if (value.resetAt < now) requests.delete(key)
    }
  }, 5 * 60 * 1000)
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

export function rateLimit(
  key: string,
  { maxRequests = 5, windowMs = 60_000 }: { maxRequests?: number; windowMs?: number } = {}
): RateLimitResult {
  const now = Date.now()
  const entry = requests.get(key)

  if (!entry || entry.resetAt < now) {
    requests.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs }
  }

  entry.count++
  const allowed = entry.count <= maxRequests
  return {
    allowed,
    remaining: Math.max(0, maxRequests - entry.count),
    resetAt: entry.resetAt,
  }
}
