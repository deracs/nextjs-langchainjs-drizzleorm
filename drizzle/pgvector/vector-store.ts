import { Document } from "langchain/dist/document"
import { BaseRetriever } from "langchain/dist/schema"

// TODO
interface VectorStore {
  /**
   * Add more documents to an existing VectorStore
   */
  addDocuments(documents: Document[]): Promise<void>

  /**
   * Search for the most similar documents to a query
   */
  similaritySearch(
    query: string,
    k?: number,
    filter?: object | undefined
  ): Promise<Document[]>

  /**
   * Search for the most similar documents to a query,
   * and return their similarity score
   */
  similaritySearchWithScore(
    query: string,
    k?: number,
    filter?: object
  ): Promise<[object, number][]>

  /**
   * Turn a VectorStore into a Retriever
   */
  asRetriever(k?: number): BaseRetriever

  /**
   * Advanced: Add more documents to an existing VectorStore,
   * when you already have their embeddings
   */
  addVectors(vectors: number[][], documents: Document[]): Promise<void>

  /**
   * Advanced: Search for the most similar documents to a query,
   * when you already have the embedding of the query
   */
  similaritySearchVectorWithScore(
    query: number[],
    k: number,
    filter?: object
  ): Promise<[Document, number][]>
}

class DrizzleORMVectorStore implements VectorStore {
  addDocuments(documents: Document<Record<string, any>>[]): Promise<void> {
    throw new Error("Method not implemented.")
  }
  similaritySearch(
    query: string,
    k?: number | undefined,
    filter?: object | undefined
  ): Promise<Document<Record<string, any>>[]> {
    throw new Error("Method not implemented.")
  }
  similaritySearchWithScore(
    query: string,
    k?: number,
    filter?: object | undefined
  ): Promise<[object, number][]> {
    throw new Error("Method not implemented.")
  }
  asRetriever(k?: number | undefined): BaseRetriever {
    throw new Error("Method not implemented.")
  }

  addVectors(
    vectors: number[][],
    documents: Document<Record<string, any>>[]
  ): Promise<void> {
    const rows = vectors.map((embedding, idx) => {
      const embeddingString = `[${embedding.join(",")}]`
      const documentRow = {
        pageContent: documents[idx].pageContent,
        embedding: embeddingString,
        metadata: documents[idx].metadata,
      }

      return documentRow
    })

    // const documentRepository = this.appDataSource.getRepository(
    //   this.documentEntity
    // );

    const chunkSize = 500
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize)

      // try {
      //   await documentRepository.save(chunk);
      // } catch (e) {
      //   console.error(e);
      //   throw new Error(`Error inserting: ${chunk[0].pageContent}`);
      // }
    }
  }
  similaritySearchVectorWithScore(
    query: number[],
    k: number,
    filter?: object | undefined
  ): Promise<[Document<Record<string, any>>, number][]> {
    throw new Error("Method not implemented.")
  }
}
