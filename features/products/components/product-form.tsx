"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import type { CreateProductPayload } from "@/types/api.types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"

const formSchema = z.object({
  name: z.string().min(1, "Nombre es requerido"),
  description: z.string().optional(),
  unit: z.string().optional(),
  costReference: z.coerce.number().min(0, "Costo debe ser >= 0").optional().or(z.literal("")),
  priceReference: z.coerce.number().min(0, "Precio debe ser >= 0").optional().or(z.literal("")),
  active: z.boolean().default(true),
})

type FormValues = z.infer<typeof formSchema>

export type ProductFormProps = {
  initialValues?: CreateProductPayload
  onSubmit: (values: CreateProductPayload) => Promise<void> | void
  isLoading?: boolean
  errorMessage?: string | null
}

export function ProductForm({ initialValues, onSubmit, isLoading = false, errorMessage }: ProductFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      name: "",
      description: "",
      unit: "",
      costReference: undefined,
      priceReference: undefined,
      active: true,
    },
  })

  const handleSubmit = async (values: FormValues) => {
    const payload: CreateProductPayload = {
      name: values.name,
      description: values.description || undefined,
      unit: values.unit || undefined,
      costReference: values.costReference ? Number(values.costReference) : undefined,
      priceReference: values.priceReference ? Number(values.priceReference) : undefined,
      active: values.active,
    }
    await onSubmit(payload)
  }

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-background">Datos del producto</CardTitle>
        <CardDescription className="text-white/80">Completa la información básica del producto o servicio.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {errorMessage && (
              <Alert className="bg-red-950 border-red-800">
                <AlertDescription className="text-red-200">{errorMessage}</AlertDescription>
              </Alert>
            )}

            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-background">Nombre *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Servicio de consultoría"
                      className="bg-slate-800 border-slate-700 text-background placeholder:text-slate-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-background">Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción detallada del producto o servicio"
                      className="bg-slate-800 border-slate-700 text-background placeholder:text-slate-500"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Unit Field */}
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-background">Unidad</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: unidad, m, h, kg"
                      className="bg-slate-800 border-slate-700 text-background placeholder:text-slate-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cost and Price Reference (2 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="costReference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-background">Costo ref.</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        className="bg-slate-800 border-slate-700 text-background placeholder:text-slate-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priceReference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-background">Precio ref.</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        className="bg-slate-800 border-slate-700 text-background placeholder:text-slate-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Active Toggle */}
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-700 p-3 bg-slate-800">
                  <div>
                    <FormLabel className="text-background">Estado</FormLabel>
                    <p className="text-sm text-white/80">Marcar como activo/inactivo</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto md:ml-auto block bg-[#44C6D1] hover:bg-[#3ba8b0] text-slate-950 font-semibold"
            >
              {isLoading ? "Guardando..." : "Guardar producto"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
