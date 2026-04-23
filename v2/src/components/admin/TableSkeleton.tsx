import Skeleton from "@/components/ui/Skeleton"

interface TableSkeletonProps {
  /** Number of skeleton rows to render (default 6). */
  rows?: number
  /** Number of skeleton columns (default 5). */
  columns?: number
  /** Show header bar (default true). */
  withHeader?: boolean
  /** Aria label for screen readers (default "Chargement…"). */
  label?: string
}

/**
 * Inline table skeleton used inside admin tabs, so the user sees the shape
 * of the list while it loads instead of a bare spinner.
 */
export function TableSkeleton({
  rows = 6,
  columns = 5,
  withHeader = true,
  label = "Chargement…",
}: TableSkeletonProps) {
  return (
    <div
      role="status"
      aria-label={label}
      aria-live="polite"
      className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
    >
      {withHeader && (
        <div className="flex gap-4 bg-gray-50/50 border-b border-gray-100 px-4 py-3">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-3.5 flex-1" />
          ))}
        </div>
      )}
      <div className="divide-y divide-gray-50">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-4 items-center">
            {Array.from({ length: columns }).map((__, j) => (
              <Skeleton
                key={j}
                className={`h-4 flex-1 ${
                  j === columns - 1 ? "max-w-[96px]" : ""
                }`}
              />
            ))}
          </div>
        ))}
      </div>
      <span className="sr-only">{label}</span>
    </div>
  )
}
