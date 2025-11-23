"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CustomersTable } from "@/features/customers/components/customers-table"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"
import type { Customer } from "@/types/api.types"

export default function CustomersPage() {
  const { token, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (token) {
      fetchCustomers()
    }
  }, [token, isAuthenticated, authLoading, router])

  async function fetchCustomers() {
    try {
      setIsLoading(true)
      const data = await api.getCustomers(token!)
      setCustomers(Array.isArray(data) ? data : data.items || [])
    } catch (err) {
      console.error("Error fetching customers:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    router.push("/customers/new")
  }

  const handleSelect = () => {
    // Could implement customer detail page later
  }

  if (authLoading || isLoading) {
    return <div className="p-4 text-slate-300">Cargando...</div>
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <CustomersTable customers={customers} onCreate={handleCreate} onSelect={handleSelect} />
    </div>
  )
}
