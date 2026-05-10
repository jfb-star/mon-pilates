"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3 | 4;
  as?: "div" | "section" | "li" | "article";
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("revealed");
      return;
    }

    // Si l'élément est DÉJÀ visible au mount (au-dessus du fold), reveal direct
    // sans attendre l'observer — sinon les éléments en haut de page restent
    // invisibles si l'observer rate l'intersection initiale.
    const rect = el.getBoundingClientRect();
    const inViewport =
      rect.top < window.innerHeight && rect.bottom > 0;
    if (inViewport) {
      el.classList.add("revealed");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px 0px 0px" }
    );
    observer.observe(el);

    // Filet de sécurité : si l'observer ne fire pas dans les 2s
    // (cas rares : iframes, mauvaise détection mobile, etc.), reveal quand même.
    const fallback = window.setTimeout(() => {
      el.classList.add("revealed");
      observer.unobserve(el);
    }, 2000);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  const delayClass = delay ? `reveal-delay-${delay}` : "";

  return (
    <Tag
      ref={ref as any}
      className={`reveal ${delayClass} ${className}`}
    >
      {children}
    </Tag>
  );
}
