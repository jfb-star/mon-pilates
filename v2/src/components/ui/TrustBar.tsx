"use client"

import { AnimatedCounter } from "./AnimatedCounter"

export function TrustBar() {
  return (
    <section className="py-8 bg-mp-white border-b border-mp-sand-dark/20" aria-label="Chiffres clés du studio">
      <div className="mp-container">
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-14 text-center">
          <div>
            <p className="font-heading text-3xl font-bold text-mp-ocean">
              <AnimatedCounter end={4.9} decimals={1} />/5
            </p>
            <p className="font-body text-xs text-mp-text-light mt-1">47 avis Google</p>
          </div>
          <div className="w-px h-10 bg-mp-sand-dark/30 hidden sm:block" aria-hidden="true" />
          <div>
            <p className="font-heading text-3xl font-bold text-mp-ocean">
              <AnimatedCounter end={200} suffix="+" />
            </p>
            <p className="font-body text-xs text-mp-text-light mt-1">élèves accompagnés</p>
          </div>
          <div className="w-px h-10 bg-mp-sand-dark/30 hidden sm:block" aria-hidden="true" />
          <div>
            <p className="font-heading text-3xl font-bold text-mp-ocean">
              <AnimatedCounter end={10} suffix=" max" />
            </p>
            <p className="font-body text-xs text-mp-text-light mt-1">par cours</p>
          </div>
          <div className="w-px h-10 bg-mp-sand-dark/30 hidden sm:block" aria-hidden="true" />
          <div>
            <p className="font-heading text-3xl font-bold text-mp-ocean">
              <AnimatedCounter end={10} suffix="€" />
            </p>
            <p className="font-body text-xs text-mp-text-light mt-1">cours d&apos;essai</p>
          </div>
        </div>
      </div>
    </section>
  )
}
