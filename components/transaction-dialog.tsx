"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api"

interface Product {
  id: number
  name: string
  sku: string
  quantity: number
}

interface TransactionDialogProps {
  open: boolean
  onClose: (refresh?: boolean) => void
}

export function TransactionDialog({ open, onClose }: TransactionDialogProps) {
  const [formData, setFormData] = useState({
    product_id: "",
    action_type: "add",
    quantity: "",
    notes: "",
  })
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      fetchProducts()
      setFormData({
        product_id: "",
        action_type: "add",
        quantity: "",
        notes: "",
      })
      setSelectedProduct(null)
    }
  }, [open])

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products")
      setProducts(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      })
    }
  }

  const handleProductChange = (productId: string) => {
    setFormData({ ...formData, product_id: productId })
    const product = products.find((p) => p.id.toString() === productId)
    setSelectedProduct(product || null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const quantity = Number.parseInt(formData.quantity)

    if (formData.action_type === "remove" && selectedProduct && quantity > selectedProduct.quantity) {
      toast({
        title: "Error",
        description: `Cannot remove ${quantity} items. Only ${selectedProduct.quantity} available in stock.`,
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      const payload = {
        product_id: Number.parseInt(formData.product_id),
        action_type: formData.action_type,
        quantity: quantity,
        notes: formData.notes,
      }

      await api.post("/transactions", payload)
      toast({
        title: "Success",
        description: "Transaction recorded successfully",
      })

      onClose(true)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create transaction",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Product</Label>
            <Select value={formData.product_id} onValueChange={handleProductChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name} ({product.sku}) - Stock: {product.quantity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="action_type">Action Type</Label>
            <Select
              value={formData.action_type}
              onValueChange={(value) => setFormData({ ...formData, action_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">Add Stock</SelectItem>
                <SelectItem value="remove">Remove Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
            {selectedProduct && formData.action_type === "remove" && (
              <p className="text-xs text-muted-foreground">Available stock: {selectedProduct.quantity}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Optional notes about this transaction..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Recording..." : "Record Transaction"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
