import { clsx, type ClassValue } from "clsx";
import { SITE_URL } from "./env";

/**
 * Merge class names (simplified without tailwind-merge).
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Sanitize a user-provided string: trim and enforce max length.
 */
export function sanitizeString(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

/**
 * Allowed origins for CSRF-like origin checking on sensitive routes.
 * Includes the apex and www aliases (kept hardcoded so legacy requests still
 * pass even if SITE_URL points at the v2 subdomain) plus the current SITE_URL.
 */
const ALLOWED_ORIGINS = [
  "https://mon-pilates.bzh",
  "https://www.mon-pilates.bzh",
  SITE_URL,
];

/**
 * Check whether the request origin is allowed.
 * Permits localhost/127.0.0.1 only when NOT running on Vercel production
 * (i.e. allowed in preview and local dev, refused in prod).
 */
export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Allow localhost and 127.0.0.1 outside of Vercel production — preview
  // deployments and local dev still need to work from a dev machine.
  if (process.env.VERCEL_ENV === "production") {
    return false;
  }
  try {
    const url = new URL(origin);
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

/**
 * Format a price in cents to a human-readable string (e.g. "25,00 €").
 */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

/**
 * Format a Date object to a French locale date string (e.g. "11 avril 2026").
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Format a time string "HH:mm" to a display-friendly format (e.g. "14h30").
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  if (minutes === "00") {
    return `${hours}h`;
  }
  return `${hours}h${minutes}`;
}

/**
 * Generate a unique gift card code (e.g. "GIFT-A1B2-C3D4-E5F6").
 */
export function generateGiftCardCode(): string {
  // Lazy require to keep this module usable on edge runtimes that import other helpers.
  const { randomInt } = require("crypto") as typeof import("crypto");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars (0/O, 1/I)
  const segment = () =>
    Array.from({ length: 4 }, () => chars.charAt(randomInt(chars.length))).join("");
  return `GIFT-${segment()}-${segment()}-${segment()}`;
}
