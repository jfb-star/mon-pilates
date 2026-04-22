import { clsx } from "clsx";

/**
 * Base Skeleton primitive — réutilisable partout.
 *
 * Usage:
 *   <Skeleton className="h-24 w-full rounded-xl" />
 *
 * A11y :
 *   - Pas de texte, purement décoratif (aria-hidden). Le parent doit
 *     fournir un `role="status"` + `aria-label="Chargement…"`.
 *   - L'animation shimmer est neutralisée globalement par la règle
 *     `@media (prefers-reduced-motion: reduce)` dans globals.css.
 */
export default function Skeleton({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        "bg-mp-sand/60 animate-shimmer rounded-md",
        className
      )}
      {...rest}
    />
  );
}

/** Rend N `<Skeleton />` identiques — utile pour les listes/grilles. */
export function SkeletonList({
  count = 3,
  className,
  itemClassName,
}: {
  count?: number;
  className?: string;
  itemClassName?: string;
}) {
  return (
    <div className={className} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className={itemClassName} />
      ))}
    </div>
  );
}

/* ============================================================
   Variantes existantes — conservées pour compat descendante
   ============================================================ */

export function SkeletonLine({ width = "100%" }: { width?: string }) {
  return (
    <div
      className="h-4 rounded-md bg-gray-200 animate-shimmer"
      style={{ width }}
    />
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  const widths = ["100%", "92%", "78%", "85%", "65%"];
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }, (_, i) => (
        <SkeletonLine key={i} width={widths[i % widths.length]} />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 48 }: { size?: number }) {
  return (
    <div
      className="rounded-full bg-gray-200 animate-shimmer"
      style={{ width: size, height: size }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm">
      <div className="h-40 bg-gray-200 animate-shimmer" />
      <div className="p-5 space-y-3">
        <SkeletonLine width="60%" />
        <SkeletonText lines={2} />
        <SkeletonLine width="35%" />
      </div>
    </div>
  );
}

export function SkeletonButton({ width = "120px" }: { width?: string }) {
  return (
    <div
      className="h-10 rounded-xl bg-gray-200 animate-shimmer"
      style={{ width }}
    />
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
