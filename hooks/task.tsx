import { useState } from "react"
import { useRouter } from "next/navigation"
import { DeleteManyTasks } from "@/drizzle/mutations/tasks"
import { NewTask } from "@/drizzle/schema"

import { siteConfig } from "@/config/site"
import { useToast } from "@/components/ui/use-toast"
import type {
  createTask,
  deleteTask,
  deleteTasks,
  favouriteTask,
  updateTask,
} from "@/app/_requests/task"

type DeleteMethod = typeof deleteTask
type DeleteManyMethod = typeof deleteTasks
export type CreateTask = typeof createTask
export type UpdateTask = typeof updateTask
export type FavouriteTask = typeof favouriteTask

export const useDeleteTask = (taskId: number, deleteTask: DeleteMethod) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const onDelete = async (refresh: boolean = true) => {
    setIsDeleting(true)

    const response = await deleteTask(taskId)

    setIsDeleting(false)

    if (!response) {
      return toast({
        title: "Something went wrong.",
        description: "Your task was not deleted. Please try again.",
        variant: "destructive",
      })
    }
    if (refresh) {
      router.refresh()
    } else {
      router.push(siteConfig.links.tasks.view)
    }

    toast({
      title: "Success!",
      description: "Your task has been deleted.",
    })
  }

  return { onDelete, isDeleting }
}

export const useDeleteTasks = (
  tasks: DeleteManyTasks,
  deleteTasks: DeleteManyMethod
) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const onDelete = async () => {
    setIsDeleting(true)

    const response = await deleteTasks(tasks)

    setIsDeleting(false)

    if (!response) {
      return toast({
        title: "Something went wrong.",
        description: "Your task was not deleted. Please try again.",
        variant: "destructive",
      })
    }

    router.refresh()

    toast({
      title: "Success!",
      description: "Your task has been deleted.",
    })
  }

  return { onDelete, isDeleting }
}

export const useSave = (
  saveAction: CreateTask | UpdateTask | FavouriteTask,
  type: "create" | "update" | "favourite"
) => {
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const onSave = async (data: NewTask) => {
    setIsSaving(true)

    const response = await saveAction(data)

    setIsSaving(false)

    if (!response) {
      return toast({
        title: "Something went wrong.",
        description: "Your task was not saved. Please try again.",
        variant: "destructive",
      })
    }
    router.refresh()
    if (type === "create") {
      router.push(siteConfig.links.tasks.view)
    }

    toast({
      title: "Success!",
      description: "Your task has been saved.",
    })
  }

  return { isSaving, onSave }
}
export const useFavouriteTask = (saveAction: FavouriteTask) => {
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const onSave = async (id: number) => {
    setIsSaving(true)

    const response = await saveAction(id)

    setIsSaving(false)

    if (!response) {
      return toast({
        title: "Something went wrong.",
        description: "Your task was not saved. Please try again.",
        variant: "destructive",
      })
    }
    router.refresh()

    toast({
      title: "Success!",
      description: "Your task has been favourited.",
    })
  }

  return { isSaving, onSave }
}
export function useCreateTask(createAction: CreateTask) {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const router = useRouter()
  const { toast } = useToast()

  const onSave = async (data: NewTask) => {
    setIsSaving(true)

    const response = await createAction(data)
    setIsSaving(false)

    if (!response) {
      return toast({
        title: "Something went wrong.",
        description: "Your task was not saved. Please try again.",
        variant: "destructive",
      })
    }

    router.push(siteConfig.links.tasks.view)

    toast({
      title: "Success!",
      description: "Your task has been saved.",
    })
  }

  return { isSaving, onSave }
}

export function useUpdateTask(updateAction: UpdateTask) {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const router = useRouter()
  const { toast } = useToast()

  const onSave = async (data: NewTask) => {
    setIsSaving(true)

    const response = await updateAction(data)
    setIsSaving(false)

    if (!response) {
      return toast({
        title: "Something went wrong.",
        description: "Your task was not saved. Please try again.",
        variant: "destructive",
      })
    }

    router.refresh()

    toast({
      title: "Success!",
      description: "Your task has been saved.",
    })
  }

  return { isSaving, onSave }
}
