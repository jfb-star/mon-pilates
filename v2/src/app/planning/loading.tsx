export default function PlanningLoading() {
  return (
    <div role="status" aria-label="Chargement du planning">
      {/* Hero skeleton */}
      <section className="relative h-[40vh] min-h-[320px] bg-mp-sand animate-pulse" />

      {/* Banner skeleton */}
      <div className="bg-mp-ocean/5 border-b border-mp-ocean/10">
        <div className="mp-container py-3 flex items-center justify-center gap-3">
          <div className="w-48 h-4 rounded bg-mp-sand-dark/30 animate-pulse" />
        </div>
      </div>

      {/* Planning skeleton */}
      <div className="mp-section bg-mp-cream">
        <div className="mp-container">
          {/* Week nav skeleton */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-mp-sand-dark/30 animate-pulse" />
              <div className="w-48 h-6 rounded-lg bg-mp-sand-dark/30 animate-pulse" />
              <div className="w-10 h-10 rounded-full bg-mp-sand-dark/30 animate-pulse" />
            </div>
            <div className="w-24 h-10 rounded-full bg-mp-sand-dark/30 animate-pulse" />
          </div>

          {/* Mobile day tabs skeleton */}
          <div className="flex sm:hidden gap-1.5 mb-4">
            {[0, 1, 2, 3, 4, 5].map((d) => (
              <div key={d} className="w-16 h-14 rounded-xl bg-mp-sand-dark/20 animate-pulse" />
            ))}
          </div>

          {/* Mobile session cards skeleton */}
          <div className="sm:hidden space-y-2">
            {[0, 1, 2, 3].map((s) => (
              <div
                key={s}
                className="h-20 rounded-xl bg-white border border-mp-sand-dark/20 animate-pulse"
                style={{ animationDelay: `${s * 100}ms` }}
              />
            ))}
          </div>

          {/* Desktop grid skeleton */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {[0, 1, 2, 3, 4, 5].map((day) => (
              <div key={day}>
                <div className="h-16 rounded-xl bg-mp-sand-dark/20 animate-pulse mb-3" />
                <div className="space-y-2">
                  {[0, 1, 2].map((s) => (
                    <div
                      key={s}
                      className="h-28 rounded-xl bg-white border border-mp-sand-dark/20 animate-pulse"
                      style={{ animationDelay: `${(day * 3 + s) * 50}ms` }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
