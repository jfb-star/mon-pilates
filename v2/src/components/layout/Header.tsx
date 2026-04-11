"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Calendar } from "lucide-react";
import { clsx } from "clsx";

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Planning", href: "/planning" },
  { name: "Nos cours", href: "/cours" },
  { name: "Tarifs", href: "/tarifs" },
  { name: "L'équipe", href: "/equipe" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Only use transparent header on homepage
  const isHomepage = pathname === "/";
  const isTransparent = isHomepage && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isTransparent
          ? "bg-transparent"
          : "bg-mp-white/95 backdrop-blur-md shadow-[0_1px_10px_rgba(0,0,0,0.06)]"
      )}
    >
      <div className="mp-container flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span
            className={clsx(
              "font-heading text-2xl font-bold tracking-tight transition-colors duration-300",
              isTransparent ? "text-white" : "text-mp-charcoal"
            )}
          >
            Mon{" "}
            <span
              className={clsx(
                "transition-colors duration-300",
                isTransparent
                  ? "text-mp-ocean-light group-hover:text-white"
                  : "text-mp-ocean group-hover:text-mp-ocean-dark"
              )}
            >
              Pilates
            </span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Navigation principale">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "font-heading text-sm font-medium transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:transition-all hover:after:w-full",
                isTransparent
                  ? "text-white/80 hover:text-white after:bg-white"
                  : "text-mp-text-light hover:text-mp-ocean after:bg-mp-ocean",
                pathname === item.href && !isTransparent && "text-mp-ocean after:w-full"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-4">
          <Link
            href="/planning"
            className={clsx(
              "mp-btn hidden sm:inline-flex text-sm transition-all duration-300",
              isTransparent
                ? "!bg-white/15 !text-white !border-white/30 backdrop-blur-sm hover:!bg-white hover:!text-mp-ocean"
                : "mp-btn-primary"
            )}
          >
            <Calendar className="w-4 h-4" />
            Réserver
          </Link>

          <button
            type="button"
            className={clsx(
              "lg:hidden p-2 transition-colors",
              isTransparent
                ? "text-white hover:text-mp-ocean-light"
                : "text-mp-charcoal hover:text-mp-ocean"
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={clsx(
          "lg:hidden overflow-hidden transition-all duration-300 bg-mp-white border-t border-mp-sand",
          mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
        role="navigation"
        aria-label="Navigation mobile"
      >
        <div className="mp-container py-6 flex flex-col gap-1">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                "font-heading text-base font-medium hover:text-mp-ocean hover:bg-mp-sand/50 px-4 py-3 rounded-xl transition-all",
                pathname === item.href ? "text-mp-ocean bg-mp-ocean/5" : "text-mp-text-light"
              )}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/planning"
            onClick={() => setMobileOpen(false)}
            className="mp-btn mp-btn-primary mt-4 text-center"
          >
            <Calendar className="w-4 h-4" />
            Réserver un cours
          </Link>
        </div>
      </div>
    </header>
  );
}
