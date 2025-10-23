import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export interface AuthRequest extends Request {
  userId?: string
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" })
  }
  const token = authHeader.slice("Bearer ".length)
  try {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error("JWT_SECRET not configured")
    const payload = jwt.verify(token, secret) as { userId: string }
    req.userId = payload.userId
    next()
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" })
  }
}

export function signToken(userId: string) {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error("JWT_SECRET not configured")
  return jwt.sign({ userId }, secret, { expiresIn: "7d" })
}


