import { InferModel } from "drizzle-orm"
import {
  boolean,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

import { vector } from "./pgvector"

// ENUMS
export const roleEnum = pgEnum("role", ["admin", "user"])
export const priorityEnum = pgEnum("priority", ["low", "medium", "high"])
export const statusEnum = pgEnum("status", [
  "in_progress",
  "done",
  "canceled",
  "todo",
  "backlog",
])

// TABLES
export const user = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: roleEnum("role").notNull().default("user"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  status: statusEnum("status").notNull().default("todo"),
  priority: priorityEnum("priority").notNull().default("low"),
  favourite: boolean("favourite").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// enable when added
export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  embedding: vector("embedding", {
    dimensions: 3,
    default: undefined,
    primaryKey: false,
    tableName: "",
    name: "embedding",
    data: undefined,
    driverParam: undefined,
    notNull: false,
    hasDefault: false,
  }),
})

// TYPES
export type Task = InferModel<typeof tasks>
export type NewTask = InferModel<typeof tasks, "insert">

// SCHEMAS
export const insertTaskSchema = createInsertSchema(tasks) // Schema for inserting a tasks - can be used to validate API requests
export const selectTaskSchema = createSelectSchema(tasks) // Schema for selecting a tasks - can be used to validate API responses