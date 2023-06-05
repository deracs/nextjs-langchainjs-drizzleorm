import { initializeAgentExecutorWithOptions } from "langchain/agents"
import { ChatOpenAI } from "langchain/chat_models/openai"

import { CreateTaskTool, FindTaskTool } from "./_tools/create-task.tool"

export async function POST(req: Request) {
  // const test = [
  //   {
  //     id: 16,
  //     title: "Finish project report",
  //     status: "in_progress",
  //     priority: "high",
  //     favourite: false,
  //     createdAt: "2023-06-04T23:52:56.000Z",
  //     updatedAt: "2023-06-04T23:52:56.000Z",
  //   },
  // ]

  // return new Response(JSON.stringify(test), {
  //   headers: { "Content-Type": "application/json" },
  // })
  try {
    const { input } = await req.json()

    const tools = [new CreateTaskTool(), new FindTaskTool()]
    const model = new ChatOpenAI({
      temperature: 0,
      modelName: "gpt-3.5-turbo", // "gpt-3.5-turbo",
      verbose: true,
    })
    const executor = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: "structured-chat-zero-shot-react-description",
      verbose: true,
    })

    const response = await executor.call({ input })

    if (response.output) {
      try {
        const json = JSON.parse(response.output)
        return new Response(JSON.stringify(json), {
          headers: { "Content-Type": "application/json" },
        })
      } catch (e) {
        // not JSON
        return new Response(JSON.stringify({ error: (e as any).message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        })
      }
    }
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

// export const runtime = "edge"
