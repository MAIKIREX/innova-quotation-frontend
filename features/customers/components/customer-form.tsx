"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { CreateCustomerPayload } from "@/types/api.types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Validation schema
const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  nitCi: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface CustomerFormProps {
  initialValues?: CreateCustomerPayload
  onSubmit: (values: CreateCustomerPayload) => Promise<void> | void
  isLoading?: boolean
  errorMessage?: string | null
}

export function CustomerForm({ initialValues, onSubmit, isLoading = false, errorMessage }: CustomerFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      name: "",
      nitCi: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
    },
  })

  const handleSubmit = async (values: FormValues) => {
    const payload: CreateCustomerPayload = {
      ...values,
      email: values.email || undefined,
      phone: values.phone || undefined,
      address: values.address || undefined,
      notes: values.notes || undefined,
    }
    await onSubmit(payload)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-[#1A587F]/30 bg-[#1F2933]/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl text-[#44C6D1]">Datos del cliente</CardTitle>
          <CardDescription className="text-slate-400">Completa la información básica del cliente.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Error Alert */}
              {errorMessage && (
                <Alert className="border-red-500 bg-red-500/10">
                  <AlertDescription className="text-red-400">{errorMessage}</AlertDescription>
                </Alert>
              )}

              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Nombre</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nombre del cliente"
                        className="border-[#44C6D1]/30 bg-[#111827]/50 text-white placeholder:text-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* NIT/CI and Email */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="nitCi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">NIT/CI</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Documento de identidad"
                          className="border-[#44C6D1]/30 bg-[#111827]/50 text-white placeholder:text-gray-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="correo@example.com"
                          className="border-[#44C6D1]/30 bg-[#111827]/50 text-white placeholder:text-gray-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Phone and Address */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Teléfono</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Número de teléfono"
                          className="border-[#44C6D1]/30 bg-[#111827]/50 text-white placeholder:text-gray-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Dirección</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Dirección completa"
                          className="border-[#44C6D1]/30 bg-[#111827]/50 text-white placeholder:text-gray-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Notas</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Notas adicionales sobre el cliente..."
                        className="border-[#44C6D1]/30 bg-[#111827]/50 text-white placeholder:text-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#44C6D1] hover:bg-[#3ba8b0] text-slate-950 font-semibold w-full sm:w-auto"
                >
                  {isLoading ? "Guardando..." : "Guardar cliente"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
