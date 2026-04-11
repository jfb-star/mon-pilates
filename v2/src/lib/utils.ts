import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind CSS conflict resolution.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
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
