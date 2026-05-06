import Skeleton from "@/components/ui/Skeleton"

interface AdminPageSkeletonProps {
  title?: string
  rows?: number
  columns?: number
  withFilters?: boolean
  withStats?: boolean
}

/**
 * Loading-boundary skeleton for /admin/* pages. Rendered *inside* AdminShell
 * (which provides the sidebar + breadcrumb bar) so it must not draw its own
 * page chrome — only the in-page elements (page title row, optional stats grid,
 * optional filter chips, table skeleton).
 */
export function AdminPageSkeleton({
  title = "Chargement…",
  rows = 6,
  columns = 5,
  withFilters = false,
  withStats = false,
}: AdminPageSkeletonProps) {
  return (
    <div role="status" aria-label={title}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page title placeholder */}
        <div className="flex items-center justify-between mb-6 gap-3">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>

        {withStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        )}

        {withFilters && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 rounded-md" />
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex gap-4 bg-gray-50 border-b border-gray-200 px-4 py-3">
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} className="h-3.5 flex-1" />
            ))}
          </div>
          <div className="divide-y divide-gray-100">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="flex gap-4 px-4 py-4 items-center">
                {Array.from({ length: columns }).map((__, j) => (
                  <Skeleton
                    key={j}
                    className={`h-4 flex-1 ${j === columns - 1 ? "max-w-[96px]" : ""}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
      <span className="sr-only">Chargement en cours…</span>
    </div>
  )
}
