/**
 * Lightweight structured logger.
 *
 * - Dev: human-ish line: "<ts> <LEVEL> <msg> <meta-json>"
 * - Prod (VERCEL_ENV=production): single-line JSON, which Vercel's log drain
 *   parses natively (level, message, and meta become searchable fields).
 * - Every call also emits a Sentry breadcrumb; `log.error` additionally
 *   forwards real Error instances to `Sentry.captureException`.
 *
 * Zero runtime deps beyond `@sentry/nextjs` — and even that is loaded
 * lazily/optionally so edge routes or environments without Sentry installed
 * still work.
 */

type Level = "info" | "warn" | "error";
type Meta = Record<string, unknown>;

// Lazy Sentry reference. We resolve it once per process and cache either the
// module or `null` if it can't be loaded (e.g. edge runtime build issues).
type SentryLike = {
  captureException?: (err: unknown) => void;
  addBreadcrumb?: (crumb: {
    level?: "info" | "warning" | "error" | "debug";
    message?: string;
    category?: string;
    data?: Meta;
  }) => void;
};

let sentryRef: SentryLike | null | undefined;

function getSentry(): SentryLike | null {
  if (sentryRef !== undefined) return sentryRef;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("@sentry/nextjs") as SentryLike;
    sentryRef = mod;
    return mod;
  } catch {
    sentryRef = null;
    return null;
  }
}

function isProd(): boolean {
  return process.env.VERCEL_ENV === "production";
}

function serializeError(err: unknown): Meta | undefined {
  if (!err) return undefined;
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      stack: err.stack,
    };
  }
  return { error: String(err) };
}

function emit(level: Level, message: string, meta?: Meta) {
  const ts = new Date().toISOString();

  if (isProd()) {
    const line = JSON.stringify({
      level,
      time: ts,
      message,
      ...(meta && Object.keys(meta).length > 0 ? { meta } : {}),
    });
    const writer =
      level === "error"
        ? console.error
        : level === "warn"
          ? console.warn
          : console.log;
    writer(line);
  } else {
    const metaStr = meta && Object.keys(meta).length > 0 ? " " + JSON.stringify(meta) : "";
    const line = `${ts} ${level.toUpperCase()} ${message}${metaStr}`;
    const writer =
      level === "error"
        ? console.error
        : level === "warn"
          ? console.warn
          : console.log;
    writer(line);
  }

  // Sentry breadcrumb — guarded, never throws.
  try {
    const Sentry = getSentry();
    Sentry?.addBreadcrumb?.({
      level: level === "warn" ? "warning" : level,
      message,
      category: "app",
      data: meta,
    });
  } catch {
    // never break the caller because of logging
  }
}

export const log = {
  info(message: string, meta?: Meta) {
    emit("info", message, meta);
  },
  warn(message: string, meta?: Meta) {
    emit("warn", message, meta);
  },
  error(message: string, err?: unknown, meta?: Meta) {
    const errorMeta = serializeError(err);
    const merged: Meta = {
      ...(errorMeta ? { err: errorMeta } : {}),
      ...(meta ?? {}),
    };
    emit("error", message, merged);

    if (err instanceof Error) {
      try {
        const Sentry = getSentry();
        Sentry?.captureException?.(err);
      } catch {
        // never break the caller because of logging
      }
    }
  },
};

export type Logger = typeof log;
