export default function BlogLoading() {
  return (
    <div role="status" aria-label="Chargement du blog">
      {/* Hero skeleton */}
      <section className="pt-32 pb-12 bg-mp-cream animate-pulse">
        <div className="mp-container">
          <div className="w-16 h-4 rounded bg-mp-sand-dark/30 mb-3" />
          <div className="w-64 h-10 rounded-lg bg-mp-sand-dark/30 mb-4" />
          <div className="w-96 h-5 rounded bg-mp-sand-dark/20" />
        </div>
      </section>

      {/* Categories skeleton */}
      <section className="border-b border-mp-sand-dark/30 bg-mp-white">
        <div className="mp-container py-4 flex gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="w-20 h-9 rounded-full bg-mp-sand-dark/20 animate-pulse" />
          ))}
        </div>
      </section>

      {/* Featured skeleton */}
      <section className="mp-section bg-mp-white">
        <div className="mp-container">
          <div className="mp-card grid grid-cols-1 lg:grid-cols-2 animate-pulse">
            <div className="h-64 lg:h-auto bg-mp-sand-dark/15 rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none" />
            <div className="p-8 space-y-4">
              <div className="flex gap-3">
                <div className="w-16 h-6 rounded-full bg-mp-sand-dark/20" />
                <div className="w-24 h-6 rounded bg-mp-sand-dark/15" />
              </div>
              <div className="w-3/4 h-7 rounded bg-mp-sand-dark/20" />
              <div className="w-full h-4 rounded bg-mp-sand-dark/15" />
              <div className="w-2/3 h-4 rounded bg-mp-sand-dark/15" />
            </div>
          </div>
        </div>
      </section>

      {/* Grid skeleton */}
      <section className="mp-section bg-mp-cream">
        <div className="mp-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="mp-card animate-pulse">
                <div className="h-48 bg-mp-sand-dark/15 rounded-t-2xl" />
                <div className="p-6 space-y-3">
                  <div className="flex gap-2">
                    <div className="w-14 h-5 rounded-full bg-mp-sand-dark/20" />
                    <div className="w-20 h-5 rounded bg-mp-sand-dark/15" />
                  </div>
                  <div className="w-3/4 h-5 rounded bg-mp-sand-dark/20" />
                  <div className="w-full h-4 rounded bg-mp-sand-dark/15" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
