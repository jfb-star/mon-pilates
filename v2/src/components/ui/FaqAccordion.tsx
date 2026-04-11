"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="mp-card border border-mp-sand-dark/30 overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${index}`}
              id={`faq-heading-${index}`}
            >
              <span className="font-heading text-base sm:text-lg font-semibold text-mp-charcoal pr-4">
                {item.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-mp-ocean flex-shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              id={`faq-panel-${index}`}
              role="region"
              aria-labelledby={`faq-heading-${index}`}
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="px-5 sm:px-6 pb-5 sm:pb-6 font-body text-mp-text-light leading-relaxed">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
