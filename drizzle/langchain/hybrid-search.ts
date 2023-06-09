import { OpenAIEmbeddings } from "langchain/embeddings/openai"

import { db } from ".."
import { DrizzleHybridSearch } from "./drizzle-retriever"

export const run = async () => {
  const client = db

  const embeddings = new OpenAIEmbeddings()

  const retriever = new DrizzleHybridSearch(embeddings, {
    client,
    similarityK: 2,
    keywordK: 2,
    tableName: "product",
    // similarityQueryName: "match_products",
    // keywordQueryName: "kw_match_products",
    similarityQueryName: "products",
    keywordQueryName: "products",
  })

  const results = await retriever.getRelevantDocuments("3m products")

  console.log(results)
  process.exit(0)
}

run()
