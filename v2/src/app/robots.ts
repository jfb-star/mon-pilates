import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/env";

/**
 * robots.txt — blocks private/auth/dynamic routes from indexing while
 * keeping everything under /, /blog, /cours, /planning, /tarifs, etc. open.
 *
 * Kept in sync with `src/app/sitemap.ts` (which skips the same paths) and
 * with page-level `robots: { index: false }` on success/cancel pages.
 *
 * Les bots IA (LLMs) sont autorisés explicitement : on veut être indexable
 * par ChatGPT, Claude, Perplexity, Gemini, etc. — voir aussi /llms.txt et
 * /llms-full.txt qui décrivent le studio en format lisible par les LLMs.
 */
const PRIVATE_PATHS = [
  "/admin",
  "/admin/*",
  "/api/*",
  "/compte",
  "/compte/*",
  "/connexion",
  "/inscription",
  "/reset-password",
  "/defis",
  "/instructeur",
  "/instructeur/*",
  "/reservation/succes",
  "/reservation/annulation",
  "/unsubscribe",
];

const AI_BOTS = [
  // OpenAI (ChatGPT, GPT-4o, search, training)
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic (Claude, Claude.ai search, Claude indexing)
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  // Google AI Overviews / Gemini (séparé du Googlebot classique)
  "Google-Extended",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Apple Intelligence
  "Applebot",
  "Applebot-Extended",
  // Meta / Llama
  "FacebookBot",
  "meta-externalagent",
  // Common Crawl (training data foundation)
  "CCBot",
  // Cohere
  "cohere-ai",
  // Mistral
  "MistralAI-User",
  // DuckDuckGo AI
  "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      // Autorisations explicites pour les bots IA
      ...AI_BOTS.map((ua) => ({
        userAgent: ua,
        allow: "/",
        disallow: PRIVATE_PATHS,
      })),
    ],
    host: SITE_URL,
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
