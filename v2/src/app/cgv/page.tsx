import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Conditions générales de vente — Mon Pilates Larmor-Plage",
  description:
    "Conditions générales de vente du studio Mon Pilates à Larmor-Plage. Réservations, tarifs, annulations, abonnements et cartes cadeaux.",
  alternates: {
    canonical: "https://mon-pilates.bzh/cgv",
  },
  robots: { index: true, follow: true },
};

export default function CgvPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Accueil", href: "/" },
        { name: "CGV", href: "/cgv" },
      ]} />
      {/* Hero */}
      <section className="bg-mp-cream pt-32 pb-12">
        <div className="mp-container">
          <Breadcrumb items={[
            { name: "Accueil", href: "/" },
            { name: "CGV", href: "/cgv" },
          ]} />
        </div>
        <div className="mp-container text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-mp-charcoal mb-4">
            Conditions générales de vente — Mon Pilates
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
                Article 1 — Objet
              </h2>
              <p>
                Les présentes conditions générales de vente (<abbr title="Conditions Générales de Vente" className="no-underline">CGV</abbr>) régissent les
                relations contractuelles entre Mon Pilates, studio de Pilates
                situé au 14 Boulevard des Dunes, 56260 Larmor-Plage, et toute
                personne physique souhaitant bénéficier de ses prestations de
                cours de Pilates (ci-après &laquo; le Client &raquo;).
              </p>
              <p className="mt-3">
                Toute réservation ou achat implique l&apos;acceptation sans
                réserve des présentes CGV.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                Article 2 — Prestations et tarifs
              </h2>
              <p>
                Mon Pilates propose des cours collectifs et individuels de
                Pilates (Mat, Reformer, Prénatal, Senior, Doux, Intensif) sous
                forme de :
              </p>
              <ul className="mt-3 space-y-1.5 list-disc list-inside">
                <li>Cours d&apos;essai : 10&euro;</li>
                <li>Séance à l&apos;unité : 18&euro;</li>
                <li>Carte 5 cours : 80&euro; (validité 2 mois)</li>
                <li>Carte 10 cours : 150&euro; (validité 4 mois)</li>
                <li>Carte 20 cours : 260&euro; (validité 6 mois)</li>
                <li>Abonnement mensuel illimité : 89&euro;/mois</li>
              </ul>
              <p className="mt-3">
                Les tarifs en vigueur sont affichés sur le site mon-pilates.bzh
                et au studio. Mon Pilates se réserve le droit de modifier ses
                tarifs à tout moment. Les prestations seront facturées au tarif
                en vigueur au moment de la réservation ou de l&apos;achat.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                Article 3 — Réservation et annulation
              </h2>
              <p>
                Les réservations s&apos;effectuent en ligne via le site
                mon-pilates.bzh ou par téléphone. Chaque réservation est
                nominative et non cessible.
              </p>
              <h3 className="font-heading text-lg font-semibold text-mp-charcoal mt-4 mb-2">
                Annulation par le Client
              </h3>
              <p>
                Toute annulation doit être effectuée au minimum{" "}
                <strong>12 heures avant le début du cours</strong>. Au-delà de
                ce délai, la séance sera considérée comme effectuée et déduite de
                la carte de cours ou facturée.
              </p>
              <p className="mt-2">
                En cas de retard de plus de 10 minutes, l&apos;accès au cours
                pourra être refusé pour des raisons de sécurité et de respect
                des autres participants. La séance sera alors considérée comme
                consommée.
              </p>
              <h3 className="font-heading text-lg font-semibold text-mp-charcoal mt-4 mb-2">
                Annulation par Mon Pilates
              </h3>
              <p>
                En cas d&apos;annulation d&apos;un cours par Mon Pilates
                (indisponibilité de l&apos;instructrice, force majeure, etc.), le
                Client sera prévenu dans les meilleurs délais et la séance sera
                reportée ou remboursée.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                Article 4 — Cartes de cours
              </h2>
              <p>Les cartes de cours sont soumises aux conditions suivantes :</p>
              <ul className="mt-3 space-y-1.5 list-disc list-inside">
                <li>
                  <strong>Carte 5 cours :</strong> valable 2 mois à compter de
                  la date d&apos;achat.
                </li>
                <li>
                  <strong>Carte 10 cours :</strong> valable 4 mois à compter de
                  la date d&apos;achat.
                </li>
                <li>
                  <strong>Carte 20 cours :</strong> valable 6 mois à compter de
                  la date d&apos;achat.
                </li>
              </ul>
              <p className="mt-3">
                Les cartes sont nominatives et non remboursables. Les séances
                non utilisées à l&apos;expiration de la carte sont perdues. En
                cas de circonstances exceptionnelles (maladie, accident), une
                suspension temporaire peut être accordée sur présentation d&apos;un
                justificatif médical, à la discrétion de Mon Pilates.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                Article 5 — Abonnement mensuel
              </h2>
              <p>
                L&apos;abonnement mensuel illimité donne accès à l&apos;ensemble
                des cours collectifs du planning, sans limitation du nombre de
                séances.
              </p>
              <ul className="mt-3 space-y-1.5 list-disc list-inside">
                <li>
                  Le prélèvement est effectué chaque mois à la date
                  anniversaire de la souscription.
                </li>
                <li>
                  L&apos;abonnement est <strong>sans engagement</strong> et
                  résiliable à tout moment avec un préavis de 15 jours avant la
                  prochaine échéance.
                </li>
                <li>
                  La résiliation peut être effectuée par email à
                  contact@mon-pilates.bzh ou depuis l&apos;espace client en
                  ligne.
                </li>
                <li>
                  Aucun remboursement au prorata ne sera effectué en cas de
                  résiliation en cours de période.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                Article 6 — Cartes cadeaux
              </h2>
              <p>
                Les cartes cadeaux sont valables 12 mois à compter de la date
                d&apos;achat. Elles sont transférables mais non remboursables et
                ne peuvent être échangées contre de l&apos;argent. Le solde non
                utilisé à l&apos;expiration de la carte est perdu. Le
                bénéficiaire de la carte cadeau doit se conformer aux présentes
                CGV.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                Article 7 — Paiement
              </h2>
              <p>
                Les paiements s&apos;effectuent en ligne par carte bancaire via
                la plateforme sécurisée Stripe, ou sur place au studio par carte
                bancaire, espèces ou chèque.
              </p>
              <p className="mt-3">
                L&apos;intégralité du paiement est due au moment de
                l&apos;achat. En cas de défaut de paiement, Mon Pilates se
                réserve le droit de suspendre l&apos;accès aux prestations.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                Article 8 — Responsabilité
              </h2>
              <p>
                Le Client s&apos;engage à informer l&apos;instructrice de tout
                problème de santé, blessure ou grossesse avant le début du
                cours. Mon Pilates décline toute responsabilité en cas de
                blessure survenue pendant un cours si le Client n&apos;a pas
                communiqué les informations médicales nécessaires.
              </p>
              <p className="mt-3">
                La pratique du Pilates se fait sous la responsabilité du Client.
                Un certificat médical d&apos;aptitude à la pratique sportive peut
                être demandé.
              </p>
              <p className="mt-3">
                Mon Pilates n&apos;est pas responsable des objets personnels
                perdus ou volés dans le studio.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                Article 9 — Droit de rétractation
              </h2>
              <p>
                Conformément à l&apos;article L.221-28 du Code de la
                consommation, le droit de rétractation ne s&apos;applique pas
                aux prestations de services de loisirs devant être fournies à
                une date ou une période déterminée.
              </p>
              <p className="mt-3">
                En conséquence, toute réservation confirmée pour un cours à une
                date et un horaire précis ne pourra faire l&apos;objet d&apos;un
                droit de rétractation. Les conditions d&apos;annulation prévues
                à l&apos;article 3 s&apos;appliquent.
              </p>
              <p className="mt-3">
                Pour les achats de cartes de cours ou cartes cadeaux non encore
                utilisées, le Client dispose d&apos;un délai de 14 jours à
                compter de l&apos;achat pour exercer son droit de rétractation
                en contactant contact@mon-pilates.bzh.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                Article 10 — Litiges
              </h2>
              <p>
                Les présentes CGV sont soumises au droit français. En cas de
                litige, les parties s&apos;engagent a rechercher une solution
                amiable avant toute action judiciaire.
              </p>
              <p className="mt-3">
                Conformément à l&apos;article L.612-1 du Code de la
                consommation, le Client peut recourir à un médiateur de la
                consommation en cas de litige non résolu. Le médiateur peut être
                saisi dans un délai d&apos;un an à compter de la réclamation
                écrite adressée au professionnel.
              </p>
              <p className="mt-3">
                À défaut de résolution amiable, le litige sera porté devant les
                tribunaux compétents du ressort du Tribunal judiciaire de
                Lorient.
              </p>
            </div>

            {/* Contact box */}
            <div className="p-6 bg-mp-cream rounded-xl">
              <h2 className="font-heading text-lg font-semibold text-mp-charcoal mb-2">
                Contact
              </h2>
              <p className="text-sm">
                Pour toute question relative aux présentes CGV, contactez-nous :
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
                  Téléphone :{" "}
                  <a
                    href="tel:+33699183216"
                    className="text-mp-ocean hover:underline"
                  >
                    07 83 67 15 63
                  </a>
                </li>
                <li>
                  Adresse : 14 Boulevard des Dunes, 56260 Larmor-Plage
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
