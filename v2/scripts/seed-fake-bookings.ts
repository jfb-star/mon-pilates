/**
 * Seed realistic fake bookings on existing V2 sessions for Bsport-imported users.
 *
 * For each Bsport-imported user with an active card, randomly book 1-N
 * sessions in the past + future. Past bookings get status=CONFIRMED +
 * a paidAt date; future ones are still CONFIRMED but no paidAt.
 *
 * Card credit accounting is HONORED: if a card has 5 remaining sessions,
 * we book at most 5 (decrementing remainingSessions accordingly).
 *
 * Usage:
 *   npx tsx scripts/seed-fake-bookings.ts                # default: 0-3 bookings/user
 *   npx tsx scripts/seed-fake-bookings.ts --max=5        # up to 5/user
 *   npx tsx scripts/seed-fake-bookings.ts --past-weeks=4 # how far back to book
 *   npx tsx scripts/seed-fake-bookings.ts --future-weeks=4
 *   npx tsx scripts/seed-fake-bookings.ts --reset        # wipe Bsport-user bookings first
 *   npx tsx scripts/seed-fake-bookings.ts --dry-run
 *
 * V2-native users are NEVER touched (only users with migrationSource=BSPORT_IMPORT).
 */
import { PrismaClient } from "@prisma/client"
import crypto from "node:crypto"

interface Args {
  max: number
  pastWeeks: number
  futureWeeks: number
  reset: boolean
  dryRun: boolean
}
function parseArgs(): Args {
  const argv = process.argv.slice(2)
  const get = (n: string): string | undefined => {
    const eq = argv.find((a) => a.startsWith(`--${n}=`))
    if (eq) return eq.slice(n.length + 3)
    return argv.includes(`--${n}`) ? "true" : undefined
  }
  return {
    max: parseInt(get("max") ?? "3", 10),
    pastWeeks: parseInt(get("past-weeks") ?? "4", 10),
    futureWeeks: parseInt(get("future-weeks") ?? "4", 10),
    reset: get("reset") === "true",
    dryRun: get("dry-run") === "true",
  }
}

const PRISMA = new PrismaClient()

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}
function intRand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function main() {
  const args = parseArgs()
  console.log("=".repeat(60))
  console.log(`Seed fake bookings`)
  console.log(`  max bookings/user: ${args.max}`)
  console.log(`  past weeks:        ${args.pastWeeks}`)
  console.log(`  future weeks:      ${args.futureWeeks}`)
  console.log(`  reset:             ${args.reset ? "YES" : "no"}`)
  console.log(`  dry-run:           ${args.dryRun ? "YES" : "no"}`)
  console.log("=".repeat(60))

  // 1. Reset (delete all bookings made on behalf of Bsport-imported users)
  if (args.reset && !args.dryRun) {
    const deleted = await PRISMA.booking.deleteMany({
      where: { user: { migrationSource: "BSPORT_IMPORT" } },
    })
    console.log(`⚠ wiped ${deleted.count} existing bookings on Bsport-imported users`)
  }

  // 2. Pick eligible users (Bsport-imported + with at least 1 active card with credits)
  const users = await PRISMA.user.findMany({
    where: {
      migrationSource: "BSPORT_IMPORT",
      courseCards: { some: { remainingSessions: { gt: 0 }, expiresAt: { gt: new Date() } } },
    },
    include: {
      courseCards: { where: { remainingSessions: { gt: 0 }, expiresAt: { gt: new Date() } } },
    },
  })
  console.log(`\nFound ${users.length} eligible users (with active cards)`)

  // 3. Pick available sessions in the window
  const now = new Date()
  const pastStart = new Date(now)
  pastStart.setDate(pastStart.getDate() - args.pastWeeks * 7)
  const futureEnd = new Date(now)
  futureEnd.setDate(futureEnd.getDate() + args.futureWeeks * 7)

  const sessions = await PRISMA.session.findMany({
    where: {
      date: { gte: pastStart, lte: futureEnd },
      status: "SCHEDULED",
    },
    select: {
      id: true,
      date: true,
      startTime: true,
      maxParticipants: true,
      currentParticipants: true,
    },
    orderBy: { date: "asc" },
  })

  if (sessions.length === 0) {
    console.log(`\n⚠ No SCHEDULED sessions found in the window [${pastStart.toISOString().slice(0, 10)} → ${futureEnd.toISOString().slice(0, 10)}].`)
    console.log(`  → Run the session generator first: visit /api/admin/generate-sessions or trigger the cron.`)
    await PRISMA.$disconnect()
    return
  }
  console.log(`Found ${sessions.length} SCHEDULED sessions in window\n`)

  // 4. For each user: book some random sessions (consuming card credits)
  let bookingsCreated = 0
  let bookingsSkipped = 0
  for (const user of users) {
    const count = intRand(0, args.max)
    if (count === 0) continue

    // Take a random sample of sessions
    const userSessions = [...sessions].sort(() => Math.random() - 0.5).slice(0, count)
    const card = user.courseCards[0]!  // we filtered for >=1 card
    let creditsLeft = card.remainingSessions

    for (const session of userSessions) {
      if (creditsLeft <= 0) break
      if (session.currentParticipants >= session.maxParticipants) {
        bookingsSkipped++
        continue
      }
      // Skip if user already booked that session
      const existing = await PRISMA.booking.findFirst({
        where: { userId: user.id, sessionId: session.id },
        select: { id: true },
      })
      if (existing) { bookingsSkipped++; continue }

      const isPast = session.date < now
      if (args.dryRun) {
        bookingsCreated++
        creditsLeft--
        continue
      }

      // Transaction: create booking + increment session counter + decrement card
      await PRISMA.$transaction(async (tx) => {
        await tx.booking.create({
          data: {
            userId: user.id,
            sessionId: session.id,
            status: "CONFIRMED",
            paymentMethod: "CARD",
            paymentStatus: "PAID",
            paidAt: isPast ? session.date : new Date(),
            // Synthetic bsportId so subsequent --reset on bookings can target them
            bsportId: 800000 + bookingsCreated,
          },
        })
        await tx.session.update({
          where: { id: session.id },
          data: { currentParticipants: { increment: 1 } },
        })
        await tx.courseCard.update({
          where: { id: card.id },
          data: { remainingSessions: { decrement: 1 } },
        })
      })
      // Update local counters so subsequent picks see the updated state
      session.currentParticipants++
      creditsLeft--
      bookingsCreated++
    }
  }

  console.log(`\n${args.dryRun ? "[dry-run] would create" : "✓ Created"} ${bookingsCreated} bookings (${bookingsSkipped} skipped: full session or duplicate)`)
  await PRISMA.$disconnect()
}

main().catch((e) => {
  console.error("FATAL:", e)
  PRISMA.$disconnect().finally(() => process.exit(1))
})
