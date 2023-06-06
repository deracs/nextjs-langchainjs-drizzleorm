"use client"

import { useRouter } from "next/navigation"
import { selectTaskSchema } from "@/drizzle/schema"
import { Row } from "@tanstack/react-table"
import { Copy, MoreHorizontal, Pen, Star, Trash } from "lucide-react"

import { TableActions } from "@/types/table"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { useDeleteTask, useFavouriteTask, useSave } from "@/hooks/task"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  actions: TableActions<TData>
}

export function DataTableRowActions<TData>({
  row,
  actions,
}: DataTableRowActionsProps<TData>) {
  const task = selectTaskSchema.parse(row.original)
  const router = useRouter()
  const { onDelete, isDeleting } = useDeleteTask(task.id, actions.delete)
  const { onSave, isSaving } = useFavouriteTask(actions.favourite)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onSelect={() =>
            router.push(`${siteConfig.links.tasks.view}${task.id}`)
          }
        >
          <Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Edit
        </DropdownMenuItem>
        {/* <DropdownMenuItem>
          <Copy className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Make a copy
        </DropdownMenuItem> */}
        <DropdownMenuItem onSelect={() => onSave(task.id)}>
          <Star
            className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
            color={task.favourite ? "gold" : "grey"}
            fill={task.favourite ? "gold" : "none"}
          />
          {task.favourite ? "Favourited" : "Favourite"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => onDelete()}>
          <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          {isDeleting ? "Deleting..." : "Delete"}
          {/* <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
