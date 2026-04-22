import Skeleton from "@/components/ui/Skeleton";

export default function CompteLoading() {
  return (
    <div
      className="min-h-[70vh] bg-mp-cream"
      role="status"
      aria-label="Chargement du compte"
    >
      <section className="pt-32 pb-10">
        <div className="mp-container">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="w-14 h-14 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-56 rounded-md" />
              <Skeleton className="h-4 w-40 rounded-md" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Skeleton className="lg:col-span-2 h-40 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
          </div>
        </div>
      </section>

      <section className="mp-section bg-mp-white pb-0">
        <div className="mp-container max-w-3xl space-y-6">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </section>

      <section className="mp-section bg-mp-cream/30">
        <div className="mp-container max-w-3xl">
          <div className="mb-6 space-y-2">
            <Skeleton className="h-7 w-44 rounded-md" />
            <Skeleton className="h-4 w-64 rounded-md" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        </div>
      </section>

      <section className="py-8 bg-mp-white">
        <div className="mp-container max-w-3xl space-y-4">
          <Skeleton className="h-6 w-48 rounded-md" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </section>

      <span className="sr-only">Chargement de votre espace personnel…</span>
    </div>
  );
}
