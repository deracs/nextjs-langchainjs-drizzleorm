import { db } from "@/db"
import { createTask } from "@/db/mutations"
import { findFirstTask, findTask } from "@/db/queries"
import { Task, insertTaskSchema, selectTaskSchema, tasks } from "@/db/schema"
import { StructuredTool } from "langchain/tools"
import { z } from "zod"

const createTaskType = insertTaskSchema.pick({
  title: true,
  status: true,
  priority: true,
})

const findTaskType = selectTaskSchema.pick({
  priority: true,
  status: true,
})

type CreateTaskType = z.infer<typeof createTaskType>
type FindTaskType = z.infer<typeof findTaskType>

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

    const task: Task[] = await createTask(data)

    if (!task) {
      throw new Error("Task not created")
    }

    return JSON.stringify(task)
  }
  returnDirect: boolean = true
  description =
    "Creates a task in the project management tool. This is the last step in the workflow. All fields are required."
}

export class FindTaskTool extends StructuredTool {
  name = "find-task"
  schema = findTaskType

  /** @ignore */
  async _call(input: FindTaskType) {
    const task = await findTask(input)

    if (!task) {
      return "Task not found"
    }

    return JSON.stringify(task)
  }
  returnDirect: boolean = true
  description =
    "Find a task in the project management tool. This is the last step in the workflow. All fields are required."
}
