import { NextResponse } from "next/server"
import { deleteTask, updateTask } from "@/drizzle/mutations/tasks"
import { findFirstTask } from "@/drizzle/queries/tasks"
import { insertTaskSchema } from "@/drizzle/schema"
import * as z from "zod"

const routeContextSchema = z.object({
  params: z.object({
    taskId: z.string(),
  }),
})

type routeContextType = z.infer<typeof routeContextSchema>

export async function PATCH(req: Request, context: routeContextType) {
  try {
    const { params } = routeContextSchema.parse(context)
    const taskId = parseInt(params.taskId)
    const findTask = await findFirstTask(taskId)
    const data = await updateTask(taskId, {
      favourite: !findTask?.favourite,
    })

    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 })
    }

    return NextResponse.json(null, { status: 500 })
  }
}
