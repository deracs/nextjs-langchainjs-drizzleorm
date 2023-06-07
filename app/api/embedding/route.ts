import { NextResponse } from "next/server"
import { insertItem, selectItem } from "@/drizzle/mutations/item"
import * as z from "zod"

export async function GET() {
  try {
    const allItems = await selectItem()

    return NextResponse.json(allItems)
  } catch (error) {
    return NextResponse.json(null, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const ni = await insertItem()

    return NextResponse.json(ni)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 })
    }
    return NextResponse.json(error.message, { status: 500 })
  }
}
