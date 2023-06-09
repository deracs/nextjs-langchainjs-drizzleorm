import { PostgresJsDatabase } from "drizzle-orm/postgres-js"
import { Document } from "langchain/document"
import { Embeddings } from "langchain/embeddings/base"
import { BaseRetriever } from "langchain/schema"

import { Embedding, find_kw_matches, find_matches } from "../pgvector/utils"

interface SearchEmbeddingsParams {
  query_embedding: number[]
  match_count: number // int
}

interface SearchKeywordParams {
  query_text: string
  match_count: number // int
}

interface SearchResponseRow {
  id: number
  content: string
  metadata: object
  similarity: number
}

type SearchResult = [Document, number, number]

export interface DrizzleLibArgs {
  client: PostgresJsDatabase
  tableName?: string
  similarityQueryName?: string
  keywordQueryName?: string
  similarityK?: number
  keywordK?: number
}

export interface DrizzleHybridSearchParams {
  query: string
  similarityK: number
  keywordK: number
}

export class DrizzleHybridSearch extends BaseRetriever {
  similarityK: number

  query: string

  keywordK: number

  similarityQueryName: string

  client: PostgresJsDatabase

  tableName: string

  keywordQueryName: string

  embeddings: Embeddings

  constructor(embeddings: Embeddings, args: DrizzleLibArgs) {
    super()
    this.embeddings = embeddings
    this.client = args.client
    this.tableName = args.tableName || "documents"
    this.similarityQueryName = args.similarityQueryName || "match_documents"
    this.keywordQueryName = args.keywordQueryName || "kw_match_documents"
    this.similarityK = args.similarityK || 2
    this.keywordK = args.keywordK || 2
    this.query = ""
  }

  protected async similaritySearch(
    query: string,
    k: number
  ): Promise<SearchResult[]> {
    const embeddedQuery = await this.embeddings.embedQuery(query)

    const matchDocumentsParams: Embedding = {
      query_embedding: embeddedQuery,
      match_count: k,
      match_threshold: 0.75,
    }

    await find_matches(this.similarityQueryName, matchDocumentsParams)
    const searches = await find_matches(
      this.similarityQueryName,
      matchDocumentsParams
    )

    // if (error) {
    //   throw new Error(
    //     `Error searching for documents: ${error.code} ${error.message} ${error.details}`
    //   )
    // }

    return (searches as SearchResponseRow[]).map((resp) => [
      new Document({
        metadata: {
          ...resp,
        },
        pageContent: resp.description,
      }),
      resp.similarity,
      resp.id,
    ])
  }

  async keywordSearch(query: string, k: number): Promise<SearchResult[]> {
    const kwMatchDocumentsParams: SearchKeywordParams = {
      query_text: query,
      match_count: k,
    }

    const { data: searches, error } = await find_kw_matches(
      this.keywordQueryName,
      kwMatchDocumentsParams
    )

    if (error) {
      throw new Error(
        `Error searching for documents: ${error.code} ${error.message} ${error.details}`
      )
    }
    // return searches
    return (searches as SearchResponseRow[]).map((resp) => [
      new Document({
        metadata: {
          ...resp,
        },
        pageContent: resp.description,
      }),
      resp.similarity * 10,
      resp.id,
    ])
  }

  protected async hybridSearch(
    query: string,
    similarityK: number,
    keywordK: number
  ): Promise<SearchResult[]> {
    const similarity_search = this.similaritySearch(query, similarityK)

    const keyword_search = this.keywordSearch(query, keywordK)

    return Promise.all([similarity_search, keyword_search])
      .then((results) => results.flat())
      .then((results) => {
        const picks = new Map<number, SearchResult>()

        results.forEach((result) => {
          const id = result[2]
          const nextScore = result[1]
          const prevScore = picks.get(id)?.[1]

          if (prevScore === undefined || nextScore > prevScore) {
            picks.set(id, result)
          }
        })

        return Array.from(picks.values())
      })
      .then((results) => results.sort((a, b) => b[1] - a[1]))
  }

  async getRelevantDocuments(query: string): Promise<Document[]> {
    const searchResults = await this.hybridSearch(
      query,
      this.similarityK,
      this.keywordK
    )

    return searchResults.map(([doc]) => doc)
  }
}
