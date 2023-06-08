import { sql } from "drizzle-orm"
import { Configuration, OpenAIApi } from "openai"
import { z } from "zod"

import { db } from ".."

const embedding_model = "text-embedding-ada-002"

const embeddingSchema = z.object({
  embedding: z.array(z.number()),
  match_threshold: z.number(),
  match_count: z.number(),
})

export const inputEmbeddingSchema = z.object({
  input: z.string(),
})

export type Embedding = z.infer<typeof embeddingSchema>
export type InputEmbedding = z.infer<typeof inputEmbeddingSchema>

export async function getEmbedding(data: InputEmbedding) {
  const openai = new OpenAIApi(
    new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    })
  )
  inputEmbeddingSchema.parse(data)
  const embeddingResponse = await openai.createEmbedding({
    model: embedding_model,
    input: data.input,
  })

  const [{ embedding }] = embeddingResponse.data.data

  return embedding
}

export function match_sql(
  table: string,
  data: {
    embedding: number[]
    match_threshold: number
    match_count: number
  }
) {
  return sql.raw(
    `SELECT * FROM match_${table}('${JSON.stringify(data.embedding)}', ${
      data.match_threshold
    }, ${data.match_count})`
  )
}

export async function find_matches(tableName: string, embedding: Embedding) {
  try {
    return await db.execute(
      match_sql(tableName, embeddingSchema.parse(embedding))
    )
  } catch (error) {
    console.log(error)
    return {
      message: "Something went wrong with your search",
    }
  }
}
