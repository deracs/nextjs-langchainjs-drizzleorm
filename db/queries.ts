import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "."
import { Task, selectTaskSchema, tasks } from "./schema"

// QUERIES
export const allTasks = async () => {
  const tasks = await db.query.tasks.findMany()
  return z.array(selectTaskSchema).parse(tasks)
}

export async function findFirstTask(taskId: Task["id"]) {
  "use server"
  return await db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
  })
}
