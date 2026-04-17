import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const userId = session.user.id;
  const now = new Date();

  // Fetch user's booking history
  const bookings = await prisma.booking.findMany({
    where: { userId, status: { in: ["ATTENDED", "CONFIRMED"] } },
    include: {
      session: {
        select: { date: true, startTime: true, courseTypeId: true, instructorId: true },
      },
    },
  });

  // Analyze preferred day/time
  const dayCount: Record<number, number> = {};
  const timeSlots: Record<string, number> = {};
  const courseTypeCounts: Record<string, number> = {};

  for (const b of bookings) {
    const day = new Date(b.session.date).getDay();
    dayCount[day] = (dayCount[day] ?? 0) + 1;
    const hour = b.session.startTime.slice(0, 2);
    timeSlots[hour] = (timeSlots[hour] ?? 0) + 1;
    courseTypeCounts[b.session.courseTypeId] = (courseTypeCounts[b.session.courseTypeId] ?? 0) + 1;
  }

  const preferredDay = Object.entries(dayCount).sort(([, a], [, b]) => b - a)[0]?.[0];
  const preferredHour = Object.entries(timeSlots).sort(([, a], [, b]) => b - a)[0]?.[0];
  const triedCourseTypes = new Set(Object.keys(courseTypeCounts));

  // Fetch upcoming sessions with course type info
  const upcomingSessions = await prisma.session.findMany({
    where: {
      date: { gte: now },
      status: "SCHEDULED",
    },
    include: {
      courseType: { select: { id: true, name: true, slug: true, shortDescription: true, color: true } },
      instructor: { select: { user: { select: { name: true } } } },
    },
    orderBy: { date: "asc" },
    take: 50,
  });

  // Check which sessions user already booked
  const bookedSessionIds = new Set(
    (
      await prisma.booking.findMany({
        where: { userId, status: "CONFIRMED", session: { date: { gte: now } } },
        select: { sessionId: true },
      })
    ).map((b) => b.sessionId)
  );

  // Score each session
  const scored = upcomingSessions
    .filter((s) => !bookedSessionIds.has(s.id))
    .map((s) => {
      const tags: string[] = [];
      let score = 0;

      // Preferred day
      const sessionDay = new Date(s.date).getDay();
      if (preferredDay && sessionDay === Number(preferredDay)) {
        score += 3;
        tags.push("Votre créneau");
      }

      // Preferred time
      const sessionHour = s.startTime.slice(0, 2);
      if (preferredHour && sessionHour === preferredHour) {
        score += 2;
        if (!tags.includes("Votre créneau")) tags.push("Votre horaire");
      }

      // New course type
      if (!triedCourseTypes.has(s.courseTypeId)) {
        score += 4;
        tags.push("Nouveau pour vous");
      }

      // Low capacity = available
      const occupancy = s.maxParticipants > 0 ? s.currentParticipants / s.maxParticipants : 1;
      if (occupancy < 0.5) {
        score += 1;
        tags.push("Places dispo");
      }

      // Almost full = urgency
      if (occupancy >= 0.8 && s.currentParticipants < s.maxParticipants) {
        score += 2;
        tags.push("Dernières places");
      }

      // Favorite course type bonus
      const favCount = courseTypeCounts[s.courseTypeId] ?? 0;
      if (favCount >= 3) {
        score += 2;
        if (!tags.some((t) => t === "Votre créneau" || t === "Votre horaire")) {
          tags.push("Votre favori");
        }
      }

      return {
        id: s.id,
        courseName: s.courseType.name,
        courseSlug: s.courseType.slug,
        courseColor: s.courseType.color,
        description: s.courseType.shortDescription,
        instructor: s.instructor.user.name,
        date: s.date.toISOString(),
        startTime: s.startTime,
        endTime: s.endTime,
        spotsLeft: s.maxParticipants - s.currentParticipants,
        tags,
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return NextResponse.json({ recommendations: scored, hasHistory: bookings.length > 0 });
}
