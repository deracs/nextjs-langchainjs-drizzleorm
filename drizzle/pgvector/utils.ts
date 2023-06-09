import { sql } from "drizzle-orm"
import { Configuration, OpenAIApi } from "openai"
import { z } from "zod"

import { db } from ".."

const embedding_model = "text-embedding-ada-002"

const embeddingSchema = z.object({
  query_embedding: z.array(z.number()),
  match_threshold: z.number(),
  match_count: z.number(),
})

export const inputEmbeddingSchema = z.object({
  input: z.string(),
})

export const keywordSearchSchema = z.object({
  query_text: z.string(),
  match_count: z.number(),
})

export type Embedding = z.infer<typeof embeddingSchema>
export type InputEmbedding = z.infer<typeof inputEmbeddingSchema>
export type KeywordSearch = z.infer<typeof keywordSearchSchema>

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

export function match_sql(table: string, data: Embedding) {
  return sql.raw(
    `SELECT * FROM match_${table}('${JSON.stringify(data.query_embedding)}', ${
      data.match_threshold
    }, ${data.match_count})`
  )
}

export function match_kw_sql(table: string, data: KeywordSearch) {
  return sql.raw(
    `SELECT * FROM kw_match_${table}('${data.query_text}', ${data.match_count})`
  )
}

export async function find_kw_matches(
  tableName: string,
  search: KeywordSearch
) {
  try {
    const data = await db.execute(
      match_kw_sql(tableName, keywordSearchSchema.parse(search))
    )
    return {
      data,
      error: null,
    }
  } catch (error) {
    console.log(error)
    return {
      data: null,
      error: {
        message: "Something went wrong with your search",
        code: 500,
        details: error,
      },
    }
  }
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
