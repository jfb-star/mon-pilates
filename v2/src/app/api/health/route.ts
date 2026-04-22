import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { log } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Check = "up" | "down" | "configured" | "missing";

export async function GET() {
  const checks: { db: Check; resend: Check; stripe: Check } = {
    db: "down",
    resend: process.env.RESEND_API_KEY ? "configured" : "missing",
    stripe: process.env.STRIPE_SECRET_KEY ? "configured" : "missing",
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.db = "up";
  } catch (err) {
    checks.db = "down";
    log.error("health.db_check_failed", err instanceof Error ? err : undefined);
  }

  const healthy =
    checks.db === "up" &&
    checks.resend === "configured" &&
    checks.stripe === "configured";

  const body = {
    status: healthy ? "ok" : "degraded",
    checks,
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA ?? "dev",
  };

  return NextResponse.json(body, { status: healthy ? 200 : 503 });
}
