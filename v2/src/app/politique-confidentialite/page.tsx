import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Mon Pilates Larmor-Plage",
  description:
    "Politique de confidentialité et protection des données personnelles du site mon-pilates.bzh. Traitement RGPD, droits des utilisateurs et cookies.",
  alternates: {
    canonical: "https://mon-pilates.bzh/politique-confidentialite",
  },
  robots: { index: true, follow: true },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Accueil", href: "/" },
        { name: "Politique de confidentialité", href: "/politique-confidentialite" },
      ]} />
      {/* Hero */}
      <section className="bg-mp-cream pt-32 pb-12">
        <div className="mp-container">
          <Breadcrumb items={[
            { name: "Accueil", href: "/" },
            { name: "Politique de confidentialité", href: "/politique-confidentialite" },
          ]} />
        </div>
        <div className="mp-container text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-mp-charcoal mb-4">
            Politique de confidentialité — Mon Pilates
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
            <p>
              Mon Pilates s&apos;engage à protéger la vie privée de ses
              utilisateurs et clients. La présente politique de confidentialité
              décrit comment nous collectons, utilisons et protégeons vos
              données personnelles, conformément au Règlement Général sur la
              Protection des Données (RGPD - UE 2016/679) et à la loi
              Informatique et Libertés.
            </p>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                1. Responsable du traitement
              </h2>
              <p>Le responsable du traitement des données est :</p>
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
                  Téléphone :{" "}
                  <a
                    href="tel:+33699183216"
                    className="text-mp-ocean hover:underline"
                  >
                    07 83 67 15 63
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                2. Données collectées
              </h2>
              <p>
                Nous collectons les catégories de données suivantes :
              </p>

              <h3 className="font-heading text-lg font-semibold text-mp-charcoal mt-4 mb-2">
                2.1 Formulaire de contact
              </h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone</li>
                <li>Contenu du message</li>
              </ul>

              <h3 className="font-heading text-lg font-semibold text-mp-charcoal mt-4 mb-2">
                2.2 Réservation de cours
              </h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone</li>
                <li>Historique des réservations et participations</li>
              </ul>

              <h3 className="font-heading text-lg font-semibold text-mp-charcoal mt-4 mb-2">
                2.3 Paiement
              </h3>
              <p>
                Les paiements en ligne sont traités par{" "}
                <strong>Stripe Inc.</strong> en tant que sous-traitant. Mon
                Pilates ne collecte ni ne stocke les données de carte bancaire.
                Stripe traite ces données conformément à sa propre{" "}
                <a
                  href="https://stripe.com/fr/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mp-ocean hover:underline"
                >
                  politique de confidentialité
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                3. Bases légales du traitement
              </h2>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>
                  <strong>Exécution du contrat :</strong> gestion des
                  réservations, des paiements et de votre compte client.
                </li>
                <li>
                  <strong>Intérêt légitime :</strong> amélioration de nos
                  services, sécurité du site.
                </li>
                <li>
                  <strong>Consentement :</strong> envoi de communications
                  commerciales (le cas échéant).
                </li>
                <li>
                  <strong>Obligation légale :</strong> facturation, comptabilité.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                4. Finalités du traitement
              </h2>
              <p>
                Vos données personnelles sont collectées pour les finalités
                suivantes :
              </p>
              <ul className="mt-3 space-y-1.5 list-disc list-inside">
                <li>
                  Répondre à vos demandes de contact et d&apos;information
                </li>
                <li>Gérer vos réservations de cours</li>
                <li>
                  Traiter vos achats (cartes de cours, abonnements, cartes
                  cadeaux)
                </li>
                <li>Vous envoyer des confirmations et rappels de cours</li>
                <li>
                  Gérer la relation commerciale et le suivi clientèle
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                5. Durée de conservation
              </h2>
              <p>
                Vos données personnelles sont conservées pendant la durée
                nécessaire à la réalisation des finalités pour lesquelles elles
                ont été collectées :
              </p>
              <ul className="mt-3 space-y-1.5 list-disc list-inside">
                <li>
                  <strong>Données de contact :</strong> 3 ans après le dernier
                  échange.
                </li>
                <li>
                  <strong>Données de réservation :</strong> 3 ans après la
                  dernière participation.
                </li>
                <li>
                  <strong>Données de facturation :</strong> 10 ans (obligation
                  légale comptable).
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                6. Destinataires des données
              </h2>
              <p>
                Vos données peuvent être transmises aux destinataires suivants :
              </p>
              <ul className="mt-3 space-y-1.5 list-disc list-inside">
                <li>
                  <strong>Stripe Inc.</strong> : traitement sécurisé des
                  paiements en ligne
                </li>
                <li>
                  <strong>Vercel Inc.</strong> : hébergement du site web
                </li>
              </ul>
              <p className="mt-3">
                Aucune donnée n&apos;est vendue ou cédée à des tiers à des fins
                commerciales.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-4">
                7. Cookies
              </h2>
              <p>
                Notre site utilise uniquement des cookies essentiels au bon
                fonctionnement du site (cookies de session, préférences
                d&apos;affichage). Aucun cookie de suivi, d&apos;analyse ou
                publicitaire n&apos;est utilisé.
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
                Conformément au RGPD, vous disposez des droits suivants
                concernant vos données personnelles :
              </p>
              <ul className="mt-3 space-y-1.5 list-disc list-inside">
                <li>
                  <strong>Droit d&apos;accès :</strong> obtenir la confirmation
                  que vos données sont traitées et en obtenir une copie.
                </li>
                <li>
                  <strong>Droit de rectification :</strong> faire corriger des
                  données inexactes ou incomplètes.
                </li>
                <li>
                  <strong>Droit à l&apos;effacement :</strong> demander la
                  suppression de vos données, sous réserve des obligations
                  légales de conservation.
                </li>
                <li>
                  <strong>Droit à la portabilité :</strong> recevoir vos données
                  dans un format structuré et lisible par machine.
                </li>
                <li>
                  <strong>Droit d&apos;opposition :</strong> vous opposer au
                  traitement de vos données pour des motifs légitimes.
                </li>
                <li>
                  <strong>Droit à la limitation :</strong> demander la
                  limitation du traitement dans certains cas.
                </li>
              </ul>
              <p className="mt-3">
                Pour exercer ces droits, contactez-nous à l&apos;adresse{" "}
                <a
                  href="mailto:contact@mon-pilates.bzh"
                  className="text-mp-ocean hover:underline"
                >
                  contact@mon-pilates.bzh
                </a>
                . Nous répondrons dans un délai de 30 jours.
              </p>
              <p className="mt-3">
                Vous disposez également du droit d&apos;introduire une
                réclamation auprès de la CNIL (
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
                9. Sécurité des données
              </h2>
              <p>
                Nous mettons en oeuvre les mesures techniques et
                organisationnelles appropriées pour protéger vos données
                personnelles contre tout accès non autorisé, modification,
                divulgation ou destruction. Le site est sécurisé par le
                protocole HTTPS.
              </p>
            </div>

            {/* Contact DPO */}
            <div className="p-6 bg-mp-cream rounded-xl">
              <h2 className="font-heading text-lg font-semibold text-mp-charcoal mb-2">
                Contact — Protection des données
              </h2>
              <p className="text-sm">
                Pour toute question relative à la protection de vos données
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
                  Courrier : Mon Pilates — Protection des données, 14 Boulevard
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
