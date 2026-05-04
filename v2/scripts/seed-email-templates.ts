/**
 * Refresh ONLY the EmailTemplate rows from the current build-fn sources.
 *
 * Safe to run against prod — does not touch any other table.  Idempotent:
 * upserts by `key` and overwrites subject/html/variables with what the code
 * says today.
 *
 * Usage (from v2/):
 *   npx tsx scripts/seed-email-templates.ts
 *
 * Env required: DATABASE_URL pointing to the target database.
 */

import { prisma } from "@/lib/prisma";
import {
  buildBookingConfirmHtml,
  buildBookingReminderHtml,
  buildBookingCancelledHtml,
  buildResetPasswordHtml,
  buildWelcomeHtml,
  buildBsportMigrationHtml,
} from "@/lib/email-templates";

type Template = {
  key: string;
  name: string;
  subject: string;
  html: string;
  variables: string[];
};

async function main() {
  const templates: Template[] = [
    {
      key: "booking_confirm",
      name: "Confirmation de réservation",
      subject: "Réservation confirmée — {{courseName}}",
      html: buildBookingConfirmHtml(),
      variables: ["courseName", "date", "time", "instructor"],
    },
    {
      key: "booking_reminder",
      name: "Rappel de séance",
      subject: "Rappel — Votre séance demain",
      html: buildBookingReminderHtml(),
      variables: ["courseName", "date", "time", "instructor"],
    },
    {
      key: "booking_cancelled",
      name: "Annulation de séance",
      subject: "Annulation — {{courseName}}",
      html: buildBookingCancelledHtml(),
      variables: ["userName", "courseName", "date", "time"],
    },
    {
      key: "reset_password",
      name: "Réinitialisation de mot de passe",
      subject: "Réinitialisation de votre mot de passe",
      html: buildResetPasswordHtml(),
      variables: ["name", "resetUrl"],
    },
    {
      key: "welcome",
      name: "Bienvenue après inscription",
      subject: "Bienvenue chez Mon Pilates !",
      html: buildWelcomeHtml(),
      variables: ["name"],
    },
    {
      key: "bsport_migration_welcome",
      name: "Migration Bsport — activation de compte",
      subject: "Votre nouveau site Mon Pilates est prêt — activez votre compte",
      html: buildBsportMigrationHtml(),
      variables: ["name", "activationUrl", "cardSummary"],
    },
  ];

  for (const t of templates) {
    await prisma.emailTemplate.upsert({
      where: { key: t.key },
      create: {
        key: t.key,
        name: t.name,
        subject: t.subject,
        mjmlSource: t.html,
        htmlCompiled: t.html,
        variables: JSON.stringify(t.variables),
      },
      update: {
        name: t.name,
        subject: t.subject,
        mjmlSource: t.html,
        htmlCompiled: t.html,
        variables: JSON.stringify(t.variables),
      },
    });
    console.log(`✓ ${t.key}`);
  }

  console.log(`\nRafraîchi ${templates.length} templates.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
