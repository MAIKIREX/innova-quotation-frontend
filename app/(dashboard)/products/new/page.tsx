"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { CreateProductPayload } from "@/types/api.types"
import { ProductForm } from "@/features/products/components/product-form"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"

export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { token } = useAuth()

  const handleSubmit = async (values: CreateProductPayload) => {
    setIsLoading(true)
    setErrorMessage(null)

    if (!token) {
      setErrorMessage("No estás autenticado")
      setIsLoading(false)
      return
    }

    try {
      await api.createProduct(values, token)
      router.push("/products")
    } catch (error) {
      setErrorMessage("Error al crear el producto. Intenta de nuevo.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-background">Nuevo producto</h1>
        <p className="text-muted-background mt-2">Crea un nuevo producto o servicio en el sistema.</p>
      </div>
      <div className="max-w-2xl mx-auto">
        <ProductForm onSubmit={handleSubmit} isLoading={isLoading} errorMessage={errorMessage} />
      </div>
    </div>
  )
}
