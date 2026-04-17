import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Politique de cookies — Mon Pilates Larmor-Plage",
  description:
    "Politique de cookies du site mon-pilates.bzh. Types de cookies utilisés, finalités et gestion de vos préférences de navigation.",
  alternates: {
    canonical: "https://mon-pilates.bzh/politique-cookies",
  },
  robots: { index: true, follow: true },
};

export default function PolitiqueCookiesPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Accueil", href: "/" },
        { name: "Politique cookies", href: "/politique-cookies" },
      ]} />
      {/* Hero */}
      <section className="bg-mp-cream pt-32 pb-12">
        <div className="mp-container">
          <Breadcrumb items={[
            { name: "Accueil", href: "/" },
            { name: "Politique cookies", href: "/politique-cookies" },
          ]} />
        </div>
        <div className="mp-container text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-mp-charcoal mb-4">
            Politique de cookies — Mon Pilates
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
                1. Qu&apos;est-ce qu&apos;un cookie ?
              </h2>
              <p>
                Un cookie est un petit fichier texte déposé sur votre terminal
                (ordinateur, tablette, smartphone) lors de votre visite sur
                notre site. Il permet de stocker des informations relatives à
                votre navigation afin de faciliter votre expérience ultérieure
                et de rendre le site plus fonctionnel.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                2. Les cookies que nous utilisons
              </h2>
              <p>
                Le site mon-pilates.bzh utilise{" "}
                <strong>uniquement des cookies essentiels et fonctionnels</strong>{" "}
                au bon fonctionnement du site. Nous n&apos;utilisons aucun
                cookie de suivi, d&apos;analyse ou de publicité.
              </p>

              <h3 className="font-heading text-lg font-semibold text-mp-charcoal mt-6 mb-3">
                Cookies essentiels (strictement nécessaires)
              </h3>
              <p>
                Ces cookies sont indispensables au fonctionnement du site. Ils
                ne peuvent pas être désactivés.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-mp-sand-dark/30">
                      <th className="font-heading font-semibold text-mp-charcoal text-left py-3 pr-4">
                        Cookie
                      </th>
                      <th className="font-heading font-semibold text-mp-charcoal text-left py-3 pr-4">
                        Finalité
                      </th>
                      <th className="font-heading font-semibold text-mp-charcoal text-left py-3">
                        Durée
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mp-sand-dark/20">
                    <tr>
                      <td className="py-3 pr-4 font-mono text-xs">
                        session_id
                      </td>
                      <td className="py-3 pr-4">
                        Maintien de la session utilisateur
                      </td>
                      <td className="py-3">Session</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-mono text-xs">
                        cookie_consent
                      </td>
                      <td className="py-3 pr-4">
                        Mémorisation de vos préférences cookies
                      </td>
                      <td className="py-3">12 mois</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="font-heading text-lg font-semibold text-mp-charcoal mt-6 mb-3">
                Cookies fonctionnels
              </h3>
              <p>
                Ces cookies permettent de sauvegarder vos préférences
                d&apos;affichage pour améliorer votre expérience.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-mp-sand-dark/30">
                      <th className="font-heading font-semibold text-mp-charcoal text-left py-3 pr-4">
                        Cookie
                      </th>
                      <th className="font-heading font-semibold text-mp-charcoal text-left py-3 pr-4">
                        Finalité
                      </th>
                      <th className="font-heading font-semibold text-mp-charcoal text-left py-3">
                        Durée
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mp-sand-dark/20">
                    <tr>
                      <td className="py-3 pr-4 font-mono text-xs">
                        user_preferences
                      </td>
                      <td className="py-3 pr-4">
                        Sauvegarde de vos préférences (thème, langue)
                      </td>
                      <td className="py-3">6 mois</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                3. Cookies tiers
              </h2>
              <p>
                Nous n&apos;utilisons actuellement aucun cookie tiers
                (analytics, réseaux sociaux, publicité). Si cela devait
                évoluer, cette politique sera mise à jour et votre consentement
                sera recueilli préalablement.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                4. Gérer vos cookies
              </h2>
              <p>
                Vous pouvez à tout moment configurer votre navigateur pour
                accepter ou refuser les cookies. Voici comment procéder selon
                votre navigateur :
              </p>
              <ul className="mt-3 space-y-1.5 list-disc list-inside">
                <li>
                  <strong>Chrome :</strong> Paramètres &gt; Confidentialité et
                  sécurité &gt; Cookies
                </li>
                <li>
                  <strong>Firefox :</strong> Paramètres &gt; Vie privée et
                  sécurité &gt; Cookies
                </li>
                <li>
                  <strong>Safari :</strong> Préférences &gt; Confidentialité
                  &gt; Cookies
                </li>
                <li>
                  <strong>Edge :</strong> Paramètres &gt; Cookies et
                  autorisations de site
                </li>
              </ul>
              <p className="mt-3 text-sm text-mp-text-light">
                Attention : la désactivation des cookies essentiels peut
                affecter le bon fonctionnement du site et limiter certaines
                fonctionnalités.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                5. En savoir plus
              </h2>
              <p>
                Pour en savoir plus sur les cookies et vos droits, vous pouvez
                consulter le site de la CNIL :{" "}
                <a
                  href="https://www.cnil.fr/fr/cookies-et-autres-traceurs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mp-ocean hover:underline"
                >
                  www.cnil.fr
                </a>
                .
              </p>
            </div>

            {/* Contact */}
            <div className="p-6 bg-mp-cream rounded-xl">
              <h2 className="font-heading text-lg font-semibold text-mp-charcoal mb-2">
                Contact
              </h2>
              <p className="text-sm">
                Pour toute question relative à l&apos;utilisation des cookies
                sur ce site :
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>
                  Email :{" "}
                  <a
                    href="mailto:contact@mon-pilates.bzh"
                    className="text-mp-ocean hover:underline"
                  >
                    contact@mon-pilates.bzh
                  </a>
                </li>
                <li>
                  Adresse : Mon Pilates, 14 Boulevard des Dunes, 56260
                  Larmor-Plage
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
