"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Calendar } from "lucide-react";

export function MobileFloatingCta() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  // Hide on pages where the CTA is redundant
  const hiddenPages = ["/planning", "/connexion", "/compte", "/reservation"];
  const isHiddenPage = hiddenPages.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (isHiddenPage) {
      setVisible(false);
      return;
    }
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const nearBottom = scrollY + window.innerHeight > document.documentElement.scrollHeight - 200;
      setVisible(scrollY > 600 && !nearBottom);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHiddenPage]);

  return (
    <div
      role="complementary"
      aria-label="Réservation rapide"
      aria-hidden={!visible}
      className={`fixed bottom-0 left-0 right-0 z-40 sm:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full pointer-events-none"
      }`}
    >
      <div className="bg-white/95 backdrop-blur-xl border-t border-mp-sand-dark/30 px-4 py-3 safe-area-pb shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <Link
          href="/planning"
          tabIndex={visible ? 0 : -1}
          className="mp-btn mp-btn-primary mp-pulse-glow w-full justify-center text-sm !py-3.5"
        >
          <Calendar className="w-4 h-4" aria-hidden="true" />
          R&eacute;server mon essai — 10&euro;
        </Link>
      </div>
    </div>
  );
}
