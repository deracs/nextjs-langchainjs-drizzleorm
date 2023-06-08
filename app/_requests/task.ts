import "server-only"
import { DeleteManyTasks, deleteManyTasks } from "@/drizzle/mutations/tasks"
import { NewTask, insertTaskSchema } from "@/drizzle/schema"

export async function deleteTask(taskId: number) {
  "use server"
  const data = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
    method: "DELETE",
    cache: "no-cache",
  })
  return await data.json()
}

export async function deleteTasks(ids: DeleteManyTasks) {
  "use server"
  const data = await fetch("http://localhost:3000/api/tasks/delete", {
    method: "POST",
    body: JSON.stringify(deleteManyTasks.parse(ids)),
    cache: "no-cache",
  })
  return await data.json()
}

export async function createTask(task: NewTask) {
  "use server"
  const data = await fetch("http://localhost:3000/api/tasks", {
    method: "POST",
    body: JSON.stringify(insertTaskSchema.parse(task)),
    cache: "no-cache",
  })
  return await data.json()
}

export async function updateTask(task: NewTask) {
  "use server"
  const data = await fetch(`http://localhost:3000/api/tasks/${task.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(insertTaskSchema.parse(task)),
    cache: "no-cache",
  })
  return await data.json()
}

export async function favouriteTask(id: number) {
  "use server"
  const data = await fetch(`http://localhost:3000/api/tasks/${id}/favourite`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-cache",
  })
  return await data.json()
}

export const TaskAPI = {
  delete: deleteTask,
  deleteMany: deleteTasks,
  update: updateTask,
  create: createTask,
  favourite: favouriteTask,
}
