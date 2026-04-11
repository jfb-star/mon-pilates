// TODO: Implement Stripe webhook handler
// - Verify webhook signature with STRIPE_WEBHOOK_SECRET
// - Handle checkout.session.completed -> create Payment, CourseCard, or Subscription
// - Handle invoice.payment_succeeded -> renew subscription period
// - Handle customer.subscription.updated -> update Subscription status
// - Handle customer.subscription.deleted -> cancel Subscription
// - Return 200 quickly to avoid Stripe retries

import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // TODO: Read raw body, verify Stripe signature, process event
  return Response.json({ received: true });
}
