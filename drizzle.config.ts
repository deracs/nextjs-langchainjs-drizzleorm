import * as dotenv from "dotenv"
import type { Config } from "drizzle-kit"

dotenv.config()

export default {
  schema: "./drizzle/schema.ts",
  out: "./migrations",
  connectionString: process.env.DATABASE_URL,
} satisfies Config
