"use client"

import { cn } from "@/lib/utils"
import { useDeleteTask } from "@/hooks/task"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface DeleteButtonProps {
  taskId: number
  deleteAction: (taskId: number) => Promise<any>
}

export default function DeleteButton({
  taskId,
  deleteAction,
}: DeleteButtonProps) {
  const { isDeleting, onDelete } = useDeleteTask(taskId, deleteAction)
  return (
    <button
      type="button"
      onClick={() => onDelete(false)}
      className={cn(buttonVariants())}
    >
      {isDeleting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      <span>Delete</span>
    </button>
  )
}
