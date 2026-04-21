import { test, expect } from "@playwright/test"

/**
 * Smoke tests — each public page loads, renders its key content, has no
 * console errors, and returns a 2xx.  If any of these fail, something
 * is broken at the most basic level.
 */

const PAGES: { path: string; heading: RegExp }[] = [
  { path: "/", heading: /Pilates/i },
  { path: "/planning", heading: /Planning/i },
  { path: "/tarifs", heading: /Tarifs/i },
  { path: "/contact", heading: /Contact/i },
]

for (const { path, heading } of PAGES) {
  test(`smoke: ${path} renders`, async ({ page }) => {
    const consoleErrors: string[] = []
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text())
    })

    const response = await page.goto(path, { waitUntil: "domcontentloaded" })
    expect(response?.ok(), `${path} should return 2xx`).toBe(true)

    await expect(page.locator("h1, h2").first()).toContainText(heading)

    // Header + Footer landmarks present everywhere
    await expect(page.locator("header, [role='banner']").first()).toBeVisible()
    await expect(page.locator("footer, [role='contentinfo']").first()).toBeVisible()

    // Console errors that indicate a real bug — ignore third-party noise
    const meaningfulErrors = consoleErrors.filter(
      (e) =>
        !/(favicon|ServiceWorker|sentry|analytics|GA4|gtag|chrome-extension)/i.test(e)
    )
    expect(meaningfulErrors, `console errors on ${path}`).toEqual([])
  })
}

test("smoke: /planning lists sessions or empty state", async ({ page }) => {
  await page.goto("/planning")
  // Either sessions render or an empty-state message is shown —
  // both are acceptable, we just want no crash.
  const body = await page.textContent("body")
  expect(body?.length ?? 0).toBeGreaterThan(200)
})

test("smoke: /contact form has required fields", async ({ page }) => {
  await page.goto("/contact")
  await expect(page.getByLabel(/email/i).first()).toBeVisible()
  await expect(page.getByLabel(/message/i).first()).toBeVisible()
})
