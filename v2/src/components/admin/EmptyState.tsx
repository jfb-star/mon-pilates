import type { LucideIcon } from "lucide-react"
import { clsx } from "clsx"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    icon?: LucideIcon
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const ActionIcon = action?.icon
  return (
    <div
      role="status"
      className={clsx(
        "flex flex-col items-center justify-center text-center py-12 px-6 bg-white rounded-xl border border-dashed border-gray-200",
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-mp-ocean/10 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-mp-ocean" aria-hidden="true" />
      </div>
      <p className="font-heading text-base font-semibold text-mp-charcoal">
        {title}
      </p>
      {description && (
        <p className="mt-1 text-sm text-mp-text-light max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-mp-ocean text-white rounded-lg text-sm font-medium hover:bg-mp-ocean-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mp-ocean"
        >
          {ActionIcon && <ActionIcon className="w-4 h-4" aria-hidden="true" />}
          {action.label}
        </button>
      )}
    </div>
  )
}
