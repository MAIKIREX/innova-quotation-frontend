"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Company } from "@/types/api.types"
import { CompaniesTable } from "@/features/companies/components/companies-table"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"

export default function CompaniesPage() {
  const { token, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchCompanies = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await api.getCompanies(token!)
      setCompanies(Array.isArray(data) ? data : data.items || [])
    } catch (err) {
      console.error("Error fetching companies:", err)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (token) {
      fetchCompanies()
    }
  }, [token, isAuthenticated, authLoading, router, fetchCompanies])

  const handleCreate = () => {
    router.push("/companies/new")
  }

  const handleView = (companyId: string) => {
    router.push(`/companies/${companyId}`)
  }

  const handleEdit = (companyId: string) => {
    router.push(`/companies/${companyId}/edit`)
  }

  const handleDelete = async (companyId: string) => {
    if (!token) return
    const confirmed = window.confirm("Deseas eliminar esta compania?")
    if (!confirmed) return

    try {
      await api.deleteCompany(companyId, token)
      await fetchCompanies()
    } catch (error) {
      console.error("Error deleting company:", error)
    }
  }

  if (authLoading || isLoading) {
    return <div className="p-4 text-[#A7A2A9]">Cargando...</div>
  }

  return (
    <div className="p-4 md:p-6">
      <CompaniesTable
        companies={companies}
        onCreate={handleCreate}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
