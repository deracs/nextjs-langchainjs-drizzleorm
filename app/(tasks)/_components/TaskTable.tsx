"use client"

import { useMemo } from "react"
import { Metadata } from "next"
import Image from "next/image"
import { Task } from "@/drizzle/schema"

import { TableActions } from "@/types/table"
import { DataTable } from "@/components/ui/data-table/data-table"
import { UserNav } from "@/components/ui/data-table/user-nav"

import { createColumns } from "../_data/columns"

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
}

type TaskTableProps = {
  tasks: Task[]
  actions: TableActions<Task>
}

export default function TaskTable({ tasks, actions }: TaskTableProps) {
  const columns = useMemo(() => createColumns(actions), [actions])
  return (
    <div>
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
          {/* <div className="flex items-center space-x-2">
            <UserNav />
          </div> */}
        </div>
        <DataTable data={tasks} columns={columns} actions={actions} />
      </div>
    </div>
  )
}
