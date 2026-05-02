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

const PAGES = [
  { slug: "home", url: "/" },
  { slug: "tarifs", url: "/tarifs" },
  { slug: "planning", url: "/planning" },
  { slug: "carte-cadeau", url: "/carte-cadeau" },
  { slug: "premiere-visite", url: "/premiere-visite" },
  { slug: "connexion", url: "/connexion" },
  { slug: "contact", url: "/contact" },
];

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.w, height: vp.h, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    for (const p of PAGES) {
      try {
        await page.goto(`${BASE}${p.url}`, { waitUntil: "domcontentloaded", timeout: 60000 });
        await new Promise((r) => setTimeout(r, 1500));
        const file = path.join(OUT, `${vp.name}-${p.slug}-full.png`);
        await page.screenshot({ path: file, fullPage: true });
        console.log("✓", path.relative(OUT, file));
        const fileFold = path.join(OUT, `${vp.name}-${p.slug}-fold.png`);
        await page.screenshot({ path: fileFold, fullPage: false });
        console.log("✓", path.relative(OUT, fileFold));
      } catch (e) {
        console.warn("⚠", vp.name, p.slug, (e as Error).message);
      }
    }
    await page.close();
  }
  await browser.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
