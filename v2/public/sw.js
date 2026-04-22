/**
 * Mon Pilates — Minimal service worker.
 *
 * Scope: `/sw.js` served from origin root (see Service-Worker-Allowed header
 * in next.config.ts). Strategy is deliberately conservative:
 *
 *   - Network-first with cache fallback ONLY for blog article navigations
 *     (`GET` + navigation mode + path starts with `/blog/` and is not the
 *     blog index list). This lets visited articles render when the user
 *     goes offline without interfering with anything dynamic.
 *
 *   - Everything else is pass-through (no caching at all). In particular we
 *     NEVER intercept /api/*, /admin/*, /compte/*, /reservation/*, auth flows
 *     or any POST/PUT/PATCH/DELETE — those must always hit the network so
 *     Stripe, auth, and admin mutations remain reliable.
 *
 * Cache name is versioned so we can bump it on schema/content changes by
 * editing CACHE_VERSION below; old caches are purged on `activate`.
 */

const CACHE_VERSION = "v1";
const BLOG_CACHE = `blog-${CACHE_VERSION}`;
const KNOWN_CACHES = new Set([BLOG_CACHE]);

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Delete caches we no longer recognize (old versions).
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => !KNOWN_CACHES.has(key))
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

/**
 * Determine whether this request is a blog-article navigation we should
 * handle with network-first + cache fallback.
 */
function isBlogArticleNavigation(request, url) {
  if (request.method !== "GET") return false;
  // `mode === "navigate"` catches top-level document requests (anchor clicks,
  // direct loads, back/forward) but excludes subresources, API fetches, etc.
  if (request.mode !== "navigate") return false;
  if (url.origin !== self.location.origin) return false;
  // Only individual articles — not `/blog` (index) nor `/blog/` exactly.
  if (!url.pathname.startsWith("/blog/")) return false;
  if (url.pathname === "/blog/") return false;
  return true;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Fast bail-out for non-GET — we never cache mutations.
  if (request.method !== "GET") return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  if (!isBlogArticleNavigation(request, url)) {
    // Pass-through. Do not call event.respondWith — the browser handles it.
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(BLOG_CACHE);
      try {
        const networkResponse = await fetch(request);
        // Only cache successful, same-origin, basic responses to avoid
        // poisoning the cache with opaque/error payloads.
        if (
          networkResponse &&
          networkResponse.ok &&
          networkResponse.type === "basic"
        ) {
          // Clone before consuming — responses can only be read once.
          cache.put(request, networkResponse.clone()).catch(() => {});
        }
        return networkResponse;
      } catch {
        const cached = await cache.match(request);
        if (cached) return cached;
        return new Response("Offline — article non disponible", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }
    })()
  );
});
