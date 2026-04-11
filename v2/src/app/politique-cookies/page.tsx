import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de cookies",
  description:
    "Politique de cookies du site mon-pilates.bzh. Types de cookies utilises, finalites et gestion de vos preferences.",
};

export default function PolitiqueCookiesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-mp-cream pt-32 pb-12">
        <div className="mp-container text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-mp-charcoal mb-4">
            Politique de cookies
          </h1>
          <p className="font-body text-mp-text-light">
            Derniere mise a jour : avril 2026
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
                Un cookie est un petit fichier texte depose sur votre terminal
                (ordinateur, tablette, smartphone) lors de votre visite sur
                notre site. Il permet de stocker des informations relatives a
                votre navigation afin de faciliter votre experience ulterieure
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
                cookie de suivi, d&apos;analyse ou de publicite.
              </p>

              <h3 className="font-heading text-lg font-semibold text-mp-charcoal mt-6 mb-3">
                Cookies essentiels (strictement necessaires)
              </h3>
              <p>
                Ces cookies sont indispensables au fonctionnement du site. Ils
                ne peuvent pas etre desactives.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-mp-sand-dark/30">
                      <th className="font-heading font-semibold text-mp-charcoal text-left py-3 pr-4">
                        Cookie
                      </th>
                      <th className="font-heading font-semibold text-mp-charcoal text-left py-3 pr-4">
                        Finalite
                      </th>
                      <th className="font-heading font-semibold text-mp-charcoal text-left py-3">
                        Duree
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
                        Memorisation de vos preferences cookies
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
                Ces cookies permettent de sauvegarder vos preferences
                d&apos;affichage pour ameliorer votre experience.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-mp-sand-dark/30">
                      <th className="font-heading font-semibold text-mp-charcoal text-left py-3 pr-4">
                        Cookie
                      </th>
                      <th className="font-heading font-semibold text-mp-charcoal text-left py-3 pr-4">
                        Finalite
                      </th>
                      <th className="font-heading font-semibold text-mp-charcoal text-left py-3">
                        Duree
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mp-sand-dark/20">
                    <tr>
                      <td className="py-3 pr-4 font-mono text-xs">
                        user_preferences
                      </td>
                      <td className="py-3 pr-4">
                        Sauvegarde de vos preferences (theme, langue)
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
                (analytics, reseaux sociaux, publicite). Si cela devait
                evoluer, cette politique sera mise a jour et votre consentement
                sera recueilli prealablement.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                4. Gerer vos cookies
              </h2>
              <p>
                Vous pouvez a tout moment configurer votre navigateur pour
                accepter ou refuser les cookies. Voici comment proceder selon
                votre navigateur :
              </p>
              <ul className="mt-3 space-y-1.5 list-disc list-inside">
                <li>
                  <strong>Chrome :</strong> Parametres &gt; Confidentialite et
                  securite &gt; Cookies
                </li>
                <li>
                  <strong>Firefox :</strong> Parametres &gt; Vie privee et
                  securite &gt; Cookies
                </li>
                <li>
                  <strong>Safari :</strong> Preferences &gt; Confidentialite
                  &gt; Cookies
                </li>
                <li>
                  <strong>Edge :</strong> Parametres &gt; Cookies et
                  autorisations de site
                </li>
              </ul>
              <p className="mt-3 text-sm text-mp-text-light">
                Attention : la desactivation des cookies essentiels peut
                affecter le bon fonctionnement du site et limiter certaines
                fonctionnalites.
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
                Pour toute question relative a l&apos;utilisation des cookies
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
