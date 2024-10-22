import "server-only"

import { db } from "@/db"
import { tasks, type Task } from "@/db/schema"
import {
  and,
  asc,
  count,
  desc,
  gt,
  gte,
  ilike,
  inArray,
  lte,
} from "drizzle-orm"

import { unstable_cache } from "@/lib/unstable-cache"

import { type GetTasksSchema } from "./validations"

export async function getTasks(input: GetTasksSchema) {
  return await unstable_cache(
    async () => {
      try {
        const offset = (input.page - 1) * input.per_page
        const [column, order] = (input.sort?.split(".").filter(Boolean) ?? [
          "createdAt",
          "desc",
        ]) as [keyof Task | undefined, "asc" | "desc" | undefined]

        const statuses = input.status
          ? (input.status.split(",") as Task["status"][])
          : undefined
        const priorities = input.priority
          ? (input.priority.split(",") as Task["priority"][])
          : undefined

        const fromDate = input.from ? new Date(input.from) : undefined
        const toDate = input.to ? new Date(input.to) : undefined

        const where = and(
          input.title ? ilike(tasks.title, `%${input.title}%`) : undefined,
          statuses ? inArray(tasks.status, statuses) : undefined,
          priorities ? inArray(tasks.priority, priorities) : undefined,
          fromDate ? gte(tasks.createdAt, fromDate) : undefined,
          toDate ? lte(tasks.createdAt, toDate) : undefined
        )

        const { data, total } = await db.transaction(async (tx) => {
          const data = await tx
            .select()
            .from(tasks)
            .limit(input.per_page)
            .offset(offset)
            .where(where)
            .orderBy(
              column && column in tasks
                ? order === "asc"
                  ? asc(tasks[column])
                  : desc(tasks[column])
                : desc(tasks.id)
            )

          const total = await tx
            .select({
              count: count(),
            })
            .from(tasks)
            .where(where)
            .execute()
            .then((res) => res[0]?.count ?? 0)

          return {
            data,
            total,
          }
        })

        const pageCount = Math.ceil(total / input.per_page)
        return { data, pageCount }
      } catch (err) {
        return { data: [], pageCount: 0 }
      }
    },
    [JSON.stringify(input)],
    {
      revalidate: 3600,
      tags: ["tasks"],
    }
  )()
}

export async function getTaskStatusCounts() {
  return unstable_cache(
    async () => {
      try {
        return await db
          .select({
            status: tasks.status,
            count: count(),
          })
          .from(tasks)
          .groupBy(tasks.status)
          .having(gt(count(), 0))
          .then((res) =>
            res.reduce(
              (acc, { status, count }) => {
                acc[status] = count
                return acc
              },
              {} as Record<Task["status"], number>
            )
          )
      } catch (err) {
        return {} as Record<Task["status"], number>
      }
    },
    ["task-status-counts"],
    {
      revalidate: 3600,
    }
  )()
}

export async function getTaskPriorityCounts() {
  return unstable_cache(
    async () => {
      try {
        return await db
          .select({
            priority: tasks.priority,
            count: count(),
          })
          .from(tasks)
          .groupBy(tasks.priority)
          .having(gt(count(), 0))
          .then((res) =>
            res.reduce(
              (acc, { priority, count }) => {
                acc[priority] = count
                return acc
              },
              {} as Record<Task["priority"], number>
            )
          )
      } catch (err) {
        return {} as Record<Task["priority"], number>
      }
    },
    ["task-priority-counts"],
    {
      revalidate: 3600,
    }
  )()
}
