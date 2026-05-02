import fs from "node:fs";
const path = "src/lib/pricing-plans.ts";
let s = fs.readFileSync(path, "utf8");

// Tag each plan based on its name. Order matches pricingPlans[] entries.
const tags = [
  { match: 'name: "Découverte — Tapis"', cat: "tapis" },
  { match: 'name: "Séance tapis à l\'unité"', cat: "tapis" },
  { match: 'name: "Carte 5 cours tapis"', cat: "tapis" },
  { match: 'name: "Carte 10 cours tapis"', cat: "tapis" },
  { match: 'name: "Carte 20 cours tapis"', cat: "tapis" },
  { match: 'name: "Découverte Privé sur équipement"', cat: "prive" },
  { match: 'name: "Privé sur équipement"', cat: "prive" },
  { match: 'name: "Carte 10 privés équipement"', cat: "prive" },
];

let count = 0;
for (const { match, cat } of tags) {
  if (!s.includes(match)) {
    console.warn(`  ⚠ not found: ${match}`);
    continue;
  }
  // Insert `category: "<cat>"` immediately after the matching `name:` line.
  // We splice into the closing `},` of that object — find next `},` after match.
  const i = s.indexOf(match);
  const closeIdx = s.indexOf("\n  },", i);
  if (closeIdx < 0) { console.warn(`  ⚠ no close brace after ${match}`); continue; }
  // Detect whether category already present
  const objText = s.slice(i, closeIdx);
  if (/category:\s*"/.test(objText)) {
    console.log(`  · already has category: ${match}`);
    continue;
  }
  // Insert before the close brace, preserving indentation
  const insert = `\n    category: "${cat}",`;
  s = s.slice(0, closeIdx) + insert + s.slice(closeIdx);
  count++;
  console.log(`  ✓ tagged ${match} → ${cat}`);
}

fs.writeFileSync(path, s);
console.log(`\nWrote ${count} categories to ${path}`);
