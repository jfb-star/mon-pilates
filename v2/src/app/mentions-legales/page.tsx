import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SITE_URL } from "@/lib/env";

export const metadata: Metadata = {
  title: "Mentions légales — Mon Pilates Larmor-Plage",
  description:
    "Mentions légales du site mon-pilates.bzh. Informations sur l'éditeur, l'hébergeur et les conditions d'utilisation du studio de Pilates à Larmor-Plage.",
  alternates: {
    canonical: `${SITE_URL}/mentions-legales`,
  },
  robots: { index: true, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Accueil", href: "/" },
        { name: "Mentions légales", href: "/mentions-legales" },
      ]} />
      {/* Hero */}
      <section className="bg-mp-cream pt-32 pb-12">
        <div className="mp-container">
          <Breadcrumb items={[
            { name: "Accueil", href: "/" },
            { name: "Mentions légales", href: "/mentions-legales" },
          ]} />
        </div>
        <div className="mp-container text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-mp-charcoal mb-4">
            Mentions légales du site Mon Pilates
          </h1>
          <p className="font-body text-mp-text-light">
            Dernière mise à jour : <time dateTime="2025-01-15">15 janvier 2025</time>
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mp-section bg-mp-white">
        <div className="mp-container max-w-3xl">
          <div className="space-y-10 font-body text-mp-text leading-relaxed">
            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                1. Éditeur du site
              </h2>
              <p>
                Le site <strong>mon-pilates.bzh</strong> est édité par :
              </p>
              <ul className="mt-3 space-y-1.5 list-none">
                <li>
                  <strong>Raison sociale :</strong> Mon Pilates
                </li>
                <li>
                  <strong>Forme juridique :</strong> Micro-entreprise /
                  Entreprise individuelle
                </li>
                <li>
                  <strong>Adresse :</strong> 14 Boulevard des Dunes, 56260
                  Larmor-Plage, France
                </li>
                <li>
                  <strong>SIRET :</strong> communiqué sur demande
                </li>
                <li>
                  <strong>Téléphone :</strong>{" "}
                  <a
                    href="tel:+33699183216"
                    className="text-mp-ocean hover:underline"
                  >
                    06 99 18 32 16
                  </a>
                </li>
                <li>
                  <strong>Email :</strong>{" "}
                  <a
                    href="mailto:contact@mon-pilates.bzh"
                    className="text-mp-ocean hover:underline"
                  >
                    contact@mon-pilates.bzh
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                2. Responsable de publication
              </h2>
              {/* TODO owner : renseigner le nom complet de la gérante (prénom + nom + éventuellement mention "gérante"). */}
              <p>
                Le responsable de la publication du site est Violette, fondatrice et gérante de Mon Pilates.
              </p>
              <p className="mt-2">
                Contact :{" "}
                <a
                  href="mailto:contact@mon-pilates.bzh"
                  className="text-mp-ocean hover:underline"
                >
                  contact@mon-pilates.bzh
                </a>
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                3. Hébergeur
              </h2>
              <p>Le site est hébergé par :</p>
              <ul className="mt-3 space-y-1.5 list-none">
                <li>
                  <strong>Vercel Inc.</strong>
                </li>
                <li>440 N Barranca Ave #4133, Covina, CA 91723, USA</li>
                <li>
                  Site web :{" "}
                  <a
                    href="https://vercel.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mp-ocean hover:underline"
                  >
                    vercel.com
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                4. Propriété intellectuelle
              </h2>
              <p>
                L&apos;ensemble du contenu du site mon-pilates.bzh (textes,
                images, graphismes, logo, icônes, sons, logiciels, etc.) est la
                propriété exclusive de Mon Pilates ou de ses partenaires et est
                protégé par les lois françaises et internationales relatives à la
                propriété intellectuelle.
              </p>
              <p className="mt-3">
                Toute reproduction, représentation, modification, publication,
                adaptation de tout ou partie des éléments du site, quel que soit
                le moyen ou le procédé utilisé, est interdite, sauf autorisation
                écrite préalable de Mon Pilates.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                5. Données personnelles
              </h2>
              <p>
                Pour plus d&apos;informations sur la collecte et le traitement
                de vos données personnelles, veuillez consulter notre{" "}
                <a
                  href="/politique-confidentialite"
                  className="text-mp-ocean hover:underline"
                >
                  politique de confidentialité
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                6. Cookies
              </h2>
              <p>
                Pour en savoir plus sur l&apos;utilisation des cookies sur ce
                site, consultez notre{" "}
                <a
                  href="/politique-cookies"
                  className="text-mp-ocean hover:underline"
                >
                  politique de cookies
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                7. Limitation de responsabilité
              </h2>
              <p>
                Mon Pilates s&apos;efforce de fournir des informations aussi
                précises que possible sur le site. Toutefois, il ne pourra être
                tenu responsable des omissions, des inexactitudes et des
                carences dans la mise à jour, qu&apos;elles soient de son fait
                ou du fait des tiers partenaires qui lui fournissent ces
                informations.
              </p>
              <p className="mt-3">
                Les informations présentes sur le site sont données à titre
                indicatif et sont susceptibles d&apos;évoluer. Le site peut
                contenir des liens vers d&apos;autres sites dont Mon Pilates ne
                maîtrise pas le contenu.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                8. Droit applicable
              </h2>
              <p>
                Les présentes mentions légales sont régies par le droit
                français. En cas de litige, et après tentative de résolution
                amiable, les tribunaux français seront seuls compétents.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
