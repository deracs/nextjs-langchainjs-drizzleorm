import { NextResponse } from "next/server"
import { z } from "zod"

import { db } from ".."
import { l2Distance } from "../pgvector"
import { InputEmbedding, find_matches, getEmbedding } from "../pgvector/utils"
import { products } from "../schema"

export async function selectProducts(input: InputEmbedding) {
  const embedding = await getEmbedding(input)
  return await db
    .select()
    .from(products)
    .orderBy(l2Distance(products.embedding, embedding))
    .limit(5)
}

async function match_products(input: InputEmbedding) {
  const embedding = await getEmbedding(input)
  return await find_matches("products", {
    embedding,
    match_threshold: 0.78,
    match_count: 10,
  })
}

export async function fromRequest(req: Request) {
  try {
    const input = await req.json()
    const data = await match_products(input)
    return NextResponse.json(data)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 })
    }
    return NextResponse.json(error.message, { status: 500 })
  }
}
