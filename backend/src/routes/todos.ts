import { Router } from "express"
import { prisma } from "../lib/prisma.js"
import { z } from "zod"
import { requireAuth, type AuthRequest } from "../middleware/auth.js"

export const todoRouter = Router()

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.coerce.date().optional(),
})

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.coerce.date().optional().nullable(),
})

todoRouter.use(requireAuth)

todoRouter.get("/", async (req: AuthRequest, res) => {
  const todos = await prisma.todo.findMany({
    where: { userId: req.userId! },
    orderBy: { createdAt: "desc" },
  })
  res.json(todos)
})

todoRouter.post("/", async (req: AuthRequest, res) => {
  const parse = createSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json({ message: "Invalid payload", errors: parse.error.flatten() })
  const data = parse.data
  const todo = await prisma.todo.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate,
      userId: req.userId!,
    },
  })
  res.status(201).json(todo)
})

todoRouter.patch("/:id", async (req: AuthRequest, res) => {
  const { id } = req.params
  const parse = updateSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json({ message: "Invalid payload", errors: parse.error.flatten() })
  const existing = await prisma.todo.findFirst({ where: { id, userId: req.userId! } })
  if (!existing) return res.status(404).json({ message: "Todo not found" })
  const updated = await prisma.todo.update({ where: { id }, data: parse.data })
  res.json(updated)
})

todoRouter.delete("/:id", async (req: AuthRequest, res) => {
  const { id } = req.params
  const existing = await prisma.todo.findFirst({ where: { id, userId: req.userId! } })
  if (!existing) return res.status(404).json({ message: "Todo not found" })
  await prisma.todo.delete({ where: { id } })
  res.status(204).send()
})


