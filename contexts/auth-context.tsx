"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, LoginInput, SignupInput } from "@/lib/types"
import { login as apiLogin, signup as apiSignup, logout as apiLogout, getCurrentUser } from "@/lib/auth-api"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (input: LoginInput) => Promise<void>
  signup: (input: SignupInput) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem("auth_token")
    if (token) {
      getCurrentUser(token)
        .then((user) => {
          if (user) {
            setUser(user)
          } else {
            localStorage.removeItem("auth_token")
          }
        })
        .catch(() => {
          localStorage.removeItem("auth_token")
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (input: LoginInput) => {
    const response = await apiLogin(input)
    setUser(response.user)
    localStorage.setItem("auth_token", response.token)
  }

  const signup = async (input: SignupInput) => {
    const response = await apiSignup(input)
    setUser(response.user)
    localStorage.setItem("auth_token", response.token)
  }

  const logout = async () => {
    await apiLogout()
    setUser(null)
    localStorage.removeItem("auth_token")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
