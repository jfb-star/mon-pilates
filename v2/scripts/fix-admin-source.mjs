import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

// Restore V2_NATIVE for any user who is ADMIN or INSTRUCTOR but got
// flagged BSPORT_IMPORT during the email-match link path. These users
// MUST survive a --reset.
const result = await p.user.updateMany({
  where: {
    role: { in: ["ADMIN", "INSTRUCTOR"] },
    migrationSource: "BSPORT_IMPORT",
  },
  data: {
    migrationSource: "V2_NATIVE",
  },
});
console.log(`✓ Fixed ${result.count} admin/instructor users back to V2_NATIVE`);

// Show post-fix state
const admins = await p.user.findMany({
  where: { role: { in: ["ADMIN", "INSTRUCTOR"] } },
  select: { email: true, role: true, migrationSource: true, bsportId: true },
});
console.log("Admins/Instructors after fix:", admins);

await p.$disconnect();
