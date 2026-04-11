import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.738-.9 10.126-5.864 10.126-11.854z"/>
    </svg>
  );
}

const footerLinks = {
  studio: [
    { name: "Nos cours", href: "/cours" },
    { name: "Planning", href: "/planning" },
    { name: "Tarifs", href: "/tarifs" },
    { name: "L'équipe", href: "/equipe" },
    { name: "Carte cadeau", href: "/carte-cadeau" },
  ],
  info: [
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/tarifs#faq" },
  ],
  legal: [
    { name: "Mentions légales", href: "/mentions-legales" },
    { name: "CGV", href: "/cgv" },
    { name: "Confidentialité", href: "/politique-confidentialite" },
    { name: "Cookies", href: "/politique-cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-mp-charcoal text-white/80" role="contentinfo">
      <div className="mp-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-heading text-2xl font-bold text-white">
                Mon <span className="text-mp-ocean-light">Pilates</span>
              </span>
            </Link>
            <p className="font-body text-sm leading-relaxed text-white/60">
              Studio de Pilates à Larmor-Plage, Bretagne.
              <br />
              Cours adaptés à tous les niveaux, dans un cadre lumineux face à l&apos;océan.
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href="https://www.instagram.com/monpilates_larmorplage/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-mp-ocean transition-colors"
                aria-label="Instagram Mon Pilates"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61559937498498"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-mp-ocean transition-colors"
                aria-label="Facebook Mon Pilates"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Studio links */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Le Studio
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.studio.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-mp-ocean-light transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info + Legal */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Informations
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.info.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-mp-ocean-light transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="font-heading text-sm font-semibold text-white uppercase tracking-wider mb-4 mt-8">
              Légal
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-mp-ocean-light transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-mp-ocean-light flex-shrink-0" />
                <span>
                  14 Boulevard des Dunes
                  <br />
                  56260 Larmor-Plage
                </span>
              </li>
              <li>
                <a
                  href="tel:+33783671563"
                  className="flex items-center gap-3 text-sm hover:text-mp-ocean-light transition-colors"
                >
                  <Phone className="w-4 h-4 text-mp-ocean-light flex-shrink-0" />
                  07 83 67 15 63
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@mon-pilates.bzh"
                  className="flex items-center gap-3 text-sm hover:text-mp-ocean-light transition-colors"
                >
                  <Mail className="w-4 h-4 text-mp-ocean-light flex-shrink-0" />
                  contact@mon-pilates.bzh
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Mon Pilates. Tous droits réservés.
          </p>
          <p className="text-xs text-white/30">
            Fait avec soin en Bretagne
          </p>
        </div>
      </div>
    </footer>
  );
}
