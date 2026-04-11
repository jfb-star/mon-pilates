// TODO: Implement gift card endpoints
// - GET: Validate a gift card code (check status, remaining value/sessions)
// - POST: Purchase a new gift card (create Stripe checkout, then GiftCard record)
// - PATCH: Redeem a gift card (apply to user account)

import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // TODO: Look up gift card by code query param, return status and remaining value
  return Response.json({ message: "Gift cards GET - not yet implemented" }, { status: 501 });
}

export async function POST(request: NextRequest) {
  // TODO: Validate input, create Stripe checkout session, generate gift card code
  return Response.json({ message: "Gift cards POST - not yet implemented" }, { status: 501 });
}
