/**
 * Real mobile audit — runs every page through:
 *  - Color contrast check (WCAG 1.4.3 / 1.4.11)
 *  - Touch target check (WCAG 2.5.5)
 *  - Text overflow / clipping detection
 *  - Horizontal overflow on body (a layout bug == real-world horizontal scroll)
 *  - Tiny / unreadable text detection
 *  - Hero text-over-image readability (sample background pixels under text)
 *
 * Outputs:
 *   screenshots/mobile-audit/_findings.json   (machine-readable)
 *   screenshots/mobile-audit/_findings.md     (human-readable summary)
 *   screenshots/mobile-audit/issue-<n>.png    (annotated capture per issue)
 */
import puppeteer, { Browser, Page } from "puppeteer";
import path from "path";
import fs from "fs";

const BASE = process.argv[2] || "http://localhost:3456";
const OUT = path.resolve(__dirname, "../screenshots/mobile-audit");
fs.mkdirSync(OUT, { recursive: true });

const VIEWPORT = { name: "iphone-se", w: 375, h: 667 }; // Most-constrained common iPhone

const PAGES = [
  { slug: "home", url: "/" },
  { slug: "tarifs", url: "/tarifs" },
  { slug: "planning", url: "/planning" },
  { slug: "carte-cadeau", url: "/carte-cadeau" },
  { slug: "premiere-visite", url: "/premiere-visite" },
  { slug: "connexion", url: "/connexion" },
  { slug: "contact", url: "/contact" },
  { slug: "cours", url: "/cours" },
  { slug: "equipe", url: "/equipe" },
  { slug: "about", url: "/about" },
  { slug: "blog", url: "/blog" },
];

interface Finding {
  page: string;
  severity: "critical" | "high" | "medium" | "low";
  category: "contrast" | "overflow" | "truncation" | "touch-target" | "tiny-text" | "hero-readability";
  message: string;
  selector?: string;
  details?: Record<string, unknown>;
}

const findings: Finding[] = [];

