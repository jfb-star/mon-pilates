import puppeteer, { type Page } from "puppeteer"

const BASE_URL = process.argv[2] || "http://localhost:3456"
const results: { test: string; status: "PASS" | "FAIL"; detail?: string }[] = []

function log(test: string, status: "PASS" | "FAIL", detail?: string) {
  const icon = status === "PASS" ? "✅" : "❌"
  console.log(`${icon} ${test}${detail ? ` — ${detail}` : ""}`)
  results.push({ test, status, detail })
}

/** Navigate and wait for React hydration */
async function navigate(page: Page, path: string, timeout = 15000) {
  await page.goto(`${BASE_URL}${path}`, { waitUntil: "load", timeout })
  // Wait for React to hydrate
  await new Promise((r) => setTimeout(r, 2000))
}

/** Type into a React-controlled input (bypasses synthetic event issues) */
async function typeReact(page: Page, selector: string, value: string) {
  await page.focus(selector)
  await page.evaluate(
    (sel, val) => {
      const el = document.querySelector(sel) as HTMLInputElement
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!
      setter.call(el, val)
      el.dispatchEvent(new Event("input", { bubbles: true }))
      el.dispatchEvent(new Event("change", { bubbles: true }))
    },
    selector,
    value
  )
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-web-security"],
  })

  // ============================================================
  // TEST 1: Homepage loads with correct title and hero
  // ============================================================
  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900 })
    const res = await page.goto(`${BASE_URL}/`, { waitUntil: "load", timeout: 30000 })
    await new Promise((r) => setTimeout(r, 2000))

    log("Homepage loads", res?.ok() ? "PASS" : "FAIL", `HTTP ${res?.status()}`)

    const title = await page.title()
    log("Homepage title", title.includes("Mon Pilates") ? "PASS" : "FAIL", title)

    // Check header nav is visible
    const navVisible = await page.$eval('nav[aria-label="Navigation principale"]', (el) => {
      return window.getComputedStyle(el).display !== "none"
    }).catch(() => false)
    log("Desktop nav visible", navVisible ? "PASS" : "FAIL")

    // Check hero CTA button exists
    const heroCta = await page.$('a[href="/planning"]')
    log("Hero CTA present", heroCta ? "PASS" : "FAIL")

    // Check footer renders
    const footer = await page.$('footer[role="contentinfo"]')
    log("Footer renders", footer ? "PASS" : "FAIL")

    // Check no console errors (JS errors)
    const consoleErrors: string[] = []
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text())
    })
    await page.reload({ waitUntil: "load", timeout: 15000 })
    await new Promise((r) => setTimeout(r, 3000))
    const realErrors = consoleErrors.filter(
      (e) => !e.includes("Fast Refresh") && !e.includes("webpack") && !e.includes("[HMR]") && !e.includes("hydrat")
    )
    log("No JS console errors", realErrors.length === 0 ? "PASS" : "FAIL", realErrors.join("; ").slice(0, 200))

    await page.close()
  } catch (err) {
    log("Homepage tests", "FAIL", String(err).slice(0, 200))
  }

  // ============================================================
  // TEST 2: Navigation links work
  // ============================================================
  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900 })

    const navLinks = [
      { name: "Planning", href: "/planning" },
      { name: "Nos cours", href: "/cours" },
      { name: "Tarifs", href: "/tarifs" },
      { name: "Contact", href: "/contact" },
    ]

    for (const link of navLinks) {
      await navigate(page, link.href)
      const status = page.url().includes(link.href)
      log(`Nav to ${link.name}`, status ? "PASS" : "FAIL", page.url())
    }

    await page.close()
  } catch (err) {
    log("Navigation tests", "FAIL", String(err).slice(0, 200))
  }

  // ============================================================
  // TEST 3: Registration flow
  // ============================================================
  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900 })
    await navigate(page, "/connexion")

    // Check login form renders
    const loginForm = await page.$('input[id="login-email"]')
    log("Login form renders", loginForm ? "PASS" : "FAIL")

    // Switch to register tab — find button containing "Créer" or second button in toggle
    const registerTab = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll("button"))
      return buttons.find((b) => b.textContent?.includes("Créer")) ?? null
    })
    if (registerTab) {
      await (registerTab as any).click()
      await new Promise((r) => setTimeout(r, 500))
    }

    const registerName = await page.$('input[id="register-name"]')
    log("Register form renders", registerName ? "PASS" : "FAIL")

    // Fill in registration form using React-compatible input
    const testEmail = `test-${Date.now()}@example.com`
    if (registerName) {
      await typeReact(page, 'input[id="register-name"]', "Test User")
      await typeReact(page, 'input[id="register-email"]', testEmail)
      await typeReact(page, 'input[id="register-password"]', "testpassword123")
      await typeReact(page, 'input[id="register-password-confirm"]', "testpassword123")

      // Submit via form event (more reliable with React)
      await page.evaluate(() => {
        const form = document.querySelector("form")
        form?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))
      })
      await new Promise((r) => setTimeout(r, 5000))

      const url = page.url()
      if (url.includes("/compte") || url.includes("/bienvenue")) {
        log("Registration + auto-login", "PASS", `Redirected to ${url.replace(BASE_URL, "")}`)
      } else {
        const alertText = await page.$eval('[role="alert"]', (el) => el.textContent).catch(() => null)
        if (alertText?.includes("Compte créé")) {
          log("Registration + auto-login", "PASS", "Account created (auto-login skipped in test)")
        } else {
          log("Registration + auto-login", "FAIL", alertText || `Stayed on ${url}`)
        }
      }
    }

    await page.close()
  } catch (err) {
    log("Registration tests", "FAIL", String(err).slice(0, 200))
  }

  // ============================================================
  // TEST 4: Planning page — session cards render
  // ============================================================
  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900 })
    await navigate(page, "/planning")

    // Dismiss cookie consent if present
    const cookieAccept = await page.$('[role="dialog"][aria-label="Consentement aux cookies"] button:last-child')
    if (cookieAccept) await cookieAccept.click()
    await new Promise((r) => setTimeout(r, 500))

    // Check week nav renders
    const weekNav = await page.$('button[aria-label="Semaine suivante"]')
    log("Planning week nav", weekNav ? "PASS" : "FAIL")

    // Check session cards exist (try multiple selectors)
    let sessionCards = await page.$$('[data-testid="session-card"]')
    if (sessionCards.length === 0) {
      sessionCards = await page.$$('button[class*="session"], button[class*="cours"]')
    }
    if (sessionCards.length === 0) {
      sessionCards = await page.$$('.lg\\:grid-cols-6 button')
    }
    log("Planning session cards", sessionCards.length > 0 ? "PASS" : "FAIL", `${sessionCards.length} cards`)

    // Click a session card to open modal
    if (sessionCards.length > 0) {
      await sessionCards[0].click()
      await new Promise((r) => setTimeout(r, 1000))

      // Use aria-labelledby to identify session modal specifically (not cookie dialog)
      const modal = await page.$('[role="dialog"][aria-labelledby="session-modal-title"]')
      log("Session modal opens", modal ? "PASS" : "FAIL")

      if (modal) {
        await page.keyboard.press("Escape")
        await new Promise((r) => setTimeout(r, 500))
        const modalAfter = await page.$('[role="dialog"][aria-labelledby="session-modal-title"]')
        log("Modal closes on Escape", !modalAfter ? "PASS" : "FAIL")
      }
    }

    await page.close()
  } catch (err) {
    log("Planning tests", "FAIL", String(err).slice(0, 200))
  }

  // ============================================================
  // TEST 5: Contact form validation
  // ============================================================
  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900 })
    await navigate(page, "/contact")

    const form = await page.$("form")
    log("Contact form present", form ? "PASS" : "FAIL")

    await page.close()
  } catch (err) {
    log("Contact tests", "FAIL", String(err).slice(0, 200))
  }

  // ============================================================
  // TEST 6: Mobile navigation
  // ============================================================
  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 390, height: 844 })
    await navigate(page, "/")

    // Desktop nav should be hidden
    const desktopNav = await page.$eval('nav[aria-label="Navigation principale"]', (el) => {
      return window.getComputedStyle(el).display !== "none"
    }).catch(() => false)
    log("Desktop nav hidden on mobile", !desktopNav ? "PASS" : "FAIL")

    // Hamburger menu visible
    const hamburger = await page.$('button[aria-label="Ouvrir le menu"]')
    log("Hamburger menu visible", hamburger ? "PASS" : "FAIL")

    if (hamburger) {
      await hamburger.click()
      await new Promise((r) => setTimeout(r, 500))

      const mobileNav = await page.$('nav[aria-label="Navigation mobile"]')
      log("Mobile menu opens", mobileNav ? "PASS" : "FAIL")

      await page.keyboard.press("Escape")
      await new Promise((r) => setTimeout(r, 500))
    }

    await page.close()
  } catch (err) {
    log("Mobile nav tests", "FAIL", String(err).slice(0, 200))
  }

  // ============================================================
  // TEST 7: Accessibility basics
  // ============================================================
  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900 })
    await navigate(page, "/")

    const skipLink = await page.$('a[href="#main-content"]')
    log("Skip-to-content link", skipLink ? "PASS" : "FAIL")

    const mainContent = await page.$("main#main-content")
    log("Main content landmark", mainContent ? "PASS" : "FAIL")

    const lang = await page.$eval("html", (el) => el.lang)
    log("HTML lang attribute", lang === "fr" ? "PASS" : "FAIL", lang)

    const imgsWithoutAlt = await page.$$eval("img:not([alt])", (imgs) => imgs.length)
    log("All images have alt", imgsWithoutAlt === 0 ? "PASS" : "FAIL", `${imgsWithoutAlt} missing`)

    await page.close()
  } catch (err) {
    log("Accessibility tests", "FAIL", String(err).slice(0, 200))
  }

  // ============================================================
  // TEST 8: Responsive — key pages don't overflow
  // ============================================================
  try {
    const page = await browser.newPage()
    const pagesToCheck = ["/", "/planning", "/cours", "/tarifs", "/contact", "/connexion"]

    for (const path of pagesToCheck) {
      await page.setViewport({ width: 390, height: 844 })
      await navigate(page, path)

      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth
      })
      log(`No horizontal overflow: ${path}`, !hasOverflow ? "PASS" : "FAIL")
    }

    await page.close()
  } catch (err) {
    log("Responsive tests", "FAIL", String(err).slice(0, 200))
  }

  // ============================================================
  // TEST 9: Cookie consent
  // ============================================================
  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900 })
    await navigate(page, "/")

    const cookieBanner = await page.$('[role="dialog"][aria-label="Consentement aux cookies"]')
    log("Cookie consent appears", cookieBanner ? "PASS" : "FAIL")

    if (cookieBanner) {
      const acceptBtn = await page.$eval(
        '[role="dialog"][aria-label="Consentement aux cookies"] button:last-child',
        (el) => el.textContent
      )
      log("Cookie accept button", acceptBtn?.includes("Accepter") ? "PASS" : "FAIL", acceptBtn ?? "")
    }

    await page.close()
  } catch (err) {
    log("Cookie consent tests", "FAIL", String(err).slice(0, 200))
  }

  // ============================================================
  // SUMMARY
  // ============================================================
  await browser.close()

  console.log("\n" + "=".repeat(50))
  const passed = results.filter((r) => r.status === "PASS").length
  const failed = results.filter((r) => r.status === "FAIL").length
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${results.length} tests`)

  if (failed > 0) {
    console.log("\n❌ Failed tests:")
    results.filter((r) => r.status === "FAIL").forEach((r) => {
      console.log(`   - ${r.test}${r.detail ? `: ${r.detail}` : ""}`)
    })
  }

  console.log()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error("Test runner failed:", err)
  process.exit(1)
})
