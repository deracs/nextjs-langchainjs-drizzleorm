import { Metadata } from "next"

import { createTask } from "@/app/_requests/task"

import { TaskForm } from "../_components/form"

export const metadata: Metadata = {
  title: "Tasks - create",
  description: "A task and issue tracker build using Tanstack Table.",
}

export default async function TaskPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Create task
        </h1>
      </div>
      <TaskForm taskAction={createTask} type="create" />
    </section>
  )
}
