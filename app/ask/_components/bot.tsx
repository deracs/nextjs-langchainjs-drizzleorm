"use client"

import { FormEvent, useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Task } from "@/db/schema"
import { ArrowRightCircle, CircleEllipsis, HelpCircle } from "lucide-react"

import { priorities, statuses } from "@/config/data"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

const TestCard = ({ item }: { item: Task }) => {
  const router = useRouter()
  const priorityData = priorities.find((label) => label.value === item.priority)

  // bg colors for priority
  const priorityBg = {
    low: "bg-accent",
    medium: "bg-primary",
    high: "bg-destructive",
  }

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
              href={`${siteConfig.links.tasks}/${item.id}`}
              className="font-medium text-gray-900 hover:text-gray-600"
            >
              {item.title}
            </a>
            <p className="text-gray-500">{priorityData?.label}</p>
          </div>
          <div className="shrink-0 pr-2">
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full  bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() =>
                router.push(`${siteConfig.links.tasks.view}/${item.id}`)
              }
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
  const router = useRouter()
  const [output, setOutput] = useState<Task[]>([])
  const [inflight, setInflight] = useState(false)

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()

      // Prevent multiple requests at once
      if (inflight) return
      if (!input) {
        toast({
          title: "Please enter a task.",
        })
        return
      }

      setInflight(true)

      try {
        const res = await fetch(`/api/helpful`, {
          method: "POST",
          body: JSON.stringify({ input }),
        })
        const data = await res.json()
        if (data.output) {
          setOutput((prevOutput) => [...prevOutput, ...data.output])
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
      <Card>
        <CardHeader>
          <CardTitle>AI tasks</CardTitle>
          <CardDescription>
            Helpful AI bot to help you with your tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {output.length > 0 && (
              <div className="space-y-4">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tasks created</CardTitle>
                    </CardHeader>
                    <div className="items-start justify-center gap-6 rounded-lg p-8 md:grid lg:grid-cols-2 xl:grid-cols-3">
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
                  </Card>
                </div>
              </div>
            )}
          </div>
          <Separator className="my-4" />
          <div className="flex space-x-2 pb-5">
            <Input
              placeholder="Can you create a todo task called Michael needs eggs?"
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
          </div>
          <Button type="submit" variant="secondary" className="shrink-0">
            {inflight ? "Thinking..." : "Ask"}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}
