"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CustomerForm } from "@/features/customers/components/customer-form"
import type { CreateCustomerPayload } from "@/types/api.types"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"

export default function NewCustomerPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { token } = useAuth()

  const handleSubmit = async (values: CreateCustomerPayload) => {
    setIsLoading(true)
    setErrorMessage(null)

    if (!token) {
      setErrorMessage("No estás autenticado")
      setIsLoading(false)
      return
    }

    try {
      await api.createCustomer(values, token)
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
        <h1 className="text-2xl font-bold text-background">Nuevo cliente</h1>
        <p className="text-sm text-muted-background mt-1">Crea un nuevo cliente en el sistema.</p>
      </div>
      <CustomerForm onSubmit={handleSubmit} isLoading={isLoading} errorMessage={errorMessage} />
    </div>
  )
}
