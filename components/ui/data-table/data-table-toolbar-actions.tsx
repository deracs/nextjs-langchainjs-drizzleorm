import { useRouter } from "next/navigation"
import { Task } from "@/db/schema"
import { Row, Table } from "@tanstack/react-table"
import { Delete, Edit } from "lucide-react"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu"
import { useToast } from "../use-toast"

interface DataTableToolbarActions<TData> {
  table: Table<TData>
}

export function DataTableToolbarActions<TData>({
  table,
}: DataTableToolbarActions<TData>) {
  const router = useRouter()
  const { toast } = useToast()

  const selectedRows = table.getSelectedRowModel().rows
  const deleteTask = async (rows: Row<Task>[]) => {
    const ids = rows.map((row) => row.original.id)
    if (ids.length === 0) {
      toast({
        description: "No tasks selected",
      })
      return
    }

    const response = await fetch("/api/tasks", {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    })

    if (!response.ok) {
      toast({
        title: "An error occurred",
        description: "Tasks could not be deleted: " + response.statusText,
      })
      return
    }
    toast({
      description: "Tasks deleted",
    })
  }

  return (
    <div className="ml-auto hidden h-8 lg:flex">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onSelect={() => router.push(siteConfig.links.tasks.create)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Create
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => deleteTask(selectedRows)}>
            <Delete className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
