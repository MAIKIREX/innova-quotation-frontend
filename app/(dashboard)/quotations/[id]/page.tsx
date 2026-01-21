"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import type {
  Quotation,
  QuotationPdf,
  QuotationEmail,
  SendQuotationEmailPayload,
  UpdateQuotationPayload,
} from "@/types/api.types"
import { QuotationActions } from "@/features/quotations/components/quotation-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"

export default function QuotationDetailPage() {
  const params = useParams()
  const quotationId = params.id as string
  const router = useRouter()
  const { token } = useAuth()

  const [quotation, setQuotation] = useState<Quotation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)
  const [isViewingPdf, setIsViewingPdf] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [lastPdf, setLastPdf] = useState<QuotationPdf | null>(null)
  const [lastEmail, setLastEmail] = useState<QuotationEmail | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const formatMoney = (value?: string) => {
    if (!value) return "-"
    const num = Number.parseFloat(value)
    if (Number.isNaN(num)) return value
    return num.toFixed(2)
  }

  const totalCostUnit = quotation?.items?.reduce((acc, item) => {
    const value = Number.parseFloat(item.costUnit ?? "0")
    return acc + (Number.isNaN(value) ? 0 : value)
  }, 0) ?? 0

  const totalSale = quotation?.items?.reduce((acc, item) => {
    const value = Number.parseFloat(item.totalSale ?? "0")
    return acc + (Number.isNaN(value) ? 0 : value)
  }, 0) ?? 0

  useEffect(() => {
    if (!token || !quotationId) return

    const fetchQuotation = async () => {
      try {
        const data = await api.getQuotation(quotationId, token)
        setQuotation(data)
      } catch (error) {
        console.error("Error fetching quotation:", error)
        setErrorMessage("No se pudo cargar la proforma.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuotation()
  }, [quotationId, token])

  const handleDownloadPdf = async () => {
    if (!token) return
    setIsDownloadingPdf(true)
    setErrorMessage(null)

    try {
      const blob = await api.downloadQuotationPdf(quotationId, token)
      // Create a URL for the blob and trigger download
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `proforma-${quotation?.number || quotationId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      setErrorMessage("Error al descargar el PDF")
      console.error(error)
    } finally {
      setIsDownloadingPdf(false)
    }
  }

  const handleViewPdf = async () => {
    if (!token) return
    setIsViewingPdf(true)
    setErrorMessage(null)

    try {
      const blob = await api.downloadQuotationPdf(quotationId, token)
      const url = window.URL.createObjectURL(blob)
      window.open(url, "_blank", "noopener,noreferrer")
      window.setTimeout(() => window.URL.revokeObjectURL(url), 30_000)
    } catch (error) {
      setErrorMessage("Error al visualizar el PDF")
      console.error(error)
    } finally {
      setIsViewingPdf(false)
    }
  }

  const handleGeneratePdf = async () => {
    if (!token) return
    setIsGeneratingPdf(true)
    setErrorMessage(null)

    try {
      const newPdf = await api.generateQuotationPdf(quotationId, token)
      setLastPdf(newPdf)
      // Optionally refresh quotation to show new PDF in list if needed
      // const updatedQuotation = await api.getQuotation(quotationId, token)
      // setQuotation(updatedQuotation)
    } catch (error) {
      setErrorMessage("Error al generar el PDF")
      console.error(error)
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  const handleSendEmail = async (payload: SendQuotationEmailPayload) => {
    if (!token) return
    setIsSendingEmail(true)
    setErrorMessage(null)

    try {
      const newEmail = await api.sendQuotationEmail(quotationId, payload, token)
      setLastEmail(newEmail)
      await updateStatus("sent")
    } catch (error) {
      setErrorMessage("Error al enviar el correo")
      console.error(error)
    } finally {
      setIsSendingEmail(false)
    }
  }

  const updateStatus = async (status: Quotation["status"]) => {
    if (!token) return
    setIsUpdatingStatus(true)
    setErrorMessage(null)

    try {
      const payload: UpdateQuotationPayload = { status }
      const updated = await api.updateQuotation(quotationId, payload, token)
      setQuotation((prev) => (prev ? { ...prev, status: updated?.status || status } : prev))
    } catch (error) {
      setErrorMessage("No se pudo actualizar el estado.")
      console.error(error)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  if (isLoading) {
    return <div className="p-6">Cargando proforma...</div>
  }

  if (!quotation) {
    return <div className="p-6 text-red-500">No se encontró la proforma o hubo un error.</div>
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-background">Proforma {quotation.number}</h1>
        <p className="text-muted-background mt-2">Gestiona las acciones de descarga, generación y envío.</p>
        <div className="mt-4">
          <Button variant="outline" onClick={() => router.push(`/quotations/${quotationId}/edit`)} className="bg-[#44C6D1] text-[#111827] hover:bg-[#44C6D1]/10 cursor-pointer hover:text-white border-[#44C6D1]/50">
            Editar proforma
          </Button>
        </div>
      </div>

      {/* Basic Info Card */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-background">Información de la proforma</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-white">Cliente</p>
              <p className="font-semibold text-background">{quotation.customer?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-background">Empresa</p>
              <p className="font-semibold text-background">{quotation.company?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-background">Email del cliente</p>
              <p className="break-all font-semibold text-background">
                {quotation.customer?.email || "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Summary */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-background">Resumen de items</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full border border-slate-700 rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-800">
                <TableRow className="border-slate-700 hover:bg-slate-800">
                  <TableHead className="text-[#44C6D1] font-semibold">Item</TableHead>
                  <TableHead className="text-[#44C6D1] font-semibold hidden md:table-cell">Producto</TableHead>
                  <TableHead className="text-[#44C6D1] font-semibold text-right">Cantidad</TableHead>
                  <TableHead className="text-[#44C6D1] font-semibold text-right hidden md:table-cell">
                    Costo unit.
                  </TableHead>
                  <TableHead className="text-[#44C6D1] font-semibold text-right hidden lg:table-cell">
                    Venta unit.
                  </TableHead>
                  <TableHead className="text-[#44C6D1] font-semibold text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotation.items?.length ? (
                  quotation.items.map((item) => (
                    <TableRow key={item.id} className="border-slate-700 hover:bg-slate-800/50">
                      <TableCell className="text-background">
                        {item.itemDescription || item.product?.name || "Item"}
                      </TableCell>
                      <TableCell className="text-background hidden md:table-cell">
                        {item.product?.name || "-"}
                      </TableCell>
                      <TableCell className="text-background text-right">{item.quantity}</TableCell>
                      <TableCell className="text-background text-right hidden md:table-cell">
                        {formatMoney(item.costUnit)}
                      </TableCell>
                      <TableCell className="text-background text-right hidden lg:table-cell">
                        {formatMoney(item.saleUnit)}
                      </TableCell>
                      <TableCell className="text-background text-right">
                        {formatMoney(item.totalSale)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="border-slate-700">
                    <TableCell colSpan={6} className="text-center text-muted-background py-8">
                      No hay items para mostrar
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>

          <div className="mt-4 flex flex-col gap-2 md:items-end">
            <div className="flex w-full max-w-md items-center justify-between rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-3">
              <span className="text-sm text-slate-300">Total costo unit.</span>
              <span className="text-sm font-semibold text-background">
                {formatMoney(totalCostUnit.toString())}
              </span>
            </div>
            <div className="flex w-full max-w-md items-center justify-between rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-3">
              <span className="text-sm text-slate-300">Total general</span>
              <span className="text-sm font-semibold text-[#44C6D1]">
                {formatMoney(totalSale.toString())}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions Card */}
      <QuotationActions
        quotation={quotation}
        onDownloadPdf={handleDownloadPdf}
        onViewPdf={handleViewPdf}
        onGeneratePdf={handleGeneratePdf}
        onSendEmail={handleSendEmail}
        onMarkAccepted={() => updateStatus("accepted")}
        isDownloadingPdf={isDownloadingPdf}
        isViewingPdf={isViewingPdf}
        isGeneratingPdf={isGeneratingPdf}
        isSendingEmail={isSendingEmail}
        isUpdatingStatus={isUpdatingStatus}
        lastPdf={lastPdf}
        lastEmail={lastEmail}
        errorMessage={errorMessage}
      />

      
    </div>
  )
}
