export default function CoursLoading() {
  return (
    <div className="pt-20" role="status" aria-label="Chargement des cours">
      {/* Hero skeleton */}
      <section className="bg-mp-sand py-16 sm:py-24 animate-pulse">
        <div className="mp-container text-center">
          <div className="w-24 h-4 rounded bg-mp-sand-dark/30 mx-auto mb-4" />
          <div className="w-72 h-10 rounded-lg bg-mp-sand-dark/30 mx-auto mb-4" />
          <div className="w-96 h-5 rounded bg-mp-sand-dark/20 mx-auto" />
        </div>
      </section>

      {/* Cards skeleton */}
      <section className="mp-section bg-mp-white">
        <div className="mp-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="mp-card border border-mp-sand-dark/20 animate-pulse">
                <div className="h-48 bg-mp-sand-dark/15" />
                <div className="p-6 space-y-3">
                  <div className="w-20 h-5 rounded-full bg-mp-sand-dark/20" />
                  <div className="w-3/4 h-6 rounded bg-mp-sand-dark/20" />
                  <div className="w-full h-4 rounded bg-mp-sand-dark/15" />
                  <div className="w-2/3 h-4 rounded bg-mp-sand-dark/15" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
