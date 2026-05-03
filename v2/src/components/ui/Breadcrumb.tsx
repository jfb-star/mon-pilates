import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  name: string
  href: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="mb-6">
      <ol className="flex items-center gap-1 text-sm font-heading flex-wrap">
        <li className="flex items-center gap-1">
          <Link
            href="/"
            className="text-mp-text-light hover:text-mp-ocean transition-colors inline-flex items-center gap-1.5 min-h-[44px] min-w-[44px] sm:min-w-0 sm:min-h-0 px-1 -mx-1 rounded"
            aria-label="Retour à l'accueil"
          >
            <Home className="w-4 h-4 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Accueil</span>
          </Link>
        </li>
        {items.slice(1).map((item, i) => {
          const isLast = i === items.length - 2
          return (
            <li key={item.href} className="flex items-center gap-1">
              <ChevronRight className="w-3.5 h-3.5 text-mp-text-muted shrink-0" aria-hidden="true" />
              {isLast ? (
                <span className="text-mp-ocean-dark font-medium py-2.5 sm:py-0" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-mp-text-light hover:text-mp-ocean transition-colors inline-flex items-center min-h-[44px] sm:min-h-0 px-1 -mx-1 rounded"
                >
                  {item.name}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
