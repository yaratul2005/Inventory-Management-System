"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import api from "@/lib/api"
import { Package, TrendingUp, AlertTriangle, Users } from "lucide-react"
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface DashboardStats {
  totalProducts: number
  totalValue: number
  lowStockCount: number
  totalCategories: number
  recentTransactions: any[]
  categoryDistribution: any[]
  lowStockProducts: any[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [productsRes, categoriesRes, transactionsRes, lowStockRes] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
        api.get("/transactions"),
        api.get("/products/low-stock"),
      ])

      const products = productsRes.data
      const categories = categoriesRes.data
      const transactions = transactionsRes.data
      const lowStockProducts = lowStockRes.data

      // Calculate total value
      const totalValue = products.reduce((sum: number, p: any) => sum + p.price * p.quantity, 0)

      // Category distribution
      const categoryDistribution = categories.map((cat: any) => ({
        name: cat.name,
        value: products.filter((p: any) => p.category?.id === cat.id).length,
      }))

      setStats({
        totalProducts: products.length,
        totalValue,
        lowStockCount: lowStockProducts.length,
        totalCategories: categories.length,
        recentTransactions: transactions.slice(0, 5),
        categoryDistribution,
        lowStockProducts: lowStockProducts.slice(0, 5),
      })
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = [
    "oklch(0.65 0.25 265)",
    "oklch(0.60 0.20 180)",
    "oklch(0.70 0.18 85)",
    "oklch(0.55 0.22 25)",
    "oklch(0.75 0.15 140)",
  ]

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your inventory system</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Across all categories</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats?.totalValue.toFixed(2) || "0.00"}</div>
                <p className="text-xs text-muted-foreground mt-1">Inventory worth</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Items</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{stats?.lowStockCount || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Need restocking</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalCategories || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Product categories</p>
              </CardContent>
            </Card>
          </div>

          {/* Low Stock Alert */}
          {stats && stats.lowStockCount > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You have {stats.lowStockCount} product(s) with low stock. Consider restocking soon.
              </AlertDescription>
            </Alert>
          )}

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Products by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats?.categoryDistribution || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats?.categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Low Stock Products */}
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Products</CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.lowStockProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No low stock products</p>
                ) : (
                  <div className="space-y-3">
                    {stats?.lowStockProducts.map((product: any) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-destructive">{product.quantity}</p>
                          <p className="text-xs text-muted-foreground">in stock</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.recentTransactions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent transactions</p>
              ) : (
                <div className="space-y-4">
                  {stats?.recentTransactions.map((transaction: any) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between border-b border-border pb-3 last:border-0"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{transaction.product?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.action_type} by {transaction.user?.username}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-bold ${transaction.action_type === "add" ? "text-green-500" : "text-red-500"}`}
                        >
                          {transaction.action_type === "add" ? "+" : "-"}
                          {transaction.quantity}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
