import type { Metadata } from "next";
import Image from "next/image";
import { GiftCardForm } from "@/components/ui/GiftCardForm";

export const metadata: Metadata = {
  title: "Carte Cadeau",
  description:
    "Offrez une carte cadeau Pilates. Choisissez un nombre de cours ou un montant libre et personnalisez votre message. Livraison par email.",
  openGraph: {
    title: "Carte Cadeau | Mon Pilates",
    description:
      "Offrez du bien-etre : une carte cadeau Pilates personnalisee, livree par email.",
  },
};

export default function CartesCadeauPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-mp-gold-light/40 via-mp-cream to-mp-sand pt-32 pb-16 sm:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--mp-gold-light)_0%,_transparent_50%)] opacity-30" />
        <div className="mp-container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="text-center lg:text-left">
            <p className="font-heading text-sm font-semibold text-mp-gold uppercase tracking-[0.2em] mb-3">
              Carte cadeau
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-mp-charcoal mb-6">
              Offrir du{" "}
              <span className="text-mp-gold">bien-etre</span>
            </h1>
            <p className="font-body text-lg sm:text-xl text-mp-text-light leading-relaxed max-w-2xl">
              Offrez une experience Pilates unique. Choisissez votre formule,
              personnalisez votre message et faites plaisir a ceux que vous aimez.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <Image
              src="/images/illustration-carte-cadeau.png"
              alt="Illustration d'une carte cadeau avec feuilles et noeud vert sauge"
              width={480}
              height={480}
              className="w-full max-w-sm lg:max-w-md h-auto drop-shadow-lg"
              priority
            />
          </div>
        </div>
      </section>

      {/* Gift Card Form & Preview */}
      <section className="mp-section bg-mp-white">
        <div className="mp-container">
          <GiftCardForm />
        </div>
      </section>
    </>
  );
}
