import { NextResponse } from "next/server"
import { deleteManyTasks, deleteTasks } from "@/drizzle/mutations/tasks"
import * as z from "zod"

export async function POST(req: Request) {
  try {
    const json = await req.json()

    const { ids } = deleteManyTasks.parse(json)

    if (!ids) {
      return NextResponse.json(
        {
          error: "No taskIds provided",
        },
        { status: 404 }
      )
    }

    const tasks = await deleteTasks(ids)

    return NextResponse.json(tasks, { status: 200 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 })
    }
    return NextResponse.json(error.message, { status: 500 })
  }
}