const auditScript = `
(() => {
  const out = {
    horizontalOverflow: false,
    bodyScrollWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
    overflowingElements: [],
    truncatedText: [],
    tinyText: [],
    smallTouchTargets: [],
    contrastIssues: [],
    heroIssues: [],
  };

  // 1. Horizontal overflow on body
  out.horizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;

  // 2. Find elements wider than viewport (causes horizontal scroll)
  const allEls = document.querySelectorAll("body *");
  for (const el of allEls) {
    const r = el.getBoundingClientRect();
    if (r.right > window.innerWidth + 1 || r.left < -1) {
      // Skip absolutely-positioned offscreen things (modals, slide-ins,
      // decorative blobs). Walk up to find any positioned ancestor.
      let positioned = false;
      let cur = el;
      while (cur && cur !== document.body) {
        const p = getComputedStyle(cur).position;
        if (p === "fixed" || p === "absolute") { positioned = true; break; }
        cur = cur.parentElement;
      }
      if (positioned) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.opacity === "0") continue;
      // Skip SVG path/polygon/etc — they don't cause body scroll
      if (el.tagName === "PATH" || el.tagName === "POLYGON" || el.tagName === "G") continue;
      if (r.width > window.innerWidth + 1) {
        out.overflowingElements.push({
          tag: el.tagName,
          cls: (el.className || "").toString().slice(0, 80),
          width: Math.round(r.width),
          right: Math.round(r.right),
          text: (el.textContent || "").trim().slice(0, 40),
        });
      }
    }
  }

  // 3. Truncated text (text-overflow:ellipsis where scrollWidth > clientWidth)
  for (const el of allEls) {
    if (!el.textContent || !el.textContent.trim()) continue;
    if (el.children.length > 0) continue; // leaf nodes only
    const cs = getComputedStyle(el);
    // Skip sr-only / visually-hidden elements (intentionally clipped for a11y)
    const cls = (el.className || "").toString();
    if (/(\\bsr-only\\b|\\bvisually-hidden\\b)/.test(cls)) continue;
    // Sr-only sets width:1px height:1px clip — detect by computed dimensions
    if (el.clientWidth <= 1 || el.clientHeight <= 1) continue;
    if (cs.textOverflow === "ellipsis" || cs.overflow === "hidden") {
      if (el.scrollWidth > el.clientWidth + 1) {
        out.truncatedText.push({
          tag: el.tagName,
          cls: cls.slice(0, 80),
          text: el.textContent.trim().slice(0, 60),
          scroll: el.scrollWidth, client: el.clientWidth,
        });
      }
    }
  }

  // 4. Tiny text (<12px effective)
  for (const el of allEls) {
    if (!el.textContent || !el.textContent.trim()) continue;
    if (el.children.length > 0) continue;
    const cs = getComputedStyle(el);
    const fs = parseFloat(cs.fontSize);
    if (fs > 0 && fs < 11) {
      out.tinyText.push({
        tag: el.tagName,
        cls: (el.className || "").toString().slice(0, 60),
        fs: fs.toFixed(1),
        text: el.textContent.trim().slice(0, 40),
      });
    }
  }

  // 5. Small touch targets (interactive elements <44x44 per WCAG 2.5.5)
  const interactive = document.querySelectorAll('a[href], button, [role="button"], input[type="checkbox"], input[type="radio"], input[type="submit"], input[type="button"]');
  for (const el of interactive) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue; // hidden
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.opacity === "0") continue;
    // Skip elements inside non-interactive contexts (e.g. inline links in body text)
    const parentLink = el.closest("nav, header, footer");
    const isInline = cs.display === "inline" && !parentLink;
    if (isInline) continue;
    if (r.width < 44 || r.height < 36) {
      out.smallTouchTargets.push({
        tag: el.tagName,
        cls: (el.className || "").toString().slice(0, 60),
        w: Math.round(r.width), h: Math.round(r.height),
        text: (el.textContent || "").trim().slice(0, 40),
      });
    }
  }

  // 6. Color contrast — sample text color against effective background
  function getLuminance(rgb) {
    const [r, g, b] = rgb.map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  function parseRgb(str) {
    const m = str.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/);
    return m ? [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])] : null;
  }
  function getEffectiveBg(el) {
    let cur = el;
    while (cur && cur !== document.body) {
      const cs = getComputedStyle(cur);
      const bg = cs.backgroundColor;
      const rgb = parseRgb(bg);
      const a = bg.match(/rgba\\(.*?,\\s*([\\d.]+)\\)$/);
      const alpha = a ? parseFloat(a[1]) : 1;
      if (rgb && alpha > 0.5) return rgb;
      // backgroundImage: url(...) is a real image — bail to "image".
      // Gradients are an intentional design choice (we skip) — sample
      // the gradient's first color stop instead.
      if (cs.backgroundImage && cs.backgroundImage !== "none") {
        if (/url\\(/.test(cs.backgroundImage)) return "image";
        // Try to extract first color stop from the gradient
        const grad = cs.backgroundImage;
        const colorMatch = grad.match(/rgba?\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)/);
        if (colorMatch) {
          return [parseInt(colorMatch[1]), parseInt(colorMatch[2]), parseInt(colorMatch[3])];
        }
        return "gradient";
      }
      cur = cur.parentElement;
    }
    return [255, 255, 255]; // assume white body
  }
  function contrast(rgb1, rgb2) {
    const l1 = getLuminance(rgb1);
    const l2 = getLuminance(rgb2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }

  // Detect if an element is positioned over a Next.js <Image> with dark
  // overlay siblings — common hero pattern. Returns true if so (skip
  // contrast check; bg can't be sampled and the dark scrim usually fixes it).
  function isOverDarkImageHero(el) {
    let cur = el;
    while (cur && cur !== document.body) {
      const sib = cur.parentElement?.querySelector(":scope > img, :scope > picture img");
      if (sib) {
        // Look for any dark overlay sibling
        const overlays = cur.parentElement?.querySelectorAll(":scope > [class*='absolute'], :scope > [class*='from-mp-charcoal'], :scope > [class*='bg-mp-charcoal']");
        if (overlays && overlays.length > 0) return true;
      }
      cur = cur.parentElement;
    }
    return false;
  }

  for (const el of allEls) {
    if (!el.textContent || !el.textContent.trim()) continue;
    if (el.children.length > 0) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.opacity === "0") continue;
    const cls2 = (el.className || "").toString();
    if (/(\\bsr-only\\b|\\bvisually-hidden\\b)/.test(cls2)) continue;
    if (el.clientWidth <= 1 || el.clientHeight <= 1) continue;
    const fg = parseRgb(cs.color);
    if (!fg) continue;
    if (isOverDarkImageHero(el)) continue; // Next.js <Image> with dark overlay
    const bg = getEffectiveBg(el);
    const fontSize = parseFloat(cs.fontSize);
    const fontWeight = parseInt(cs.fontWeight) || 400;
    const isLargeText = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
    const minRatio = isLargeText ? 3 : 4.5;
    if (bg === "image") {
      // Text potentially on image — flag for visual review
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && r.top < window.innerHeight) {
        out.heroIssues.push({
          tag: el.tagName,
          cls: (el.className || "").toString().slice(0, 60),
          text: el.textContent.trim().slice(0, 60),
          color: cs.color,
          fontSize, fontWeight,
          rect: { top: Math.round(r.top), left: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) },
        });
      }
      continue;
    }
    if (bg === "gradient") continue; // gradient with no parsable color stops
    const ratio = contrast(fg, bg);
    if (ratio < minRatio) {
      out.contrastIssues.push({
        tag: el.tagName,
        cls: (el.className || "").toString().slice(0, 60),
        text: el.textContent.trim().slice(0, 60),
        ratio: ratio.toFixed(2),
        required: minRatio,
        fg: cs.color,
        bg: \`rgb(\${bg.join(",")})\`,
        fontSize, fontWeight,
      });
    }
  }

  return out;
})();
`;

