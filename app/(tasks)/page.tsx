import { Metadata } from "next"
import Image from "next/image"
import { allTasks } from "@/db/queries"
import { Task } from "@/db/schema"
import { Row } from "@tanstack/react-table"

import { DataTable } from "@/components/ui/data-table/data-table"
import { UserNav } from "@/components/ui/data-table/user-nav"

import { columns } from "./columns"

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
}
async function deleteTasks(rows: Row<Task>[], toast: any) {
  "use server"
  const ids = rows.map((row) => row.original.id)
  if (ids.length === 0) {
    toast({
      description: "No tasks selected",
    })
    return
  }

  const response = await fetch("/api/tasks", {
    method: "DELETE",
    body: JSON.stringify({ ids }),
  })

  if (!response.ok) {
    toast({
      title: "An error occurred",
      description: "Tasks could not be deleted: " + response.statusText,
    })
    return
  }
  toast({
    description: "Tasks deleted",
  })
}

export default async function TaskPage() {
  const tasks = await allTasks()
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
        <DataTable
          data={tasks}
          columns={columns}
          actions={{
            delete: deleteTasks,
          }}
        />
      </div>
    </>
  )
}
