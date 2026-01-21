"use client"

import { useMemo, useState } from "react"
import type { Company } from "@/types/api.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye, Pencil, Trash2 } from "lucide-react"

export type CompaniesTableProps = {
  companies: Company[]
  onCreate: () => void
  onView: (companyId: string) => void
  onEdit: (companyId: string) => void
  onDelete: (companyId: string) => void
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

export function CompaniesTable({ companies, onCreate, onView, onEdit, onDelete }: CompaniesTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const term = searchTerm.toLowerCase()
      return (
        company.name.toLowerCase().includes(term) ||
        (company.nit?.toLowerCase().includes(term) ?? false) ||
        (company.email?.toLowerCase().includes(term) ?? false)
      )
    })
  }, [companies, searchTerm])

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-background">Companias</h1>
            <p className="text-sm text-muted-background">Administra tus companias registradas.</p>
          </div>
          <Button
            onClick={onCreate}
            className="bg-[#44C6D1] hover:bg-[#3ba8b0] text-slate-950 font-semibold w-full sm:w-auto"
          >
            Nueva compania
          </Button>
        </div>

        <Input
          placeholder="Buscar por nombre, NIT o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-800 border-slate-700 text-background placeholder:text-slate-500"
        />
      </div>

      <ScrollArea className="w-full border border-slate-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-800">
            <TableRow className="border-slate-700 hover:bg-slate-800">
              <TableHead className="text-[#44C6D1] font-semibold">Nombre</TableHead>
              <TableHead className="text-[#44C6D1] font-semibold">NIT</TableHead>
              <TableHead className="text-[#44C6D1] font-semibold hidden md:table-cell">Email</TableHead>
              <TableHead className="text-[#44C6D1] font-semibold hidden lg:table-cell">Telefono</TableHead>
              <TableHead className="text-[#44C6D1] font-semibold hidden lg:table-cell">Ciudad</TableHead>
              <TableHead className="text-[#44C6D1] font-semibold hidden xl:table-cell">Actualizado</TableHead>
              <TableHead className="text-[#44C6D1] font-semibold text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <TableRow
                  key={company.id}
                  onClick={() => onView(company.id)}
                  className="border-slate-700 cursor-pointer hover:bg-slate-800/50 transition-colors"
                >
                  <TableCell className="font-medium text-background">{company.name}</TableCell>
                  <TableCell className="text-muted-background">{company.nit || "-"}</TableCell>
                  <TableCell className="text-muted-background hidden md:table-cell">{company.email || "-"}</TableCell>
                  <TableCell className="text-muted-background hidden lg:table-cell">{company.phone || "-"}</TableCell>
                  <TableCell className="text-muted-background hidden lg:table-cell">{company.city || "-"}</TableCell>
                  <TableCell className="text-muted-background hidden xl:table-cell">
                    {formatDate(company.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(event) => {
                          event.stopPropagation()
                          onView(company.id)
                        }}
                        className="text-[#44C6D1] hover:text-[#3ba8b0] hover:bg-slate-700"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(event) => {
                          event.stopPropagation()
                          onEdit(company.id)
                        }}
                        className="text-[#44C6D1] hover:text-[#3ba8b0] hover:bg-slate-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(event) => {
                          event.stopPropagation()
                          onDelete(company.id)
                        }}
                        className="text-[#F8333C] hover:text-[#F8333C] hover:bg-red-950/40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-slate-700">
                <TableCell colSpan={7} className="text-center text-muted-background py-8">
                  No se encontraron companias
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      <div className="text-sm text-muted-background">
        Mostrando {filteredCompanies.length} de {companies.length} compania
        {companies.length !== 1 ? "s" : ""}
      </div>
    </div>
  )
}