async function auditPage(browser: Browser, slug: string, url: string): Promise<void> {
  const page: Page = await browser.newPage();
  await page.setViewport({
    width: VIEWPORT.w,
    height: VIEWPORT.h,
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  // Pre-accept cookies to avoid the bottom banner overlapping things
  await page.evaluateOnNewDocument(() => {
    try { localStorage.setItem("mp_cookie_consent", "accepted"); } catch {}
  });

  try {
    await page.goto(`${BASE}${url}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 2500));
    const result = await page.evaluate(auditScript);

    const r = result as Record<string, unknown>;

    if (r.horizontalOverflow) {
      findings.push({
        page: slug, severity: "critical", category: "overflow",
        message: `Horizontal scroll on body: scrollWidth=${r.bodyScrollWidth} > viewport=${r.viewportWidth}`,
        details: r as Record<string, unknown>,
      });
    }

    const overflowing = r.overflowingElements as Array<Record<string, unknown>>;
    for (const el of overflowing.slice(0, 10)) {
      findings.push({
        page: slug, severity: "high", category: "overflow",
        message: `Element wider than viewport: ${el.tag}.${el.cls} (${el.width}px)`,
        details: el,
      });
    }

    const truncated = r.truncatedText as Array<Record<string, unknown>>;
    for (const el of truncated.slice(0, 20)) {
      findings.push({
        page: slug, severity: "high", category: "truncation",
        message: `Truncated text: "${el.text}"`,
        selector: el.cls as string,
        details: el,
      });
    }

    const tiny = r.tinyText as Array<Record<string, unknown>>;
    for (const el of tiny.slice(0, 10)) {
      findings.push({
        page: slug, severity: "medium", category: "tiny-text",
        message: `Text smaller than 11px: "${el.text}" (${el.fs}px)`,
        details: el,
      });
    }

    const targets = r.smallTouchTargets as Array<Record<string, unknown>>;
    for (const el of targets.slice(0, 15)) {
      findings.push({
        page: slug, severity: "medium", category: "touch-target",
        message: `Small touch target: ${el.tag} (${el.w}x${el.h}px) "${el.text}"`,
        details: el,
      });
    }

    const contrastIss = r.contrastIssues as Array<Record<string, unknown>>;
    for (const el of contrastIss.slice(0, 30)) {
      findings.push({
        page: slug,
        severity: parseFloat(el.ratio as string) < 3 ? "critical" : "high",
        category: "contrast",
        message: `Contrast ${el.ratio}:1 (need ${el.required}:1) — "${el.text}" (${el.fg} on ${el.bg})`,
        details: el,
      });
    }

    const heroes = r.heroIssues as Array<Record<string, unknown>>;
    for (const el of heroes.slice(0, 15)) {
      findings.push({
        page: slug, severity: "high", category: "hero-readability",
        message: `Text over image (manual contrast review needed): "${el.text}" (${el.color}, ${el.fontSize}px)`,
        details: el,
      });
    }

    // Save raw screenshot of the issue area for hero issues
    if (heroes.length > 0) {
      const screenPath = path.join(OUT, `_audit-${slug}-hero.png`);
      await page.screenshot({ path: screenPath, fullPage: false });
    }

    console.log(`✓ ${slug.padEnd(20)} overflow:${r.horizontalOverflow?"YES":"no"} elems:${overflowing.length} trunc:${truncated.length} tiny:${tiny.length} touch:${targets.length} contrast:${contrastIss.length} hero:${heroes.length}`);
  } catch (e) {
    console.warn("⚠", slug, (e as Error).message);
  }
  await page.close();
}

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  for (const p of PAGES) {
    await auditPage(browser, p.slug, p.url);
  }
  await browser.close();

  // Group findings
  const bySeverity: Record<string, Finding[]> = { critical: [], high: [], medium: [], low: [] };
  for (const f of findings) bySeverity[f.severity].push(f);

  const json = { totalFindings: findings.length, byCount: { critical: bySeverity.critical.length, high: bySeverity.high.length, medium: bySeverity.medium.length, low: bySeverity.low.length }, findings };
  fs.writeFileSync(path.join(OUT, "_findings.json"), JSON.stringify(json, null, 2));

  // Markdown summary
  const md: string[] = [];
  md.push(`# Mobile audit — iPhone SE (375×667)\n`);
  md.push(`**Total: ${findings.length} findings** — critical: ${bySeverity.critical.length}, high: ${bySeverity.high.length}, medium: ${bySeverity.medium.length}\n`);

  for (const sev of ["critical", "high", "medium"] as const) {
    const items = bySeverity[sev];
    if (items.length === 0) continue;
    md.push(`\n## ${sev.toUpperCase()} (${items.length})\n`);
    const byPage = new Map<string, Finding[]>();
    for (const f of items) {
      if (!byPage.has(f.page)) byPage.set(f.page, []);
      byPage.get(f.page)!.push(f);
    }
    for (const [page, list] of byPage) {
      md.push(`\n### ${page} (${list.length})\n`);
      for (const f of list.slice(0, 30)) {
        md.push(`- [${f.category}] ${f.message}`);
      }
    }
  }
  fs.writeFileSync(path.join(OUT, "_findings.md"), md.join("\n"));

  console.log(`\n📊 ${findings.length} findings — critical:${bySeverity.critical.length} high:${bySeverity.high.length} medium:${bySeverity.medium.length}`);
  console.log(`📄 Report: ${path.join(OUT, "_findings.md")}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
