import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Calendar } from "lucide-react";
import { ContactForm } from "@/components/ui/ContactForm";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { OpenStatus } from "@/components/ui/OpenStatus";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez le studio Mon Pilates à Larmor-Plage. Formulaire de contact, téléphone, email et plan d'accès.",
  openGraph: {
    title: "Contact | Mon Pilates",
    description:
      "Une question ? Contactez-nous par formulaire, téléphone ou email. Studio de Pilates à Larmor-Plage.",
    images: [
      {
        url: "/images/studio-reformer-ocean.jpg",
        width: 1920,
        height: 1080,
        alt: "Studio de Pilates Mon Pilates face à l'océan à Larmor-Plage",
      },
    ],
  },
  alternates: {
    canonical: "https://mon-pilates.bzh/contact",
  },
};

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.738-.9 10.126-5.864 10.126-11.854z" />
    </svg>
  );
}

const contactPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact — Mon Pilates",
  description:
    "Contactez le studio Mon Pilates à Larmor-Plage. Formulaire de contact, téléphone, email et plan d'accès.",
  url: "https://mon-pilates.bzh/contact",
  mainEntity: {
    "@type": "SportsActivityLocation",
    name: "Mon Pilates",
    url: "https://mon-pilates.bzh",
    telephone: "+33699183216",
    email: "contact@mon-pilates.bzh",
    address: {
      "@type": "PostalAddress",
      streetAddress: "14 Boulevard des Dunes",
      addressLocality: "Larmor-Plage",
      postalCode: "56260",
      addressCountry: "FR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "14:00",
      },
    ],
    sameAs: [
      "https://www.instagram.com/monpilates.bzh",
      "https://www.facebook.com/MonPilatesBZH",
    ],
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }}
      />
      <BreadcrumbJsonLd items={[
        { name: "Accueil", href: "/" },
        { name: "Contact", href: "/contact" },
      ]} />
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-mp-sand via-mp-cream to-mp-ocean-light/20 pt-32 pb-16 sm:pb-20">
        <div className="mp-container">
          <Breadcrumb items={[
            { name: "Accueil", href: "/" },
            { name: "Contact", href: "/contact" },
          ]} />
        </div>
        <div className="mp-container text-center">
          <p className="font-heading text-sm font-semibold text-mp-ocean uppercase tracking-[0.2em] mb-3">
            Échangeons
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-mp-charcoal mb-6">
            Nous contacter
          </h1>
          <p className="font-body text-lg sm:text-xl text-mp-text-light leading-relaxed max-w-2xl mx-auto">
            Une question, une réservation ou simplement envie d&apos;en savoir
            plus ? Nous sommes à votre écoute.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="mp-section bg-mp-white">
        <div className="mp-container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
            {/* Form — left */}
            <div className="lg:col-span-3">
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-6">
                Envoyez-nous un message
              </h2>
              <ContactForm />
              <p className="mt-4 font-body text-xs text-mp-text-muted">
                Nous répondons généralement sous 24h en semaine. Pour une question urgente, appelez-nous directement.
              </p>
            </div>

            {/* Info — right */}
            <div className="lg:col-span-2 space-y-8">
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-6">
                Nos coordonnées
              </h2>

              <address className="space-y-6 not-italic">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-mp-ocean/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-mp-ocean" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-mp-charcoal text-sm">
                      Adresse
                    </p>
                    <p className="font-body text-sm text-mp-text-light">
                      14 Boulevard des Dunes
                      <br />
                      56260 Larmor-Plage
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-mp-ocean/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-mp-ocean" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-mp-charcoal text-sm">
                      Téléphone
                    </p>
                    <a
                      href="tel:+33699183216"
                      className="font-body text-sm text-mp-ocean hover:text-mp-ocean-dark transition-colors"
                    >
                      06 99 18 32 16
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-mp-ocean/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-mp-ocean" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-mp-charcoal text-sm">
                      Email
                    </p>
                    <a
                      href="mailto:contact@mon-pilates.bzh"
                      className="font-body text-sm text-mp-ocean hover:text-mp-ocean-dark transition-colors"
                    >
                      contact@mon-pilates.bzh
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-mp-ocean/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-mp-ocean" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-heading font-semibold text-mp-charcoal text-sm">
                        Horaires d&apos;ouverture
                      </p>
                      <OpenStatus />
                    </div>
                    <p className="font-body text-sm text-mp-text-light">
                      Lundi - Vendredi : 9h - 20h
                      <br />
                      Samedi : 9h - 14h
                      <br />
                      Dimanche : Fermé
                    </p>
                  </div>
                </div>
              </address>

              {/* Google Maps */}
              <div className="rounded-2xl overflow-hidden shadow-lg border border-mp-sand-dark/30">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2661.5!2d-3.3864!3d47.7083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDQyJzI5LjkiTiAzwrAyMycxMS4wIlc!5e0!3m2!1sfr!2sfr!4v1700000000000"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localisation Mon Pilates - Larmor-Plage"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mp-section bg-gradient-to-br from-mp-ocean to-mp-ocean-dark text-white">
        <div className="mp-container text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Envie d&apos;essayer directement ?
          </h2>
          <p className="font-body text-lg text-white/80 max-w-md mx-auto mb-8">
            Réservez votre cours d&apos;essai à 10&euro; et découvrez le
            studio face à l&apos;océan.
          </p>
          <Link
            href="/planning"
            className="mp-btn bg-white text-mp-ocean hover:bg-mp-cream font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <Calendar className="w-5 h-5" aria-hidden="true" />
            Réserver un cours d&apos;essai
          </Link>
        </div>
      </section>

      {/* Social Links */}
      <section className="mp-section bg-mp-cream">
        <div className="mp-container text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-mp-charcoal mb-4">
            Suivez-nous
          </h2>
          <p className="font-body text-mp-text-light mb-8 max-w-md mx-auto">
            Retrouvez-nous sur les réseaux sociaux pour découvrir les coulisses
            du studio, des conseils et l&apos;actualité de Mon Pilates.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://www.instagram.com/monpilates.bzh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 mp-btn mp-btn-secondary"
              aria-label="Instagram Mon Pilates"
            >
              <InstagramIcon className="w-5 h-5" />
              Instagram
            </a>
            <a
              href="https://www.facebook.com/MonPilatesBZH"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 mp-btn mp-btn-secondary"
              aria-label="Facebook Mon Pilates"
            >
              <FacebookIcon className="w-5 h-5" />
              Facebook
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
