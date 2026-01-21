"use client"

import { useState } from "react"
import type { Quotation, QuotationPdf, QuotationEmail, SendQuotationEmailPayload } from "@/types/api.types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SendQuotationEmailDialog } from "./send-quotation-email-dialog"
import { Download, Eye, FileText, Mail } from "lucide-react"

export type QuotationActionsProps = {
  quotation: Quotation
  onDownloadPdf: () => void
  onViewPdf: () => void
  onGeneratePdf: () => void
  onSendEmail: (payload: SendQuotationEmailPayload) => Promise<void> | void
  onMarkAccepted: () => void
  isDownloadingPdf?: boolean
  isViewingPdf?: boolean
  isGeneratingPdf?: boolean
  isSendingEmail?: boolean
  isUpdatingStatus?: boolean
  lastPdf?: QuotationPdf | null
  lastEmail?: QuotationEmail | null
  errorMessage?: string | null
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

export function QuotationActions({
  quotation,
  onDownloadPdf,
  onViewPdf,
  onGeneratePdf,
  onSendEmail,
  onMarkAccepted,
  isDownloadingPdf = false,
  isViewingPdf = false,
  isGeneratingPdf = false,
  isSendingEmail = false,
  isUpdatingStatus = false,
  lastPdf,
  lastEmail,
  errorMessage,
}: QuotationActionsProps) {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)

  return (
    <>
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-background flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#44C6D1]" />
            Acciones de la proforma
          </CardTitle>
          <CardDescription className="text-background">Descarga, genera y envía esta proforma.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {errorMessage && (
            <Alert className="bg-red-950 border-red-800">
              <AlertDescription className="text-red-200">{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Quotation Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
            <div>
              <p className="text-sm text-background">Número</p>
              <p className="text-lg font-semibold text-background">{quotation.number}</p>
            </div>
            <div>
              <p className="text-sm text-background">Cliente</p>
              <p className="text-lg font-semibold text-background">{quotation.customer.name}</p>
            </div>
            <div>
              <p className="text-sm text-background">Total</p>
              <p className="text-lg font-semibold text-[#44C6D1]">
                {quotation.totalAmount} {quotation.currency}
              </p>
            </div>
            <div>
              <p className="text-sm text-background">Estado</p>
              <Badge className="bg-blue-900 text-blue-100 border border-blue-700 mt-1">{quotation.status}</Badge>
            </div>
          </div>

          <Separator className="bg-slate-700" />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onDownloadPdf}
              disabled={isDownloadingPdf}
              variant="outline"
              className="border-[#44C6D1] text-[#44C6D1] hover:bg-slate-800 bg-transparent"
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloadingPdf ? "Descargando..." : "Descargar PDF"}
            </Button>

            <Button
              onClick={onViewPdf}
              disabled={isViewingPdf}
              variant="outline"
              className="border-[#1A587F] text-[#1A587F] hover:bg-slate-800 bg-transparent"
            >
              <Eye className="w-4 h-4 mr-2" />
              {isViewingPdf ? "Abriendo..." : "Ver PDF"}
            </Button>

            <Button
              onClick={onGeneratePdf}
              disabled={isGeneratingPdf}
              className="bg-[#1A587F] hover:bg-[#134058] text-white font-semibold"
            >
              <FileText className="w-4 h-4 mr-2" />
              {isGeneratingPdf ? "Generando..." : "Generar y guardar PDF"}
            </Button>

            <Button
              onClick={() => setEmailDialogOpen(true)}
              disabled={isSendingEmail}
              className="bg-[#44C6D1] hover:bg-[#3ba8b0] text-slate-950 font-semibold"
            >
              <Mail className="w-4 h-4 mr-2" />
              Enviar por correo
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onMarkAccepted}
              disabled={isUpdatingStatus || quotation.status === "accepted"}
              className="bg-green-700 hover:bg-green-800 text-white font-semibold"
            >
              {isUpdatingStatus ? "Actualizando..." : "Marcar como aceptada"}
            </Button>
          </div>

          <Separator className="bg-slate-700" />

          {/* Last PDF Info */}
          {lastPdf && (
            <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
              <p className="text-sm font-semibold text-background mb-2">📄 Último PDF generado</p>
              <p className="text-xs text-muted-background">{lastPdf.filePath}</p>
              <p className="text-xs text-muted-background mt-1">Generado: {formatDate(lastPdf.createdAt)}</p>
            </div>
          )}

          {/* Last Email Info */}
          {lastEmail && (
            <div
              className={`p-3 rounded-lg border ${
                lastEmail.status === "success" ? "bg-green-950 border-green-800" : "bg-red-950 border-red-800"
              }`}
            >
              <p className="text-sm font-semibold mb-2">
                {lastEmail.status === "success" ? "✉️ Correo enviado" : "❌ Error al enviar"}
              </p>
              <p className={`text-xs ${lastEmail.status === "success" ? "text-green-200" : "text-red-200"}`}>
                Para: {lastEmail.toEmail}
              </p>
              <p className={`text-xs ${lastEmail.status === "success" ? "text-green-200" : "text-red-200"} mt-1`}>
                {formatDate(lastEmail.sentAt)}
              </p>
              {lastEmail.errorDetail && <p className="text-xs text-red-300 mt-2">Error: {lastEmail.errorDetail}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Dialog */}
      <SendQuotationEmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        defaultToEmail={quotation.customer.email}
        defaultSubject={`Proforma N° ${quotation.number}`}
        onSubmit={onSendEmail}
        isSubmitting={isSendingEmail}
      />
    </>
  )
}
