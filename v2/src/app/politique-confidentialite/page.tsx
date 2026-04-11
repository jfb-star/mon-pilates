import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialite",
  description:
    "Politique de confidentialite et protection des donnees personnelles du site mon-pilates.bzh, conforme au RGPD.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-mp-cream pt-32 pb-12">
        <div className="mp-container text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-mp-charcoal mb-4">
            Politique de confidentialite
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
            <p>
              Mon Pilates s&apos;engage a proteger la vie privee de ses
              utilisateurs et clients. La presente politique de confidentialite
              decrit comment nous collectons, utilisons et protegeons vos
              donnees personnelles, conformement au Reglement General sur la
              Protection des Donnees (RGPD - UE 2016/679) et a la loi
              Informatique et Libertes.
            </p>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                1. Responsable du traitement
              </h2>
              <p>Le responsable du traitement des donnees est :</p>
              <ul className="mt-3 space-y-1.5 list-none">
                <li>
                  <strong>Mon Pilates</strong>
                </li>
                <li>14 Boulevard des Dunes, 56260 Larmor-Plage</li>
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
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                2. Donnees collectees
              </h2>
              <p>
                Nous collectons les categories de donnees suivantes :
              </p>

              <h3 className="font-heading text-lg font-semibold text-mp-charcoal mt-4 mb-2">
                2.1 Formulaire de contact
              </h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Nom et prenom</li>
                <li>Adresse email</li>
                <li>Numero de telephone</li>
                <li>Contenu du message</li>
              </ul>

              <h3 className="font-heading text-lg font-semibold text-mp-charcoal mt-4 mb-2">
                2.2 Reservation de cours
              </h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Nom et prenom</li>
                <li>Adresse email</li>
                <li>Numero de telephone</li>
                <li>Historique des reservations et participations</li>
              </ul>

              <h3 className="font-heading text-lg font-semibold text-mp-charcoal mt-4 mb-2">
                2.3 Paiement
              </h3>
              <p>
                Les paiements en ligne sont traites par{" "}
                <strong>Stripe Inc.</strong> en tant que sous-traitant. Mon
                Pilates ne collecte ni ne stocke les donnees de carte bancaire.
                Stripe traite ces donnees conformement a sa propre{" "}
                <a
                  href="https://stripe.com/fr/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mp-ocean hover:underline"
                >
                  politique de confidentialite
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                3. Bases legales du traitement
              </h2>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>
                  <strong>Execution du contrat :</strong> gestion des
                  reservations, des paiements et de votre compte client.
                </li>
                <li>
                  <strong>Interet legitime :</strong> amelioration de nos
                  services, securite du site.
                </li>
                <li>
                  <strong>Consentement :</strong> envoi de communications
                  commerciales (le cas echeant).
                </li>
                <li>
                  <strong>Obligation legale :</strong> facturation, comptabilite.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                4. Finalites du traitement
              </h2>
              <p>
                Vos donnees personnelles sont collectees pour les finalites
                suivantes :
              </p>
              <ul className="mt-3 space-y-1.5 list-disc list-inside">
                <li>
                  Repondre a vos demandes de contact et d&apos;information
                </li>
                <li>Gerer vos reservations de cours</li>
                <li>
                  Traiter vos achats (cartes de cours, abonnements, cartes
                  cadeaux)
                </li>
                <li>Vous envoyer des confirmations et rappels de cours</li>
                <li>
                  Gerer la relation commerciale et le suivi clientele
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                5. Duree de conservation
              </h2>
              <p>
                Vos donnees personnelles sont conservees pendant la duree
                necessaire a la realisation des finalites pour lesquelles elles
                ont ete collectees :
              </p>
              <ul className="mt-3 space-y-1.5 list-disc list-inside">
                <li>
                  <strong>Donnees de contact :</strong> 3 ans apres le dernier
                  echange.
                </li>
                <li>
                  <strong>Donnees de reservation :</strong> 3 ans apres la
                  derniere participation.
                </li>
                <li>
                  <strong>Donnees de facturation :</strong> 10 ans (obligation
                  legale comptable).
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                6. Destinataires des donnees
              </h2>
              <p>
                Vos donnees peuvent etre transmises aux destinataires suivants :
              </p>
              <ul className="mt-3 space-y-1.5 list-disc list-inside">
                <li>
                  <strong>Stripe Inc.</strong> : traitement securise des
                  paiements en ligne
                </li>
                <li>
                  <strong>Vercel Inc.</strong> : hebergement du site web
                </li>
              </ul>
              <p className="mt-3">
                Aucune donnee n&apos;est vendue ou cedee a des tiers a des fins
                commerciales.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                7. Cookies
              </h2>
              <p>
                Notre site utilise uniquement des cookies essentiels au bon
                fonctionnement du site (cookies de session, preferences
                d&apos;affichage). Aucun cookie de suivi, d&apos;analyse ou
                publicitaire n&apos;est utilise.
              </p>
              <p className="mt-3">
                Pour plus d&apos;informations, consultez notre{" "}
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
                8. Vos droits
              </h2>
              <p>
                Conformement au RGPD, vous disposez des droits suivants
                concernant vos donnees personnelles :
              </p>
              <ul className="mt-3 space-y-1.5 list-disc list-inside">
                <li>
                  <strong>Droit d&apos;acces :</strong> obtenir la confirmation
                  que vos donnees sont traitees et en obtenir une copie.
                </li>
                <li>
                  <strong>Droit de rectification :</strong> faire corriger des
                  donnees inexactes ou incompletes.
                </li>
                <li>
                  <strong>Droit a l&apos;effacement :</strong> demander la
                  suppression de vos donnees, sous reserve des obligations
                  legales de conservation.
                </li>
                <li>
                  <strong>Droit a la portabilite :</strong> recevoir vos donnees
                  dans un format structure et lisible par machine.
                </li>
                <li>
                  <strong>Droit d&apos;opposition :</strong> vous opposer au
                  traitement de vos donnees pour des motifs legitimes.
                </li>
                <li>
                  <strong>Droit a la limitation :</strong> demander la
                  limitation du traitement dans certains cas.
                </li>
              </ul>
              <p className="mt-3">
                Pour exercer ces droits, contactez-nous a l&apos;adresse{" "}
                <a
                  href="mailto:contact@mon-pilates.bzh"
                  className="text-mp-ocean hover:underline"
                >
                  contact@mon-pilates.bzh
                </a>
                . Nous repondrons dans un delai de 30 jours.
              </p>
              <p className="mt-3">
                Vous disposez egalement du droit d&apos;introduire une
                reclamation aupres de la CNIL (
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mp-ocean hover:underline"
                >
                  www.cnil.fr
                </a>
                ).
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                9. Securite des donnees
              </h2>
              <p>
                Nous mettons en oeuvre les mesures techniques et
                organisationnelles appropriees pour proteger vos donnees
                personnelles contre tout acces non autorise, modification,
                divulgation ou destruction. Le site est securise par le
                protocole HTTPS.
              </p>
            </div>

            {/* Contact DPO */}
            <div className="p-6 bg-mp-cream rounded-xl">
              <h2 className="font-heading text-lg font-semibold text-mp-charcoal mb-2">
                Contact — Protection des donnees
              </h2>
              <p className="text-sm">
                Pour toute question relative a la protection de vos donnees
                personnelles :
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
                  Courrier : Mon Pilates — Protection des donnees, 14 Boulevard
                  des Dunes, 56260 Larmor-Plage
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
