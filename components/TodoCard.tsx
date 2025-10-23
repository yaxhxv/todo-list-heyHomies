"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Moon, Sun, Loader2 } from "lucide-react"
import type { Todo, CreateTodoInput } from "@/lib/types"
import { getTodos, createTodo, updateTodo, deleteTodo } from "@/lib/api"
import { TodoItem } from "./TodoItem"
import { AddTaskModal } from "./AddTaskModal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"

export function TodoCard() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    setIsLoading(true)
    const data = await getTodos()
    setTodos(data)
    setIsLoading(false)
  }

  const handleAddTodo = async (input: CreateTodoInput) => {
    const newTodo = await createTodo(input)
    setTodos([newTodo, ...todos])
  }

  const handleToggleTodo = async (id: string, completed: boolean) => {
    await updateTodo(id, { completed })
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed } : t)))
  }

  const handleUpdateTodo = async (id: string, title: string) => {
    await updateTodo(id, { title })
    setTodos(todos.map((t) => (t.id === id ? { ...t, title } : t)))
  }

  const handleDeleteTodo = async (id: string) => {
    await deleteTodo(id)
    setTodos(todos.filter((t) => t.id !== id))
  }

  const completedCount = todos.filter((t) => t.completed).length
  const totalCount = todos.length

  return (
    <>
      <Card className="w-full max-w-2xl backdrop-blur-sm bg-card/95 shadow-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">My Tasks</CardTitle>
              <CardDescription className="mt-1">
                {totalCount === 0
                  ? "No tasks yet. Add one to get started!"
                  : `${completedCount} of ${totalCount} completed`}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : todos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="rounded-full bg-muted p-4 mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium">No tasks yet</p>
              <p className="text-sm text-muted-foreground mt-1">Click the button below to add your first task</p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {todos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggleTodo}
                    onUpdate={handleUpdateTodo}
                    onDelete={handleDeleteTodo}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-8 right-8"
      >
        <Button
          size="lg"
          onClick={() => setIsModalOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">Add task</span>
        </Button>
      </motion.div>

      <AddTaskModal open={isModalOpen} onOpenChange={setIsModalOpen} onAdd={handleAddTodo} />
    </>
  )
}
