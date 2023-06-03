import { db } from "@/db"
import { insertTaskSchema, tasks } from "@/db/schema"
import { eq } from "drizzle-orm"
import * as z from "zod"

const routeContextSchema = z.object({
  params: z.object({
    taskId: z.string(),
  }),
})

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)
    const taskId = parseInt(params.taskId)
    // Delete the post.
    await db.delete(tasks).where(eq(tasks.id, taskId)).returning()

    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
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

    const data = await db
      .update(tasks)
      .set(body)
      .where(eq(tasks.id, taskId))
      .returning()

    return new Response(JSON.stringify(data))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
