"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { CreateProductPayload } from "@/types/api.types"
import { ProductForm } from "@/features/products/components/product-form"

export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (values: CreateProductPayload) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      console.log("Creating product", values)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success
      router.push("/products")
    } catch (error) {
      setErrorMessage("Error al crear el producto. Intenta de nuevo.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Nuevo producto</h1>
        <p className="text-muted-foreground mt-2">Crea un nuevo producto o servicio en el sistema.</p>
      </div>
      <ProductForm onSubmit={handleSubmit} isLoading={isLoading} errorMessage={errorMessage} />
    </div>
  )
}
