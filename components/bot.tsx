"use client"

import { FormEvent, useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { Task } from "@/drizzle/schema"
import { ArrowRightCircle } from "lucide-react"

import { priorities } from "@/config/data"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { askBot } from "@/app/_requests/ai"

import { AnimatedInput } from "./ui/AnimatedInput"

const TestCard = ({ item }: { item: Task }) => {
  const router = useRouter()
  const priorityData = priorities.find((label) => label.value === item.priority)

  if (!priorityData) {
    return null
  }

  // bg colors for priority
  const priorityBg = {
    low: "bg-accent",
    medium: "bg-primary",
    high: "bg-destructive",
  }

  const taskLink = `${siteConfig.links.tasks.view}${item.id}`

  return (
    <CardContent>
      <div className="col-span-1 flex rounded-md shadow-sm">
        <div
          className={cn(
            "flex w-16 shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white",
            priorityBg[item.priority] || "bg-secondary"
          )}
        >
          <priorityData.icon />
        </div>
        <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-y border-r border-gray-200 bg-white">
          <div className="flex-1 truncate px-4 py-2 text-sm">
            <a
              href={taskLink}
              className="font-medium text-gray-900 hover:text-gray-600"
            >
              {item.title}
            </a>
            <p className="text-gray-500">Priority: {priorityData?.label}</p>
          </div>
          <div className="shrink-0 pr-2">
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full  bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => router.push(taskLink)}
            >
              <span className="sr-only">View task</span>
              <ArrowRightCircle className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </CardContent>
  )
}

export function BotForm() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<Task[]>([])
  const [inflight, setInflight] = useState(false)

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      if (inflight) return
      if (!input) {
        toast({
          title: "Please enter a task.",
        })
        return
      }

      setInflight(true)

      try {
        const data = await askBot({ input })

        if (data) {
          setOutput([...data])
        }
      } catch (error) {
        console.error(error)
      } finally {
        setInflight(false)
      }
    },
    [input, inflight]
  )

  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-6">
        {output.length > 0 && (
          <div className="">
            {output.map((item) => {
              return item.priority ? (
                <TestCard item={item} />
              ) : (
                <div className="flex items-center justify-between space-x-4 pb-5">
                  Failed to create task
                  <pre>{JSON.stringify(item, null, 2)}</pre>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <Separator className="my-4" />
      <div className="flex space-x-2 pb-5">
        <AnimatedInput
          placeholderArray={[
            "Can you create a todo task called Michael needs eggs?",
            "Can you find me high priority tasks?",
          ]}
          onChange={(e: any) => setInput(e.target.value)}
          autoFocus
        />
      </div>
      <Button type="submit" variant="secondary" className="shrink-0">
        {inflight ? "Thinking..." : "Ask"}
      </Button>
    </form>
  )
}
