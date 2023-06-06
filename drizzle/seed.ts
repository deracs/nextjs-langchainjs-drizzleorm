import "dotenv/config"
import { faker } from "@faker-js/faker"

import { priorities, statuses } from "@/config/data"

import { db } from "."
import { insertTaskSchema, tasks } from "./schema"

const generateTask = (number: number) => {
  const task = {
    title: faker.hacker
      .phrase()
      .replace(/^./, (letter) => letter.toUpperCase()),
    status: faker.helpers.arrayElement(statuses).value,
    priority: faker.helpers.arrayElement(priorities).value,
  }
  return db.insert(tasks).values(insertTaskSchema.parse(task))
}

const main = async () => {
  const tasksSeed = Array.from({ length: 100 }, (_, index) =>
    generateTask(index)
  )
  await Promise.all(tasksSeed)
  console.log("✅ Tasks data generated.")
  process.exit(0)
}

main()
