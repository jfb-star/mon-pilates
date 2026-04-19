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
  const courseTypes = [
    {
      slug: "pilates-decouverte",
      name: "Séance Découverte",
      shortDescription: "Première séance pour découvrir la méthode",
      description:
        "Cours collectif d'initiation (jusqu'à 5 personnes). Idéal pour découvrir le Pilates sur tapis et évaluer votre niveau.",
      duration: 55,
      level: "BEGINNER",
      intensity: 2,
      maxParticipants: 5,
      color: "#ffdfa3",
      benefits: JSON.stringify(["Découverte", "Posture", "Respiration"]),
      equipment: JSON.stringify(["tapis"]),
    },
    {
      slug: "pilates-mat-tous-niveaux",
      name: "Pilates Mat — Tous Niveaux",
      shortDescription: "Cours collectif au tapis, tous niveaux (max 5)",
      description:
        "Cours de Pilates sur tapis, groupe de 5 maximum. Adapté à tous les niveaux, l'instructrice ajuste les exercices selon chaque participant.",
      duration: 55,
      level: "ALL_LEVELS",
      intensity: 3,
      maxParticipants: 5,
      color: "#d8ecf5",
      benefits: JSON.stringify([
        "Renforcement profond",
        "Souplesse",
        "Posture",
      ]),
      equipment: JSON.stringify(["tapis", "ballon", "élastique"]),
    },
    {
      slug: "pilates-mat-debutant",
      name: "Pilates Mat — Débutant",
      shortDescription: "Cours collectif au tapis, niveau débutant (max 5)",
      description:
        "Cours au tapis pour débutants : apprentissage des fondamentaux de la méthode, respiration, postures de base.",
      duration: 55,
      level: "BEGINNER",
      intensity: 2,
      maxParticipants: 5,
      color: "#cce5b8",
      benefits: JSON.stringify([
        "Apprentissage des bases",
        "Respiration",
        "Alignement",
      ]),
      equipment: JSON.stringify(["tapis"]),
    },
    {
      slug: "pilates-mat-avance",
      name: "Pilates Mat — Avancé",
      shortDescription: "Cours collectif au tapis, niveau confirmé (max 5)",
      description:
        "Cours au tapis pour pratiquants confirmés. Enchaînements dynamiques, exercices avancés, défi musculaire accru.",
      duration: 55,
      level: "ADVANCED",
      intensity: 4,
      maxParticipants: 5,
      color: "#f5b8b8",
      benefits: JSON.stringify(["Défi musculaire", "Endurance", "Coordination"]),
      equipment: JSON.stringify(["tapis", "ballon", "élastique"]),
    },
    {
      slug: "pilates-prive-equipement",
      name: "Cours Privé — Équipement",
      shortDescription: "Séance individuelle sur équipement (Reformer, etc.)",
      description:
        "Séance 100% personnalisée sur équipement Pilates (Reformer, Cadillac, Chair). 55 min en tête-à-tête, objectifs et rythme adaptés.",
      duration: 55,
      level: "ALL_LEVELS",
      intensity: 3,
      maxParticipants: 1,
      color: "#c9b8f5",
      benefits: JSON.stringify([
        "100% personnalisé",
        "Équipement professionnel",
        "Progression rapide",
      ]),
      equipment: JSON.stringify(["Reformer", "Cadillac", "Chair"]),
    },
    {
      slug: "pilates-posture-seniors",
      name: "Pilates Posture & Seniors",
      shortDescription: "Séance douce axée posture et équilibre",
      description:
        "Cours doux dédié à l'amélioration de la posture et de l'équilibre, particulièrement adapté aux seniors et aux personnes avec douleurs chroniques.",
      duration: 55,
      level: "BEGINNER",
      intensity: 1,
      maxParticipants: 5,
      color: "#e8e1d4",
      benefits: JSON.stringify(["Posture", "Équilibre", "Douceur"]),
      equipment: JSON.stringify(["tapis", "chaise"]),
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

  const scheduleTemplates: Array<{
    dayOfWeek: number
    startTime: string
    endTime: string
    courseTypeSlug: string
  }> = [
    // Monday
    { dayOfWeek: 1, startTime: "09:00", endTime: "09:55", courseTypeSlug: "pilates-mat-tous-niveaux" },
    { dayOfWeek: 1, startTime: "18:30", endTime: "19:25", courseTypeSlug: "pilates-mat-debutant" },
    // Tuesday
    { dayOfWeek: 2, startTime: "09:00", endTime: "09:55", courseTypeSlug: "pilates-mat-avance" },
    { dayOfWeek: 2, startTime: "18:30", endTime: "19:25", courseTypeSlug: "pilates-mat-tous-niveaux" },
    // Wednesday
    { dayOfWeek: 3, startTime: "10:00", endTime: "10:55", courseTypeSlug: "pilates-posture-seniors" },
    { dayOfWeek: 3, startTime: "18:30", endTime: "19:25", courseTypeSlug: "pilates-mat-tous-niveaux" },
    // Thursday
    { dayOfWeek: 4, startTime: "09:00", endTime: "09:55", courseTypeSlug: "pilates-mat-tous-niveaux" },
    { dayOfWeek: 4, startTime: "18:30", endTime: "19:25", courseTypeSlug: "pilates-mat-debutant" },
    // Friday
    { dayOfWeek: 5, startTime: "09:00", endTime: "09:55", courseTypeSlug: "pilates-mat-tous-niveaux" },
    { dayOfWeek: 5, startTime: "12:15", endTime: "13:10", courseTypeSlug: "pilates-mat-tous-niveaux" },
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
