import * as z from "zod"

const askSchema = z.object({
  input: z.string(),
})

type AskType = z.infer<typeof askSchema>

export const askBot = async (data: AskType) => {
  const ask = await fetch("/api/helpful", {
    method: "POST",
    body: JSON.stringify(askSchema.parse(data)),
  })

  return await ask.json()
}
