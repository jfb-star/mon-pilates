import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock the prisma client before importing the module under test.
// Each prisma method used inside calculateLoyalty is replaced with a vi.fn().
vi.mock("@/lib/prisma", () => ({
  prisma: {
    booking: { findMany: vi.fn() },
    review: { findMany: vi.fn() },
    user: { count: vi.fn() },
    courseCard: { findMany: vi.fn() },
    subscription: { findMany: vi.fn() },
    courseType: { count: vi.fn() },
  },
}))

import { prisma } from "@/lib/prisma"
import { calculateLoyalty, BADGES } from "@/lib/loyalty"

type MockedFn = ReturnType<typeof vi.fn>

function setup(opts: {
  attended?: Array<{ session: { date: Date; courseTypeId: string } }>
  reviews?: Array<Record<string, unknown>>
  referrals?: number
  cards?: Array<Record<string, unknown>>
  subscriptions?: Array<Record<string, unknown>>
  courseTypes?: number
}) {
  ;(prisma.booking.findMany as unknown as MockedFn).mockResolvedValue(
    opts.attended ?? []
  )
  ;(prisma.review.findMany as unknown as MockedFn).mockResolvedValue(
    opts.reviews ?? []
  )
  ;(prisma.user.count as unknown as MockedFn).mockResolvedValue(
    opts.referrals ?? 0
  )
  ;(prisma.courseCard.findMany as unknown as MockedFn).mockResolvedValue(
    opts.cards ?? []
  )
  ;(prisma.subscription.findMany as unknown as MockedFn).mockResolvedValue(
    opts.subscriptions ?? []
  )
  ;(prisma.courseType.count as unknown as MockedFn).mockResolvedValue(
    opts.courseTypes ?? 6
  )
}

describe("calculateLoyalty", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns zero points for a user with no activity", async () => {
    setup({})
    const result = await calculateLoyalty("user-1")
    expect(result.totalPoints).toBe(0)
    expect(result.level.name).toBe("Débutant")
    expect(result.badges.every((b) => b.unlocked === false)).toBe(true)
  })

  it("awards FIRST_CLASS bonus (50) + ATTENDED (10) for first booking", async () => {
    setup({
      attended: [{ session: { date: new Date(), courseTypeId: "ct1" } }],
    })
    const result = await calculateLoyalty("user-1")
    // 1 attended (10) + first class (50) + streak week = 1 (20). Total = 80.
    expect(result.totalPoints).toBeGreaterThanOrEqual(60)
    // First-class badge unlocked.
    const firstClass = result.badges.find((b) => b.id === "first-class")
    expect(firstClass?.unlocked).toBe(true)
  })

  it("awards points for reviews, referrals, cards, subscriptions", async () => {
    setup({
      reviews: [{}, {}], // 2 * 15 = 30
      referrals: 3, // 3 * 100 = 300
      cards: [{}], // 1 * 50 = 50
      subscriptions: [{}, {}], // 2 * 200 = 400
    })
    const result = await calculateLoyalty("user-1")
    // No attended classes = no class/first-class/streak points. Total = 780.
    expect(result.totalPoints).toBe(30 + 300 + 50 + 400)
  })

  it("unlocks ambassador badge at 3 referrals", async () => {
    setup({ referrals: 3 })
    const result = await calculateLoyalty("user-1")
    const ambassador = result.badges.find((b) => b.id === "ambassador")
    expect(ambassador?.unlocked).toBe(true)
  })

  it("unlocks reviewer badge at 3 reviews", async () => {
    setup({ reviews: [{}, {}, {}] })
    const result = await calculateLoyalty("user-1")
    const reviewer = result.badges.find((b) => b.id === "reviewer")
    expect(reviewer?.unlocked).toBe(true)
  })

  it("caps badge progress at 1 even if current >> threshold", async () => {
    setup({ referrals: 1000 })
    const result = await calculateLoyalty("user-1")
    const ambassador = result.badges.find((b) => b.id === "ambassador")
    expect(ambassador?.progress).toBe(1)
  })

  it("progress is 0 when current is 0", async () => {
    setup({})
    const result = await calculateLoyalty("user-1")
    for (const b of result.badges) {
      expect(b.progress).toBe(0)
      expect(b.unlocked).toBe(false)
    }
  })

  it("returns correct level at thresholds (Régulier)", async () => {
    setup({ referrals: 1 }) // 100 points — exactly at Régulier boundary.
    const result = await calculateLoyalty("user-1")
    expect(result.level.name).toBe("Régulier")
  })

  it("returns Maître Pilates at >=1000 points", async () => {
    setup({ subscriptions: [{}, {}, {}, {}, {}, {}] }) // 1200 points
    const result = await calculateLoyalty("user-1")
    expect(result.level.name).toBe("Maître Pilates")
    // maxPoints replaced from Infinity to minPoints + 1000.
    expect(Number.isFinite(result.level.maxPoints)).toBe(true)
  })

  it("surfaces next reward when under threshold", async () => {
    setup({})
    const result = await calculateLoyalty("user-1")
    expect(result.nextReward).not.toBeNull()
    expect(result.nextReward?.name).toBe("1 cours offert")
    expect(result.nextReward?.pointsNeeded).toBe(200)
  })

  it("returns null nextReward when all rewards reached", async () => {
    setup({ subscriptions: Array.from({ length: 10 }, () => ({})) }) // 2000 points
    const result = await calculateLoyalty("user-1")
    expect(result.nextReward).toBeNull()
  })

  it("handles a large history (100 attended classes)", async () => {
    const attended = Array.from({ length: 100 }, (_, i) => ({
      session: {
        date: new Date(2025, 0, 1 + i),
        courseTypeId: `ct${(i % 6) + 1}`,
      },
    }))
    setup({ attended })
    const result = await calculateLoyalty("user-1")
    const legend = result.badges.find((b) => b.id === "legend")
    expect(legend?.unlocked).toBe(true)
    // All-courses badge: 6 unique types = threshold 6.
    const explorer = result.badges.find((b) => b.id === "all-courses")
    expect(explorer?.unlocked).toBe(true)
  })

  it("queries the current user when calculating referrals", async () => {
    setup({})
    await calculateLoyalty("the-user-id")
    expect(prisma.user.count).toHaveBeenCalledWith({
      where: { referredBy: "the-user-id" },
    })
  })

  it("filters bookings by ATTENDED status only", async () => {
    setup({})
    await calculateLoyalty("u1")
    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "u1", status: "ATTENDED" },
      })
    )
  })
})

describe("BADGES constant", () => {
  it("has the expected 10 badges", () => {
    expect(BADGES).toHaveLength(10)
  })

  it("every badge has a unique id", () => {
    const ids = new Set(BADGES.map((b) => b.id))
    expect(ids.size).toBe(BADGES.length)
  })

  it("every badge type is one of the known types", () => {
    const valid = new Set(["classes", "streak", "referrals", "reviews", "variety"])
    for (const b of BADGES) {
      expect(valid.has(b.type)).toBe(true)
    }
  })
})
