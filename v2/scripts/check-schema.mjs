import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const cols = await p.$queryRawUnsafe(`
  SELECT column_name, data_type, is_nullable
  FROM information_schema.columns
  WHERE table_name='User' AND column_name LIKE '%bsport%'
     OR table_name='User' AND column_name LIKE '%migra%'
     OR table_name='User' AND column_name LIKE '%needsAct%'
  ORDER BY table_name, column_name
`);
console.log("User Bsport-related columns:", cols);
const tables = await p.$queryRawUnsafe(`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema='public' AND (table_name LIKE 'Migration%' OR table_name LIKE 'Bsport%')
`);
console.log("Migration tables:", tables);
await p.$disconnect();
