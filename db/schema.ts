import { InferModel } from "drizzle-orm"
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

export const user = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role", { enum: ["admin", "user"] }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  status: text("status", {
    enum: ["in_progress", "done", "canceled", "todo", "backlog"],
  }).notNull(),
  priority: text("priority", { enum: ["low", "medium", "high"] }).notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export type Task = InferModel<typeof tasks>
export type NewTask = InferModel<typeof tasks, "insert">

// Schema for inserting a user - can be used to validate API requests
export const insertTaskSchema = createInsertSchema(tasks)
// Schema for selecting a user - can be used to validate API responses
export const selectTaskSchema = createSelectSchema(tasks)
