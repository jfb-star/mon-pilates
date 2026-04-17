export default function Loading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-mp-cream to-mp-white" role="status" aria-label="Chargement en cours">
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo pulse */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-mp-ocean/10 animate-ping absolute inset-0" />
          <div className="w-16 h-16 rounded-full bg-mp-ocean/20 flex items-center justify-center relative">
            <span className="font-heading text-lg font-bold text-mp-ocean">MP</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-mp-ocean/60 animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 rounded-full bg-mp-ocean/60 animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 rounded-full bg-mp-ocean/60 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
