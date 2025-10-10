"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
  requireStaff?: boolean
}

export function ProtectedRoute({ children, requireAdmin, requireStaff }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
      } else if (requireAdmin && user.role !== "admin") {
        router.push("/dashboard")
      } else if (requireStaff && user.role !== "staff" && user.role !== "admin") {
        router.push("/dashboard")
      }
    }
  }, [user, loading, requireAdmin, requireStaff, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requireAdmin && user.role !== "admin") {
    return null
  }

  if (requireStaff && user.role !== "staff" && user.role !== "admin") {
    return null
  }

  return <>{children}</>
}
