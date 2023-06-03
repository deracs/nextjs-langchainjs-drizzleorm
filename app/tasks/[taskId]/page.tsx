import { useState } from "react"
import { notFound, useRouter } from "next/navigation"
import { db } from "@/db"
import { Task, tasks } from "@/db/schema"
import { eq } from "drizzle-orm"

import DeleteButton from "../_components/DeleteButton"
import { UpdateTaskForm } from "./form"

async function getTaskForUser(taskId: Task["id"]) {
  return await db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
  })
}

interface TaskEditPageProps {
  params: { taskId: number }
}

export default async function TaskEditPage({ params }: TaskEditPageProps) {
  const task = await getTaskForUser(params.taskId)

  if (!task) {
    notFound()
  }

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Update task
        </h1>
        <DeleteButton taskId={params.taskId} />
      </div>
      <UpdateTaskForm task={task} />
    </section>
  )
}
