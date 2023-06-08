import { fromRequest } from "@/drizzle/queries/products"

export async function POST(req: Request) {
  return await fromRequest(req)
}
