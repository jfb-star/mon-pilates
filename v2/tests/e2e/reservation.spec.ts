import { test, expect, type Page } from "@playwright/test"

/**
 * Reservation flow — the booking journey is a MODAL on /planning (no
 * separate /reservation/[id] route exists in this codebase). After a
 * successful paid booking, Stripe redirects the user to
 * /reservation/succes which mounts <ConfirmBooking/> and POSTs to
 * /api/checkout/confirm.
 *
 * These tests stub every network call so they're deterministic and
 * fast. They do NOT hit the DB, Stripe, or NextAuth.
 *
 * Covered journeys:
 *   1) Happy path — authenticated user clicks an available session,
 *      chooses "Régler sur place", sees the success card inside the
 *      modal.
 *   2) Session complet — when spotsRemaining === 0, the "complet"
 *      panel replaces the CTAs and only a waitlist button is offered.
 *   3) Non authentifié — /api/bookings/on-site returns 401 with the
 *      "Connectez-vous pour réserver." message; the modal surfaces it
 *      in a role=alert box (NB: there is currently no route-level
 *      returnTo redirect — see report notes).
 *   4) API failure (500) — server error is shown in role=alert and
 *      the modal does not crash / close.
 *
 * We also verify the succes page renders its confirmation heading and
 * calls /api/checkout/confirm on mount.
 */

test.describe.configure({ mode: "parallel" })

type SessionFixture = {
  id: string
  scheduleId: string
  courseType: string
  courseName: string
  instructor: string
  time: string
  endTime: string
  duration: string
  durationMinutes: number
  level: string
  spotsTotal: number
  spotsRemaining: number
  dayOffset: number
  description: string
  icon: string
  color: string
  date: string
}

function sessionsPayload(override: Partial<SessionFixture> = {}) {
  const base: SessionFixture = {
    id: "sess_test_1",
    scheduleId: "sch_test_1",
    courseType: "mat",
    courseName: "Pilates Mat",
    instructor: "Violette",
    time: "10:00",
    endTime: "11:00",
    duration: "60 min",
    durationMinutes: 60,
    level: "Tous niveaux",
    spotsTotal: 8,
    spotsRemaining: 4,
    dayOffset: 1,
    description: "",
    icon: "sparkles",
    color: "#000000",
    date: "2026-04-14",
  }
  return {
    sessions: [{ ...base, ...override }],
    weekStart: "2026-04-13",
  }
}

/**
 * Stub every network call the /planning page makes on load so the
 * page renders deterministically without a DB. Individual tests add
 * their own booking-endpoint stubs on top.
 */
async function stubPlanningPage(
  page: Page,
  opts: { session?: Partial<SessionFixture> } = {}
) {
  await page.route("**/api/sessions?**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(sessionsPayload(opts.session)),
    })
  })
  await page.route("**/api/sessions/availability?**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ availability: {} }),
    })
  })
  await page.route("**/api/account", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ activeCard: null }),
    })
  })
  await page.route("**/api/me/is-first-timer", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ isFirstTimer: false }),
    })
  })
  await page.route("**/api/recommendations**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ recommendations: [] }),
    })
  })
}

async function openFirstSessionModal(page: Page) {
  const sessionButtons = page.getByRole("button", {
    name: /(place|complet)/i,
  })
  await expect(sessionButtons.first()).toBeVisible({ timeout: 15_000 })
  await sessionButtons.first().click()
  await expect(page.getByRole("dialog")).toBeVisible()
}

test.describe("Reservation — happy path", () => {
  test(
    "Utilisateur authentifié peut réserver un créneau disponible (règlement sur place)",
    async ({ page }) => {
      await stubPlanningPage(page)

      // Stub the on-site booking endpoint with a 201 CONFIRMED response.
      await page.route("**/api/bookings/on-site", async (route) => {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            ok: true,
            bookingId: "bk_test_1",
            status: "CONFIRMED",
          }),
        })
      })

      await page.goto("/planning")
      await openFirstSessionModal(page)

      // Click the "Régler sur place au studio" CTA
      await page
        .getByRole("button", { name: /régler sur place au studio/i })
        .click()

      // Success panel appears inside the dialog
      const dialog = page.getByRole("dialog")
      await expect(
        dialog.getByRole("heading", {
          name: /réservation confirmée.*règlement sur place/i,
        })
      ).toBeVisible({ timeout: 10_000 })

      // Calendar export CTAs + "Voir mes réservations" link are offered
      await expect(dialog.getByRole("link", { name: /voir mes réservations/i })).toBeVisible()
      await expect(dialog.getByRole("link", { name: /calendrier.*ics/i })).toBeVisible()
    }
  )

  test(
    "Page /reservation/succes affiche la confirmation de paiement",
    async ({ page }) => {
      // ConfirmBooking posts to /api/checkout/confirm on mount — stub it.
      let confirmCalled = false
      await page.route("**/api/checkout/confirm", async (route) => {
        confirmCalled = true
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ ok: true }),
        })
      })

      await page.goto("/reservation/succes?session_id=cs_test_123")

      await expect(
        page.getByRole("heading", { name: /paiement confirmé/i })
      ).toBeVisible()
      await expect(page.getByText(/email de confirmation/i)).toBeVisible()
      await expect(page.getByRole("link", { name: /voir mes réservations/i })).toBeVisible()

      // ConfirmBooking fires exactly one POST /api/checkout/confirm
      await page.waitForTimeout(300)
      expect(confirmCalled).toBe(true)
    }
  )
})

