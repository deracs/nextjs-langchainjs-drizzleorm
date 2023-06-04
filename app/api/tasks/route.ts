import { db } from "@/db"
import { createTask } from "@/db/mutations"
import { insertTaskSchema, tasks } from "@/db/schema"
import * as z from "zod"

export async function GET() {
  try {
    const tasksData = await db.query.tasks.findMany()

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
