import { and, eq } from "drizzle-orm"
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

export async function findTask(
  task: Partial<z.infer<typeof selectTaskSchema>>
) {
  const filters = Object.entries(task).map(([key, value]) => {
    return eq(tasks[key as keyof Task], value)
  })

  return await db.query.tasks.findMany({
    where: and(...filters),
  })
}
