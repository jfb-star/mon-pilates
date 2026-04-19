import { NextResponse } from "next/server"
import { randomInt } from "crypto"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/** Generate a referral code: MP-XXX-YYYY */
function generateReferralCode(name: string): string {
  const prefix = name
    .replace(/[^a-zA-ZÀ-ÿ]/g, "")
    .slice(0, 3)
    .toUpperCase()
    .padEnd(3, "X")
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let suffix = ""
  for (let i = 0; i < 4; i++) {
    suffix += chars[randomInt(chars.length)]
  }
  return `MP-${prefix}-${suffix}`
}

/** Ensure a user has a unique referral code, generating one if needed */
async function ensureReferralCode(userId: string, userName: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true },
  })

  if (user?.referralCode) return user.referralCode

  let code = generateReferralCode(userName)
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.user.findUnique({
      where: { referralCode: code },
    })
    if (!exists) break
    code = generateReferralCode(userName)
  }

  await prisma.user.update({
    where: { id: userId },
    data: { referralCode: code },
  })

  return code
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const userId = session.user.id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, referralCode: true },
  })

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
  }

  const code = await ensureReferralCode(userId, user.name)

  // Count how many users were referred by this user
  const referredCount = await prisma.user.count({
    where: { referredBy: userId },
  })

  // Count referral credits earned (CourseCards of type REFERRAL for this user)
  const creditsEarned = await prisma.courseCard.count({
    where: {
      userId,
      type: "REFERRAL",
    },
  })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mon-pilates.bzh"
  const referralLink = `${baseUrl}/connexion?ref=${code}`

  return NextResponse.json({
    code,
    referralLink,
    referredCount,
    creditsEarned,
  })
}

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const userId = session.user.id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  })

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
  }

  // Generate a new code (replace existing)
  let code = generateReferralCode(user.name)
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.user.findUnique({
      where: { referralCode: code },
    })
    if (!exists) break
    code = generateReferralCode(user.name)
  }

  await prisma.user.update({
    where: { id: userId },
    data: { referralCode: code },
  })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mon-pilates.bzh"
  const referralLink = `${baseUrl}/connexion?ref=${code}`

  return NextResponse.json({
    code,
    referralLink,
    message: "Nouveau code de parrainage généré.",
  })
}
