"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import type { CreateProductPayload } from "@/types/api.types"
import { ProductForm } from "@/features/products/components/product-form"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const { token } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [initialValues, setInitialValues] = useState<CreateProductPayload | null>(null)

  useEffect(() => {
    if (!token || !productId) return

    const fetchProduct = async () => {
      try {
        const product = await api.getProduct(productId, token)
        // Adapt product to CreateProductPayload if necessary, or just pass it if compatible
        // Assuming the API returns a Product which has the fields of CreateProductPayload
        setInitialValues({
          name: product.name,
          description: product.description,
          unit: product.unit,
          costReference: Number(product.costReference), // Ensure number
          priceReference: Number(product.priceReference), // Ensure number
          active: product.active,
        })
      } catch (error) {
        console.error("Error fetching product:", error)
        setErrorMessage("No se pudo cargar el producto.")
      } finally {
        setIsFetching(false)
      }
    }

    fetchProduct()
  }, [productId, token])

  const handleSubmit = async (values: CreateProductPayload) => {
    setIsLoading(true)
    setErrorMessage(null)

    if (!token) {
      setErrorMessage("No estás autenticado")
      setIsLoading(false)
      return
    }

    try {
      await api.updateProduct(productId, values, token)
      router.push("/products")
    } catch (error) {
      setErrorMessage("Error al actualizar el producto. Intenta de nuevo.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return <div className="p-6">Cargando producto...</div>
  }

  if (!initialValues) {
    return <div className="p-6 text-red-500">No se encontró el producto o hubo un error.</div>
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-background">Editar producto</h1>
        <p className="text-muted-background mt-2">Actualiza la información del producto.</p>
      </div>
      <ProductForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </div>
  )
}
