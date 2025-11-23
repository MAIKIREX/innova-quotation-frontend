"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import type { CreateProductPayload } from "@/types/api.types"
import { ProductForm } from "@/features/products/components/product-form"

// Mock product for editing
const mockProduct: CreateProductPayload = {
  name: "Consultoría Estratégica",
  description: "Servicios de consultoría empresarial y estrategia",
  unit: "h",
  costReference: 150,
  priceReference: 300,
  active: true,
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (values: CreateProductPayload) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      console.log("Updating product", productId, values)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success
      router.push("/products")
    } catch (error) {
      setErrorMessage("Error al actualizar el producto. Intenta de nuevo.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Editar producto</h1>
        <p className="text-muted-foreground mt-2">Actualiza la información del producto.</p>
      </div>
      <ProductForm
        initialValues={mockProduct}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </div>
  )
}
