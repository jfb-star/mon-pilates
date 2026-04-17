"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

const breadcrumbItems = [
  { name: "Accueil", href: "/" },
  { name: "Réinitialisation", href: "/reset-password" },
];

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la réinitialisation.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Erreur de connexion. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-mp-sand-dark/50 bg-mp-white text-mp-text font-body text-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-mp-ocean focus-visible:outline-offset-2";

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-mp-cream py-20">
        <div className="mp-container max-w-md">
          <div className="mp-card p-8 sm:p-10 border border-mp-sand-dark/30 text-center">
            <AlertCircle className="w-12 h-12 text-mp-rose mx-auto mb-4" aria-hidden="true" />
            <h1 className="font-heading text-xl font-bold text-mp-charcoal mb-2">
              Lien invalide
            </h1>
            <p className="font-body text-sm text-mp-text-light mb-6">
              Ce lien de réinitialisation est invalide ou incomplet.
            </p>
            <Link
              href="/connexion"
              className="mp-btn mp-btn-primary inline-flex justify-center"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-mp-cream py-20">
        <div className="mp-container max-w-md">
          <div className="mp-card p-8 sm:p-10 border border-mp-sand-dark/30 text-center">
            <CheckCircle className="w-12 h-12 text-mp-sage mx-auto mb-4" aria-hidden="true" />
            <h1 className="font-heading text-xl font-bold text-mp-charcoal mb-2">
              Mot de passe modifié
            </h1>
            <p className="font-body text-sm text-mp-text-light mb-6">
              Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.
            </p>
            <Link
              href="/connexion"
              className="mp-btn mp-btn-primary inline-flex justify-center"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-mp-cream py-20">
      <div className="mp-container max-w-md">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mp-card p-8 sm:p-10 border border-mp-sand-dark/30">
          <h1 className="font-heading text-2xl font-bold text-mp-charcoal mb-2">
            Nouveau mot de passe
          </h1>
          <p className="font-body text-sm text-mp-text-light mb-6">
            Choisissez un nouveau mot de passe pour votre compte.
          </p>

          {error && (
            <div role="alert" className="mb-4 p-3 rounded-xl bg-mp-rose/10 border border-mp-rose/20">
              <p className="text-sm text-mp-rose font-body">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block font-heading text-sm font-medium text-mp-charcoal mb-1.5">
                Nouveau mot de passe <span className="text-mp-text-light font-normal">(min. 8 caractères)</span>
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  enterKeyHint="next"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-mp-text-light hover:text-mp-ocean transition-colors"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirm-password" className="block font-heading text-sm font-medium text-mp-charcoal mb-1.5">
                Confirmer le mot de passe
              </label>
              <input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete="new-password"
                enterKeyHint="go"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mp-btn mp-btn-primary w-full justify-center mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                "Réinitialiser le mot de passe"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
