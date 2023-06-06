import { Metadata } from "next"
import { allTasks } from "@/drizzle/queries/tasks"

import { TaskAPI } from "../_requests/task"
import TaskTable from "./_components/TaskTable"

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
}

export default async function TaskPage() {
  const tasks = await allTasks()
  return <TaskTable tasks={tasks} actions={TaskAPI} />
}
