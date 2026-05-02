/**
 * PROD seed — minimal & safe.
 *
 * Seeds ONLY what's needed to bootstrap a real studio: 1 admin user, course
 * types matching real offering, 1 instructor (Violette), and a generic weekly
 * schedule to be refined via the admin UI.
 *
 * NO fake members, NO fake bookings, NO fake reviews, NO fake blog posts,
 * NO fake gift cards/subscriptions. The owner refines everything via /admin.
 *
 * Usage:
 *   DATABASE_URL="<prod>" DIRECT_URL="<prod>" \
 *   PROD_ADMIN_PASSWORD="<strong>" \
 *   npx tsx prisma/seed-prod.ts
 *
 * Idempotent: re-runnable, upserts everything.
 */

import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

const ADMIN_EMAIL = "jean.francois.baltzinger@gmail.com"
const ADMIN_NAME = "Jean-François Baltzinger"
const INSTRUCTOR_EMAIL = "violette@mon-pilates.bzh"
const INSTRUCTOR_NAME = "Violette"

async function main() {
  const adminPassword = process.env.PROD_ADMIN_PASSWORD
  if (!adminPassword) {
    throw new Error("PROD_ADMIN_PASSWORD env var is required")
  }

  console.log("🌱 Seeding PROD — minimal & safe")

  // ---- Admin user --------------------------------------------------------
  const adminHash = await hash(adminPassword, 10)
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      email: ADMIN_EMAIL,
      passwordHash: adminHash,
      name: ADMIN_NAME,
      role: "ADMIN",
    },
  })
  console.log(`  ✓ admin: ${admin.email} (role=${admin.role})`)

  // ---- Instructor (Violette) --------------------------------------------
  const instructorPassword = await hash(
    "change-me-on-first-login-" + Math.random().toString(36).slice(2, 10),
    10
  )
  const instructorUser = await prisma.user.upsert({
    where: { email: INSTRUCTOR_EMAIL },
    update: {},
    create: {
      email: INSTRUCTOR_EMAIL,
      passwordHash: instructorPassword,
      name: INSTRUCTOR_NAME,
      role: "INSTRUCTOR",
    },
  })

  const instructor = await prisma.instructor.upsert({
    where: { userId: instructorUser.id },
    update: {},
    create: {
      userId: instructorUser.id,
      slug: "violette",
      bio: "Fondatrice de Mon Pilates, certifiée FPMP (Fédération des Professionnels de la Méthode Pilates). Ancienne éducatrice sportive reconvertie au Pilates.",
      certifications: "FPMP",
      specialties: JSON.stringify(["Pilates Mat", "Pilates Équipement", "Posture"]),
    },
  })
  console.log(`  ✓ instructor: ${INSTRUCTOR_NAME} (slug=${instructor.slug})`)

  // ---- Course types (real offering) -------------------------------------
  // Slugs alignés avec /src/lib/mock-data.ts (5 types collectifs).
  const courseTypes = [
    {
      slug: "tapis",
      name: "Pilates classique — Tapis",
      shortDescription: "Cours collectif au tapis, tous niveaux (max 5)",
      description:
        "Cours de Pilates classique sur tapis, groupe de 5 maximum. Tous niveaux : Violette ajuste les exercices selon chaque participant.",
      duration: 55,
      level: "ALL_LEVELS",
      intensity: 3,
      maxParticipants: 5,
      color: "#3e7787",
      benefits: JSON.stringify(["Renforcement profond", "Souplesse", "Posture"]),
      equipment: JSON.stringify(["tapis", "ballon", "élastique"]),
    },
    {
      slug: "doux",
      name: "Pilates doux — Tapis",
      shortDescription: "Séance douce, idéale débutants et seniors (max 5)",
      description:
        "Cours doux au tapis : mouvements lents, respiration, mobilité et équilibre. Particulièrement adapté aux seniors, aux personnes en convalescence et aux débutants.",
      duration: 55,
      level: "BEGINNER",
      intensity: 1,
      maxParticipants: 5,
      color: "#a3c9d3",
      benefits: JSON.stringify(["Posture", "Équilibre", "Douceur"]),
      equipment: JSON.stringify(["tapis", "coussin"]),
    },
    {
      slug: "intensif",
      name: "Pilates avancé — Tapis",
      shortDescription: "Cours collectif au tapis, niveau confirmé (max 5)",
      description:
        "Cours au tapis pour pratiquants confirmés. Enchaînements dynamiques, exercices avancés, défi musculaire accru.",
      duration: 55,
      level: "ADVANCED",
      intensity: 4,
      maxParticipants: 5,
      color: "#2c2c2c",
      benefits: JSON.stringify(["Défi musculaire", "Endurance", "Coordination"]),
      equipment: JSON.stringify(["tapis", "ballon", "élastique"]),
    },
    {
      slug: "appareils",
      name: "Cours collectif sur appareils",
      shortDescription: "Petit groupe sur Reformer et appareils (max 4)",
      description:
        "Cours collectif sur Reformer Cadillac et autres appareils Pilates, groupe de 4 maximum. Charges adaptées à chaque participant. Format intermédiaire entre tapis et privé.",
      duration: 55,
      level: "ALL_LEVELS",
      intensity: 3,
      maxParticipants: 4,
      color: "#8b6518",
      benefits: JSON.stringify([
        "Travail musculaire ciblé",
        "Charges ajustables",
        "Progression rapide",
      ]),
      equipment: JSON.stringify(["Reformer", "Cadillac", "Chair"]),
    },
    {
      slug: "prenatal",
      name: "Pilates pré & post-natal",
      shortDescription: "Cours adapté à la grossesse et au post-partum",
      description:
        "Cours dédié aux futures et jeunes mamans : renforcement du plancher pelvien, soulagement des lombaires, préparation à l'accouchement et reprise post-partum en douceur.",
      duration: 55,
      level: "ALL_LEVELS",
      intensity: 2,
      maxParticipants: 5,
      color: "#d4a0a0",
      benefits: JSON.stringify([
        "Plancher pelvien",
        "Soulagement du dos",
        "Reprise en douceur",
      ]),
      equipment: JSON.stringify(["tapis", "ballon", "coussin"]),
    },
    {
      slug: "prive-appareils",
      name: "Cours privé sur appareils",
      shortDescription: "Séance individuelle sur Reformer, sur réservation",
      description:
        "Séance 100% personnalisée sur Reformer Cadillac, en tête-à-tête avec Violette. 55 min, objectifs et rythme adaptés. Sur réservation hors planning collectif.",
      duration: 55,
      level: "ALL_LEVELS",
      intensity: 3,
      maxParticipants: 1,
      color: "#5a7856",
      benefits: JSON.stringify([
        "100% personnalisé",
        "Reformer Cadillac",
        "Progression rapide",
      ]),
      equipment: JSON.stringify(["Reformer", "Cadillac", "Chair"]),
    },
  ]

  const createdTypes: Record<string, string> = {}
  for (const ct of courseTypes) {
    const created = await prisma.courseType.upsert({
      where: { slug: ct.slug },
      update: {},
      create: ct,
    })
    createdTypes[ct.slug] = created.id
  }
  console.log(`  ✓ ${courseTypes.length} course types`)

  // ---- Schedules (generic, to be refined via admin UI) ------------------
  // Monday..Friday, morning (09:00) + evening (18:30), rotating course types.
  // dayOfWeek: 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri
  const startDate = new Date()
  startDate.setHours(0, 0, 0, 0)

  // Planning v3 — rentrée septembre 2026.
  // Lundi matin et jeudi complet : indisponibles (instructrice).
  // dayOfWeek: 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  const scheduleTemplates: Array<{
    dayOfWeek: number
    startTime: string
    endTime: string
    courseTypeSlug: string
  }> = [
    // Lundi (PM uniquement)
    { dayOfWeek: 1, startTime: "17:00", endTime: "17:55", courseTypeSlug: "appareils" },
    { dayOfWeek: 1, startTime: "18:15", endTime: "19:10", courseTypeSlug: "tapis" },
    { dayOfWeek: 1, startTime: "19:30", endTime: "20:25", courseTypeSlug: "tapis" },
    // Mardi
    { dayOfWeek: 2, startTime: "09:15", endTime: "10:10", courseTypeSlug: "doux" },
    { dayOfWeek: 2, startTime: "10:30", endTime: "11:25", courseTypeSlug: "doux" },
    { dayOfWeek: 2, startTime: "12:30", endTime: "13:25", courseTypeSlug: "tapis" },
    { dayOfWeek: 2, startTime: "17:00", endTime: "17:55", courseTypeSlug: "prenatal" },
    { dayOfWeek: 2, startTime: "18:15", endTime: "19:10", courseTypeSlug: "intensif" },
    { dayOfWeek: 2, startTime: "19:30", endTime: "20:25", courseTypeSlug: "tapis" },
    // Mercredi
    { dayOfWeek: 3, startTime: "10:30", endTime: "11:25", courseTypeSlug: "doux" },
    { dayOfWeek: 3, startTime: "12:30", endTime: "13:25", courseTypeSlug: "tapis" },
    { dayOfWeek: 3, startTime: "18:15", endTime: "19:10", courseTypeSlug: "tapis" },
    { dayOfWeek: 3, startTime: "19:30", endTime: "20:25", courseTypeSlug: "appareils" },
    // Jeudi : fermé
    // Vendredi
    { dayOfWeek: 5, startTime: "09:15", endTime: "10:10", courseTypeSlug: "doux" },
    { dayOfWeek: 5, startTime: "10:30", endTime: "11:25", courseTypeSlug: "doux" },
    { dayOfWeek: 5, startTime: "12:30", endTime: "13:25", courseTypeSlug: "tapis" },
    { dayOfWeek: 5, startTime: "17:00", endTime: "17:55", courseTypeSlug: "prenatal" },
    { dayOfWeek: 5, startTime: "18:15", endTime: "19:10", courseTypeSlug: "tapis" },
    { dayOfWeek: 5, startTime: "19:30", endTime: "20:25", courseTypeSlug: "intensif" },
    // Samedi (matin)
    { dayOfWeek: 6, startTime: "09:30", endTime: "10:25", courseTypeSlug: "tapis" },
    { dayOfWeek: 6, startTime: "10:45", endTime: "11:40", courseTypeSlug: "appareils" },
  ]

  let scheduleCount = 0
  for (const s of scheduleTemplates) {
    const courseTypeId = createdTypes[s.courseTypeSlug]
    if (!courseTypeId) continue

    const existing = await prisma.schedule.findFirst({
      where: {
        courseTypeId,
        instructorId: instructor.id,
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
      },
    })
    if (existing) continue

    await prisma.schedule.create({
      data: {
        courseTypeId,
        instructorId: instructor.id,
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
        isRecurring: true,
        startDate,
        endDate: null,
      },
    })
    scheduleCount++
  }
  console.log(
    `  ✓ ${scheduleCount} schedules created (${scheduleTemplates.length - scheduleCount} already existed)`
  )

  console.log("\n✅ Seed PROD terminé.")
  console.log("   Admin login : " + ADMIN_EMAIL)
  console.log(
    "   À faire : lancer /api/admin/generate-sessions pour peupler le planning."
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
