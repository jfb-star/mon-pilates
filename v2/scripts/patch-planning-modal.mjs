import fs from "node:fs";
const path = "src/app/planning/page.tsx";
let s = fs.readFileSync(path, "utf8");

// Helper: try both CRLF and LF forms of `from` since the file may be mixed.
function tryReplace(haystack, from, to) {
  if (haystack.includes(from)) return { ok: true, out: haystack.replace(from, to) };
  const fromCRLF = from.replace(/\n/g, "\r\n");
  const toCRLF = to.replace(/\n/g, "\r\n");
  if (haystack.includes(fromCRLF)) return { ok: true, out: haystack.replace(fromCRLF, toCRLF) };
  return { ok: false, out: haystack };
}

const replacements = [
  // 1. Récap "Formule" → drop the row, and merge into the "Prix total" row
  // which becomes "À payer" with carte-aware label.
  {
    from: `                    <div className="flex justify-between gap-4">
                      <dt className="text-mp-text-muted">Formule</dt>
                      <dd className="text-right text-mp-charcoal font-heading font-medium">
                        {isTrial ? "Cours d\\u2019essai" : "Paiement à l\\u2019unité"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4 pt-2 mt-2 border-t border-mp-sand">
                      <dt className="text-mp-charcoal font-heading font-semibold">
                        Prix total
                      </dt>
                      <dd className="text-right text-mp-charcoal font-heading font-bold text-base">
                        {isTrial ? "10" : "20"}&nbsp;&euro;
                      </dd>
                    </div>`,
    to: `                    <div className="flex justify-between gap-3 pt-2 mt-2 border-t border-mp-sand">
                      <dt className="text-mp-charcoal font-heading font-semibold">
                        À payer
                      </dt>
                      <dd className="text-right text-mp-charcoal font-heading font-bold text-base">
                        {activeCard && activeCard.remaining > 0 ? (
                          <span className="text-mp-sage">
                            <span className="line-through text-mp-text-muted text-xs font-normal mr-2">{isTrial ? "10" : "20"}&nbsp;&euro;</span>
                            1 séance carte
                          </span>
                        ) : (
                          <>{isTrial ? "10" : "20"}&nbsp;&euro;</>
                        )}
                      </dd>
                    </div>`,
  },
  // 2. Tighten récap fields
  {
    from: `                  <dl className="space-y-2 text-sm font-body text-mp-text-light">
                    <div className="flex justify-between gap-4">
                      <dt className="text-mp-text-muted">Séance</dt>
                      <dd className="text-right text-mp-charcoal font-heading font-medium">
                        {courseTypeLabels[selectedSession.courseType as keyof typeof courseTypeLabels] ?? selectedSession.courseName} — {dayNames[selectedSession.dayOffset]} {selectedSession.time}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-mp-text-muted">Instructrice</dt>
                      <dd className="text-right text-mp-charcoal font-heading font-medium">
                        {selectedSession.instructor}
                      </dd>
                    </div>`,
    to: `                  <dl className="space-y-2 text-sm font-body text-mp-text-light">
                    <div className="flex justify-between gap-3">
                      <dt className="text-mp-text-muted shrink-0">Séance</dt>
                      <dd className="text-right text-mp-charcoal font-heading font-medium min-w-0 break-words">
                        {courseTypeLabels[selectedSession.courseType as keyof typeof courseTypeLabels] ?? selectedSession.courseName}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-mp-text-muted shrink-0">Quand</dt>
                      <dd className="text-right text-mp-charcoal font-heading font-medium">
                        {dayNames[selectedSession.dayOffset]} {selectedSession.time}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-mp-text-muted shrink-0">Avec</dt>
                      <dd className="text-right text-mp-charcoal font-heading font-medium">
                        {selectedSession.instructor}
                      </dd>
                    </div>`,
  },
  // 3. "Réserver avec ma carte" — stack content vertically + remove "ou" separator
  {
    from: `                    {bookingLoading ? "Réservation\\u2026" : (
                      <>
                        <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                        Réserver avec ma carte ({activeCard.remaining}/{activeCard.total} restants)
                      </>
                    )}
                  </button>
                )}

                {/* Separator if card option is shown */}
                {activeCard && activeCard.remaining > 0 && (
                  <div className="flex items-center gap-3 text-xs text-mp-text-muted">
                    <span className="flex-1 h-px bg-mp-sand-dark/30" />
                    ou
                    <span className="flex-1 h-px bg-mp-sand-dark/30" />
                  </div>
                )}`,
    to: `                    {bookingLoading ? "Réservation\\u2026" : (
                      <span className="flex flex-col items-center gap-0.5 leading-tight">
                        <span className="inline-flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                          Réserver avec ma carte
                        </span>
                        <span className="text-[11px] font-body font-normal opacity-90">
                          {activeCard.remaining} séance{activeCard.remaining > 1 ? "s" : ""} restante{activeCard.remaining > 1 ? "s" : ""} sur {activeCard.total}
                        </span>
                      </span>
                    )}
                  </button>
                )}`,
  },
  // 4. On-site button: strip mp-btn styling, use text-link style
  {
    from: `                  className="mp-btn mp-btn-secondary w-full justify-center text-sm"
                >
                  R&eacute;gler sur place au studio
                </button>

                {/* Link to buy a card */}
                {!activeCard && (
                  <p className="text-center text-xs text-mp-text-muted mt-1">
                    <a href="/tarifs" className="text-mp-ocean hover:underline">
                      Acheter une carte de cours &rarr;
                    </a>{" "}
                    pour r&eacute;server sans payer &agrave; chaque fois
                  </p>
                )}

                {/* Recurring booking toggle */}`,
    to: `                  className="block w-full text-center text-sm font-heading font-medium text-mp-text-light hover:text-mp-charcoal hover:underline py-2.5"
                >
                  R&eacute;gler sur place au studio
                </button>

                {/* Recurring booking toggle */}`,
  },
];

let okCount = 0;
let failCount = 0;
for (const r of replacements) {
  const result = tryReplace(s, r.from, r.to);
  if (result.ok) {
    s = result.out;
    okCount++;
    console.log(`  ✓ replaced #${okCount}`);
  } else {
    failCount++;
    console.log(`  ✗ NOT FOUND: ${r.from.split("\n")[0].slice(0, 80)}...`);
  }
}

if (okCount > 0) {
  fs.writeFileSync(path, s);
  console.log(`\nWrote ${okCount} replacements (${failCount} failures) to ${path}`);
}
process.exit(failCount > 0 ? 1 : 0);
