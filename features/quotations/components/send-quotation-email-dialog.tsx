"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import type { SendQuotationEmailPayload } from "@/types/api.types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

const formSchema = z.object({
  toEmail: z.string().email("Email inválido"),
  subject: z.string().min(1, "Asunto es requerido"),
  body: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export type SendQuotationEmailDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultToEmail?: string
  defaultSubject?: string
  onSubmit: (payload: SendQuotationEmailPayload) => Promise<void> | void
  isSubmitting?: boolean
}

export function SendQuotationEmailDialog({
  open,
  onOpenChange,
  defaultToEmail,
  defaultSubject,
  onSubmit,
  isSubmitting = false,
}: SendQuotationEmailDialogProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      toEmail: defaultToEmail || "",
      subject: defaultSubject || "",
      body: "",
    },
  })

  const handleSubmit = async (values: FormValues) => {
    setErrorMessage(null)

    try {
      const payload: SendQuotationEmailPayload = {
        toEmail: values.toEmail,
        subject: values.subject,
        body: values.body,
      }
      await onSubmit(payload)

      // Reset form and close on success
      form.reset()
      onOpenChange(false)
    } catch (error) {
      setErrorMessage("Error al enviar el correo. Intenta de nuevo.")
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-foreground">Enviar proforma por correo</DialogTitle>
          <DialogDescription>Completa los detalles del correo para enviar la proforma.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {errorMessage && (
              <Alert className="bg-red-950 border-red-800">
                <AlertDescription className="text-red-200">{errorMessage}</AlertDescription>
              </Alert>
            )}

            {/* To Email Field */}
            <FormField
              control={form.control}
              name="toEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Email destino *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="cliente@example.com"
                      className="bg-slate-800 border-slate-700 text-foreground placeholder:text-slate-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subject Field */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Asunto *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Proforma N° 001"
                      className="bg-slate-800 border-slate-700 text-foreground placeholder:text-slate-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Body Field */}
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Mensaje (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mensaje adicional para incluir en el correo"
                      className="bg-slate-800 border-slate-700 text-foreground placeholder:text-slate-500"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-slate-700 text-foreground hover:bg-slate-800"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#44C6D1] hover:bg-[#3ba8b0] text-slate-950 font-semibold"
              >
                {isSubmitting ? "Enviando..." : "Enviar correo"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
