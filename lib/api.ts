import type { Todo, CreateTodoInput, UpdateTodoInput } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

function getAuthHeaders() {
  const token = localStorage.getItem("auth_token")
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export async function getTodos(): Promise<Todo[]> {
  const response = await fetch(`${API_BASE_URL}/api/todos`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch todos")
  }

  return response.json()
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const response = await fetch(`${API_BASE_URL}/api/todos`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to create todo")
  }

  return response.json()
}

export async function updateTodo(id: string, input: UpdateTodoInput): Promise<Todo> {
  const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to update todo")
  }

  return response.json()
}

export async function deleteTodo(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to delete todo")
  }
}
