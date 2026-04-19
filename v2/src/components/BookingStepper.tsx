"use client"

import { Check } from "lucide-react"
import { clsx } from "clsx"

type Step = 1 | 2 | 3 | 4

interface BookingStepperProps {
  currentStep: Step
  labels?: [string, string, string, string]
  className?: string
}

const DEFAULT_LABELS: [string, string, string, string] = [
  "Choix",
  "Détails",
  "Paiement",
  "Confirmation",
]

/**
 * Horizontal stepper for the booking journey.
 * 4 circles with connecting lines. Past steps show a check,
 * current step is highlighted in mp-ocean, future steps are muted.
 */
export function BookingStepper({
  currentStep,
  labels = DEFAULT_LABELS,
  className,
}: BookingStepperProps) {
  const steps = [1, 2, 3, 4] as const

  return (
    <nav
      aria-label="Étapes de réservation"
      className={clsx("w-full", className)}
    >
      <ol className="flex items-start justify-between gap-1 sm:gap-2">
        {steps.map((step, index) => {
          const isPast = step < currentStep
          const isCurrent = step === currentStep
          const isFuture = step > currentStep
          const label = labels[index]
          const isLast = index === steps.length - 1

          return (
            <li
              key={step}
              className={clsx(
                "flex-1 flex flex-col items-center relative min-w-0",
                !isLast && "after:hidden"
              )}
              aria-current={isCurrent ? "step" : undefined}
            >
              <div className="flex items-center w-full">
                {/* Left spacer for first line alignment */}
                <div className="flex-1 h-0.5">
                  {index > 0 && (
                    <div
                      className={clsx(
                        "h-0.5 w-full",
                        step <= currentStep
                          ? "bg-mp-ocean"
                          : "bg-mp-sand-dark/40"
                      )}
                    />
                  )}
                </div>

                {/* Circle */}
                <div
                  className={clsx(
                    "flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-heading text-xs sm:text-sm font-bold transition-colors duration-300 border-2",
                    isPast &&
                      "bg-mp-ocean border-mp-ocean text-white",
                    isCurrent &&
                      "bg-mp-ocean border-mp-ocean text-white shadow-md shadow-mp-ocean/30 ring-4 ring-mp-ocean/15",
                    isFuture &&
                      "bg-mp-white border-mp-sand-dark/40 text-mp-text-muted"
                  )}
                  aria-hidden="true"
                >
                  {isPast ? (
                    <Check className="w-4 h-4 sm:w-4.5 sm:h-4.5" aria-hidden="true" />
                  ) : (
                    <span>{step}</span>
                  )}
                </div>

                {/* Right connector */}
                <div className="flex-1 h-0.5">
                  {!isLast && (
                    <div
                      className={clsx(
                        "h-0.5 w-full",
                        step < currentStep
                          ? "bg-mp-ocean"
                          : "bg-mp-sand-dark/40"
                      )}
                    />
                  )}
                </div>
              </div>

              {/* Label */}
              <span
                className={clsx(
                  "mt-2 text-[10px] sm:text-xs font-heading font-medium text-center leading-tight px-1 truncate max-w-full",
                  isCurrent && "text-mp-ocean font-semibold",
                  isPast && "text-mp-charcoal",
                  isFuture && "text-mp-text-muted"
                )}
              >
                {label}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
