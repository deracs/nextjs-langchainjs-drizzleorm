import { l2Distance } from "@/drizzle/pgvector"

import { db } from ".."
import { items } from "../schema"

export async function insertItem() {
  const newItems = [{ embedding: [1, 2, 3] }, { embedding: [4, 5, 6] }]

  return await db.insert(items).values(newItems)
}

export async function selectItem() {
  const embedding = [1, 2, 3]
  return await db
    .select()
    .from(items)
    .orderBy(l2Distance(items.embedding, embedding))
    .limit(5)
}
