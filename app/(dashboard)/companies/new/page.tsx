"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { CreateCompanyPayload } from "@/types/api.types"
import { CompanyForm } from "@/features/companies/components/company-form"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"

export default function NewCompanyPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { token } = useAuth()

  const handleSubmit = async (values: CreateCompanyPayload) => {
    setIsLoading(true)
    setErrorMessage(null)

    if (!token) {
      setErrorMessage("No estas autenticado")
      setIsLoading(false)
      return
    }

    try {
      await api.createCompany(values, token)
      router.push("/companies")
    } catch (error) {
      setErrorMessage("Error al crear la compania. Intenta de nuevo.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-6 ">
      <div className="mb-6">
        <h1 className="text-3xl font-light text-background">Nueva compania</h1>
        <p className="text-muted-background mt-2">Crea una nueva compania en el sistema.</p>
      </div>
      <CompanyForm onSubmit={handleSubmit} isLoading={isLoading} errorMessage={errorMessage} />
    </div>
  )
}
