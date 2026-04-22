"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1.5rem",
          background:
            "linear-gradient(to bottom, #faf7f3 0%, #fefdfb 100%)",
          fontFamily:
            "'Lora', ui-serif, Georgia, Cambria, 'Times New Roman', serif",
          color: "#3d3d3d",
        }}
      >
        <div
          role="alert"
          aria-live="assertive"
          style={{
            maxWidth: 560,
            width: "100%",
            textAlign: "center",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: 80,
              height: 80,
              borderRadius: "9999px",
              background: "rgba(212, 160, 160, 0.15)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.5rem",
              boxShadow: "0 0 0 8px #fefdfb",
            }}
          >
            <AlertTriangle
              size={40}
              strokeWidth={1.8}
              color="#d4a0a0"
            />
          </div>

          <h1
            style={{
              fontFamily:
                "'Outfit', ui-sans-serif, system-ui, sans-serif",
              fontSize: "2rem",
              fontWeight: 700,
              color: "#2c2c2c",
              margin: "0 0 1rem",
              lineHeight: 1.15,
            }}
          >
            Une erreur inattendue
          </h1>
          <p
            style={{
              fontSize: "1.0625rem",
              lineHeight: 1.6,
              color: "#5a5a5a",
              margin: "0 auto 2rem",
              maxWidth: 440,
            }}
          >
            Le studio rencontre un souci technique. On respire, on recharge,
            et on reprend le cours normal.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              justifyContent: "center",
              marginBottom: "1.5rem",
            }}
          >
            <button
              onClick={reset}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.5rem",
                borderRadius: "9999px",
                border: "none",
                background: "#3e7787",
                color: "#fefdfb",
                fontFamily:
                  "'Outfit', ui-sans-serif, system-ui, sans-serif",
                fontWeight: 600,
                fontSize: "0.9375rem",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#2a5d6e";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#3e7787";
              }}
            >
              <RefreshCw size={16} aria-hidden="true" />
              Réessayer
            </button>
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.5rem",
                borderRadius: "9999px",
                border: "1px solid #e8dfd6",
                background: "#fefdfb",
                color: "#2c2c2c",
                fontFamily:
                  "'Outfit', ui-sans-serif, system-ui, sans-serif",
                fontWeight: 600,
                fontSize: "0.9375rem",
                textDecoration: "none",
                transition: "background 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#faf7f3";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#fefdfb";
              }}
            >
              <Home size={16} aria-hidden="true" />
              Retour à l&apos;accueil
            </a>
          </div>

          {error.digest && (
            <p
              style={{
                fontSize: "0.75rem",
                color: "rgba(113, 113, 113, 0.7)",
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, monospace",
                margin: "1rem 0 0",
              }}
            >
              Réf.&nbsp;: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
