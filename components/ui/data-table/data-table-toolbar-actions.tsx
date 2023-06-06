"use client"

import { useRouter } from "next/navigation"
import { Table } from "@tanstack/react-table"
import { Delete, Edit } from "lucide-react"

import { TableActions } from "@/types/table"
import { siteConfig } from "@/config/site"
import { useDeleteTasks } from "@/hooks/task"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu"

interface DataTableToolbarActions<TData> {
  table: Table<TData>
  actions: TableActions<TData>
}

export function DataTableToolbarActions<TData>({
  table,
  actions,
}: DataTableToolbarActions<TData>) {
  const router = useRouter()
  const selectedRows = table.getSelectedRowModel().rows
  const ids = selectedRows.map((row) => row.original.id) // TODO fix this
  const { onDelete } = useDeleteTasks({ ids }, actions.deleteMany)
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
            Actions
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
          {selectedRows.length > 0 ? (
            <DropdownMenuItem onSelect={onDelete}>
              <Delete className="mr-2 h-4 w-4" /> Delete ({selectedRows.length})
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem disabled>Select rows</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
