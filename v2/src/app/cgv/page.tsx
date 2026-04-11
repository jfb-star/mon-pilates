import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions generales de vente",
  description:
    "Conditions generales de vente du studio Mon Pilates a Larmor-Plage. Reservations, tarifs, annulations, abonnements.",
};

export default function CgvPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-mp-cream pt-32 pb-12">
        <div className="mp-container text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-mp-charcoal mb-4">
            Conditions generales de vente
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
                Article 1 — Objet
              </h2>
              <p>
                Les presentes conditions generales de vente (CGV) regissent les
                relations contractuelles entre Mon Pilates, studio de Pilates
                situe au 14 Boulevard des Dunes, 56260 Larmor-Plage, et toute
                personne physique souhaitant beneficier de ses prestations de
                cours de Pilates (ci-apres &laquo; le Client &raquo;).
              </p>
              <p className="mt-3">
                Toute reservation ou achat implique l&apos;acceptation sans
                reserve des presentes CGV.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                Article 2 — Prestations et tarifs
              </h2>
              <p>
                Mon Pilates propose des cours collectifs et individuels de
                Pilates (Mat, Reformer, Prenatal, Senior, Doux, Intensif) sous
                forme de :
              </p>
              <ul className="mt-3 space-y-1.5 list-disc list-inside">
                <li>Cours d&apos;essai : 10&euro;</li>
                <li>Seance a l&apos;unite : 18&euro;</li>
                <li>Carte 5 cours : 80&euro; (validite 2 mois)</li>
                <li>Carte 10 cours : 150&euro; (validite 4 mois)</li>
                <li>Carte 20 cours : 260&euro; (validite 6 mois)</li>
                <li>Abonnement mensuel illimite : 89&euro;/mois</li>
              </ul>
              <p className="mt-3">
                Les tarifs en vigueur sont affiches sur le site mon-pilates.bzh
                et au studio. Mon Pilates se reserve le droit de modifier ses
                tarifs a tout moment. Les prestations seront facturees au tarif
                en vigueur au moment de la reservation ou de l&apos;achat.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                Article 3 — Reservation et annulation
              </h2>
              <p>
                Les reservations s&apos;effectuent en ligne via le site
                mon-pilates.bzh ou par telephone. Chaque reservation est
                nominative et non cessible.
              </p>
              <h3 className="font-heading text-lg font-semibold text-mp-charcoal mt-4 mb-2">
                Annulation par le Client
              </h3>
              <p>
                Toute annulation doit etre effectuee au minimum{" "}
                <strong>12 heures avant le debut du cours</strong>. Au-dela de
                ce delai, la seance sera consideree comme effectuee et deduite de
                la carte de cours ou facturee.
              </p>
              <p className="mt-2">
                En cas de retard de plus de 10 minutes, l&apos;acces au cours
                pourra etre refuse pour des raisons de securite et de respect
                des autres participants. La seance sera alors consideree comme
                consommee.
              </p>
              <h3 className="font-heading text-lg font-semibold text-mp-charcoal mt-4 mb-2">
                Annulation par Mon Pilates
              </h3>
              <p>
                En cas d&apos;annulation d&apos;un cours par Mon Pilates
                (indisponibilite de l&apos;instructrice, force majeure, etc.), le
                Client sera prevenu dans les meilleurs delais et la seance sera
                reportee ou remboursee.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                Article 4 — Cartes de cours
              </h2>
              <p>Les cartes de cours sont soumises aux conditions suivantes :</p>
              <ul className="mt-3 space-y-1.5 list-disc list-inside">
                <li>
                  <strong>Carte 5 cours :</strong> valable 2 mois a compter de
                  la date d&apos;achat.
                </li>
                <li>
                  <strong>Carte 10 cours :</strong> valable 4 mois a compter de
                  la date d&apos;achat.
                </li>
                <li>
                  <strong>Carte 20 cours :</strong> valable 6 mois a compter de
                  la date d&apos;achat.
                </li>
              </ul>
              <p className="mt-3">
                Les cartes sont nominatives et non remboursables. Les seances
                non utilisees a l&apos;expiration de la carte sont perdues. En
                cas de circonstances exceptionnelles (maladie, accident), une
                suspension temporaire peut etre accordee sur presentation d&apos;un
                justificatif medical, a la discretion de Mon Pilates.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                Article 5 — Abonnement mensuel
              </h2>
              <p>
                L&apos;abonnement mensuel illimite donne acces a l&apos;ensemble
                des cours collectifs du planning, sans limitation du nombre de
                seances.
              </p>
              <ul className="mt-3 space-y-1.5 list-disc list-inside">
                <li>
                  Le prelevement est effectue chaque mois a la date
                  anniversaire de la souscription.
                </li>
                <li>
                  L&apos;abonnement est <strong>sans engagement</strong> et
                  resiliable a tout moment avec un preavis de 15 jours avant la
                  prochaine echeance.
                </li>
                <li>
                  La resiliation peut etre effectuee par email a
                  contact@mon-pilates.bzh ou depuis l&apos;espace client en
                  ligne.
                </li>
                <li>
                  Aucun remboursement au prorata ne sera effectue en cas de
                  resiliation en cours de periode.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                Article 6 — Cartes cadeaux
              </h2>
              <p>
                Les cartes cadeaux sont valables 12 mois a compter de la date
                d&apos;achat. Elles sont transferables mais non remboursables et
                ne peuvent etre echangees contre de l&apos;argent. Le solde non
                utilise a l&apos;expiration de la carte est perdu. Le
                beneficiaire de la carte cadeau doit se conformer aux presentes
                CGV.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                Article 7 — Paiement
              </h2>
              <p>
                Les paiements s&apos;effectuent en ligne par carte bancaire via
                la plateforme securisee Stripe, ou sur place au studio par carte
                bancaire, especes ou cheque.
              </p>
              <p className="mt-3">
                L&apos;integralite du paiement est due au moment de
                l&apos;achat. En cas de defaut de paiement, Mon Pilates se
                reserve le droit de suspendre l&apos;acces aux prestations.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                Article 8 — Responsabilite
              </h2>
              <p>
                Le Client s&apos;engage a informer l&apos;instructrice de tout
                probleme de sante, blessure ou grossesse avant le debut du
                cours. Mon Pilates decline toute responsabilite en cas de
                blessure survenue pendant un cours si le Client n&apos;a pas
                communique les informations medicales necessaires.
              </p>
              <p className="mt-3">
                La pratique du Pilates se fait sous la responsabilite du Client.
                Un certificat medical d&apos;aptitude a la pratique sportive peut
                etre demande.
              </p>
              <p className="mt-3">
                Mon Pilates n&apos;est pas responsable des objets personnels
                perdus ou voles dans le studio.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                Article 9 — Droit de retractation
              </h2>
              <p>
                Conformement a l&apos;article L.221-28 du Code de la
                consommation, le droit de retractation ne s&apos;applique pas
                aux prestations de services de loisirs devant etre fournies a
                une date ou une periode determinee.
              </p>
              <p className="mt-3">
                En consequence, toute reservation confirmee pour un cours a une
                date et un horaire precis ne pourra faire l&apos;objet d&apos;un
                droit de retractation. Les conditions d&apos;annulation prevues
                a l&apos;article 3 s&apos;appliquent.
              </p>
              <p className="mt-3">
                Pour les achats de cartes de cours ou cartes cadeaux non encore
                utilisees, le Client dispose d&apos;un delai de 14 jours a
                compter de l&apos;achat pour exercer son droit de retractation
                en contactant contact@mon-pilates.bzh.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                Article 10 — Litiges
              </h2>
              <p>
                Les presentes CGV sont soumises au droit francais. En cas de
                litige, les parties s&apos;engagent a rechercher une solution
                amiable avant toute action judiciaire.
              </p>
              <p className="mt-3">
                Conformement a l&apos;article L.612-1 du Code de la
                consommation, le Client peut recourir a un mediateur de la
                consommation en cas de litige non resolu. Le mediateur peut etre
                saisi dans un delai d&apos;un an a compter de la reclamation
                ecrite adressee au professionnel.
              </p>
              <p className="mt-3">
                A defaut de resolution amiable, le litige sera porte devant les
                tribunaux competents du ressort du Tribunal judiciaire de
                Lorient.
              </p>
            </div>

            {/* Contact box */}
            <div className="p-6 bg-mp-cream rounded-xl">
              <h2 className="font-heading text-lg font-semibold text-mp-charcoal mb-2">
                Contact
              </h2>
              <p className="text-sm">
                Pour toute question relative aux presentes CGV, contactez-nous :
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
                  Telephone :{" "}
                  <a
                    href="tel:+33783671563"
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
