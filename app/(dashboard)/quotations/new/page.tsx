"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { QuotationForm } from "@/features/quotations/components/quotation-form"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"
import type { Company, CreateQuotationPayload, Customer } from "@/types/api.types"

export default function NewQuotationPage() {
  const { token, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (token) {
      loadData()
    }
  }, [token, isAuthenticated, authLoading, router])

  async function loadData() {
    try {
      setIsLoading(true)
      const [companiesData, customersData] = await Promise.all([api.getCompanies(token!), api.getCustomers(token!)])
      setCompanies(Array.isArray(companiesData) ? companiesData : companiesData.items || [])
      setCustomers(Array.isArray(customersData) ? customersData : customersData.items || [])
    } catch (err) {
      console.error("Error loading data:", err)
      setErrorMessage("Error al cargar datos")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (values: CreateQuotationPayload) => {
    try {
      setIsLoading(true)
      setErrorMessage(null)
      await api.createQuotation(values, token!)
      router.push("/quotations")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al crear proforma"
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || !companies.length) {
    return <div className="p-4 text-slate-300">Cargando...</div>
  }

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Nueva proforma</h1>
        <p className="mt-1 text-gray-400">Crea una nueva proforma completando el formulario a continuación</p>
      </div>

      <QuotationForm
        companies={companies}
        customers={customers}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </div>
  )
}
