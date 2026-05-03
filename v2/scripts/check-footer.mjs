import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: true });
const p = await b.newPage();
await p.setViewport({ width: 375, height: 667, isMobile: true, deviceScaleFactor: 2 });
await p.goto("http://localhost:3456", { waitUntil: "domcontentloaded" });
await new Promise(r => setTimeout(r, 1500));
const info = await p.evaluate(() => {
  const h2 = document.querySelector('footer h2');
  if (!h2) return "no footer h2";
  const cs = getComputedStyle(h2);
  const cls = h2.className;
  // Get all CSS rules that match this h2
  const rules = [];
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules || [])) {
        if (rule instanceof CSSStyleRule) {
          if (h2.matches(rule.selectorText) && rule.style.color) {
            rules.push({ selector: rule.selectorText, color: rule.style.color });
          }
        }
      }
    } catch {}
  }
  return JSON.stringify({
    h2_class: cls,
    h2_color_computed: cs.color,
    matching_color_rules: rules,
  });
});
console.log(info);
await b.close();
