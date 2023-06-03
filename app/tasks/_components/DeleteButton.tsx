"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface DeleteButtonProps {
  taskId: number
}

export default function DeleteButton({ taskId }: DeleteButtonProps) {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const router = useRouter()

  async function onDelete() {
    setIsSaving(true)

    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
    })

    setIsSaving(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your post was not saved. Please try again.",
        variant: "destructive",
      })
    }

    router.push("/tasks")

    return toast({
      title: "Success!",
      description: "Your task has been deleted.",
    })
  }

  return (
    <button
      type="button"
      onClick={() => onDelete()}
      className={cn(buttonVariants())}
    >
      {isSaving && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      <span>Delete</span>
    </button>
  )
}
