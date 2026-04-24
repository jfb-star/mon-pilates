import { test, expect } from "@playwright/test"

/**
 * Admin E2E smoke — these tests exercise the /admin UI contract only.
 *
 * Notes on the real codebase:
 *   - There is no Next.js middleware guarding /admin. The guard is client-side
 *     in src/app/admin/page.tsx: `useSession()` → on `unauthenticated`, call
 *     `router.push("/connexion")` (without a callbackUrl).
 *   - `/admin/users` and `/admin/sessions` are NOT standalone routes: they are
 *     tabs inside the single /admin page. The real standalone admin sub-routes
 *     are /admin/instructors, /admin/course-types, /admin/schedules,
 *     /admin/contact, /admin/emails/{campaigns,templates,logs}.
 *   - The top-level heading on /admin is "Administration" (not "Tableau de
 *     bord"). Tabs are labelled "Séances", "Réservations", "Membres", etc.
 *   - NextAuth (JWT strategy) is stubbed at two levels:
 *       * /api/auth/session   → returns a fake admin session payload
 *       * /api/admin/stats    → returns a minimal Stats object
 *     Everything else is stubbed per-test as needed.
 */

test.describe.configure({ mode: "parallel" })

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const FAKE_ADMIN_SESSION = {
  user: {
    id: "admin-1",
    name: "Test Admin",
    email: "admin@monpilates.test",
    role: "ADMIN",
  },
  // Far-future ISO expiry so next-auth client treats the session as live.
  expires: "2099-12-31T23:59:59.000Z",
}

const MINIMAL_STATS = {
  totalUsers: 0,
  bookingsThisMonth: 0,
  revenueThisMonth: 0,
  activeCards: 0,
  activeSubscriptions: 0,
  popularCourseName: "—",
  occupancyRate: 0,
  revenueBreakdown: [],
}

/* ------------------------------------------------------------------ */

test.describe("Admin — /admin", () => {
  test("Accès non-authentifié → redirection vers /connexion", async ({
    page,
  }) => {
    // With no session cookie, /api/auth/session returns an empty object and
    // next-auth sets status to "unauthenticated". The admin page then calls
    // `router.push("/connexion")`. Force that path explicitly via stub so the
    // test does not depend on server-side auth behaviour.
    await page.route("**/api/auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({}),
      })
    })

    await page.goto("/admin")

    // Wait for the client-side redirect to settle.
    await page.waitForURL(/\/connexion/, { timeout: 10_000 })
    expect(page.url()).toContain("/connexion")

    // The login heading should render after redirect.
    await expect(
      page.getByRole("heading", { name: /bon retour/i })
    ).toBeVisible()
  })

  test("Admin authentifié → dashboard /admin affiche le heading et les stats", async ({
    page,
  }) => {
    // Stub session → admin
    await page.route("**/api/auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(FAKE_ADMIN_SESSION),
      })
    })

    // Stub credentials callback — harmless here since we never submit the
    // form, but aligns with the task spec.
    await page.route(
      "**/api/auth/callback/credentials**",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          headers: {
            "Set-Cookie":
              "next-auth.session-token=fake-token; Path=/; HttpOnly",
          },
          body: JSON.stringify({ url: "/admin", ok: true }),
        })
      }
    )

    // Minimal stats payload
    await page.route("**/api/admin/stats", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MINIMAL_STATS),
      })
    })

    // The default tab ("sessions") will try to fetch /api/admin/sessions.
    // Stub it so the test does not hit the DB.
    await page.route("**/api/admin/sessions**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ sessions: [] }),
      })
    })

    await page.goto("/admin")

    // The top-level admin heading (codebase uses "Administration", not
    // "Tableau de bord" — no such string exists anywhere in /admin).
    await expect(
      page.getByRole("heading", { name: /administration/i })
    ).toBeVisible({ timeout: 15_000 })

    // Sanity: at least one stat card label is rendered once stats resolve.
    await expect(page.getByText(/total membres/i)).toBeVisible()
    await expect(page.getByText(/revenus ce mois/i)).toBeVisible()
  })

  test("Navigation par tabs — clic sur 'Séances' affiche la section séances", async ({
    page,
  }) => {
    // Same session + stats stubs as the previous test
    await page.route("**/api/auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(FAKE_ADMIN_SESSION),
      })
    })
    await page.route("**/api/admin/stats", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MINIMAL_STATS),
      })
    })
    // Sessions tab is the default — stub its data source with an empty list.
    await page.route("**/api/admin/sessions**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ sessions: [] }),
      })
    })

    await page.goto("/admin")

    // Admin heading visible first
    await expect(
      page.getByRole("heading", { name: /administration/i })
    ).toBeVisible({ timeout: 15_000 })

    // Click the "Séances" tab button (this is a <button>, not a <Link>, since
    // /admin/sessions does not exist as a standalone route).
    await page.getByRole("button", { name: /^séances$/i }).click()

    // Sessions tab renders a "Nouvelle séance" CTA button and a week picker.
    // At least one of those must be present once the tab is active.
    await expect(
      page.getByRole("button", { name: /nouvelle séance/i }).first()
    ).toBeVisible()
  })

  test("Tab Membres — liste les utilisateurs stubés", async ({ page }) => {
    await page.route("**/api/auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(FAKE_ADMIN_SESSION),
      })
    })
    await page.route("**/api/admin/stats", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MINIMAL_STATS),
      })
    })
    // Default Sessions tab still fires a fetch on mount — stub it harmlessly.
    await page.route("**/api/admin/sessions**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ sessions: [] }),
      })
    })

    // Two fake users — shape matches /api/admin/users response.
    const fakeUsers = {
      users: [
        {
          id: "u1",
          name: "Alice Martin",
          email: "alice.martin@example.test",
          role: "USER",
          createdAt: "2025-01-15T10:00:00.000Z",
          totalBookings: 3,
          activeCard: null,
        },
        {
          id: "u2",
          name: "Bob Durand",
          email: "bob.durand@example.test",
          role: "USER",
          createdAt: "2025-02-20T14:30:00.000Z",
          totalBookings: 7,
          activeCard: { type: "TEN_SESSIONS", remainingSessions: 4 },
        },
      ],
      total: 2,
      limit: 20,
      offset: 0,
    }
    await page.route("**/api/admin/users**", async (route) => {
      // Only intercept GET — PATCH is unused here.
      if (route.request().method() !== "GET") return route.fallback()
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(fakeUsers),
      })
    })

    await page.goto("/admin")

    // Wait for the admin shell to render
    await expect(
      page.getByRole("heading", { name: /administration/i })
    ).toBeVisible({ timeout: 15_000 })

    // Activate the Membres tab (equivalent of the "/admin/users" requested
    // route, which does not exist as a standalone path in this codebase).
    await page.getByRole("button", { name: /^membres$/i }).click()

    // Both fake emails must be visible in the rendered table / card list.
    await expect(page.getByText("alice.martin@example.test").first()).toBeVisible()
    await expect(page.getByText("bob.durand@example.test").first()).toBeVisible()
  })

  test.skip(
    "Création de campagne email via le formulaire",
    async () => {
      // The /admin/emails/campaigns page uses a modal-based form with MJML
      // source editing + audience selector backed by /api/admin/email-audiences
      // and /api/admin/email-campaigns (both POST and GET). Building a
      // realistic stub set + filling the MJML textarea + asserting the
      // success banner across the modal close race is fragile given the
      // current UI. Skipped per guidance: "if the UI is complex, skip
      // rather than ship a flaky test".
    }
  )
})
