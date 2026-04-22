"use client";

import { useState, useEffect, useCallback } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { clsx } from "clsx";

type Theme = "light" | "dark" | "system";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  // Add transition class for smooth switching
  root.classList.add("theme-transition");

  if (theme === "system") {
    root.classList.remove("dark", "light");
  } else if (theme === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.add("light");
    root.classList.remove("dark");
  }

  // Remove transition class after animation
  setTimeout(() => root.classList.remove("theme-transition"), 350);
}

export function ThemeToggle({ scrolled = true }: { scrolled?: boolean }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("mp-theme") as Theme | null;
    if (saved && ["light", "dark", "system"].includes(saved)) {
      setTheme(saved);
      applyTheme(saved);
    }
    setMounted(true);
  }, []);

  // Listen for system theme changes when in "system" mode
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const cycle = useCallback(() => {
    const order: Theme[] = ["system", "light", "dark"];
    const next = order[(order.indexOf(theme) + 1) % order.length] ?? "system";
    setTheme(next);
    localStorage.setItem("mp-theme", next);
    applyTheme(next);
  }, [theme]);

  // Resolve display icon
  const resolved = theme === "system" ? getSystemTheme() : theme;

  if (!mounted) {
    // Avoid hydration mismatch — render placeholder
    return (
      <div className="w-9 h-9 rounded-full" aria-hidden="true" />
    );
  }

  const label =
    theme === "system"
      ? "Theme : automatique"
      : theme === "light"
        ? "Theme : clair"
        : "Theme : sombre";

  return (
    <button
      type="button"
      onClick={cycle}
      className={clsx(
        "relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300",
        scrolled
          ? "text-mp-text-light hover:text-mp-ocean hover:bg-mp-cream"
          : "text-white/80 hover:text-white hover:bg-white/10"
      )}
      aria-label={label}
      title={label}
    >
      {theme === "system" ? (
        <Monitor className="w-4 h-4" aria-hidden="true" />
      ) : theme === "light" ? (
        <Sun className="w-4 h-4" aria-hidden="true" />
      ) : (
        <Moon className="w-4 h-4" aria-hidden="true" />
      )}
    </button>
  );
}
