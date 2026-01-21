"use client"

import { useState, useMemo } from "react"
import type { Customer } from "@/types/api.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

export type CustomersTableProps = {
  customers: Customer[]
  onCreate: () => void
  onSelect: (customerId: string) => void
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

export function CustomersTable({ customers, onCreate, onSelect }: CustomersTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.nitCi && customer.nitCi.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    })
  }, [customers, searchTerm])

  return (
    <div className="w-full space-y-4">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-background">Clientes</h1>
            <p className="text-sm text-muted-background">Administra tus clientes.</p>
          </div>
          <Button
            onClick={onCreate}
            className="bg-[#44C6D1] hover:bg-[#3ba8b0] text-slate-950 font-semibold w-full sm:w-auto"
          >
            Nuevo cliente
          </Button>
        </div>

        {/* Search Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Buscar por nombre o NIT/CI…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-slate-800 border-slate-700 text-background placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Table */}
      <ScrollArea className="w-full border border-slate-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-800">
            <TableRow className="border-slate-700 hover:bg-slate-800">
              <TableHead className="text-[#44C6D1] font-semibold">Nombre</TableHead>
              <TableHead className="text-[#44C6D1] font-semibold">NIT/CI</TableHead>
              <TableHead className="text-[#44C6D1] font-semibold hidden md:table-cell">Email</TableHead>
              <TableHead className="text-[#44C6D1] font-semibold hidden lg:table-cell">Teléfono</TableHead>
              <TableHead className="text-[#44C6D1] font-semibold hidden lg:table-cell">Dirección</TableHead>
              <TableHead className="text-[#44C6D1] font-semibold hidden xl:table-cell">Última actualización</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow
                  key={customer.id}
                  onClick={() => onSelect(customer.id)}
                  className="border-slate-700 cursor-pointer hover:bg-slate-800/50 transition-colors hover:border-l-4 hover:border-l-[#44C6D1]"
                >
                  <TableCell className="font-medium text-background">{customer.name}</TableCell>
                  <TableCell className="text-muted-background">{customer.nitCi || "-"}</TableCell>
                  <TableCell className="text-muted-background hidden md:table-cell">{customer.email || "-"}</TableCell>
                  <TableCell className="text-muted-background hidden lg:table-cell">{customer.phone || "-"}</TableCell>
                  <TableCell className="text-muted-background hidden lg:table-cell">
                    {customer.address || "-"}
                  </TableCell>
                  <TableCell className="text-muted-background hidden xl:table-cell">
                    {formatDate(customer.updatedAt)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-slate-700">
                <TableCell colSpan={6} className="text-center text-muted-background py-8">
                  No se encontraron clientes
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Results count */}
      <div className="text-sm text-muted-background">
        Mostrando {filteredCustomers.length} de {customers.length} cliente{customers.length !== 1 ? "s" : ""}
      </div>
    </div>
  )
}
