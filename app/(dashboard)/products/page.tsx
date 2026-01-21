"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Product } from "@/types/api.types"
import { ProductsTable } from "@/features/products/components/products-table"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"

export default function ProductsPage() {
  const { token, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await api.getProducts(token!)
      setProducts(Array.isArray(data) ? data : data.items || [])
    } catch (err) {
      console.error("Error fetching products:", err)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (token) {
      fetchProducts()
    }
  }, [token, isAuthenticated, authLoading, router, fetchProducts])

  const handleCreate = () => {
    router.push("/products/new")
  }

  const handleEdit = (productId: string) => {
    router.push(`/products/${productId}/edit`)
  }

  if (authLoading || isLoading) {
    return <div className="p-4 text-slate-300">Cargando...</div>
  }

  return (
    <div className="p-4 md:p-6">
      <ProductsTable products={products} onCreate={handleCreate} onEdit={handleEdit} />
    </div>
  )
}
