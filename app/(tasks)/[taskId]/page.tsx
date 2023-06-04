import { notFound } from "next/navigation"
import { findFirstTask } from "@/db/queries"

import DeleteButton from "../_components/DeleteButton"
import { UpdateTaskForm } from "./form"

interface TaskEditPageProps {
  params: { taskId: number }
}

export default async function TaskEditPage({ params }: TaskEditPageProps) {
  const task = await findFirstTask(params.taskId)

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
