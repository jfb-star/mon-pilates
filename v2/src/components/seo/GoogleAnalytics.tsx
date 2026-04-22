import { GoogleAnalytics as NextGA } from "@next/third-parties/google"

const GA_ID = process.env.NEXT_PUBLIC_GA4_ID

/**
 * GA4 via `@next/third-parties/google`.
 *
 * Perf: the package lazy-loads the gtag script (worker-off main thread where
 * possible, `lazyOnload` strategy) and ships the init snippet in a single
 * bundle, removing the two inline `<Script>` tags we previously injected in
 * `<head>` on every page. No GA_ID configured → nothing rendered.
 */
export function GoogleAnalytics() {
  if (!GA_ID) return null
  return <NextGA gaId={GA_ID} />
}
