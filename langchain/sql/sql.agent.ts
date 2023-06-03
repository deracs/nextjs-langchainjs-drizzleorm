import { LLMChain } from "langchain"
import {
  AgentExecutor,
  SqlCreatePromptArgs,
  Toolkit,
  ZeroShotAgent,
} from "langchain/agents"
import { BaseLanguageModel } from "langchain/dist/base_language"
import { renderTemplate } from "langchain/prompts"
import { Tool } from "langchain/tools"

import { SQL_PREFIX, SQL_SUFFIX } from "./prompts"
import {
  InfoSqlTool,
  ListTablesSqlTool,
  QueryCheckerTool,
  QuerySqlTool,
} from "./sql.tools"

export class SqlToolkit extends Toolkit {
  tools: Tool[]
  db: any
  dialect = "postgres"

  constructor(db: any, llm?: BaseLanguageModel) {
    super()
    this.db = db
    this.tools = [
      new QuerySqlTool(db),
      new InfoSqlTool(db),
      new ListTablesSqlTool(db),
      new QueryCheckerTool({ llm }),
    ]
  }
}

export function createSqlAgent(
  llm: BaseLanguageModel,
  toolkit: SqlToolkit,
  args?: SqlCreatePromptArgs
) {
  const {
    prefix = SQL_PREFIX,
    suffix = SQL_SUFFIX,
    inputVariables = ["input", "agent_scratchpad"],
    topK = 10,
  } = args ?? {}
  const { tools } = toolkit
  const formattedPrefix = renderTemplate(prefix, "f-string", {
    dialect: toolkit.dialect,
    top_k: topK,
  })

  const prompt = ZeroShotAgent.createPrompt(tools, {
    prefix: formattedPrefix,
    suffix,
    inputVariables,
  })
  const chain = new LLMChain({ prompt, llm })
  const agent = new ZeroShotAgent({
    llmChain: chain,
    allowedTools: tools.map((t) => t.name),
  })
  return AgentExecutor.fromAgentAndTools({
    agent,
    tools,
    returnIntermediateSteps: true,
    verbose: true,
  })
}
