import { eq, or } from "drizzle-orm"
import { z } from "zod"

import { db } from ".."
import { NewTask, Task, insertTaskSchema, tasks } from "../schema"

export const createTask = async (task: NewTask) => {
  return await db.insert(tasks).values(insertTaskSchema.parse(task)).returning()
}

export const deleteTask = async (taskId: Task["id"]) => {
  return await db.delete(tasks).where(eq(tasks.id, taskId)).returning()
}

export const deleteTasks = async (taskIds: Task["id"][]) => {
  const filters = taskIds.map((taskId: number) => {
    return eq(tasks.id, taskId)
  })
  return await db
    .delete(tasks)
    .where(or(...filters))
    .returning()
}

export const updateTask = async (
  taskId: Task["id"],
  task: Partial<NewTask>
) => {
  return await db
    .update(tasks)
    .set(task)
    .where(eq(tasks.id, taskId))
    .returning()
}

// SCHEMAS
export const deleteManyTasks = z.object({
  ids: z.array(z.number()),
})

export type DeleteManyTasks = z.infer<typeof deleteManyTasks>
