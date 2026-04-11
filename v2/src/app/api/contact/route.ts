// TODO: Implement contact form endpoint
// - POST: Validate input, save ContactMessage to DB, send notification email
// - Rate limit by IP to prevent spam
// - Optional: integrate with a CAPTCHA service

import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // TODO: Parse body, validate fields, create ContactMessage, send email notification
  return Response.json({ message: "Contact POST - not yet implemented" }, { status: 501 });
}
