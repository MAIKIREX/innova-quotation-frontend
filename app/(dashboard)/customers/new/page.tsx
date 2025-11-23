"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CustomerForm } from "@/features/customers/components/customer-form"
import type { CreateCustomerPayload } from "@/types/api.types"

export default function NewCustomerPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (values: CreateCustomerPayload) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      // Simulate API call
      console.log("Creating customer:", values)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // On success, navigate to customers list
      router.push("/customers")
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Ocurrió un error al crear el cliente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Nuevo cliente</h1>
        <p className="text-sm text-muted-foreground mt-1">Crea un nuevo cliente en el sistema.</p>
      </div>
      <CustomerForm onSubmit={handleSubmit} isLoading={isLoading} errorMessage={errorMessage} />
    </div>
  )
}
