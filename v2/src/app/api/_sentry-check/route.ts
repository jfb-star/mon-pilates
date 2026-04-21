/**
 * Sentry connectivity test — TEMPORARY.
 * Throws deliberately so Sentry captures it. Remove after the first
 * successful capture in the Sentry "Issues" tab.
 */
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const mode = url.searchParams.get("mode") ?? "server"

  if (mode === "server") {
    throw new Error(
      "Sentry connectivity check — server error (safe to delete this route)",
    )
  }

  return NextResponse.json({
    ok: true,
    hint: "Pass ?mode=server to throw a test error",
  })
}
