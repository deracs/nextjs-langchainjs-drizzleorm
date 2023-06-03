import { Metadata } from "next"
import Image from "next/image"
import { db } from "@/db"
import { selectTaskSchema } from "@/db/schema"
import { z } from "zod"

import { DataTable } from "@/components/ui/data-table/data-table"
import { UserNav } from "@/components/ui/data-table/user-nav"

import { columns } from "./columns"
import { generateTasks } from "./data/seed"

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
}

// Simulate a database read for tasks.
async function getTasks() {
  const tasks = await db.query.tasks.findMany()
  return z.array(selectTaskSchema).parse(tasks)
}

export default async function TaskPage() {
  const tasks = await getTasks()
  // await generateTasks()
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
  )
}
