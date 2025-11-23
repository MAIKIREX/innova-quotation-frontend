"use client"

import { useState, useMemo } from "react"
import type { Product } from "@/types/api.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Pencil } from "lucide-react"

export type ProductsTableProps = {
  products: Product[]
  onCreate: () => void
  onEdit: (productId: string) => void
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

export function ProductsTable({ products, onCreate, onEdit }: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      return matchesSearch
    })
  }, [products, searchTerm])

  return (
    <div className="w-full space-y-4">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Productos</h1>
            <p className="text-sm text-muted-foreground">Administra tus productos y servicios.</p>
          </div>
          <Button
            onClick={onCreate}
            className="bg-[#44C6D1] hover:bg-[#3ba8b0] text-slate-950 font-semibold w-full sm:w-auto"
          >
            Nuevo producto
          </Button>
        </div>

        {/* Search Filter */}
        <Input
          placeholder="Buscar por nombre o descripción…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-800 border-slate-700 text-foreground placeholder:text-slate-500"
        />
      </div>

      {/* Table */}
      <ScrollArea className="w-full border border-slate-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-800">
            <TableRow className="border-slate-700 hover:bg-slate-800">
              <TableHead className="text-[#44C6D1] font-semibold">Nombre</TableHead>
              <TableHead className="text-[#44C6D1] font-semibold hidden sm:table-cell">Unidad</TableHead>
              <TableHead className="text-[#44C6D1] font-semibold hidden md:table-cell">Costo ref.</TableHead>
              <TableHead className="text-[#44C6D1] font-semibold hidden lg:table-cell">Precio ref.</TableHead>
              <TableHead className="text-[#44C6D1] font-semibold hidden lg:table-cell">Estado</TableHead>
              <TableHead className="text-[#44C6D1] font-semibold hidden xl:table-cell">Actualizado</TableHead>
              <TableHead className="text-[#44C6D1] font-semibold text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="border-slate-700 hover:bg-slate-800/50 transition-colors">
                  <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground hidden sm:table-cell">{product.unit}</TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">
                    {product.costReference ? `${product.costReference}` : "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden lg:table-cell">
                    {product.priceReference ? `${product.priceReference}` : "-"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge className={product.active ? "bg-green-900 text-green-100" : "bg-slate-700 text-slate-100"}>
                      {product.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden xl:table-cell">
                    {formatDate(product.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(product.id)}
                      className="text-[#44C6D1] hover:text-[#3ba8b0] hover:bg-slate-700"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-slate-700">
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No se encontraron productos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Mostrando {filteredProducts.length} de {products.length} producto
        {products.length !== 1 ? "s" : ""}
      </div>
    </div>
  )
}
