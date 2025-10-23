"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Pencil, Trash2, CalendarIcon } from "lucide-react"
import type { Todo } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface TodoItemProps {
  todo: Todo
  onStatusChange: (id: string, status: "todo" | "in_progress" | "completed") => Promise<void>
  onUpdate: (id: string, title: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function TodoItem({ todo, onStatusChange, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusChange = async (newStatus: "todo" | "in_progress" | "completed") => {
    setIsLoading(true)
    await onStatusChange(todo.id, newStatus)
    setIsLoading(false)
  }

  const handleUpdate = async () => {
    if (editTitle.trim() && editTitle !== todo.title) {
      setIsLoading(true)
      await onUpdate(todo.id, editTitle.trim())
      setIsLoading(false)
    }
    setIsEditing(false)
  }

  const handleDelete = async () => {
    setIsLoading(true)
    await onDelete(todo.id)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUpdate()
    } else if (e.key === "Escape") {
      setEditTitle(todo.title)
      setIsEditing(false)
    }
  }

  const priorityColors = {
    low: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900",
    medium: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900",
    high: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900",
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group flex flex-col gap-3 rounded-lg border bg-card p-4 transition-all hover:shadow-md",
        isLoading && "opacity-50 pointer-events-none",
      )}
    >
      <div className="flex items-start gap-3">
        <Select value={todo.status} onValueChange={handleStatusChange} disabled={isLoading}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todo">Todo</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleUpdate}
              onKeyDown={handleKeyDown}
              className="mb-2"
              autoFocus
            />
          ) : (
            <>
              <p
                className={cn(
                  "text-sm font-medium transition-all",
                  todo.status === "completed" && "text-muted-foreground line-through",
                )}
              >
                {todo.title}
              </p>
              {todo.description && (
                <p className={cn("text-xs text-muted-foreground mt-1", todo.status === "completed" && "line-through")}>
                  {todo.description}
                </p>
              )}
            </>
          )}

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span
              className={cn(
                "px-2 py-0.5 rounded-md text-xs font-medium border capitalize",
                priorityColors[todo.priority],
              )}
            >
              {todo.priority}
            </span>

            {todo.dueDate && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarIcon className="h-3 w-3" />
                {format(new Date(todo.dueDate), "MMM d, yyyy")}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsEditing(true)}
            disabled={isEditing}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
