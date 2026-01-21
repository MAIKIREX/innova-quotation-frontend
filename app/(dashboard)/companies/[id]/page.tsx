"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Company } from "@/types/api.types"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CompanyDetailPage() {
  const params = useParams()
  const companyId = params.id as string
  const router = useRouter()
  const { token, isAuthenticated, isLoading: authLoading } = useAuth()

  const [company, setCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated || !token) {
      router.push("/login")
      return
    }
    if (!companyId) return

    const fetchCompany = async () => {
      try {
        const data = await api.getCompany(companyId, token)
        setCompany(data)
      } catch (error) {
        console.error("Error fetching company:", error)
        setErrorMessage("No se pudo cargar la compania.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompany()
  }, [companyId, token, isAuthenticated, authLoading, router])

  const handleDelete = async () => {
    if (!token || !companyId) return
    const confirmed = window.confirm("Deseas eliminar esta compania?")
    if (!confirmed) return

    try {
      await api.deleteCompany(companyId, token)
      router.push("/companies")
    } catch (error) {
      console.error("Error deleting company:", error)
      setErrorMessage("No se pudo eliminar la compania.")
    }
  }

  if (isLoading) {
    return <div className="p-6 text-[#A7A2A9]">Cargando compania...</div>
  }

  if (!company) {
    return <div className="p-6 text-[#F8333C]">No se encontro la compania.</div>
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#F4F7F5]">{company.name}</h1>
          <p className="text-[#A7A2A9] mt-1">Detalles de la compania.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            className="border border-[#3C6E71]/40 text-[#A7A2A9] hover:text-[#F4F7F5]"
            onClick={() => router.push("/companies")}
          >
            Volver
          </Button>
          <Button
            className="bg-[#3C6E71] hover:bg-[#345c5f] text-[#F4F7F5]"
            onClick={() => router.push(`/companies/${companyId}/edit`)}
          >
            Editar
          </Button>
          <Button
            variant="ghost"
            className="border border-[#F8333C]/40 text-[#F8333C] hover:bg-[#F8333C]/10"
            onClick={handleDelete}
          >
            Eliminar
          </Button>
        </div>
      </div>

      {errorMessage && <div className="text-[#F8333C]">{errorMessage}</div>}

      <Card className="bg-[#0b0b0b] border-[#3C6E71]/40">
        <CardHeader>
          <CardTitle className="text-[#F4F7F5]">Informacion general</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-[#A7A2A9]">NIT</p>
              <p className="text-[#F4F7F5]">{company.nit || "-"}</p>
            </div>
            <div>
              <p className="text-[#A7A2A9]">Email</p>
              <p className="text-[#F4F7F5]">{company.email || "-"}</p>
            </div>
            <div>
              <p className="text-[#A7A2A9]">Telefono</p>
              <p className="text-[#F4F7F5]">{company.phone || "-"}</p>
            </div>
            <div>
              <p className="text-[#A7A2A9]">Ciudad</p>
              <p className="text-[#F4F7F5]">{company.city || "-"}</p>
            </div>
            <div>
              <p className="text-[#A7A2A9]">Pais</p>
              <p className="text-[#F4F7F5]">{company.country || "-"}</p>
            </div>
            <div>
              <p className="text-[#A7A2A9]">Direccion</p>
              <p className="text-[#F4F7F5]">{company.address || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-[#A7A2A9]">Logo</p>
              <p className="text-[#F4F7F5]">{company.logoUrl || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
