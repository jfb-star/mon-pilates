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

// Goal: place CONFIG toggles BEFORE the "Use card" button so the user reads
// "first-time / recurring" config before deciding which CTA to tap.
// We achieve this by swapping the two blocks: move CONFIG up, "Use card" down.
const replacements = [
  {
    label: "swap-config-and-card-button",
    from: `              <div className="space-y-4">
                {/* Option 1: Use course card if available */}
                {activeCard && activeCard.remaining > 0 && (
                  <button
                    disabled={bookingLoading}
                    onClick={async () => {
                      setBookingLoading(true)
                      setBookingError("")
                      try {
                        const res = await fetch("/api/bookings/use-card", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ sessionId: selectedSession.id }),
                        })
                        if (handleAuthError(res.status)) return
                        const data = await res.json()
                        if (res.ok) {
                          setActiveCard({ ...activeCard, remaining: data.cardRemaining })
                          await handleRecurringAfterBooking(selectedSession.scheduleId)
                          setBookingSuccess({
                            message: data.status === "WAITLIST"
                              ? "Vous \\u00eates sur la liste d'attente ! Nous vous notifierons par email si une place se lib\\u00e8re."
                              : "Réservation confirmée !",
                            waitlist: data.status === "WAITLIST",
                          })
                        } else {
                          setBookingError(data.error || "Erreur lors de la réservation.")
                        }
                      } catch {
                        setBookingError("Erreur de connexion.")
                      } finally {
                        setBookingLoading(false)
                      }
                    }}
                    className="mp-btn mp-btn-primary w-full justify-center"
                  >
                    {bookingLoading ? "Réservation\\u2026" : (
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
    to: `              <div className="space-y-4">
                {/* CONFIG — toggles moved before any CTA so the user configures first, acts second */}
                {/* (toggles markup follows in next block) */}`,
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
