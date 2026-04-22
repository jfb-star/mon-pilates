"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";
import { AlertTriangle, RefreshCw, Home, Phone } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const retryRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    Sentry.captureException(error);
    retryRef.current?.focus();
  }, [error]);

  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-mp-cream to-mp-white py-20">
      <div
        className="mp-container max-w-xl text-center"
        role="alert"
        aria-live="assertive"
      >
        <div
          className="w-20 h-20 rounded-full bg-mp-rose/15 flex items-center justify-center mx-auto mb-6 ring-8 ring-mp-white"
          aria-hidden="true"
        >
          <AlertTriangle className="w-10 h-10 text-mp-rose" strokeWidth={1.8} />
        </div>

        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-mp-charcoal mb-4">
          Oups, un petit déséquilibre
        </h2>
        <p className="font-body text-mp-text-light text-lg leading-relaxed mb-10 max-w-md mx-auto">
          Quelque chose n&apos;a pas tenu en équilibre. On vous invite à
          recharger — souvent, ça suffit à tout remettre en place.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-10">
          <button
            ref={retryRef}
            onClick={reset}
            className="mp-btn mp-btn-primary"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Réessayer
          </button>
          <Link href="/" className="mp-btn mp-btn-secondary">
            <Home className="w-4 h-4" aria-hidden="true" />
            Retour à l&apos;accueil
          </Link>
        </div>

        <p className="text-sm text-mp-text-muted font-body">
          Le problème persiste&nbsp;?{" "}
          <a
            href="tel:+33699183216"
            className="text-mp-ocean hover:text-mp-ocean-dark hover:underline inline-flex items-center gap-1"
          >
            <Phone className="w-3.5 h-3.5" aria-hidden="true" />
            Appelez-nous
          </a>
        </p>

        {error.digest && (
          <p className="text-xs text-mp-text-muted/60 mt-6 font-mono">
            Réf. : {error.digest}
          </p>
        )}
      </div>
    </section>
  );
}
