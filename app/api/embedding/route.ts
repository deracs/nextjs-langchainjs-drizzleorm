import { NextResponse } from "next/server"
// import { insertItem, selectItem } from "@/drizzle/mutations/item"
import * as z from "zod"

export async function GET() {
  try {
    // const tasksData = await selectItem()

    return NextResponse.json(null)
  } catch (error) {
    return NextResponse.json(null, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // const json = await req.json()
    // const task = await insertItem()

    return NextResponse.json(null)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 })
    }
    return NextResponse.json(error.message, { status: 500 })
  }
}
