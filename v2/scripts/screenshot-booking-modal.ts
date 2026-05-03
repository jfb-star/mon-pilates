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

      // Wait for modal to be present (use aria-labelledby to disambiguate
      // from the Header's mobile drawer which also has role="dialog").
      await page.waitForSelector('[aria-labelledby="session-modal-title"]', { timeout: 8000 }).catch(() => null);
      await new Promise((r) => setTimeout(r, 800));

      const file = path.join(OUT, `${vp.name}-planning-modal-top.png`);
      await page.screenshot({ path: file, fullPage: false });
      console.log("  ✓", path.relative(OUT, file));

      const stickyDiag = await page.evaluate(() => {
        const dialog = document.querySelector('[aria-labelledby="session-modal-title"]') as HTMLElement | null;
        if (!dialog) return "no session modal";
        const stickies = Array.from(dialog.querySelectorAll<HTMLElement>("*"))
          .filter((el) => getComputedStyle(el).position === "sticky")
          .map((el) => ({
            cls: el.className.slice(0, 60),
            top: getComputedStyle(el).top,
            rect: el.getBoundingClientRect(),
          }));
        return JSON.stringify({ stickyCount: stickies.length, stickies }, null, 2);
      });
      console.log(`  sticky diag:\n${stickyDiag}`);

      // Target the session booking modal specifically (Header has its own
      // role="dialog" mobile drawer that would otherwise match).
      const scrollDiag = await page.evaluate(() => {
        const dialog = document.querySelector('[aria-labelledby="session-modal-title"]') as HTMLElement | null;
        if (!dialog) return "no session modal";
        const candidates: HTMLElement[] = [
          dialog,
          ...Array.from(dialog.children).filter((c): c is HTMLElement => c instanceof HTMLElement),
          document.scrollingElement as HTMLElement | null,
          document.body,
          document.documentElement,
        ].filter((x): x is HTMLElement => !!x);
        const before = candidates.map((el, i) => ({
          i, tag: el.tagName, cls: (el.className || "").toString().slice(0, 40),
          ch: el.clientHeight, sh: el.scrollHeight, ovY: getComputedStyle(el).overflowY,
        }));
        // Try to scroll each
        candidates.forEach((el) => { try { el.scrollTop = 99999; } catch {} });
        const after = candidates.map((el) => el.scrollTop);
        return JSON.stringify({ before, after }, null, 2);
      });
      console.log(`  scroll diag:\n${scrollDiag}`);

      // Use the bottom-most action button as the scroll target.
      await page.evaluate(() => {
        const dialog = document.querySelector('[aria-labelledby="session-modal-title"]');
        const btns = dialog ? Array.from(dialog.querySelectorAll('button')) : [];
        const last = btns[btns.length - 1];
        if (last) (last as HTMLElement).scrollIntoView({ block: "end", inline: "center" });
      });
      await new Promise((r) => setTimeout(r, 600));
      // After scroll, where is the sticky header?
      const stickyAfter = await page.evaluate(() => {
        const dialog = document.querySelector('[aria-labelledby="session-modal-title"]');
        const sticky = dialog?.querySelector(".sticky") as HTMLElement | null;
        if (!sticky) return "no sticky";
        const r = sticky.getBoundingClientRect();
        return `sticky after scroll: y=${r.top} h=${r.height} viewport=${window.innerHeight}`;
      });
      console.log(`  ${stickyAfter}`);
      await new Promise((r) => setTimeout(r, 600));
      const fileBottom = path.join(OUT, `${vp.name}-planning-modal-bottom.png`);
      await page.screenshot({ path: fileBottom, fullPage: false });
      console.log("  ✓", path.relative(OUT, fileBottom));

      // Mid scroll for récap visibility
      await page.evaluate(() => {
        const dialog = document.querySelector('[aria-labelledby="session-modal-title"]') as HTMLElement | null;
        if (dialog) dialog.scrollTop = Math.floor(dialog.scrollHeight * 0.5);
      });
      await new Promise((r) => setTimeout(r, 400));
      const fileMid = path.join(OUT, `${vp.name}-planning-modal-mid.png`);
      await page.screenshot({ path: fileMid, fullPage: false });
      console.log("  ✓", path.relative(OUT, fileMid));
    } catch (e) {
      console.warn("  ⚠", vp.name, (e as Error).message);
    }
    await page.close();
  }
  await browser.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
