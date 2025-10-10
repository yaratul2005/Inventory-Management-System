"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TransactionDialog } from "@/components/transaction-dialog"
import { useAuth } from "@/lib/auth-context"
import api from "@/lib/api"
import { Plus, Search, TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Transaction {
  id: number
  product: {
    id: number
    name: string
    sku: string
  }
  user: {
    id: number
    username: string
  }
  action_type: string
  quantity: number
  notes: string
  timestamp: string
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const { isStaff } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchTransactions()
  }, [])

  useEffect(() => {
    let filtered = transactions.filter(
      (transaction) =>
        transaction.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.user.username.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.action_type === filterType)
    }

    setFilteredTransactions(filtered)
  }, [searchQuery, filterType, transactions])

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions")
      setTransactions(response.data)
      setFilteredTransactions(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDialogClose = (refresh?: boolean) => {
    setDialogOpen(false)
    if (refresh) {
      fetchTransactions()
    }
  }

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "add":
        return <TrendingUp className="h-4 w-4" />
      case "remove":
        return <TrendingDown className="h-4 w-4" />
      case "update":
        return <RefreshCw className="h-4 w-4" />
      default:
        return null
    }
  }

  const getActionBadge = (actionType: string) => {
    switch (actionType) {
      case "add":
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
            {getActionIcon(actionType)}
            <span className="ml-1">Add</span>
          </Badge>
        )
      case "remove":
        return (
          <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
            {getActionIcon(actionType)}
            <span className="ml-1">Remove</span>
          </Badge>
        )
      case "update":
        return (
          <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            {getActionIcon(actionType)}
            <span className="ml-1">Update</span>
          </Badge>
        )
      default:
        return <Badge>{actionType}</Badge>
    }
  }

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
              <p className="text-muted-foreground">View and manage stock movements</p>
            </div>
            {isStaff && (
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Transaction
              </Button>
            )}
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by product, SKU, or user..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="add">Add</SelectItem>
                    <SelectItem value="remove">Remove</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Product</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Quantity</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Notes</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-muted-foreground">
                          No transactions found
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="font-medium">{transaction.product.name}</div>
                            <div className="text-xs text-muted-foreground">{transaction.product.sku}</div>
                          </td>
                          <td className="py-3 px-4">{getActionBadge(transaction.action_type)}</td>
                          <td className="py-3 px-4 text-right">
                            <span
                              className={`font-bold ${
                                transaction.action_type === "add"
                                  ? "text-green-500"
                                  : transaction.action_type === "remove"
                                    ? "text-red-500"
                                    : "text-blue-500"
                              }`}
                            >
                              {transaction.action_type === "add"
                                ? "+"
                                : transaction.action_type === "remove"
                                  ? "-"
                                  : ""}
                              {transaction.quantity}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm">{transaction.user.username}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground max-w-xs truncate">
                            {transaction.notes || "-"}
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            <div>{new Date(transaction.timestamp).toLocaleDateString()}</div>
                            <div className="text-xs">{new Date(transaction.timestamp).toLocaleTimeString()}</div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <TransactionDialog open={dialogOpen} onClose={handleDialogClose} />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
