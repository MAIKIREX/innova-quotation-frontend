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
    if (authLoading) return

    if (!isAuthenticated || !token) {
      router.push("/login")
      return
    }

    fetchQuotations(token)
  }, [token, isAuthenticated, authLoading, router])

  useEffect(() => {
    if (!token) return

    const handleFocus = () => fetchQuotations(token)
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchQuotations(token)
      }
    }

    window.addEventListener("focus", handleFocus)
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      window.removeEventListener("focus", handleFocus)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [token])

  async function fetchQuotations(activeToken: string) {
    try {
      setIsLoading(true)
      const data = await api.getQuotations(activeToken)
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
