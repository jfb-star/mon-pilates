import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verify } from "@/lib/unsubscribe-token"
import { removeContact } from "@/lib/resend"

/**
 * Public unsubscribe endpoint.
 *
 * Auth model: HMAC token (no cookies).  POST from the form, GET for
 * one-click email-client compatibility.
 */

async function doUnsubscribe(email: string): Promise<void> {
  const subscriber = await prisma.subscriber.findUnique({
    where: { email },
    select: { id: true, resendContactId: true, resendAudienceId: true },
  })

  // Always mark locally — idempotent.
  await prisma.subscriber.updateMany({
    where: { email },
    data: { unsubscribedAt: new Date() },
  })

  // Best-effort Resend cleanup.
  if (
    subscriber?.resendContactId &&
    subscriber.resendAudienceId &&
    process.env.RESEND_API_KEY
  ) {
    try {
      await removeContact(
        subscriber.resendAudienceId,
        subscriber.resendContactId
      )
    } catch (err) {
      console.warn("[unsubscribe] removeContact failed (non-fatal):", err)
    }
  }
}

function successPage(email: string): Response {
  const html = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex" />
    <title>Désinscription confirmée</title>
    <style>
      body { font-family: system-ui, -apple-system, sans-serif; background: #faf7f3; color: #2c2c2c; margin: 0; padding: 4rem 1rem; }
      main { max-width: 540px; margin: 0 auto; background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
      h1 { margin: 0 0 1rem; font-size: 1.5rem; }
      p { line-height: 1.6; color: #555; }
      a { color: #6b9fad; }
    </style>
  </head>
  <body>
    <main>
      <h1>Désinscription confirmée</h1>
      <p>L&apos;adresse <strong>${email.replace(/</g, "&lt;")}</strong> a été retirée de notre liste de diffusion.</p>
      <p>Vous ne recevrez plus nos emails marketing. Les emails transactionnels (confirmations de réservation, etc.) continueront d&apos;arriver.</p>
      <p><a href="/">Retour à l&apos;accueil</a></p>
    </main>
  </body>
</html>`
  return new NextResponse(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  })
}

function extractToken(
  request: NextRequest,
  formToken: string | null
): string | null {
  if (formToken) return formToken
  const qs = request.nextUrl.searchParams.get("token")
  return qs
}

export async function GET(request: NextRequest): Promise<Response> {
  const token = request.nextUrl.searchParams.get("token")
  const email = verify(token)
  if (!email) {
    return NextResponse.redirect(new URL("/unsubscribe", request.url))
  }
  try {
    await doUnsubscribe(email)
  } catch (err) {
    console.error("[unsubscribe][GET] failed:", err)
    return NextResponse.json({ error: "unsubscribe failed" }, { status: 500 })
  }
  return successPage(email)
}

export async function POST(request: NextRequest): Promise<Response> {
  // Accept JSON or form-encoded.
  let formToken: string | null = null
  const contentType = request.headers.get("content-type") ?? ""
  try {
    if (contentType.includes("application/json")) {
      const body = (await request.json()) as { token?: string }
      formToken = body?.token ?? null
    } else {
      const form = await request.formData()
      const v = form.get("token")
      formToken = typeof v === "string" ? v : null
    }
  } catch {
    // fall through — maybe token is in the query string
  }

  const token = extractToken(request, formToken)
  const email = verify(token)
  if (!email) {
    return NextResponse.redirect(new URL("/unsubscribe", request.url))
  }

  try {
    await doUnsubscribe(email)
  } catch (err) {
    console.error("[unsubscribe][POST] failed:", err)
    return NextResponse.json({ error: "unsubscribe failed" }, { status: 500 })
  }

  return successPage(email)
}
