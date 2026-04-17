"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Bell,
  ChevronLeft,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { clsx } from "clsx";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

const breadcrumbItems = [
  { name: "Accueil", href: "/" },
  { name: "Mon Studio", href: "/compte" },
  { name: "Preferences", href: "/compte/preferences" },
];

interface NotificationPrefs {
  email: {
    bookingConfirmation: boolean;
    courseReminder: boolean;
    waitlistPromotion: boolean;
    courseCardLow: boolean;
    newsletter: boolean;
  };
  inApp: {
    newBookings: boolean;
    cancellations: boolean;
    badgesRewards: boolean;
  };
}

const defaultPrefs: NotificationPrefs = {
  email: {
    bookingConfirmation: true,
    courseReminder: true,
    waitlistPromotion: true,
    courseCardLow: true,
    newsletter: false,
  },
  inApp: {
    newBookings: true,
    cancellations: true,
    badgesRewards: true,
  },
};

const STORAGE_KEY = "mp-notification-prefs";

function loadPrefs(): NotificationPrefs {
  if (typeof window === "undefined") return defaultPrefs;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPrefs;
    const parsed = JSON.parse(raw);
    return {
      email: { ...defaultPrefs.email, ...parsed.email },
      inApp: { ...defaultPrefs.inApp, ...parsed.inApp },
    };
  } catch {
    return defaultPrefs;
  }
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex items-start gap-4 py-3 cursor-pointer group">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx(
          "relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 mt-0.5",
          checked ? "bg-mp-ocean" : "bg-mp-sand-dark"
        )}
      >
        <span
          className={clsx(
            "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200",
            checked && "translate-x-5"
          )}
        />
      </button>
      <div className="flex-1 min-w-0">
        <span className="font-heading text-sm font-medium text-mp-charcoal block group-hover:text-mp-ocean transition-colors">
          {label}
        </span>
        {description && (
          <span className="text-xs text-mp-text-light mt-0.5 block">
            {description}
          </span>
        )}
      </div>
    </label>
  );
}

export default function PreferencesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prefs, setPrefs] = useState<NotificationPrefs>(defaultPrefs);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPrefs(loadPrefs());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/connexion?callbackUrl=/compte/preferences");
    }
  }, [status, router]);

  function updateEmail(key: keyof NotificationPrefs["email"], value: boolean) {
    setPrefs((prev) => ({
      ...prev,
      email: { ...prev.email, [key]: value },
    }));
    setSaved(false);
  }

  function updateInApp(key: keyof NotificationPrefs["inApp"], value: boolean) {
    setPrefs((prev) => ({
      ...prev,
      inApp: { ...prev.inApp, [key]: value },
    }));
    setSaved(false);
  }

  function handleSave() {
    setSaving(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 400);
  }

  if (status === "loading" || !mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-mp-ocean" />
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-8 bg-mp-cream">
        <div className="mp-container">
          <Breadcrumb items={breadcrumbItems} />
          <div className="flex items-center gap-3 mt-4">
            <Link
              href="/compte"
              className="p-2 -ml-2 rounded-full hover:bg-mp-sand transition-colors"
              aria-label="Retour au tableau de bord"
            >
              <ChevronLeft className="w-5 h-5 text-mp-text-light" aria-hidden="true" />
            </Link>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-mp-charcoal">
              Preferences de notification
            </h1>
          </div>
        </div>
      </section>

      <section className="mp-section bg-mp-white">
        <div className="mp-container max-w-2xl">
          {/* Email notifications */}
          <div className="mp-card !rounded-2xl p-6 mb-6 hover:!transform-none">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-mp-sand-dark/10">
              <Mail className="w-5 h-5 text-mp-ocean" aria-hidden="true" />
              <h2 className="font-heading text-base font-semibold text-mp-charcoal">
                Email
              </h2>
            </div>
            <div className="divide-y divide-mp-sand/50">
              <Toggle
                checked={prefs.email.bookingConfirmation}
                onChange={(v) => updateEmail("bookingConfirmation", v)}
                label="Confirmation de reservation"
                description="Recevez un email a chaque reservation confirmee"
              />
              <Toggle
                checked={prefs.email.courseReminder}
                onChange={(v) => updateEmail("courseReminder", v)}
                label="Rappel avant le cours (J-1)"
                description="Un rappel la veille de votre cours"
              />
              <Toggle
                checked={prefs.email.waitlistPromotion}
                onChange={(v) => updateEmail("waitlistPromotion", v)}
                label="Promotion liste d'attente"
                description="Soyez prevenu quand une place se libere"
              />
              <Toggle
                checked={prefs.email.courseCardLow}
                onChange={(v) => updateEmail("courseCardLow", v)}
                label="Carte de cours bientot epuisee"
                description="Alerte quand il ne vous reste plus que 2 seances"
              />
              <Toggle
                checked={prefs.email.newsletter}
                onChange={(v) => updateEmail("newsletter", v)}
                label="Newsletter et actualites"
                description="Conseils Pilates, offres et actus du studio"
              />
            </div>
          </div>

          {/* In-app notifications */}
          <div className="mp-card !rounded-2xl p-6 mb-8 hover:!transform-none">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-mp-sand-dark/10">
              <Bell className="w-5 h-5 text-mp-ocean" aria-hidden="true" />
              <h2 className="font-heading text-base font-semibold text-mp-charcoal">
                Notifications in-app
              </h2>
            </div>
            <div className="divide-y divide-mp-sand/50">
              <Toggle
                checked={prefs.inApp.newBookings}
                onChange={(v) => updateInApp("newBookings", v)}
                label="Nouvelles reservations"
                description="Confirmation de vos reservations dans l'application"
              />
              <Toggle
                checked={prefs.inApp.cancellations}
                onChange={(v) => updateInApp("cancellations", v)}
                label="Annulations"
                description="Notifications en cas d'annulation de cours"
              />
              <Toggle
                checked={prefs.inApp.badgesRewards}
                onChange={(v) => updateInApp("badgesRewards", v)}
                label="Badges et recompenses"
                description="Celebrez vos accomplissements Pilates"
              />
            </div>
          </div>

          {/* Save button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="mp-btn mp-btn-primary text-sm"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : saved ? (
                <>
                  <CheckCircle className="w-4 h-4" aria-hidden="true" />
                  Enregistre
                </>
              ) : (
                "Enregistrer"
              )}
            </button>
            {saved && (
              <span className="text-sm text-mp-sage font-heading font-medium">
                Preferences sauvegardees
              </span>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
