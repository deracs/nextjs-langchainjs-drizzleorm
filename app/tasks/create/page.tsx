import { Metadata } from "next"
import Image from "next/image"
import { db } from "@/db"
import { Form } from "react-hook-form"

import { CreateTaskForm } from "./form"

export const metadata: Metadata = {
  title: "Tasks - create",
  description: "A task and issue tracker build using Tanstack Table.",
}

export default async function TaskPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Create task
        </h1>
      </div>
      <CreateTaskForm />
    </section>
  )
}
