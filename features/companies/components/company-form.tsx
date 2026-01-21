"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import type { CreateCompanyPayload } from "@/types/api.types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

const formSchema = z.object({
  name: z.string().min(1, "Nombre es requerido"),
  nit: z.string().optional(),
  email: z.string().email("Email invalido").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  logoUrl: z.string().url("URL invalida").optional().or(z.literal("")),
})

type FormValues = z.infer<typeof formSchema>

export type CompanyFormProps = {
  initialValues?: CreateCompanyPayload
  onSubmit: (values: CreateCompanyPayload) => Promise<void> | void
  isLoading?: boolean
  errorMessage?: string | null
}

export function CompanyForm({
  initialValues,
  onSubmit,
  isLoading = false,
  errorMessage,
}: CompanyFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      name: "",
      nit: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      logoUrl: "",
    },
  })

  const handleSubmit = async (values: FormValues) => {
    const payload: CreateCompanyPayload = {
      name: values.name,
      nit: values.nit || undefined,
      email: values.email || undefined,
      phone: values.phone || undefined,
      address: values.address || undefined,
      city: values.city || undefined,
      country: values.country || undefined,
      logoUrl: values.logoUrl || undefined,
    }
    await onSubmit(payload)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-[#1A587F]/30 bg-[#1F2933]/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl text-[#44C6D1]">Datos de la compania</CardTitle>
          <CardDescription className="text-slate-400">
            Completa la informacion basica de la compania.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {errorMessage && (
                <Alert className="border-red-500 bg-red-500/10">
                  <AlertDescription className="text-red-400">{errorMessage}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Nombre *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: ACME S.R.L."
                        className="border-[#44C6D1]/30 bg-[#111827]/50 text-white placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                name="nit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">NIT</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: 1234567"
                        className="border-[#44C6D1]/30 bg-[#111827]/50 text-white placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Telefono</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: +591 70000000"
                        className="border-[#44C6D1]/30 bg-[#111827]/50 text-white placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="contacto@empresa.com"
                        className="border-[#44C6D1]/30 bg-[#111827]/50 text-white placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Logo (URL)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://..."
                        className="border-[#44C6D1]/30 bg-[#111827]/50 text-white placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Direccion</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Calle, zona, referencia"
                        className="border-[#44C6D1]/30 bg-[#111827]/50 text-white placeholder:text-gray-500"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Ciudad</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: La Paz"
                        className="border-[#44C6D1]/30 bg-[#111827]/50 text-white placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Pais</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Bolivia"
                        className="border-[#44C6D1]/30 bg-[#111827]/50 text-white placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto md:ml-auto block bg-[#44C6D1] hover:bg-[#3ba8b0] text-slate-950 font-semibold"
              >
                {isLoading ? "Guardando..." : "Guardar compania"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
