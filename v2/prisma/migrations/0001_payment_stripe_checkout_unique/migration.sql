-- Enforce idempotency on Stripe checkout session id. Payment rows created from
-- webhook + /api/checkout/confirm must not duplicate when both fire for the same
-- session. The unique index lets us use upsert({ where: { stripeCheckoutSessionId } })
-- as the atomic primitive instead of find-then-create.
--
-- NULLs are allowed (Postgres UNIQUE treats NULLs as distinct), so legacy payment
-- rows without a checkout session id (e.g. manual/admin entries) remain valid.
CREATE UNIQUE INDEX "Payment_stripeCheckoutSessionId_key"
  ON "Payment"("stripeCheckoutSessionId");
