export interface Todo {
  id: string
  title: string
  description?: string
  status: "todo" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate?: Date
  createdAt: Date
}

export interface CreateTodoInput {
  title: string
  description?: string
  status?: "todo" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate?: Date
}

export interface UpdateTodoInput {
  title?: string
  description?: string
  status?: "todo" | "in_progress" | "completed"
  priority?: "low" | "medium" | "high"
  dueDate?: Date
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

export interface LoginInput {
  email: string
  password: string
}

export interface SignupInput {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}
