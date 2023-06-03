import { insertTaskSchema } from "@/db/schema"
import { StructuredTool } from "langchain/tools"
import { z } from "zod"

const createTaskType = insertTaskSchema.pick({
  title: true,
  status: true,
  label: true,
  priority: true,
})

export class CreateTaskTool extends StructuredTool {
  name = "create-task"
  schema = createTaskType

  /** @ignore */
  async _call(input: z.infer<typeof createTaskType>) {
    let data
    try {
      data = insertTaskSchema.parse(input)
    } catch (err) {
      console.error(err)
      return "Invalid input"
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }

    const res = await fetch("http://localhost:3000/api/tasks", options)

    if (!res.ok) {
      throw new Error(`Got ${res.status} error from tasks: ${res.statusText}`)
    }

    return await res.json()
  }
  returnDirect: boolean = true
  description =
    "Creates a task in the project management tool. This is the last step in the workflow. All fields are required"
}
