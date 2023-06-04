"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { NewTask, insertTaskSchema } from "@/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { priorities, statuses } from "@/config/data"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

export function CreateTaskForm() {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const router = useRouter()
  const form = useForm<NewTask>({
    resolver: zodResolver(insertTaskSchema),
    mode: "onChange",
  })

  async function onSubmit(data: NewTask) {
    setIsSaving(true)

    const response = await fetch(`/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        authorId: 1,
      }),
    })

    setIsSaving(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your task was not saved. Please try again.",
        variant: "destructive",
      })
    }

    router.push("/tasks")

    return toast({
      title: "Success!",
      description: "Your task has been saved.",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <RadioGroup
              defaultValue={field.value}
              onChange={(value) => field.onChange(value)}
              className="grid grid-cols-5 gap-4"
            >
              {statuses.map((label) => (
                <Label
                  htmlFor={label.value}
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <RadioGroupItem
                    value={label.value}
                    id={label.value}
                    className="sr-only"
                  />
                  <label.icon className="mb-3 h-6 w-6" />
                  {label.label}
                </Label>
              ))}
            </RadioGroup>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {priorities.map((label) => (
                        <SelectItem key={label.value} value={label.value}>
                          {label.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* <FormDescription>
                    This is the priority of your task.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task</FormLabel>
              <FormControl>
                <Input placeholder="Fix the bug" {...field} />
              </FormControl>
              <FormDescription>
                This is the title of your task. It should be short and concise.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {isSaving && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Create task
        </Button>
      </form>
    </Form>
  )
}
