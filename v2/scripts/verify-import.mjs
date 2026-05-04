import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

const [users, bsportUsers, v2Users, cards, bsportCards, batches, top5Users] = await Promise.all([
  p.user.count(),
  p.user.count({ where: { migrationSource: "BSPORT_IMPORT" } }),
  p.user.count({ where: { migrationSource: "V2_NATIVE" } }),
  p.courseCard.count(),
  p.courseCard.count({ where: { bsportId: { not: null } } }),
  p.migrationBatch.findMany({ orderBy: { startedAt: "desc" }, take: 3 }),
  p.user.findMany({
    where: { migrationSource: "BSPORT_IMPORT" },
    select: { name: true, email: true, bsportId: true, _count: { select: { courseCards: true } } },
    take: 5,
    orderBy: { createdAt: "desc" },
  }),
]);

console.log("=".repeat(60));
console.log("📊 V2 DB after Bsport import");
console.log("=".repeat(60));
console.log(`Users total:           ${users}`);
console.log(`  • Bsport-imported:   ${bsportUsers}`);
console.log(`  • V2-native:         ${v2Users}`);
console.log(`Cards total:           ${cards}`);
console.log(`  • Bsport-imported:   ${bsportCards}`);
console.log("\nLast batches:");
for (const b of batches) {
  const stats = JSON.parse(b.stats || "{}");
  console.log(`  ${b.id} (${b.status}, ${b.source}) — clients ${stats.clients?.created ?? 0}+${stats.clients?.updated ?? 0}, cards ${stats.cards?.created ?? 0}`);
}
console.log("\nSample of 5 imported users:");
for (const u of top5Users) {
  console.log(`  • ${u.name.padEnd(30)} ${u.email.padEnd(35)} bsportId=${u.bsportId} cards=${u._count.courseCards}`);
}

await p.$disconnect();
