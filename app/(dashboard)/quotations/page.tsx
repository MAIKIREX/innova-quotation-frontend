"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { QuotationsTable } from "@/features/quotations/components/quotations-table"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"
import type { Quotation } from "@/types/api.types"

export default function QuotationsPage() {
  const { token, isLoading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (token) {
      fetchQuotations()
    }
  }, [token, isAuthenticated, authLoading, router])

  async function fetchQuotations() {
    try {
      setIsLoading(true)
      const data = await api.getQuotations(token!)
      setQuotations(Array.isArray(data) ? data : data.items || [])
    } catch (err) {
      console.error("Error fetching quotations:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    router.push("/quotations/new")
  }

  const handleSelect = (quotationId: string) => {
    router.push(`/quotations/${quotationId}`)
  }

  if (authLoading || isLoading) {
    return <div className="p-4 text-slate-300">Cargando...</div>
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <QuotationsTable quotations={quotations} onCreate={handleCreate} onSelect={handleSelect} />
    </div>
  )
}
