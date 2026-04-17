import { prisma } from "@/lib/prisma"

// Point values
const POINTS = {
  ATTENDED_CLASS: 10,
  FIRST_CLASS: 50,
  STREAK_WEEK: 20,
  REVIEW_POSTED: 15,
  REFERRAL: 100,
  CARD_PURCHASED: 50,
  SUBSCRIPTION: 200,
} as const

// Badges
export const BADGES = [
  { id: "first-class", name: "Premier Pas", description: "Votre premier cours de Pilates", icon: "\u{1F331}", threshold: 1, type: "classes" },
  { id: "regular", name: "Habitu\u00e9(e)", description: "10 cours compl\u00e9t\u00e9s", icon: "\u2B50", threshold: 10, type: "classes" },
  { id: "dedicated", name: "Passionn\u00e9(e)", description: "25 cours compl\u00e9t\u00e9s", icon: "\u{1F525}", threshold: 25, type: "classes" },
  { id: "master", name: "Pilates Master", description: "50 cours compl\u00e9t\u00e9s", icon: "\u{1F451}", threshold: 50, type: "classes" },
  { id: "legend", name: "L\u00e9gende", description: "100 cours compl\u00e9t\u00e9s", icon: "\u{1F3C6}", threshold: 100, type: "classes" },
  { id: "streak-4", name: "R\u00e9gularit\u00e9", description: "4 semaines cons\u00e9cutives", icon: "\u{1F4C5}", threshold: 4, type: "streak" },
  { id: "streak-12", name: "Discipline", description: "12 semaines cons\u00e9cutives", icon: "\u{1F4AA}", threshold: 12, type: "streak" },
  { id: "ambassador", name: "Ambassadeur", description: "3 amis parrain\u00e9s", icon: "\u{1F91D}", threshold: 3, type: "referrals" },
  { id: "reviewer", name: "Critique", description: "3 avis laiss\u00e9s", icon: "\u270D\uFE0F", threshold: 3, type: "reviews" },
  { id: "all-courses", name: "Explorateur", description: "Essay\u00e9 tous les types de cours", icon: "\u{1F9ED}", threshold: 6, type: "variety" },
] as const

export interface LoyaltyData {
  totalPoints: number
  level: { name: string; minPoints: number; maxPoints: number; current: number }
  badges: { id: string; name: string; description: string; icon: string; unlocked: boolean; progress: number }[]
  nextReward: { name: string; pointsNeeded: number } | null
}

// Levels
const LEVELS = [
  { name: "D\u00e9butant", minPoints: 0, maxPoints: 100 },
  { name: "R\u00e9gulier", minPoints: 100, maxPoints: 300 },
  { name: "Confirm\u00e9", minPoints: 300, maxPoints: 600 },
  { name: "Expert", minPoints: 600, maxPoints: 1000 },
  { name: "Ma\u00eetre Pilates", minPoints: 1000, maxPoints: Infinity },
]

// Rewards
const REWARDS = [
  { name: "1 cours offert", points: 200 },
  { name: "R\u00e9duction 20% carte", points: 500 },
  { name: "1 mois offert", points: 1500 },
]

/**
 * Calculate consecutive-week streak from attended bookings.
 */
function calculateStreakFromDates(dates: Date[]): number {
  if (dates.length === 0) return 0

  const getWeek = (d: Date) => {
    const tmp = new Date(d.getTime())
    tmp.setHours(0, 0, 0, 0)
    tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7))
    const jan4 = new Date(tmp.getFullYear(), 0, 4)
    return (
      1 +
      Math.round(
        ((tmp.getTime() - jan4.getTime()) / 86400000 -
          3 +
          ((jan4.getDay() + 6) % 7)) /
          7
      )
    )
  }
  const getYearWeek = (d: Date) => `${d.getFullYear()}-${getWeek(d)}`

  const weekSet = new Set(dates.map(getYearWeek))

  const now = new Date()
  let streak = 0
  const cursor = new Date(now)
  while (true) {
    const yw = getYearWeek(cursor)
    if (weekSet.has(yw)) {
      streak++
      cursor.setDate(cursor.getDate() - 7)
    } else {
      break
    }
  }
  return streak
}

export async function calculateLoyalty(userId: string): Promise<LoyaltyData> {
  // Fetch all needed data in parallel
  const [
    attendedBookings,
    reviews,
    referralCount,
    courseCards,
    subscriptions,
    distinctCourseTypes,
  ] = await Promise.all([
    // Attended bookings with session dates
    prisma.booking.findMany({
      where: { userId, status: "ATTENDED" },
      include: { session: { select: { date: true, courseTypeId: true } } },
      orderBy: { createdAt: "asc" },
    }),
    // Reviews posted
    prisma.review.findMany({
      where: { userId },
    }),
    // Referrals (users who have referredBy = this userId)
    prisma.user.count({
      where: { referredBy: userId },
    }),
    // Course cards purchased
    prisma.courseCard.findMany({
      where: { userId },
    }),
    // Subscriptions
    prisma.subscription.findMany({
      where: { userId },
    }),
    // Total number of course types (for "all-courses" badge)
    prisma.courseType.count(),
  ])

  const attendedCount = attendedBookings.length
  const reviewCount = reviews.length
  const cardCount = courseCards.length
  const subscriptionCount = subscriptions.length

  // Calculate points
  let totalPoints = 0

  // Points from attended classes
  totalPoints += attendedCount * POINTS.ATTENDED_CLASS

  // First class bonus
  if (attendedCount >= 1) {
    totalPoints += POINTS.FIRST_CLASS
  }

  // Streak bonus
  const bookingDates = attendedBookings.map((b) => new Date(b.session.date))
  const streak = calculateStreakFromDates(bookingDates)
  totalPoints += streak * POINTS.STREAK_WEEK

  // Review points
  totalPoints += reviewCount * POINTS.REVIEW_POSTED

  // Referral points
  totalPoints += referralCount * POINTS.REFERRAL

  // Course card points
  totalPoints += cardCount * POINTS.CARD_PURCHASED

  // Subscription points
  totalPoints += subscriptionCount * POINTS.SUBSCRIPTION

  // Determine unique course types attended
  const uniqueCourseTypes = new Set(
    attendedBookings.map((b) => b.session.courseTypeId)
  )
  const varietyCount = uniqueCourseTypes.size

  // Calculate badges with progress
  const badges = BADGES.map((badge) => {
    let current = 0
    switch (badge.type) {
      case "classes":
        current = attendedCount
        break
      case "streak":
        current = streak
        break
      case "referrals":
        current = referralCount
        break
      case "reviews":
        current = reviewCount
        break
      case "variety":
        current = varietyCount
        break
    }

    const progress = Math.min(1, current / badge.threshold)
    return {
      id: badge.id,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      unlocked: current >= badge.threshold,
      progress,
    }
  })

  // Determine current level
  const currentLevel =
    LEVELS.find(
      (l) => totalPoints >= l.minPoints && totalPoints < l.maxPoints
    ) ?? LEVELS[LEVELS.length - 1]

  const level = {
    name: currentLevel.name,
    minPoints: currentLevel.minPoints,
    maxPoints: currentLevel.maxPoints === Infinity ? currentLevel.minPoints + 1000 : currentLevel.maxPoints,
    current: totalPoints,
  }

  // Determine next reward
  const nextReward =
    REWARDS.find((r) => r.points > totalPoints) ?? null
  const nextRewardData = nextReward
    ? { name: nextReward.name, pointsNeeded: nextReward.points - totalPoints }
    : null

  return {
    totalPoints,
    level,
    badges,
    nextReward: nextRewardData,
  }
}
