import { NextResponse } from "next/server"
import { allTasks } from "@/drizzle/queries/tasks"
import { insertTaskSchema } from "@/drizzle/schema"
import { createTask } from "@/drizzle/tasks"
import * as z from "zod"

export async function GET() {
  try {
    const tasksData = await allTasks()

    return NextResponse.json(tasksData)
  } catch (error) {
    return NextResponse.json(null, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const task = await createTask(insertTaskSchema.parse(json))

    return NextResponse.json(task)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 })
    }
    return NextResponse.json(error.message, { status: 500 })
  }
}
