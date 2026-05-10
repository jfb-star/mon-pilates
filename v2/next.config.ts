import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import bundleAnalyzer from "@next/bundle-analyzer";

const isDev = process.env.NODE_ENV === "development";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Extend Next's default optimizePackageImports.
  // lucide-react, date-fns, recharts are already optimized by default in
  // Next 16 (see node_modules/next/dist/docs/.../optimizePackageImports.md),
  // so their barrel imports are safe. We add the following for a small
  // additional win on routes that import them (mostly server-side, but the
  // hint is free and prevents accidental full-package pull-in):
  experimental: {
    optimizePackageImports: [
      "@upstash/ratelimit",
      "@upstash/redis",
      "@next/third-parties",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimized variants at the CDN for 1 year. All our images are
    // content-addressable (fingerprinted filenames under /images/*), so a
    // long TTL is safe and cuts re-optimization cost + improves repeat-view LCP.
    minimumCacheTTL: 31536000,
  },
  async redirects() {
    // Redirige les anciens slugs de cours vers les nouveaux (alignement Bsport).
    // 308 (permanent) — préserve le SEO.
    return [
      { source: "/cours/tapis", destination: "/cours/tous-niveaux", permanent: true },
      { source: "/cours/doux", destination: "/cours/doux-seniors", permanent: true },
      { source: "/cours/intensif", destination: "/cours/avance", permanent: true },
      { source: "/cours/appareils", destination: "/cours/machine", permanent: true },
      { source: "/cours/prenatal", destination: "/cours/maternite", permanent: true },
    ];
  },
  async headers() {
    // Headers for the service worker — applied in both dev and prod so the
    // browser accepts root-scope registration (`Service-Worker-Allowed: /`)
    // and always revalidates the SW script (never lets a stale SW persist).
    const serviceWorkerHeaders = {
      source: "/sw.js",
      headers: [
        { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        { key: "Service-Worker-Allowed", value: "/" },
        { key: "Content-Type", value: "application/javascript; charset=utf-8" },
      ],
    };

    // In dev, only add security headers (no CSP, no cache overrides)
    if (isDev) {
      return [
        serviceWorkerHeaders,
        {
          source: "/(.*)",
          headers: [
            { key: "X-Frame-Options", value: "DENY" },
            { key: "X-Content-Type-Options", value: "nosniff" },
            { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          ],
        },
      ];
    }

    // Production: full security headers + caching.
    //
    // CSP notes:
    // - 'unsafe-inline' on script-src is kept as a pragmatic MVP trade-off
    //   (Next.js inline bootstrap + Sentry browser init). A nonce-based
    //   strategy would be cleaner but requires reworking the Sentry wrap
    //   and any third-party embeds (Stripe Elements, GTM, GA).
    // - 'unsafe-inline' on style-src is required by Tailwind's inline
    //   style injection through Next.
    // - Stripe.js + Stripe Checkout: js.stripe.com (scripts + frames),
    //   api.stripe.com (connect), hooks.stripe.com (frames for 3DS).
    // - Sentry tunnel: /monitoring rewrite stays same-origin, but the
    //   direct ingest domains are allowed via *.sentry.io for fallback.
    const isProd = process.env.VERCEL_ENV === "production";

    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://*.sentry.io https://api.stripe.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://maps.googleapis.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com https://www.google.com https://maps.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; ");

    const securityHeaders = [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-DNS-Prefetch-Control", value: "on" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
      { key: "Content-Security-Policy", value: csp },
    ];

    // HSTS only on real production — previews shouldn't pin browsers.
    if (isProd) {
      securityHeaders.push({
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      });
    }

    return [
      serviceWorkerHeaders,
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Note: /_next/image + /_next/static are intentionally not overridden —
      // Next.js sets optimal Cache-Control on those itself (and warns if we
      // shadow them). Image CDN TTL is tuned via images.minimumCacheTTL.
      {
        source: "/api/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withBundleAnalyzer(withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "echo-s2",

  project: "mon-pilates",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
}));
