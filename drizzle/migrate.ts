import "dotenv/config"
import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres"

console.log("Migrating database...", process.env.DATABASE_URL!)
const migrationConnection = postgres(process.env.DATABASE_URL!, { max: 1 })

const main = async () => {
  await migrate(drizzle(migrationConnection), {
    migrationsFolder: "migrations",
  })
  await migrationConnection.end()
  process.exit(0)
}

main()
