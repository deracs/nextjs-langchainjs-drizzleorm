import {
  BotIcon,
  ClipboardList,
  Edit,
  FileUp,
  ListChecks,
  PenTool,
  Settings,
  ShoppingBag,
} from "lucide-react"

import { siteConfig } from "./site"

export type Command = {
  route: string
  icon: React.ComponentType<{ className?: string }>
  text: string
  shortcut?: string
  callback?: () => void
}
type CommandGroup = {
  heading: string
  items: Command[]
}
export const commandGroups: CommandGroup[] = [
  {
    heading: "Suggestions",
    items: [
      {
        route: siteConfig.links.ask.view,
        icon: BotIcon,
        text: "Create a task",
        // shortcut: "⌘C",
      },
      {
        route: siteConfig.links.tasks.view,
        icon: ListChecks,
        text: "View Tasks",
      },
      {
        route: siteConfig.links.tasks.create,
        icon: Edit,
        text: "Create Task",
      },
    ],
  },
]
