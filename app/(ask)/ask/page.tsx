import { BotForm } from "@/components/bot"

import "./style.css"

export default function Home() {
  return (
    <section
      id="bot"
      className="container grid items-center gap-6 pb-8 pt-6 md:py-10"
    >
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Lets chat
        </h1>
      </div>

      <BotForm />
    </section>
  )
}
