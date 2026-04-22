import { test, expect } from "@playwright/test"

/**
 * Booking UI smoke — these tests exercise the planning + tarifs UI only.
 * They do NOT reserve a real seat, do NOT depend on an authenticated user,
 * and do NOT contact Stripe. Anything that requires a real DB fixture is
 * explicitly skipped with a note.
 */

test.describe.configure({ mode: "parallel" })

test.describe("Booking UI — /planning", () => {
  test("Page planning charge et affiche des créneaux", async ({ page }) => {
    await page.goto("/planning")

    // Hero heading
    await expect(
      page.getByRole("heading", { name: /planning des cours/i })
    ).toBeVisible()

    // Session cards are rendered as <button> with aria-label containing
    // either "places" (free) or "complet" (full). At least one must exist.
    const sessionButtons = page.getByRole("button", {
      name: /(place|complet)/i,
    })
    await expect(sessionButtons.first()).toBeVisible({ timeout: 15_000 })
    expect(await sessionButtons.count()).toBeGreaterThan(0)
  })

  test("Cliquer sur un créneau ouvre la modal de sélection", async ({ page }) => {
    await page.goto("/planning")

    const sessionButtons = page.getByRole("button", {
      name: /(place|complet)/i,
    })
    await expect(sessionButtons.first()).toBeVisible({ timeout: 15_000 })

    // Click first available (non-full) session, else first session of any kind
    const firstAvailable = sessionButtons
      .filter({ hasText: /./ })
      .first()
    await firstAvailable.click()

    // Modal is role="dialog" aria-modal
    const dialog = page.getByRole("dialog")
    await expect(dialog).toBeVisible()

    // BookingStepper is rendered inside — step 2 is selected when modal opens
    await expect(dialog.getByRole("button", { name: /fermer/i })).toBeVisible()
  })

  test.skip(
    "Confirmer une réservation mène à la page succès",
    async () => {
      // Needs test DB fixture: requires an authenticated user + a valid
      // session id + mocked /api/bookings endpoint. Out of scope for the
      // pure-UI suite.
    }
  )
})

test.describe("Tarifs — /tarifs", () => {
  test("Page tarifs liste les formules tapis", async ({ page }) => {
    await page.goto("/tarifs")

    // The five mat-oriented plans explicitly requested
    const expected = [
      /découverte.*tapis/i,
      /séance tapis/i,
      /carte 5 cours tapis/i,
      /carte 10 cours tapis/i,
      /carte 20 cours tapis/i,
    ]

    for (const rx of expected) {
      await expect(page.getByText(rx).first()).toBeVisible()
    }
  })
})
