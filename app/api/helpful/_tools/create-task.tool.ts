import { db } from "@/db"
import { insertTaskSchema, tasks } from "@/db/schema"
import { StructuredTool } from "langchain/tools"
import { z } from "zod"

const createTaskType = insertTaskSchema.pick({
  title: true,
  status: true,
  priority: true,
})

type CreateTaskType = z.infer<typeof createTaskType>

export class CreateTaskTool extends StructuredTool {
  name = "create-task"
  schema = createTaskType

  /** @ignore */
  async _call(input: CreateTaskType) {
    let data
    try {
      data = insertTaskSchema.parse(input)
    } catch (err) {
      console.error(err)
      return "Invalid input"
    }

    const task = await db.insert(tasks).values(data).returning()

    if (!task) {
      throw new Error("Task not created")
    }

    return JSON.stringify(task)
  }
  returnDirect: boolean = true
  description =
    "Creates a task in the project management tool. This is the last step in the workflow. All fields are required."
}
