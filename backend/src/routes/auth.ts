import { Router } from "express"
import { prisma } from "../lib/prisma.js"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { signToken } from "../middleware/auth.js"

export const authRouter = Router()

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
})

authRouter.post("/signup", async (req, res) => {
  const parse = signupSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json({ message: "Invalid payload", errors: parse.error.flatten() })
  const { email, password, name } = parse.data
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return res.status(409).json({ message: "Email already in use" })
  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { email, password: hashed, name } })
  const token = signToken(user.id)
  return res.status(201).json({ user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt }, token })
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

authRouter.post("/login", async (req, res) => {
  const parse = loginSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json({ message: "Invalid payload", errors: parse.error.flatten() })
  const { email, password } = parse.data
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ message: "Invalid credentials" })
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ message: "Invalid credentials" })
  const token = signToken(user.id)
  return res.json({ user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt }, token })
})

authRouter.get("/me", async (req, res) => {
  const auth = req.headers.authorization
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" })
  const token = auth.slice("Bearer ".length)
  try {
    const { userId } = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return res.status(404).json({ message: "User not found" })
    return res.json({ id: user.id, email: user.email, name: user.name, createdAt: user.createdAt })
  } catch {
    return res.status(401).json({ message: "Unauthorized" })
  }
})


