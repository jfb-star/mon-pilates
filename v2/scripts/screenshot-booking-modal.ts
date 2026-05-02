import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

const BASE = process.argv[2] || "http://localhost:3456";
const OUT = path.resolve(__dirname, "../screenshots/mobile-audit");
fs.mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: "iphone12", w: 390, h: 844 },
  { name: "iphone-se", w: 375, h: 667 },
  { name: "galaxy-fold", w: 320, h: 700 },
];

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.w, height: vp.h, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    try {
      // Pre-accept cookies so the bottom-of-page banner doesn't overlap the modal
      await page.evaluateOnNewDocument(() => {
        try { localStorage.setItem("mp_cookie_consent", "accepted"); } catch {}
      });
      await page.goto(`${BASE}/planning`, { waitUntil: "domcontentloaded", timeout: 60000 });
      await new Promise((r) => setTimeout(r, 3000));

      // Session cards are <button class="group w-full text-left p-3 rounded-xl bg-white border ...">
      // with first <p> being the time (e.g. "09:30"). Find an enabled (non-full) one.
      const clicked = await page.evaluate(() => {
        const sessionBtn = document.querySelector(
          'button.group.w-full.text-left.p-3.rounded-xl:not(.opacity-50)'
        ) as HTMLButtonElement | null;
        if (sessionBtn) { sessionBtn.click(); return sessionBtn.textContent?.trim().slice(0, 60); }
        return null;
      });
      console.log(`  ${vp.name}: clicked → ${clicked}`);
      await new Promise((r) => setTimeout(r, 2000));

      // Wait for modal to be present
      await page.waitForSelector('[role="dialog"]', { timeout: 8000 }).catch(() => null);
      await new Promise((r) => setTimeout(r, 800));

      const file = path.join(OUT, `${vp.name}-planning-modal-top.png`);
      await page.screenshot({ path: file, fullPage: false });
      console.log("  ✓", path.relative(OUT, file));

      // Diagnostic: log modal scroll metrics
      const scrollInfo = await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]') as HTMLElement | null;
        if (!dialog) return "no dialog";
        const all = Array.from(dialog.querySelectorAll<HTMLElement>("*"));
        const scrollables = all.filter((el) => {
          const cs = getComputedStyle(el);
          return (cs.overflowY === "auto" || cs.overflowY === "scroll");
        }).map((el) => ({
          cls: el.className.slice(0, 50),
          ch: el.clientHeight, sh: el.scrollHeight, scrollable: el.scrollHeight > el.clientHeight,
        }));
        return JSON.stringify({ dialog: { ch: dialog.clientHeight, sh: dialog.scrollHeight }, scrollables }, null, 2);
      });
      console.log(`  scroll info:\n${scrollInfo}`);

      // Use a CSS rule injected at top-level to disable max-height so all content shows in screenshot
      await page.addStyleTag({ content: `
        [role="dialog"] > div { max-height: none !important; overflow: visible !important; }
        [role="dialog"] { align-items: flex-start !important; overflow: visible !important; }
      ` });
      await new Promise((r) => setTimeout(r, 400));

      const fileFull = path.join(OUT, `${vp.name}-planning-modal-expanded.png`);
      await page.screenshot({ path: fileFull, fullPage: true });
      console.log("  ✓", path.relative(OUT, fileFull));
    } catch (e) {
      console.warn("  ⚠", vp.name, (e as Error).message);
    }
    await page.close();
  }
  await browser.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
