/**
 * Ensure a given User has a linked Instructor row.
 *
 * Unblocks the "Espace Pro" (/instructeur) which requires an Instructor
 * record keyed to the logged-in user. Safe to run against prod: idempotent,
 * only creates the row if missing.
 *
 * Usage (from v2/):
 *   # Target by email (preferred):
 *   INSTRUCTOR_EMAIL="violette@mon-pilates.bzh" npx tsx scripts/link-instructor.ts
 *
 *   # Or target the first ADMIN user (fallback, dev only):
 *   npx tsx scripts/link-instructor.ts --first-admin
 *
 * Env required: DATABASE_URL pointing to the target database.
 *
 * The script also ensures the user's role is "INSTRUCTOR" or "ADMIN"
 * (preserves ADMIN if already set). Bio/photo/certifications/specialties
 * mirror the hard-coded values in src/lib/mock-data.ts for Violette — edit
 * below if you want different defaults.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const VIOLETTE_DEFAULTS = {
  slug: "violette",
  bio: "Ancienne éducatrice en gymnastique et en sport, Violette s'est reconvertie au Pilates après un parcours personnel marqué par des blessures. Aujourd'hui, elle accompagne chaque personne avec attention, en adaptant chaque séance à son corps, son histoire et ses besoins, dans un cadre bienveillant, lumineux et apaisé, face à l'océan.",
  photo: "/images/cours-reformer-instructrice.webp",
  certifications: JSON.stringify([
    "Certifiée FPMP — Fédération des Professionnels de la Méthode Pilates",
    "BP AGFF — Brevet Professionnel Activités Gymniques Forme et Force (CRIFO Paris, 2010)",
    "Brevet d'État d'Éducateur Sportif — option Gymnastique Artistique Féminine (DDRJS Paris, 2001)",
    "PSC1 — Premiers Secours (Croix-Rouge française, 2012)",
  ]),
  specialties: JSON.stringify(["mat", "reformer", "prenatal", "doux", "intensif"]),
};

async function resolveUser() {
  const email = process.env.INSTRUCTOR_EMAIL?.trim().toLowerCase();
  if (email) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error(`No user with email=${email}. Set INSTRUCTOR_EMAIL to an existing account.`);
    return user;
  }
  if (process.argv.includes("--first-admin")) {
    const user = await prisma.user.findFirst({ where: { role: "ADMIN" }, orderBy: { createdAt: "asc" } });
    if (!user) throw new Error("No ADMIN user found. Seed an admin first or pass INSTRUCTOR_EMAIL.");
    return user;
  }
  throw new Error(
    "Specify target user: INSTRUCTOR_EMAIL=... npx tsx scripts/link-instructor.ts  (or --first-admin for dev)"
  );
}

async function main() {
  const user = await resolveUser();
  console.log(`→ target user: ${user.email} (${user.id}) role=${user.role}`);

  // Keep ADMIN as-is; promote USER → INSTRUCTOR.
  if (user.role !== "ADMIN" && user.role !== "INSTRUCTOR") {
    await prisma.user.update({ where: { id: user.id }, data: { role: "INSTRUCTOR" } });
    console.log("→ role upgraded to INSTRUCTOR");
  }

  const existing = await prisma.instructor.findUnique({ where: { userId: user.id } });
  if (existing) {
    console.log(`✓ Instructor row already exists (id=${existing.id}, slug=${existing.slug}). No-op.`);
    return;
  }

  // Collision-proof slug: if "violette" is taken by another instructor, suffix.
  let slug = VIOLETTE_DEFAULTS.slug;
  let n = 2;
  while (await prisma.instructor.findUnique({ where: { slug } })) {
    slug = `${VIOLETTE_DEFAULTS.slug}-${n++}`;
  }

  const instructor = await prisma.instructor.create({
    data: {
      userId: user.id,
      slug,
      bio: VIOLETTE_DEFAULTS.bio,
      photo: VIOLETTE_DEFAULTS.photo,
      certifications: VIOLETTE_DEFAULTS.certifications,
      specialties: VIOLETTE_DEFAULTS.specialties,
    },
  });

  console.log(`✓ Instructor created (id=${instructor.id}, slug=${slug}). Espace Pro unblocked.`);
}

main()
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
