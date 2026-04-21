import { NextResponse } from "next/server"
import { randomInt } from "crypto"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { checkRateLimit } from "@/lib/rate-limit"
import { sanitizeString } from "@/lib/utils"
import { sendWelcome } from "@/lib/email"

/** Generate a referral code: MP-XXX-YYYY (3 letters from name + 4 random alphanumeric) */
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

export async function POST(request: Request) {
  // Rate limit: 5 registrations per IP per 15 minutes
  const ip = request.headers.get("x-forwarded-for") ?? "unknown"
  const { allowed } = await checkRateLimit(`register:${ip}`, {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
  })
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans quelques minutes." },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const { name, email, password, phone, referralCode } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nom, email et mot de passe sont requis." },
        { status: 400 }
      )
    }

    const cleanName = sanitizeString(name, 100)
    const cleanEmail = (email as string).toLowerCase().trim().slice(0, 320)
    const cleanPhone = phone ? sanitizeString(phone, 20) : null

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Format d'email invalide." },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères." },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    })
    if (existingUser) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email." },
        { status: 409 }
      )
    }

    // Look up referrer if a referral code was provided
    let referrer: { id: string; name: string } | null = null
    if (referralCode && typeof referralCode === "string") {
      const cleanCode = referralCode.trim().toUpperCase()
      referrer = await prisma.user.findUnique({
        where: { referralCode: cleanCode },
        select: { id: true, name: true },
      })
      // Don't block registration if referral code is invalid — just ignore it
    }

    // Generate a unique referral code for the new user
    let newUserCode = generateReferralCode(cleanName)
    // Ensure uniqueness (retry up to 5 times)
    for (let i = 0; i < 5; i++) {
      const exists = await prisma.user.findUnique({
        where: { referralCode: newUserCode },
      })
      if (!exists) break
      newUserCode = generateReferralCode(cleanName)
    }

    // Hash password and create user
    const passwordHash = await hash(password, 12)
    const user = await prisma.user.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        passwordHash,
        phone: cleanPhone,
        referralCode: newUserCode,
        referredBy: referrer?.id ?? null,
      },
    })

    // If referred, credit both users with a free session
    if (referrer) {
      const expiresAt = new Date()
      expiresAt.setMonth(expiresAt.getMonth() + 2)

      // Credit the referrer: create Payment + CourseCard
      const referrerPayment = await prisma.payment.create({
        data: {
          userId: referrer.id,
          amount: 0,
          currency: "eur",
          status: "COMPLETED",
          type: "REFERRAL",
          metadata: JSON.stringify({
            referredUserId: user.id,
            referredUserName: user.name,
          }),
        },
      })
      await prisma.courseCard.create({
        data: {
          userId: referrer.id,
          paymentId: referrerPayment.id,
          type: "REFERRAL",
          totalSessions: 1,
          remainingSessions: 1,
          expiresAt,
        },
      })

      // Credit the new user: create Payment + CourseCard
      const newUserPayment = await prisma.payment.create({
        data: {
          userId: user.id,
          amount: 0,
          currency: "eur",
          status: "COMPLETED",
          type: "REFERRAL",
          metadata: JSON.stringify({
            referrerId: referrer.id,
            referrerName: referrer.name,
          }),
        },
      })
      await prisma.courseCard.create({
        data: {
          userId: user.id,
          paymentId: newUserPayment.id,
          type: "REFERRAL",
          totalSessions: 1,
          remainingSessions: 1,
          expiresAt,
        },
      })
    }

    // Send welcome email (non-blocking)
    sendWelcome({ to: user.email, name: user.name }).catch(() => {})

    return NextResponse.json(
      {
        message: referrer
          ? "Compte créé avec succès. Vous avez reçu un cours offert grâce au parrainage !"
          : "Compte créé avec succès.",
        user: { id: user.id, name: user.name, email: user.email },
        referralApplied: !!referrer,
      },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création du compte." },
      { status: 500 }
    )
  }
}
