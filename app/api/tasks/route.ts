import { createTask, deleteTasks } from "@/db/mutations"
import { allTasks, findTask } from "@/db/queries"
import { insertTaskSchema } from "@/db/schema"
import * as z from "zod"

const deleteIdsSchema = z.object({
  taskIds: z.array(z.number()),
})

type DeleteIDsType = z.infer<typeof deleteIdsSchema>

export async function GET() {
  try {
    const tasksData = await allTasks()

    return new Response(JSON.stringify(tasksData))
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const task = await createTask(insertTaskSchema.parse(json))

    return new Response(JSON.stringify(task))
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }
    return new Response(JSON.stringify(error.message), { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const json = await req.json()

    const { taskIds } = deleteIdsSchema.parse(json)

    if (!taskIds) {
      return new Response(
        JSON.stringify({
          error: "No taskIds provided",
        }),
        { status: 404 }
      )
    }

    const tasks = await deleteTasks(taskIds)

    console.log(tasks)

    return new Response(null, { status: 204 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }
    return new Response(JSON.stringify(error.message), { status: 500 })
  }
}
