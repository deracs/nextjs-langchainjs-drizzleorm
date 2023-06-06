import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { EmptyPlaceholder } from "@/components/ui/empty-placeholder"

export default function NotFound() {
  return (
    <EmptyPlaceholder className="mx-auto max-w-[800px] mt-10">
      <EmptyPlaceholder.Icon name="warning" />
      <EmptyPlaceholder.Title>Uh oh! Not Found</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        This task cound not be found. Please try again.
      </EmptyPlaceholder.Description>
      <Link href="/" className={buttonVariants({ variant: "ghost" })}>
        Go to Tasks
      </Link>
    </EmptyPlaceholder>
  )
}
