import { redirect } from "next/navigation"
import Link from "next/link"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface Stats {
  clients?: { created: number; updated: number; skipped: number; errored: number }
  cards?: { created: number; updated: number; skipped: number; errored: number }
  bookings?: { created: number; updated: number; skipped: number; errored: number }
}
interface BatchError {
  resource: string
  sourceId: string | number
  message: string
}

/** Format ISO date to "DD/MM/YYYY HH:mm" */
function fmt(d: Date | null): string {
  if (!d) return "—"
  return d.toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

export default async function MigrationAdminPage() {
  const session = await requireAdmin()
  if (!session) redirect("/connexion?returnTo=/admin/migration")

  const [batches, stats, recentWebhooks] = await Promise.all([
    prisma.migrationBatch.findMany({ orderBy: { startedAt: "desc" }, take: 20 }),
    Promise.all([
      prisma.user.count({ where: { migrationSource: "BSPORT_IMPORT" } }),
      prisma.user.count({ where: { migrationSource: "BSPORT_IMPORT", needsActivation: true } }),
      prisma.courseCard.count({ where: { bsportId: { not: null } } }),
      prisma.booking.count({ where: { bsportId: { not: null } } }),
    ]),
    prisma.bsportWebhookEvent.findMany({ orderBy: { receivedAt: "desc" }, take: 10 }),
  ])

  const [importedUsers, pendingActivation, importedCards, importedBookings] = stats

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="font-heading text-3xl font-bold text-mp-charcoal mb-2">Migration Bsport → V2</h1>
        <p className="text-sm text-mp-text-light">
          Import clients, cartes de cours et réservations depuis Bsport. Les imports sont idempotents — relancer ne crée pas de doublons.
        </p>
      </div>

      {/* Stats globales */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <Stat label="Comptes importés" value={importedUsers} />
        <Stat label="En attente activation" value={pendingActivation} highlight={pendingActivation > 0 ? "amber" : undefined} />
        <Stat label="Cartes importées" value={importedCards} />
        <Stat label="Réservations importées" value={importedBookings} />
      </section>

      {/* How-to */}
      <section className="bg-mp-cream/50 border border-mp-sand-dark/30 rounded-2xl p-6 mb-10">
        <h2 className="font-heading text-lg font-semibold text-mp-charcoal mb-3">Comment importer</h2>
        <p className="text-sm text-mp-text-light mb-3">
          Lance le CLI depuis ton terminal local. L'import lit les fixtures (test) ou l'API Bsport (prod).
        </p>
        <ol className="space-y-2 text-sm text-mp-text-light list-decimal pl-5">
          <li>Tester avec les fixtures :{" "}
            <code className="bg-white px-2 py-0.5 rounded text-xs">npx tsx scripts/import-bsport.ts --source=fixture --dry-run</code>
          </li>
          <li>Configurer les env vars : <code className="bg-white px-2 py-0.5 rounded text-xs">BSPORT_API_KEY</code>, <code className="bg-white px-2 py-0.5 rounded text-xs">BSPORT_CLIENT_ID</code>, <code className="bg-white px-2 py-0.5 rounded text-xs">BSPORT_COMPANY_ID</code></li>
          <li>Dry-run depuis l'API :{" "}
            <code className="bg-white px-2 py-0.5 rounded text-xs">npx tsx scripts/import-bsport.ts --source=api --dry-run</code>
          </li>
          <li>Import réel : retire <code className="bg-white px-2 py-0.5 rounded text-xs">--dry-run</code></li>
          <li>Envoyer les emails d'activation : ajouter <code className="bg-white px-2 py-0.5 rounded text-xs">--send-emails</code></li>
        </ol>
        <p className="text-xs text-mp-text-muted mt-4">
          Les batches apparaissent ci-dessous. Le rapport JSON détaillé est aussi écrit en local : <code>migration-report-{"{batchId}"}.json</code>.
        </p>
      </section>

      {/* Batches */}
      <section className="mb-10">
        <h2 className="font-heading text-xl font-semibold text-mp-charcoal mb-4">Imports récents</h2>
        {batches.length === 0 ? (
          <p className="text-sm text-mp-text-muted italic">Aucun import lancé pour l'instant.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-mp-sand-dark/30 text-left">
                <tr>
                  <th className="py-2 pr-4 font-heading text-xs uppercase tracking-wide text-mp-text-muted">Batch</th>
                  <th className="py-2 pr-4 font-heading text-xs uppercase tracking-wide text-mp-text-muted">Source</th>
                  <th className="py-2 pr-4 font-heading text-xs uppercase tracking-wide text-mp-text-muted">Lancé</th>
                  <th className="py-2 pr-4 font-heading text-xs uppercase tracking-wide text-mp-text-muted">Status</th>
                  <th className="py-2 pr-4 font-heading text-xs uppercase tracking-wide text-mp-text-muted">Résultats</th>
                  <th className="py-2 pr-4 font-heading text-xs uppercase tracking-wide text-mp-text-muted">Erreurs</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((b) => {
                  const stats: Stats = JSON.parse(b.stats || "{}")
                  const errors: BatchError[] = JSON.parse(b.errors || "[]")
                  const totalCreated = (stats.clients?.created ?? 0) + (stats.cards?.created ?? 0) + (stats.bookings?.created ?? 0)
                  const totalUpdated = (stats.clients?.updated ?? 0) + (stats.cards?.updated ?? 0) + (stats.bookings?.updated ?? 0)
                  return (
                    <tr key={b.id} className="border-b border-mp-sand/40">
                      <td className="py-2 pr-4 font-mono text-xs text-mp-charcoal">{b.id.slice(0, 24)}</td>
                      <td className="py-2 pr-4 text-mp-text-light">{b.source}</td>
                      <td className="py-2 pr-4 text-mp-text-light">{fmt(b.startedAt)}</td>
                      <td className="py-2 pr-4">
                        <BatchBadge status={b.status} />
                      </td>
                      <td className="py-2 pr-4 text-mp-charcoal">
                        {totalCreated > 0 && <span className="text-mp-sage">+{totalCreated} </span>}
                        {totalUpdated > 0 && <span className="text-mp-ocean">~{totalUpdated}</span>}
                        {totalCreated === 0 && totalUpdated === 0 && <span className="text-mp-text-muted">—</span>}
                      </td>
                      <td className="py-2 pr-4 text-mp-text-light">
                        {errors.length > 0 ? <span className="text-mp-rose-dark font-medium">{errors.length}</span> : "—"}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Webhook activity */}
      <section>
        <h2 className="font-heading text-xl font-semibold text-mp-charcoal mb-2">Webhooks Bsport (10 derniers)</h2>
        <p className="text-xs text-mp-text-muted mb-4">
          URL à configurer dans Bsport Settings → Webhook :{" "}
          <code className="bg-mp-cream px-2 py-0.5 rounded">https://mon-pilates.bzh/api/webhooks/bsport?secret=YOUR_SECRET</code>
        </p>
        {recentWebhooks.length === 0 ? (
          <p className="text-sm text-mp-text-muted italic">Aucun webhook reçu pour l'instant.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-mp-sand-dark/30 text-left">
                <tr>
                  <th className="py-2 pr-4 font-heading text-xs uppercase tracking-wide text-mp-text-muted">Reçu</th>
                  <th className="py-2 pr-4 font-heading text-xs uppercase tracking-wide text-mp-text-muted">Type</th>
                  <th className="py-2 pr-4 font-heading text-xs uppercase tracking-wide text-mp-text-muted">Status</th>
                  <th className="py-2 pr-4 font-heading text-xs uppercase tracking-wide text-mp-text-muted">Erreur</th>
                </tr>
              </thead>
              <tbody>
                {recentWebhooks.map((w) => (
                  <tr key={w.eventKey} className="border-b border-mp-sand/40">
                    <td className="py-2 pr-4 text-mp-text-light">{fmt(w.receivedAt)}</td>
                    <td className="py-2 pr-4 font-mono text-xs">{w.eventType}</td>
                    <td className="py-2 pr-4"><BatchBadge status={w.status} /></td>
                    <td className="py-2 pr-4 text-xs text-mp-rose-dark max-w-md truncate">{w.error ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="mt-12">
        <Link href="/admin" className="text-sm text-mp-ocean hover:underline">← Retour à l'admin</Link>
      </div>
    </main>
  )
}

function Stat({ label, value, highlight }: { label: string; value: number; highlight?: "amber" }) {
  const tone = highlight === "amber"
    ? "border-amber-300 bg-amber-50/60"
    : "border-mp-sand-dark/30 bg-white"
  return (
    <div className={`rounded-2xl border p-4 ${tone}`}>
      <p className="font-heading text-3xl font-bold text-mp-charcoal">{value}</p>
      <p className="text-xs text-mp-text-light mt-1">{label}</p>
    </div>
  )
}

function BatchBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    RUNNING: "bg-amber-100 text-amber-800",
    DONE: "bg-mp-sage/15 text-mp-sage-dark",
    PROCESSED: "bg-mp-sage/15 text-mp-sage-dark",
    FAILED: "bg-red-100 text-red-700",
    SKIPPED: "bg-mp-sand text-mp-text-light",
    RECEIVED: "bg-mp-ocean/10 text-mp-ocean-dark",
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-heading font-medium ${map[status] ?? "bg-mp-sand text-mp-text-light"}`}>
      {status}
    </span>
  )
}
