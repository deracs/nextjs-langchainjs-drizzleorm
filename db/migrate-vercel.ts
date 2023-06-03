import { sql as sqlVercel } from "@vercel/postgres"
import { drizzle as drizzleNode } from "drizzle-orm/node-postgres"
import { migrate as migrateNode } from "drizzle-orm/node-postgres/migrator"
import { drizzle as drizzleVercel } from "drizzle-orm/vercel-postgres"
import { migrate as migrateVercel } from "drizzle-orm/vercel-postgres/migrator"
import { Pool } from "pg"

const db =
  process.env.NODE_ENV === "production"
    ? drizzleVercel(sqlVercel)
    : drizzleNode(new Pool({ connectionString: process.env.POSTGRES_URL }))

export async function dbMigrate() {
  if (process.env.NODE_ENV === "production")
    await migrateVercel(db, { migrationsFolder: "./drizzle" })
  else await migrateNode(db, { migrationsFolder: "./drizzle" })
}

// look into using tis
