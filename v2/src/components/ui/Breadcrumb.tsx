import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  name: string
  href: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="mb-6">
      <ol className="flex items-center gap-1.5 text-sm font-heading flex-wrap">
        <li className="flex items-center gap-1.5">
          <Link
            href="/"
            className="text-mp-text-light hover:text-mp-ocean transition-colors flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Accueil</span>
          </Link>
        </li>
        {items.slice(1).map((item, i) => {
          const isLast = i === items.length - 2
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-mp-text-muted" aria-hidden="true" />
              {isLast ? (
                <span className="text-mp-ocean font-medium" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-mp-text-light hover:text-mp-ocean transition-colors"
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
