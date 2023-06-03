import { db } from "@/db"
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
    const post = await db
      .insert(tasks)
      .values(insertTaskSchema.parse(json))
      .returning()

    return new Response(JSON.stringify(post))
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }
    return new Response(JSON.stringify(error.message), { status: 500 })
  }
}
