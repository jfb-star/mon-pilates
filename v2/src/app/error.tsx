"use client";

import { useEffect, useRef } from "react";
import { RefreshCw, Home, Phone } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const retryRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    console.error("[app-error]", error);
    retryRef.current?.focus();
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-mp-cream to-mp-white py-20">
      <div className="mp-container max-w-lg text-center" role="alert">
        {/* Decorative icon */}
        <div className="relative inline-block mb-6">
          <div className="w-20 h-20 rounded-full bg-mp-rose/10 flex items-center justify-center mx-auto">
            <span className="font-heading text-3xl" aria-hidden="true">!</span>
          </div>
        </div>

        <h2 className="font-heading text-3xl font-bold text-mp-charcoal mb-3">
          Oups, un petit souci
        </h2>
        <p className="font-body text-mp-text-light leading-relaxed mb-8 max-w-md mx-auto">
          Pas d&apos;inqui&eacute;tude, ce n&apos;est rien de grave.
          Essayez de recharger la page ou revenez &agrave; l&apos;accueil.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
          <button ref={retryRef} onClick={reset} className="mp-btn mp-btn-primary">
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            R&eacute;essayer
          </button>
          <a href="/" className="mp-btn mp-btn-secondary">
            <Home className="w-4 h-4" aria-hidden="true" />
            Retour &agrave; l&apos;accueil
          </a>
        </div>

        <p className="text-xs text-mp-text-muted font-body">
          Le probl&egrave;me persiste ?{" "}
          <a href="tel:+33699183216" className="text-mp-ocean hover:underline inline-flex items-center gap-1">
            <Phone className="w-3 h-3" aria-hidden="true" />
            Appelez-nous
          </a>
        </p>

        {error.digest && (
          <p className="text-xs text-mp-text-muted/50 mt-4 font-mono">
            R&eacute;f. : {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
