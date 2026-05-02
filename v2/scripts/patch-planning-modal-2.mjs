import fs from "node:fs";
const path = "src/app/planning/page.tsx";
let s = fs.readFileSync(path, "utf8");

function tryReplace(haystack, from, to) {
  if (haystack.includes(from)) return { ok: true, out: haystack.replace(from, to) };
  const fromCRLF = from.replace(/\n/g, "\r\n");
  const toCRLF = to.replace(/\n/g, "\r\n");
  if (haystack.includes(fromCRLF)) return { ok: true, out: haystack.replace(fromCRLF, toCRLF) };
  return { ok: false, out: haystack };
}

const replacements = [
  // Step A: REMOVE the Recurring toggle from the bottom of the actions block
  {
    label: "remove-recurring-bottom",
    from: `                {/* Recurring booking toggle */}
                <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-xl border border-mp-sand hover:border-mp-ocean/30 transition-colors">
                  <span className={\`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 mt-0.5 \${isRecurring ? "bg-mp-ocean" : "bg-mp-sand-dark"}\`}>
                    <span className={\`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform \${isRecurring ? "translate-x-5" : "translate-x-0"}\`} />
                    <input
                      type="checkbox"
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                      className="sr-only"
                    />
                  </span>
                  <span className="flex-1">
                    <span className="font-heading text-sm font-medium text-mp-charcoal group-hover:text-mp-ocean transition-colors flex items-center gap-1.5">
                      <Repeat className="w-3.5 h-3.5" aria-hidden="true" />
                      R&eacute;server ce cr&eacute;neau chaque semaine
                    </span>
                    <span className="text-xs text-mp-text-muted block mt-0.5">
                      Vous serez automatiquement inscrit(e) aux 4 prochaines s&eacute;ances
                    </span>
                  </span>
                </label>

              </div>
            ) : (`,
    to: `              </div>
            ) : (`,
  },
  // Step B: INSERT a "config" wrapper around Trial toggle that also contains the Recurring toggle
  // (Trial is already restyled to the boxed pattern; we'll add Recurring beneath it.)
  {
    label: "wrap-config-toggles",
    from: `                {/* Option 2: Trial toggle (first-timers only) — boxed for visibility */}
                {showTrialOptions && (
                  <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl border border-mp-sand hover:border-mp-ocean/30 transition-colors">
                    <span className={\`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 \${isTrial ? "bg-mp-ocean" : "bg-mp-sand-dark"}\`}>
                      <span className={\`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform \${isTrial ? "translate-x-5" : "translate-x-0"}\`} />
                      <input
                        type="checkbox"
                        checked={isTrial}
                        onChange={(e) => setIsTrial(e.target.checked)}
                        className="sr-only"
                      />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="font-heading text-sm font-medium text-mp-charcoal group-hover:text-mp-ocean transition-colors block">
                        C&apos;est ma premi&egrave;re s&eacute;ance
                      </span>
                      <span className="text-xs text-mp-sage block mt-0.5">
                        Cours d&eacute;couverte &agrave; <strong>10&nbsp;&euro;</strong> au lieu de 20&nbsp;&euro;
                      </span>
                    </span>
                  </label>
                )}`,
    to: `                {/* CONFIG — toggles (trial + recurring) grouped before the recap and actions */}
                <div className="space-y-2.5">
                  {showTrialOptions && (
                    <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl border border-mp-sand hover:border-mp-ocean/30 transition-colors">
                      <span className={\`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 \${isTrial ? "bg-mp-ocean" : "bg-mp-sand-dark"}\`}>
                        <span className={\`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform \${isTrial ? "translate-x-5" : "translate-x-0"}\`} />
                        <input
                          type="checkbox"
                          checked={isTrial}
                          onChange={(e) => setIsTrial(e.target.checked)}
                          className="sr-only"
                        />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="font-heading text-sm font-medium text-mp-charcoal group-hover:text-mp-ocean transition-colors block">
                          C&apos;est ma premi&egrave;re s&eacute;ance
                        </span>
                        <span className="text-xs text-mp-sage block mt-0.5">
                          Cours d&eacute;couverte &agrave; <strong>10&nbsp;&euro;</strong> au lieu de 20&nbsp;&euro;
                        </span>
                      </span>
                    </label>
                  )}
                  <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl border border-mp-sand hover:border-mp-ocean/30 transition-colors">
                    <span className={\`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 \${isRecurring ? "bg-mp-ocean" : "bg-mp-sand-dark"}\`}>
                      <span className={\`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform \${isRecurring ? "translate-x-5" : "translate-x-0"}\`} />
                      <input
                        type="checkbox"
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                        className="sr-only"
                      />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="font-heading text-sm font-medium text-mp-charcoal group-hover:text-mp-ocean transition-colors flex items-center gap-1.5">
                        <Repeat className="w-3.5 h-3.5" aria-hidden="true" />
                        Chaque semaine
                      </span>
                      <span className="text-xs text-mp-text-muted block mt-0.5">
                        Inscription auto. aux 4 prochaines s&eacute;ances
                      </span>
                    </span>
                  </label>
                </div>`,
  },
];

let okCount = 0;
let failCount = 0;
for (const r of replacements) {
  const result = tryReplace(s, r.from, r.to);
  if (result.ok) {
    s = result.out;
    okCount++;
    console.log(`  ✓ ${r.label}`);
  } else {
    failCount++;
    console.log(`  ✗ ${r.label}: NOT FOUND`);
  }
}

if (okCount > 0) {
  fs.writeFileSync(path, s);
  console.log(`\nWrote ${okCount} replacements (${failCount} failures)`);
}
process.exit(failCount > 0 ? 1 : 0);
