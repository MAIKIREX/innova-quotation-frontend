"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import type { Quotation, QuotationPdf, QuotationEmail, SendQuotationEmailPayload } from "@/types/api.types"
import { QuotationActions } from "@/features/quotations/components/quotation-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock quotation data
const mockQuotation: Quotation = {
  id: "quot_001",
  number: "PRF-001-2025",
  companyId: "comp_1",
  company: {
    id: "comp_1",
    name: "Innova Solutions SRL",
    nit: "12345678",
  },
  customerId: "cust_1",
  customer: {
    id: "cust_1",
    name: "Empresa XYZ",
    nitCi: "9876543",
    email: "contacto@empresaxyz.com",
  },
  userId: "user_1",
  user: {
    id: "user_1",
    email: "vendedor@innova.com",
    role: "seller",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    profile: {
      id: 1,
      name: "Carlos",
      lastname: "Vendedor",
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
    },
    quotations: [],
  },
  issueDate: "2025-01-20",
  dueDate: "2025-02-20",
  currency: "BOB",
  subtotalAmount: "12000",
  discountAmount: "1200",
  taxIvaAmount: "1584",
  taxItAmount: "0",
  totalAmount: "13384",
  totalCost: "8000",
  grossProfit: "4000",
  netProfit: "3200",
  status: "draft",
  notes: "Válida por 30 días",
  warranty: "12 meses",
  paymentTerms: "50% anticipo, 50% contra entrega",
  deliveryPlace: "La Paz, Bolivia",
  createdAt: "2025-01-20T10:00:00Z",
  updatedAt: "2025-01-20T10:00:00Z",
  items: [],
  pdfFiles: [],
  emails: [],
}

export default function QuotationDetailPage() {
  const params = useParams()
  const quotationId = params.id as string

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [lastPdf, setLastPdf] = useState<QuotationPdf | null>(null)
  const [lastEmail, setLastEmail] = useState<QuotationEmail | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true)
    setErrorMessage(null)

    try {
      console.log("Download PDF for quotation", quotationId)
      await new Promise((resolve) => setTimeout(resolve, 1500))
    } catch (error) {
      setErrorMessage("Error al descargar el PDF")
      console.error(error)
    } finally {
      setIsDownloadingPdf(false)
    }
  }

  const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true)
    setErrorMessage(null)

    try {
      console.log("Generate & save PDF for quotation", quotationId)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate PDF creation
      const newPdf: QuotationPdf = {
        id: "pdf_001",
        quotationId,
        quotation: mockQuotation,
        filePath: `/pdfs/quotation-${quotationId}-${Date.now()}.pdf`,
        createdAt: new Date().toISOString(),
      }
      setLastPdf(newPdf)
    } catch (error) {
      setErrorMessage("Error al generar el PDF")
      console.error(error)
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  const handleSendEmail = async (payload: SendQuotationEmailPayload) => {
    setIsSendingEmail(true)
    setErrorMessage(null)

    try {
      console.log("Send email for quotation", quotationId, payload)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate email creation
      const newEmail: QuotationEmail = {
        id: "email_001",
        quotationId,
        quotation: mockQuotation,
        toEmail: payload.toEmail,
        subject: payload.subject,
        bodyPreview: payload.body?.substring(0, 100),
        sentByUserId: "user_1",
        sentAt: new Date().toISOString(),
        status: "success",
      }
      setLastEmail(newEmail)
    } catch (error) {
      setErrorMessage("Error al enviar el correo")
      console.error(error)
    } finally {
      setIsSendingEmail(false)
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Proforma {mockQuotation.number}</h1>
        <p className="text-muted-foreground mt-2">Gestiona las acciones de descarga, generación y envío.</p>
      </div>

      {/* Basic Info Card */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-foreground">Información de la proforma</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Cliente</p>
              <p className="font-semibold text-foreground">{mockQuotation.customer.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Empresa</p>
              <p className="font-semibold text-foreground">{mockQuotation.company.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email del cliente</p>
              <p className="font-semibold text-foreground">{mockQuotation.customer.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions Card */}
      <QuotationActions
        quotation={mockQuotation}
        onDownloadPdf={handleDownloadPdf}
        onGeneratePdf={handleGeneratePdf}
        onSendEmail={handleSendEmail}
        isDownloadingPdf={isDownloadingPdf}
        isGeneratingPdf={isGeneratingPdf}
        isSendingEmail={isSendingEmail}
        lastPdf={lastPdf}
        lastEmail={lastEmail}
        errorMessage={errorMessage}
      />
    </div>
  )
}
