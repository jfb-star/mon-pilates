export default function TarifsLoading() {
  return (
    <div role="status" aria-label="Chargement des tarifs">
      {/* Hero skeleton */}
      <section className="bg-mp-sand pt-32 pb-16 sm:pb-20 animate-pulse">
        <div className="mp-container text-center">
          <div className="w-32 h-4 rounded bg-mp-sand-dark/30 mx-auto mb-4" />
          <div className="w-48 h-10 rounded-lg bg-mp-sand-dark/30 mx-auto mb-6" />
          <div className="w-96 h-5 rounded bg-mp-sand-dark/20 mx-auto" />
        </div>
      </section>

      {/* Pricing grid skeleton */}
      <section className="mp-section bg-mp-white">
        <div className="mp-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="mp-card border border-mp-sand-dark/20 p-8 animate-pulse">
                <div className="w-24 h-5 rounded-full bg-mp-sand-dark/20 mb-4" />
                <div className="w-20 h-10 rounded bg-mp-sand-dark/25 mb-2" />
                <div className="w-28 h-3 rounded bg-mp-sand-dark/15 mb-6" />
                <div className="space-y-2">
                  {[0, 1, 2, 3].map((j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-mp-sand-dark/15" />
                      <div className="flex-1 h-3 rounded bg-mp-sand-dark/15" />
                    </div>
                  ))}
                </div>
                <div className="w-full h-12 rounded-full bg-mp-sand-dark/20 mt-6" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
