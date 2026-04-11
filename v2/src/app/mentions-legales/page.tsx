import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions legales",
  description:
    "Mentions legales du site mon-pilates.bzh. Informations sur l'editeur, l'hebergeur et les conditions d'utilisation.",
};

export default function MentionsLegalesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-mp-cream pt-32 pb-12">
        <div className="mp-container text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-mp-charcoal mb-4">
            Mentions legales
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
                1. Editeur du site
              </h2>
              <p>
                Le site <strong>mon-pilates.bzh</strong> est edite par :
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
                  <strong>SIRET :</strong> [A completer]
                </li>
                <li>
                  <strong>Telephone :</strong>{" "}
                  <a
                    href="tel:+33783671563"
                    className="text-mp-ocean hover:underline"
                  >
                    07 83 67 15 63
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
              <p>
                Le responsable de la publication du site est : [a completer].
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
                3. Hebergeur
              </h2>
              <p>Le site est heberge par :</p>
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
                4. Propriete intellectuelle
              </h2>
              <p>
                L&apos;ensemble du contenu du site mon-pilates.bzh (textes,
                images, graphismes, logo, icones, sons, logiciels, etc.) est la
                propriete exclusive de Mon Pilates ou de ses partenaires et est
                protege par les lois francaises et internationales relatives a la
                propriete intellectuelle.
              </p>
              <p className="mt-3">
                Toute reproduction, representation, modification, publication,
                adaptation de tout ou partie des elements du site, quel que soit
                le moyen ou le procede utilise, est interdite, sauf autorisation
                ecrite prealable de Mon Pilates.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                5. Donnees personnelles
              </h2>
              <p>
                Pour plus d&apos;informations sur la collecte et le traitement
                de vos donnees personnelles, veuillez consulter notre{" "}
                <a
                  href="/politique-confidentialite"
                  className="text-mp-ocean hover:underline"
                >
                  politique de confidentialite
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
                7. Limitation de responsabilite
              </h2>
              <p>
                Mon Pilates s&apos;efforce de fournir des informations aussi
                precises que possible sur le site. Toutefois, il ne pourra etre
                tenu responsable des omissions, des inexactitudes et des
                carences dans la mise a jour, qu&apos;elles soient de son fait
                ou du fait des tiers partenaires qui lui fournissent ces
                informations.
              </p>
              <p className="mt-3">
                Les informations presentes sur le site sont donnees a titre
                indicatif et sont susceptibles d&apos;evoluer. Le site peut
                contenir des liens vers d&apos;autres sites dont Mon Pilates ne
                maitrise pas le contenu.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                8. Droit applicable
              </h2>
              <p>
                Les presentes mentions legales sont regies par le droit
                francais. En cas de litige, et apres tentative de resolution
                amiable, les tribunaux francais seront seuls competents.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
