import type { Todo, CreateTodoInput, UpdateTodoInput } from "./types"

// Mock data for demonstration
let mockTodos: Todo[] = [
  {
    id: "1",
    title: "Complete project documentation",
    description: "Write comprehensive docs for the new features",
    completed: false,
    priority: "high",
    dueDate: new Date("2025-01-25"),
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "2",
    title: "Review pull requests",
    description: "Check and approve pending PRs from the team",
    completed: true,
    priority: "medium",
    dueDate: new Date("2025-01-20"),
    createdAt: new Date("2025-01-14"),
  },
  {
    id: "3",
    title: "Update dependencies",
    completed: false,
    priority: "low",
    createdAt: new Date("2025-01-13"),
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// TODO: Replace with real API endpoint
export async function getTodos(): Promise<Todo[]> {
  await delay(500)
  return [...mockTodos]
}

// TODO: Replace with real API endpoint
export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  await delay(300)
  const newTodo: Todo = {
    id: Math.random().toString(36).substr(2, 9),
    title: input.title,
    description: input.description,
    completed: false,
    priority: input.priority,
    dueDate: input.dueDate,
    createdAt: new Date(),
  }
  mockTodos = [newTodo, ...mockTodos]
  return newTodo
}

// TODO: Replace with real API endpoint
export async function updateTodo(id: string, input: UpdateTodoInput): Promise<Todo> {
  await delay(300)
  const todoIndex = mockTodos.findIndex((t) => t.id === id)
  if (todoIndex === -1) throw new Error("Todo not found")

  mockTodos[todoIndex] = {
    ...mockTodos[todoIndex],
    ...input,
  }
  return mockTodos[todoIndex]
}

// TODO: Replace with real API endpoint
export async function deleteTodo(id: string): Promise<void> {
  await delay(300)
  mockTodos = mockTodos.filter((t) => t.id !== id)
}
