"use client"

import { useState, useMemo } from "react"
import type { Quotation, QuotationStatus } from "@/types/api.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export type QuotationsTableProps = {
  quotations: Quotation[]
  onCreate: () => void
  onSelect: (quotationId: string) => void
}

const statusMap: Record<QuotationStatus, { label: string; color: string }> = {
  draft: { label: "Borrador", color: "bg-slate-700 text-slate-100" },
  sent: { label: "Enviada", color: "bg-blue-900 text-blue-100 border border-blue-700" },
  accepted: { label: "Aceptada", color: "bg-green-900 text-green-100" },
  rejected: { label: "Rechazada", color: "bg-red-900 text-red-100" },
  cancelled: { label: "Cancelada", color: "bg-red-950 text-red-200" },
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

const formatCurrency = (amount: string, currency: string): string => {
  const num = Number.parseFloat(amount)
  return `${num.toFixed(2)} ${currency}`
}

export function QuotationsTable({ quotations, onCreate, onSelect }: QuotationsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<QuotationStatus | "all">("all")

  const filteredQuotations = useMemo(() => {
    return quotations.filter((q) => {
      const matchesSearch =
        q.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.number.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || q.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [quotations, searchTerm, statusFilter])

  return (
    <div className="w-full space-y-4">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-background">Proformas</h1>
            <p className="text-sm text-muted-background">Gestiona y consulta tus proformas.</p>
          </div>
          <Button
            onClick={onCreate}
            className="bg-[#44C6D1] hover:bg-[#3ba8b0] text-slate-950 font-semibold w-full sm:w-auto"
          >
            Nueva proforma
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Buscar por cliente o número…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-slate-800 border-slate-700 text-background placeholder:text-slate-500"
          />
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as QuotationStatus | "all")}>
            <SelectTrigger className="w-full sm:w-48 bg-slate-800 border-slate-700 text-background">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="draft">Borrador</SelectItem>
              <SelectItem value="sent">Enviadas</SelectItem>
              <SelectItem value="accepted">Aceptadas</SelectItem>
              <SelectItem value="rejected">Rechazadas</SelectItem>
              <SelectItem value="cancelled">Canceladas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <ScrollArea className="w-full border border-slate-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-800">
            <TableRow className="border-slate-700 hover:bg-slate-800">
              <TableHead className="text-[#44C6D1] font-semibold">Número</TableHead>
              <TableHead className="text-[#44C6D1] font-semibold">Cliente</TableHead>
              <TableHead className="text-[#44C6D1] font-semibold hidden md:table-cell">Empresa</TableHead>
              <TableHead className="text-[#44C6D1] font-semibold hidden lg:table-cell">Emisión</TableHead>
              <TableHead className="text-[#44C6D1] font-semibold">Estado</TableHead>
              <TableHead className="text-[#44C6D1] font-semibold text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuotations.length > 0 ? (
              filteredQuotations.map((quotation) => (
                <TableRow
                  key={quotation.id}
                  onClick={() => onSelect(quotation.id)}
                  className="border-slate-700 cursor-pointer hover:bg-slate-800/50 transition-colors hover:border-l-4 hover:border-l-[#44C6D1]"
                >
                  <TableCell className="font-medium text-background">{quotation.number}</TableCell>
                  <TableCell className="text-white">{quotation.customer.name}</TableCell>
                  <TableCell className="text-white/80 hidden md:table-cell">{quotation.company.name}</TableCell>
                  <TableCell className="text-white/80 hidden lg:table-cell">
                    {formatDate(quotation.issueDate)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        statusMap[quotation.status as QuotationStatus]?.color || "bg-slate-700 text-slate-100"
                      }`}
                    >
                      {statusMap[quotation.status as QuotationStatus]?.label || quotation.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-[#44C6D1]">
                    {formatCurrency(quotation.totalAmount, quotation.currency)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-slate-700">
                <TableCell colSpan={6} className="text-center text-muted-background py-8">
                  No se encontraron proformas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Results count */}
      <div className="text-sm text-muted-background">
        Mostrando {filteredQuotations.length} de {quotations.length} proforma
        {quotations.length !== 1 ? "s" : ""}
      </div>
    </div>
  )
}
