"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { QuotationForm } from "@/features/quotations/components/quotation-form"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"
import type { Company, CreateQuotationPayload, Customer, Quotation } from "@/types/api.types"

export default function EditQuotationPage() {
  const params = useParams()
  const quotationId = params.id as string
  const router = useRouter()
  const { token, isAuthenticated, isLoading: authLoading } = useAuth()

  const [companies, setCompanies] = useState<Company[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [quotation, setQuotation] = useState<Quotation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (!token) return

    const loadData = async () => {
      try {
        setIsLoading(true)
        const [companiesData, customersData, quotationData] = await Promise.all([
          api.getCompanies(token),
          api.getCustomers(token),
          api.getQuotation(quotationId, token),
        ])
        setCompanies(Array.isArray(companiesData) ? companiesData : companiesData.items || [])
        setCustomers(Array.isArray(customersData) ? customersData : customersData.items || [])
        setQuotation(quotationData)
      } catch (err) {
        console.error("Error loading data:", err)
        setErrorMessage(err instanceof Error ? err.message : "Error al cargar datos")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [authLoading, isAuthenticated, quotationId, router, token])

  const initialValues: CreateQuotationPayload | undefined = useMemo(() => {
    if (!quotation) return undefined

    const normalizeDate = (value?: string | null) => {
      if (!value) return ""
      return value.split("T")[0] || value
    }

    return {
      companyId: quotation.companyId,
      customerId: quotation.customerId,
      number: quotation.number,
      issueDate: normalizeDate(quotation.issueDate) || new Date().toISOString().split("T")[0],
      dueDate: normalizeDate(quotation.dueDate),
      currency: quotation.currency,
      notes: quotation.notes || "",
      warranty: quotation.warranty || "",
      paymentTerms: quotation.paymentTerms || "",
      deliveryPlace: quotation.deliveryPlace || "",
      subtotalAmount: Number(quotation.subtotalAmount) || undefined,
      totalAmount: Number(quotation.totalAmount) || undefined,
      totalCost: Number(quotation.totalCost) || undefined,
      items: (quotation.items || []).map((item) => ({
        productId: item.productId,
        itemDescription: item.itemDescription,
        quantity: Number(item.quantity) || 0,
        costUnit: Number(item.costUnit) || 0,
        marginPercent: Number(item.marginPercent) || 0,
        marginAmount: Number(item.marginAmount) || 0,
        saleUnit: Number(item.saleUnit) || 0,
        totalCost: Number(item.totalCost) || 0,
        totalSale: Number(item.totalSale) || 0,
        order: item.order,
      })),
    }
  }, [quotation])

  const handleSubmit = async (values: CreateQuotationPayload) => {
    try {
      if (!token) throw new Error("Sesión no encontrada. Vuelve a iniciar sesión.")
      setIsLoading(true)
      setErrorMessage(null)
      await api.updateQuotation(quotationId, values, token)
      router.push(`/quotations/${quotationId}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al actualizar proforma"
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || isLoading || !initialValues || !companies.length) {
    return <div className="p-4 text-slate-300">Cargando...</div>
  }

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Editar proforma {quotation?.number}</h1>
        <p className="mt-1 text-gray-400">Actualiza la información y guarda los cambios.</p>
      </div>

      <QuotationForm
        initialValues={initialValues}
        companies={companies}
        customers={customers}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </div>
  )
}
