"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import api from "./api"

interface User {
  id: number
  username: string
  email: string
  role: string
  created_at: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string, role?: string) => Promise<void>
  logout: () => void
  isAdmin: boolean
  isStaff: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("access_token")

    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    console.log("[v0] Login attempt for username:", username)
    console.log("[v0] API URL:", process.env.NEXT_PUBLIC_API_URL)

    try {
      const response = await api.post("/auth/login", { username, password })
      console.log("[v0] Login successful:", response.data)

      const { access_token, refresh_token, user } = response.data

      localStorage.setItem("access_token", access_token)
      localStorage.setItem("refresh_token", refresh_token)
      localStorage.setItem("user", JSON.stringify(user))

      setUser(user)
      router.push("/dashboard")
    } catch (error: any) {
      console.error("[v0] Login error:", error)
      console.error("[v0] Error response:", error.response?.data)
      console.error("[v0] Error status:", error.response?.status)

      if (error.code === "ERR_NETWORK" || error.message.includes("Network Error")) {
        throw new Error(
          "Cannot connect to backend server. Make sure the Flask API is running at " + process.env.NEXT_PUBLIC_API_URL,
        )
      }

      if (error.response?.status === 401) {
        throw new Error("Invalid username or password")
      }

      throw new Error(error.response?.data?.message || error.message || "Login failed. Please try again.")
    }
  }

  const register = async (username: string, email: string, password: string, role = "viewer") => {
    console.log("[v0] Register attempt for username:", username)

    try {
      await api.post("/auth/register", { username, email, password, role })
      console.log("[v0] Registration successful")
      // Auto login after registration
      await login(username, password)
    } catch (error: any) {
      console.error("[v0] Registration error:", error)

      if (error.code === "ERR_NETWORK" || error.message.includes("Network Error")) {
        throw new Error("Cannot connect to backend server. Make sure the Flask API is running.")
      }

      throw new Error(error.response?.data?.message || error.message || "Registration failed. Please try again.")
    }
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  const isAdmin = user?.role === "admin"
  const isStaff = user?.role === "staff" || user?.role === "admin"

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isStaff }}>
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
