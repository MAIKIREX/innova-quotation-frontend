"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import type { CreateCompanyPayload } from "@/types/api.types"
import { CompanyForm } from "@/features/companies/components/company-form"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"

export default function EditCompanyPage() {
  const router = useRouter()
  const params = useParams()
  const companyId = params.id as string
  const { token } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [initialValues, setInitialValues] = useState<CreateCompanyPayload | null>(null)

  useEffect(() => {
    if (!token || !companyId) return

    const fetchCompany = async () => {
      try {
        const company = await api.getCompany(companyId, token)
        setInitialValues({
          name: company.name,
          nit: company.nit,
          address: company.address,
          phone: company.phone,
          email: company.email,
          city: company.city,
          country: company.country,
          logoUrl: company.logoUrl,
        })
      } catch (error) {
        console.error("Error fetching company:", error)
        setErrorMessage("No se pudo cargar la compania.")
      } finally {
        setIsFetching(false)
      }
    }

    fetchCompany()
  }, [companyId, token])

  const handleSubmit = async (values: CreateCompanyPayload) => {
    setIsLoading(true)
    setErrorMessage(null)

    if (!token) {
      setErrorMessage("No estas autenticado")
      setIsLoading(false)
      return
    }

    try {
      await api.updateCompany(companyId, values, token)
      router.push("/companies")
    } catch (error) {
      setErrorMessage("Error al actualizar la compania. Intenta de nuevo.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return <div className="p-6 text-[#A7A2A9]">Cargando compania...</div>
  }

  if (!initialValues) {
    return <div className="p-6 text-[#F8333C]">No se encontro la compania o hubo un error.</div>
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#F4F7F5]">Editar compania</h1>
        <p className="text-[#A7A2A9] mt-2">Actualiza la informacion de la compania.</p>
      </div>
      <CompanyForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </div>
  )
}
