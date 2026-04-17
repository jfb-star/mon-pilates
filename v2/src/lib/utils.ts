import { clsx, type ClassValue } from "clsx";

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
 */
const ALLOWED_ORIGINS = [
  "https://mon-pilates.bzh",
  "https://www.mon-pilates.bzh",
];

/**
 * Check whether the request origin is allowed.
 * Permits localhost/127.0.0.1 in development.
 */
export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Allow localhost and 127.0.0.1 in development or local testing
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
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars (0/O, 1/I)
  const segment = () =>
    Array.from({ length: 4 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  return `GIFT-${segment()}-${segment()}-${segment()}`;
}
