import { db } from "@/db"
import { deleteTask, updateTask } from "@/db/mutations"
import { insertTaskSchema, tasks } from "@/db/schema"
import { eq } from "drizzle-orm"
import * as z from "zod"

const routeContextSchema = z.object({
  params: z.object({
    taskId: z.string(),
  }),
})

type routeContextType = z.infer<typeof routeContextSchema>

export async function DELETE(req: Request, context: routeContextType) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)
    const taskId = parseInt(params.taskId)
    // Delete the post.
    await deleteTask(taskId)

    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

export async function PATCH(req: Request, context: routeContextType) {
  try {
    // Validate route params.
    const { params } = routeContextSchema.parse(context)
    const taskId = parseInt(params.taskId)
    // Get the request body and validate it.
    const json = await req.json()

    const body = insertTaskSchema
      .omit({
        createdAt: true,
        updatedAt: true,
      })
      .parse(json)

    const data = await updateTask(taskId, body)

    return new Response(JSON.stringify(data))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