test.describe("Reservation — séance complète", () => {
  test(
    "Session complète désactive la réservation et propose la liste d'attente",
    async ({ page }) => {
      // Render one session that is FULL (0 places)
      await stubPlanningPage(page, { session: { spotsRemaining: 0 } })

      await page.goto("/planning")

      // The session button's aria-label now contains "complet"
      const completButton = page
        .getByRole("button", { name: /complet/i })
        .first()
      await expect(completButton).toBeVisible({ timeout: 15_000 })
      await completButton.click()

      const dialog = page.getByRole("dialog")
      await expect(dialog).toBeVisible()

      // Explicit "complet" messaging is shown
      await expect(dialog.getByText(/cette séance est complète/i)).toBeVisible()

      // The "Régler sur place" / "Payer à l'unité" CTAs are NOT rendered —
      // only the waitlist CTA is offered.
      await expect(
        dialog.getByRole("button", { name: /payer à l'unité/i })
      ).toHaveCount(0)
      await expect(
        dialog.getByRole("button", { name: /régler sur place au studio/i })
      ).toHaveCount(0)
      await expect(
        dialog.getByRole("button", { name: /me mettre sur liste d'attente/i })
      ).toBeVisible()
    }
  )
})

test.describe("Reservation — utilisateur non authentifié", () => {
  test(
    "Tentative de réservation sans session renvoie l'erreur 'Connectez-vous pour réserver'",
    async ({ page }) => {
      await stubPlanningPage(page)

      // The on-site booking endpoint returns 401 for anonymous users,
      // matching the real handler in src/app/api/bookings/on-site/route.ts.
      await page.route("**/api/bookings/on-site", async (route) => {
        await route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({ error: "Connectez-vous pour réserver." }),
        })
      })

      await page.goto("/planning")
      await openFirstSessionModal(page)

      await page
        .getByRole("button", { name: /régler sur place au studio/i })
        .click()

      // Inline error inside the modal (role=alert)
      const dialog = page.getByRole("dialog")
      const alert = dialog.getByRole("alert")
      await expect(alert).toBeVisible()
      await expect(alert).toContainText(/connectez-vous pour réserver/i)

      // Dialog stays open — no crash, no redirect away from /planning
      await expect(dialog).toBeVisible()
      await expect(page).toHaveURL(/\/planning/)
    }
  )
})

test.describe("Reservation — erreur serveur", () => {
  test(
    "Erreur 500 sur l'API affiche un message d'erreur sans crasher la modal",
    async ({ page }) => {
      await stubPlanningPage(page)

      await page.route("**/api/bookings/on-site", async (route) => {
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ error: "Erreur interne du serveur." }),
        })
      })

      await page.goto("/planning")
      await openFirstSessionModal(page)

      await page
        .getByRole("button", { name: /régler sur place au studio/i })
        .click()

      const dialog = page.getByRole("dialog")
      const alert = dialog.getByRole("alert")
      await expect(alert).toBeVisible()
      await expect(alert).toContainText(/erreur/i)

      // Modal must remain mounted; close button still reachable
      await expect(dialog).toBeVisible()
      await expect(dialog.getByRole("button", { name: /fermer/i })).toBeVisible()
    }
  )

  test(
    "Erreur réseau sur /api/checkout affiche un message et n'entraîne pas de redirection Stripe",
    async ({ page }) => {
      await stubPlanningPage(page)

      // Simulate a network failure on checkout (no JSON body).
      await page.route("**/api/checkout", async (route) => {
        await route.abort("failed")
      })

      await page.goto("/planning")
      await openFirstSessionModal(page)

      await page
        .getByRole("button", { name: /payer à l'unité/i })
        .click()

      const dialog = page.getByRole("dialog")
      const alert = dialog.getByRole("alert")
      await expect(alert).toBeVisible()
      await expect(alert).toContainText(
        /impossible de lancer le paiement|erreur/i
      )
      // Still on /planning — no Stripe redirect happened
      await expect(page).toHaveURL(/\/planning/)
    }
  )
})
