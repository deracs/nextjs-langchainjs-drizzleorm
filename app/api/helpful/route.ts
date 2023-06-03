import { initializeAgentExecutorWithOptions } from "langchain/agents"
import { ChatOpenAI } from "langchain/chat_models/openai"
import { RequestsGetTool, SerpAPI, Serper } from "langchain/tools"
import { Calculator } from "langchain/tools/calculator"

import { CreateTaskTool } from "./_tools/create-task.tool"

export async function POST(req: Request) {
  try {
    const { input } = await req.json()

    // const tools = [new Calculator(), new SerpAPI()]
    console.log(process.env.SERPAPI_API_KEY)
    const tools = [new CreateTaskTool()]
    const model = new ChatOpenAI({
      temperature: 0,
      modelName: "gpt-3.5-turbo",
      verbose: true,
    })
    const executor = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: "structured-chat-zero-shot-react-description",
      verbose: true,
    })
    console.log("Question: ", input)
    const response = await executor.call({ input })
    console.log("Response: ", response)
    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as any).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export const runtime = "edge"
