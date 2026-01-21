"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import type { CreateCustomerPayload } from "@/types/api.types"
import { CustomerForm } from "@/features/customers/components/customer-form"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"

export default function EditCustomerPage() {
  const router = useRouter()
  const params = useParams()
  const customerId = params.id as string
  const { token } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [initialValues, setInitialValues] = useState<CreateCustomerPayload | null>(null)

  useEffect(() => {
    if (!token || !customerId) return

    const fetchCustomer = async () => {
      try {
        const customer = await api.getCustomer(customerId, token)
        setInitialValues({
          name: customer.name,
          nitCi: customer.nitCi,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          notes: customer.notes,
        })
      } catch (error) {
        console.error("Error fetching customer:", error)
        setErrorMessage("No se pudo cargar el cliente.")
      } finally {
        setIsFetching(false)
      }
    }

    fetchCustomer()
  }, [customerId, token])

  const handleSubmit = async (values: CreateCustomerPayload) => {
    setIsLoading(true)
    setErrorMessage(null)

    if (!token) {
      setErrorMessage("No estás autenticado")
      setIsLoading(false)
      return
    }

    try {
      await api.updateCustomer(customerId, values, token)
      router.push("/customers")
    } catch (error) {
      setErrorMessage("Error al actualizar el cliente. Intenta de nuevo.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return <div className="p-6 text-background">Cargando cliente...</div>
  }

  if (!initialValues) {
    return <div className="p-6 text-red-500">No se encontró el cliente o hubo un error.</div>
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-background">Editar cliente</h1>
        <p className="text-muted-background mt-2">Actualiza la información del cliente.</p>
      </div>
      <CustomerForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </div>
  )
}
