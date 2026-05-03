"use client";

import { useEffect, useRef, useState, type FormEvent, Suspense } from "react";
import { signIn, getProviders } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ArrowRight, Gift } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useToast } from "@/components/ui/Toast";

const breadcrumbItems = [
  { name: "Accueil", href: "/" },
  { name: "Connexion", href: "/connexion" },
];

/**
 * Validate a `returnTo` search-param so it can be used as a redirect target
 * without opening the user up to an open-redirect / phishing attack.
 *
 * Accepts only same-origin, relative URLs:
 *   - must start with `/`
 *   - must NOT start with `//` (protocol-relative) or `/\` (backslash variant)
 *   - must NOT contain `://` (absolute URL)
 *   - length-limited to 512 chars
 *
 * Anything else falls back to `/planning`, which is the most useful landing
 * page for a user returning from auth on the booking flow.
 */
function safeReturnTo(raw: string | null): string {
  const fallback = "/planning";
  if (!raw) return fallback;
  if (raw.length > 512) return fallback;
  if (!raw.startsWith("/")) return fallback;
  if (raw.startsWith("//") || raw.startsWith("/\\")) return fallback;
  if (raw.includes("://")) return fallback;
  return raw;
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center bg-mp-cream py-20">
        <Loader2 className="w-8 h-8 text-mp-ocean animate-spin" aria-hidden="true" />
      </div>
    }>
      <ConnexionContent />
    </Suspense>
  );
}

function ConnexionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");
  // Validated post-login destination. Defaults to /planning if absent
  // or if an invalid / unsafe value was passed (e.g. open-redirect attempt).
  const returnTo = safeReturnTo(searchParams.get("returnTo"));
  const toast = useToast();

  const [mode, setMode] = useState<"login" | "register" | "forgot">(
    refCode ? "register" : "login"
  );
  const [loading, setLoading] = useState(false);
  const [error, setErrorState] = useState("");
  const setError = (msg: string) => {
    setErrorState(msg);
    if (msg) toast.error(msg);
  };
  const [showPassword, setShowPassword] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [referralCode] = useState(refCode || "");
  const errorRef = useRef<HTMLDivElement>(null);
  // Tracks which OAuth providers are actually configured server-side. NextAuth
  // omits providers that lack credentials, so the UI hides their buttons in
  // dev/preview where Google/Apple secrets aren't set.
  const [oauthProviders, setOauthProviders] = useState<{ google: boolean; apple: boolean } | null>(null);

  useEffect(() => {
    let cancelled = false;
    getProviders().then((p) => {
      if (cancelled) return;
      setOauthProviders({
        google: Boolean(p?.google),
        apple: Boolean(p?.apple),
      });
    }).catch(() => {
      if (!cancelled) setOauthProviders({ google: false, apple: false });
    });
    return () => { cancelled = true };
  }, []);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      errorRef.current.focus();
    }
  }, [error]);

  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register extra fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou mot de passe incorrect.");
      } else {
        // Honor returnTo when present (e.g. user came from /planning#sessionId),
        // otherwise land on /compte as before.
        router.push(returnTo !== "/planning" || searchParams.get("returnTo") ? returnTo : "/compte");
        router.refresh();
      }
    } catch {
      setError("Erreur de connexion. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: FormEvent) {
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          phone: phone.trim() || undefined,
          referralCode: referralCode || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de l'inscription.");
        return;
      }

      // Auto-login after registration
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Compte créé ! Connectez-vous avec vos identifiants.");
        setMode("login");
      } else {
        // If the user was redirected here from a booking attempt, honor that
        // returnTo after registration so they land back on the session they
        // wanted. Otherwise fall through to the onboarding page.
        router.push(searchParams.get("returnTo") ? returnTo : "/bienvenue");
        router.refresh();
      }
    } catch {
      setError("Erreur de connexion. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (res.status === 429) {
        setError("Trop de tentatives. Réessayez dans quelques minutes.");
        return;
      }

      setForgotSuccess(true);
      toast.success("Si un compte existe, un email a été envoyé.");
    } catch {
      setError("Erreur de connexion. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-mp-sand-dark/50 bg-mp-white text-mp-text font-body text-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-mp-ocean focus-visible:outline-offset-2";

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-mp-cream py-20">
      <div className="mp-container max-w-md">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mp-card p-8 sm:p-10 border border-mp-sand-dark/30">
          {/* Toggle login/register */}
          {mode !== "forgot" && (
            <div className="flex gap-2 mb-8 p-1 bg-mp-sand/50 rounded-xl">
              <button
                type="button"
                onClick={() => { setMode("login"); setError(""); }}
                className={`flex-1 py-2.5 rounded-lg font-heading text-sm font-medium transition-all ${
                  mode === "login"
                    ? "bg-white text-mp-charcoal shadow-sm"
                    : "text-mp-text-light hover:text-mp-charcoal"
                }`}
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={() => { setMode("register"); setError(""); }}
                className={`flex-1 py-2.5 rounded-lg font-heading text-sm font-medium transition-all ${
                  mode === "register"
                    ? "bg-white text-mp-charcoal shadow-sm"
                    : "text-mp-text-light hover:text-mp-charcoal"
                }`}
              >
                Créer un compte
              </button>
            </div>
          )}

          <h1 className="font-heading text-2xl font-bold text-mp-charcoal mb-2">
            {mode === "login" ? "Bon retour !" : mode === "register" ? "Bienvenue !" : "Mot de passe oublié"}
          </h1>
          <p className="font-body text-sm text-mp-text-light mb-6">
            {mode === "login"
              ? "Connectez-vous pour gérer vos réservations."
              : mode === "register"
                ? "Créez votre compte pour réserver vos cours."
                : "Entrez votre email pour recevoir un lien de réinitialisation."}
          </p>

          {/* Referral banner */}
          {referralCode && (
            <div className="mb-4 p-3 rounded-xl bg-mp-sage/10 border border-mp-sage/20 flex items-start gap-2.5">
              <Gift className="w-5 h-5 text-mp-sage flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-mp-charcoal font-body">
                Vous avez &eacute;t&eacute; invit&eacute;(e) ! Inscrivez-vous et recevez un cours offert.
              </p>
            </div>
          )}

          {error && (
            <div
              ref={errorRef}
              role="alert"
              tabIndex={-1}
              className="mb-4 p-3 rounded-xl bg-mp-rose/10 border border-mp-rose/20 scroll-mt-20 focus:outline-none"
            >
              <p className="text-sm text-mp-rose font-body">{error}</p>
            </div>
          )}

          {/* Social login buttons (shown for login & register modes, only for
              providers actually configured server-side). */}
          {mode !== "forgot" && oauthProviders && (oauthProviders.google || oauthProviders.apple) && (
            <div className="space-y-3 mb-6">
              {oauthProviders.google && (
                <button
                  type="button"
                  onClick={() => signIn("google", { callbackUrl: searchParams.get("returnTo") ? returnTo : "/compte" })}
                  className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl border border-mp-sand-dark/50 bg-white text-mp-charcoal font-heading text-sm font-medium hover:bg-mp-sand/30 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continuer avec Google
                </button>
              )}
              {oauthProviders.apple && (
                <button
                  type="button"
                  onClick={() => signIn("apple", { callbackUrl: searchParams.get("returnTo") ? returnTo : "/compte" })}
                  className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl bg-mp-charcoal text-white font-heading text-sm font-medium hover:bg-mp-charcoal/90 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-1.55 4.28-3.74 4.25z"/>
                  </svg>
                  Continuer avec Apple
                </button>
              )}

              {/* Separator */}
              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-mp-sand-dark/30"></div>
                <span className="mx-4 text-sm text-mp-text-muted font-body">ou</span>
                <div className="flex-grow border-t border-mp-sand-dark/30"></div>
              </div>
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block font-heading text-sm font-medium text-mp-charcoal mb-1.5">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  inputMode="email"
                  autoComplete="email"
                  enterKeyHint="next"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="login-password" className="block font-heading text-sm font-medium text-mp-charcoal mb-1.5">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    enterKeyHint="go"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 rounded-lg text-mp-text-light hover:text-mp-ocean hover:bg-mp-sand/40 transition-colors"
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
              <button
                type="submit"
                disabled={loading}
                className="mp-btn mp-btn-primary w-full justify-center mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </>
                )}
              </button>
              <p className="text-center mt-3">
                <button
                  type="button"
                  onClick={() => { setMode("forgot"); setError(""); setForgotSuccess(false); }}
                  className="font-body text-sm text-mp-ocean hover:underline inline-flex items-center justify-center min-h-[44px] px-3"
                >
                  Mot de passe oublié ?
                </button>
              </p>
            </form>
          ) : mode === "forgot" ? (
            forgotSuccess ? (
              <div className="text-center">
                <div className="mb-4 p-4 rounded-xl bg-mp-sage/10 border border-mp-sage/20">
                  <p className="text-sm text-mp-charcoal font-body">
                    Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setMode("login"); setForgotSuccess(false); setError(""); }}
                  className="font-body text-sm text-mp-ocean hover:underline"
                >
                  Retour à la connexion
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label htmlFor="forgot-email" className="block font-heading text-sm font-medium text-mp-charcoal mb-1.5">
                    Email
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    inputMode="email"
                    autoComplete="email"
                    enterKeyHint="go"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
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
                    "Envoyer le lien"
                  )}
                </button>
                <p className="text-center mt-3">
                  <button
                    type="button"
                    onClick={() => { setMode("login"); setError(""); }}
                    className="font-body text-sm text-mp-ocean hover:underline"
                  >
                    Retour à la connexion
                  </button>
                </p>
              </form>
            )
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="register-name" className="block font-heading text-sm font-medium text-mp-charcoal mb-1.5">
                  Nom complet
                </label>
                <input
                  id="register-name"
                  type="text"
                  required
                  autoComplete="name"
                  enterKeyHint="next"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Pr&eacute;nom Nom"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="register-email" className="block font-heading text-sm font-medium text-mp-charcoal mb-1.5">
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  required
                  inputMode="email"
                  autoComplete="email"
                  enterKeyHint="next"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="register-phone" className="block font-heading text-sm font-medium text-mp-charcoal mb-1.5">
                  T&eacute;l&eacute;phone <span className="text-mp-text-light font-normal">(optionnel)</span>
                </label>
                <input
                  id="register-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  enterKeyHint="next"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06 12 34 56 78"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="register-password" className="block font-heading text-sm font-medium text-mp-charcoal mb-1.5">
                  Mot de passe <span className="text-mp-text-light font-normal">(min. 8 caract&egrave;res)</span>
                </label>
                <div className="relative">
                  <input
                    id="register-password"
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
                    className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 rounded-lg text-mp-text-light hover:text-mp-ocean hover:bg-mp-sand/40 transition-colors"
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
                <label htmlFor="register-password-confirm" className="block font-heading text-sm font-medium text-mp-charcoal mb-1.5">
                  Confirmer le mot de passe
                </label>
                <input
                  id="register-password-confirm"
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
                  <>
                    Cr&eacute;er mon compte
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-center font-body text-xs text-mp-text-muted mt-6">
            Besoin d&apos;aide ? Appelez-nous au{" "}
            <a href="tel:+33699183216" className="text-mp-ocean underline">
              06 99 18 32 16
            </a>
          </p>

          <p className="text-center font-body text-xs text-mp-text-muted mt-3">
            <Link href="/planning" className="text-mp-ocean hover:underline">
              R&eacute;server un cours sans compte &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
