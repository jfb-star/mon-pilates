export default function EquipeLoading() {
  return (
    <div role="status" aria-label="Chargement de l'équipe">
      {/* Hero skeleton */}
      <section className="bg-mp-sand pt-32 pb-16 sm:pb-20 animate-pulse">
        <div className="mp-container text-center">
          <div className="w-24 h-4 rounded bg-mp-sand-dark/30 mx-auto mb-4" />
          <div className="w-56 h-10 rounded-lg bg-mp-sand-dark/30 mx-auto mb-6" />
          <div className="w-80 h-5 rounded bg-mp-sand-dark/20 mx-auto" />
        </div>
      </section>

      {/* Instructor cards skeleton */}
      <section className="mp-section bg-mp-white">
        <div className="mp-container space-y-16">
          {[0, 1].map((i) => (
            <div key={i} className="mp-card border border-mp-sand-dark/20 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-5 gap-8 animate-pulse">
              <div className="lg:col-span-2">
                <div className="aspect-[3/4] rounded-2xl bg-mp-sand-dark/15" />
              </div>
              <div className="lg:col-span-3 space-y-4">
                <div className="w-48 h-8 rounded bg-mp-sand-dark/25" />
                <div className="w-32 h-4 rounded bg-mp-sand-dark/15" />
                <div className="space-y-2">
                  <div className="w-full h-4 rounded bg-mp-sand-dark/15" />
                  <div className="w-3/4 h-4 rounded bg-mp-sand-dark/15" />
                  <div className="w-5/6 h-4 rounded bg-mp-sand-dark/15" />
                </div>
                <div className="flex gap-2 mt-4">
                  {[0, 1, 2].map((j) => (
                    <div key={j} className="w-20 h-8 rounded-full bg-mp-sand-dark/15" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
