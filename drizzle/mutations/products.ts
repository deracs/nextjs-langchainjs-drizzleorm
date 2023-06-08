import { NextResponse } from "next/server"
import { InferModel } from "drizzle-orm"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"

import { db } from ".."
import { getEmbedding } from "../pgvector/utils"
import { products } from "../schema"

export type NewProducts = InferModel<typeof products, "insert">
export const insertProductSchema = createInsertSchema(products)

export async function insertProducts(data: NewProducts) {
  return await db
    .insert(products)
    .values(insertProductSchema.parse(data))
    .returning()
}

export async function fromRequest(req: Request) {
  try {
    const json = await req.json()
    const product = insertProductSchema.parse(json)
    // combine product object using commas with key: value pairs
    const input = Object.entries(product)
      .map(
        ([key, value]) =>
          `${key.replace(/^\w/, (c) => c.toUpperCase())}: ${value}`
      )
      .join("\n")

    // // Generate a vector using OpenAI
    const embedding = await getEmbedding({ input })

    const productInsert = await insertProducts({
      ...product,
      embedding,
    })
    return NextResponse.json(productInsert)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 })
    }
    return NextResponse.json(error.message, { status: 500 })
  }
}
