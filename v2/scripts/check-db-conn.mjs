import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const result = await p.$queryRawUnsafe(`
  SELECT current_database() as db, current_schema() as schema,
         (SELECT count(*) FROM "User") as user_count
`);
console.log(result);
const userCols = await p.$queryRawUnsafe(`
  SELECT column_name FROM information_schema.columns
  WHERE table_name='User' ORDER BY column_name
`);
console.log("User columns:", userCols.map(c => c.column_name));
await p.$disconnect();
