import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

const admins = await p.user.findMany({
  where: { role: "ADMIN" },
  select: { id: true, email: true, name: true, role: true, migrationSource: true, bsportId: true },
});
console.log("Admins:", admins);

const total = await p.user.count();
const native = await p.user.count({ where: { migrationSource: "V2_NATIVE" } });
const bsport = await p.user.count({ where: { migrationSource: "BSPORT_IMPORT" } });
const noSource = await p.user.count({ where: { migrationSource: null } });
console.log(`Total: ${total} (V2_NATIVE: ${native}, BSPORT_IMPORT: ${bsport}, no-source: ${noSource})`);

await p.$disconnect();
