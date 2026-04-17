import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CHALLENGES } from "@/lib/challenges";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const userId = session.user.id;
  const now = new Date();

  // Get week boundaries (Monday to Sunday)
  const dayOfWeek = now.getDay() || 7;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dayOfWeek + 1);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  // Get month boundaries
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  // Fetch all user bookings with session data
  const allBookings = await prisma.booking.findMany({
    where: { userId, status: { in: ["ATTENDED", "CONFIRMED"] } },
    include: { session: { select: { date: true, startTime: true, courseTypeId: true } } },
    orderBy: { createdAt: "asc" },
  });

  const attendedBookings = allBookings.filter((b) => b.status === "ATTENDED");

  // ── Streak calculation ──
  const bookingWeeks = new Set<string>();
  for (const b of attendedBookings) {
    const d = new Date(b.session.date);
    const day = d.getDay() || 7;
    const monday = new Date(d);
    monday.setDate(d.getDate() - day + 1);
    bookingWeeks.add(monday.toISOString().slice(0, 10));
  }

  const sortedWeeks = Array.from(bookingWeeks).sort().reverse();
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Check current week first
  const currentMonday = new Date(weekStart).toISOString().slice(0, 10);
  const hasCurrentWeek = bookingWeeks.has(currentMonday);

  for (let i = 0; i < sortedWeeks.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prev = new Date(sortedWeeks[i - 1]);
      const curr = new Date(sortedWeeks[i]);
      const diffDays = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
      if (Math.abs(diffDays - 7) < 2) {
        tempStreak++;
      } else {
        if (tempStreak > longestStreak) longestStreak = tempStreak;
        tempStreak = 1;
      }
    }
  }
  if (tempStreak > longestStreak) longestStreak = tempStreak;

  // Current streak: count backwards from current/last week
  currentStreak = 0;
  const checkMonday = new Date(weekStart);
  if (!hasCurrentWeek) {
    checkMonday.setDate(checkMonday.getDate() - 7);
  }
  for (let i = 0; i < 52; i++) {
    const key = checkMonday.toISOString().slice(0, 10);
    if (bookingWeeks.has(key)) {
      currentStreak++;
      checkMonday.setDate(checkMonday.getDate() - 7);
    } else {
      break;
    }
  }

  // ── Activity grid (52 weeks) ──
  const grid: { date: string; count: number; dayOfWeek: number }[] = [];
  const gridStart = new Date(weekStart);
  gridStart.setDate(gridStart.getDate() - 51 * 7);

  const bookingsByDate = new Map<string, number>();
  for (const b of allBookings) {
    const key = new Date(b.session.date).toISOString().slice(0, 10);
    bookingsByDate.set(key, (bookingsByDate.get(key) ?? 0) + 1);
  }

  for (let w = 0; w < 52; w++) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + w * 7 + d);
      const key = date.toISOString().slice(0, 10);
      grid.push({ date: key, count: bookingsByDate.get(key) ?? 0, dayOfWeek: d });
    }
  }

  // ── Challenge progress ──
  const weekBookings = allBookings.filter(
    (b) => new Date(b.session.date) >= weekStart && new Date(b.session.date) < weekEnd
  );
  const monthBookings = allBookings.filter(
    (b) => new Date(b.session.date) >= monthStart && new Date(b.session.date) < monthEnd
  );

  const totalAttended = attendedBookings.length;
  const totalCourseTypes = new Set(attendedBookings.map((b) => b.session.courseTypeId)).size;
  const weekCourseTypes = new Set(weekBookings.map((b) => b.session.courseTypeId));
  const monthCourseTypes = new Set(monthBookings.map((b) => b.session.courseTypeId));
  const earlyBookings = weekBookings.filter((b) => b.session.startTime < "10:00");

  const reviews = await prisma.review.count({ where: { userId } });
  const monthReviews = await prisma.review.count({
    where: { userId, createdAt: { gte: monthStart, lt: monthEnd } },
  });

  // Compute prev course types for "new type" check
  const prevCourseTypes = new Set(
    allBookings
      .filter((b) => new Date(b.session.date) < weekStart)
      .map((b) => b.session.courseTypeId)
  );
  const newTypesThisWeek = [...weekCourseTypes].filter((t) => !prevCourseTypes.has(t)).length;

  const progressMap: Record<string, number> = {
    w1: weekBookings.length,
    w2: earlyBookings.length,
    w3: newTypesThisWeek,
    w4: 0, // referrals not easily trackable per-week
    m1: monthBookings.length,
    m2: monthReviews,
    m3: monthCourseTypes.size,
    l1: totalAttended,
    l2: totalAttended,
    l3: totalAttended,
    l4: longestStreak,
    l5: totalCourseTypes,
  };

  const challengeProgress = CHALLENGES.map((c) => ({
    ...c,
    current: Math.min(progressMap[c.id] ?? 0, c.target),
    completed: (progressMap[c.id] ?? 0) >= c.target,
  }));

  return NextResponse.json({
    currentStreak,
    longestStreak,
    totalClasses: totalAttended,
    grid,
    challenges: challengeProgress,
    weekResets: weekEnd.toISOString(),
    monthResets: monthEnd.toISOString(),
  });
}
