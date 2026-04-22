import { createHash, timingSafeEqual } from "crypto"
import { prisma } from "@/lib/prisma"

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

export async function storeResetToken(token: string, userId: string): Promise<void> {
  const tokenHash = hashToken(token)
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
  await prisma.passwordResetToken.upsert({
    where: { tokenHash },
    create: { tokenHash, userId, expiresAt },
    update: { expiresAt, usedAt: null },
  })
}

export async function validateResetToken(
  token: string
): Promise<{ userId: string } | null> {
  const tokenHash = hashToken(token)
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    select: { tokenHash: true, userId: true, expiresAt: true, usedAt: true },
  })
  if (!record) return null
  if (record.usedAt) return null
  if (record.expiresAt < new Date()) return null
  // Double-check with constant-time compare on the hash we fetched, in case
  // a future change stores additional lookups by prefix.
  const expected = Buffer.from(record.tokenHash, "hex")
  const got = Buffer.from(tokenHash, "hex")
  if (expected.length !== got.length || !timingSafeEqual(expected, got)) return null
  return { userId: record.userId }
}

export async function consumeResetToken(token: string): Promise<void> {
  const tokenHash = hashToken(token)
  await prisma.passwordResetToken.update({
    where: { tokenHash },
    data: { usedAt: new Date() },
  }).catch(() => {})
}
