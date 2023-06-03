"use client"

import * as React from "react"
import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { Task } from "@/db/schema"
import {
  Bot,
  Calculator,
  Calendar,
  ClipboardList,
  CreditCard,
  Edit,
  FileUp,
  Settings,
  ShoppingBag,
  Smile,
  User,
} from "lucide-react"

import { commandGroups } from "@/config/command-dialog"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

export function CommandDialogButton() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey) {
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <p className="text-sm text-muted-foreground">
        Press{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandList>
          <CommandInput placeholder="Type a command or search..." />
          <CommandEmpty>No results found.</CommandEmpty>
          {commandGroups.map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
              <CommandGroup heading={group.heading}>
                {group.items.map((item, itemIndex) => (
                  <CommandItem
                    key={itemIndex}
                    onSelect={() => {
                      if (item.route && !item.callback) {
                        router.push(item.route)
                      }
                      if (item.callback && !item.route) {
                        item.callback()
                      }
                      setOpen(false)
                    }}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.text}</span>
                    {item.shortcut && (
                      <CommandShortcut>{item.shortcut}</CommandShortcut>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              {groupIndex < commandGroups.length - 1 && <CommandSeparator />}
            </React.Fragment>
          ))}
          {/* <CommandSeparator /> */}
          {/* <CommandGroup heading="Bot">
                <CommandItem
                  onSelect={() => {
                    setPages([...pages, "bot"])
                    // setOpen(false)
                  }}
                >
                  <Bot className="mr-2 h-4 w-4" />
                  <span>Task Bot</span>
                </CommandItem>
              </CommandGroup> */}
        </CommandList>
      </CommandDialog>
    </>
  )
}
