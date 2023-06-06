import { NextResponse } from "next/server"
import { insertTaskSchema } from "@/drizzle/schema"
import { deleteTask, updateTask } from "@/drizzle/tasks"
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
    const task = await deleteTask(taskId)

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 })
    }

    return NextResponse.json(null, { status: 500 })
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

    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 })
    }

    return NextResponse.json(null, { status: 500 })
  }
}
