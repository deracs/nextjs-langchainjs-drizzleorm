import { db } from "@/drizzle"
import { SqlToolkit, createSqlAgent } from "@/drizzle/langchain/sql/agent"
import { OpenAI } from "langchain/llms/openai"

export async function POST(req: Request) {
  try {
    const { input } = await req.json()
    const model = new OpenAI({
      temperature: 0,
    })
    const toolkit = new SqlToolkit(db, model)
    const executor = createSqlAgent(model, toolkit)

    console.log(`Executing with input "${input}"...`)

    const result = await executor.call({ input })
    console.log("Response: ", result)
    return new Response(JSON.stringify(result.output), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as any).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

// export const runtime = "edge" // doesn't work with dotenv/drizzle
