import { fromRequest } from "@/drizzle/mutations/products"

export async function POST(req: Request) {
  return await fromRequest(req)
}
