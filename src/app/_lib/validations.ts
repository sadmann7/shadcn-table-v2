import { tasks } from "@/db/schema"
import type { JoinOperator, Operator } from "@/types"
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
} from "nuqs/server"
import * as z from "zod"

export const filterConditionSchema = z.object({
  id: z.string(),
  value: z.string(),
  operator: z.custom<Operator>(),
  joinOperator: z.custom<JoinOperator>(),
})

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: parseAsString.withDefault("createdAt.desc"),
  title: parseAsString.withDefault(""),
  status: parseAsArrayOf(z.enum(tasks.status.enumValues)).withDefault([]),
  priority: parseAsArrayOf(z.enum(tasks.priority.enumValues)).withDefault([]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  filters: parseAsArrayOf(filterConditionSchema).withDefault([]),
})

export const createTaskSchema = z.object({
  title: z.string(),
  label: z.enum(tasks.label.enumValues),
  status: z.enum(tasks.status.enumValues),
  priority: z.enum(tasks.priority.enumValues),
})

export const updateTaskSchema = z.object({
  title: z.string().optional(),
  label: z.enum(tasks.label.enumValues).optional(),
  status: z.enum(tasks.status.enumValues).optional(),
  priority: z.enum(tasks.priority.enumValues).optional(),
})

export type GetTasksSchema = Awaited<ReturnType<typeof searchParamsCache.parse>>
export type CreateTaskSchema = z.infer<typeof createTaskSchema>
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>
