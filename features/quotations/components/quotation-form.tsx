"use client"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Trash2 } from "lucide-react"

import type { Company, CreateQuotationPayload, Customer } from "@/types/api.types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Validation schema
const itemSchema = z.object({
  productId: z.string().optional(),
  itemDescription: z.string().min(1, "Descripción requerida"),
  quantity: z.coerce.number().min(0.01, "Cantidad requerida"),
  costUnit: z.coerce.number().min(0, "Costo unitario requerido"),
  marginPercent: z.coerce.number().min(0, "Margen requerido"),
  marginAmount: z.coerce.number().optional(),
  saleUnit: z.coerce.number().optional(),
  totalCost: z.coerce.number().optional(),
  totalSale: z.coerce.number().optional(),
  order: z.number().optional(),
})

const formSchema = z.object({
  companyId: z.string().min(1, "Empresa requerida"),
  customerId: z.string().min(1, "Cliente requerido"),
  number: z.string().optional(),
  issueDate: z.string().min(1, "Fecha de emisión requerida"),
  dueDate: z.string().optional(),
  currency: z.string().min(1, "Moneda requerida"),
  notes: z.string().optional(),
  warranty: z.string().optional(),
  paymentTerms: z.string().optional(),
  deliveryPlace: z.string().optional(),
  items: z.array(itemSchema).min(1, "Al menos un ítem requerido"),
})

type FormValues = z.infer<typeof formSchema>

interface QuotationFormProps {
  initialValues?: CreateQuotationPayload
  companies: Company[]
  customers: Customer[]
  onSubmit: (values: CreateQuotationPayload) => Promise<void> | void
  isLoading?: boolean
  errorMessage?: string | null
}

export function QuotationForm({
  initialValues,
  companies,
  customers,
  onSubmit,
  isLoading = false,
  errorMessage,
}: QuotationFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      companyId: "",
      customerId: "",
      number: "",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      currency: "BOB",
      notes: "",
      warranty: "",
      paymentTerms: "",
      deliveryPlace: "",
      items: [
        {
          itemDescription: "",
          quantity: 1,
          costUnit: 0,
          marginPercent: 0,
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  // Calculate summary from items
  const items = useWatch({ control: form.control, name: "items" }) ?? []
  const summary = items.reduce(
    (acc, item) => {
      const quantity = Number(item.quantity) || 0
      const costUnit = Number(item.costUnit) || 0
      const marginPercent = Number(item.marginPercent) || 0

      const totalCost = costUnit * quantity
      const saleUnit = costUnit * (1 + marginPercent / 100)
      const totalSale = saleUnit * quantity

      return {
        subtotal: acc.subtotal + totalSale,
        totalCost: acc.totalCost + totalCost,
      }
    },
    { subtotal: 0, totalCost: 0 },
  )

  const handleSubmit = async (values: FormValues) => {
    const normalizedValues: FormValues = {
      ...values,
      number: values.number || undefined,
      dueDate: values.dueDate || undefined,
      notes: values.notes || undefined,
      warranty: values.warranty || undefined,
      paymentTerms: values.paymentTerms || undefined,
      deliveryPlace: values.deliveryPlace || undefined,
    }

    const itemsWithCalculations = normalizedValues.items.map((item) => {
      const quantity = Number(item.quantity) || 0
      const costUnit = Number(item.costUnit) || 0
      const marginPercent = Number(item.marginPercent) || 0

      const totalCost = costUnit * quantity
      const saleUnit = costUnit * (1 + marginPercent / 100)
      const totalSale = saleUnit * quantity
      const marginAmount = saleUnit - costUnit

      return {
        ...item,
        quantity,
        costUnit,
        marginPercent,
        totalCost,
        saleUnit,
        totalSale,
        marginAmount,
      }
    })

    const payload: CreateQuotationPayload = {
      ...normalizedValues,
      items: itemsWithCalculations,
      subtotalAmount: summary.subtotal,
      totalAmount: summary.subtotal,
      totalCost: summary.totalCost,
    }

    await onSubmit(payload)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Error Alert */}
          {errorMessage && (
            <Alert className="border-red-500 bg-red-500/10">
              <AlertDescription className="text-red-400">{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Header Section */}
          <Card className="border-[#1A587F]/30 bg-[#1F2933]/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl text-[#44C6D1]">Datos de la proforma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Row 1: Company & Customer */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Empresa</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-[#44C6D1]/30 bg-[#111827]/50 text-white placeholder:text-gray-500">
                            <SelectValue placeholder="Selecciona una empresa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-[#1A587F] bg-[#111827]">
                          {companies.map((company) => (
                            <SelectItem
                              key={company.id}
                              value={company.id}
                              className="text-white focus:bg-[#44C6D1] focus:text-[#111827]"
                            >
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Cliente</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-[#44C6D1]/30 bg-[#111827]/50 text-white placeholder:text-gray-500">
                            <SelectValue placeholder="Selecciona un cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-[#1A587F] bg-[#111827]">
                          {customers.map((customer) => (
                            <SelectItem
                              key={customer.id}
                              value={customer.id}
                              className="text-white focus:bg-[#44C6D1] focus:text-[#111827]"
                            >
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 2: Number & Currency */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Número de proforma</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Auto-generado"
                          className="border-[#44C6D1]/30 bg-[#111827]/50 text-white placeholder:text-gray-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Moneda</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-[#44C6D1]/30 bg-[#111827]/50 text-white">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-[#1A587F] bg-[#111827]">
                          <SelectItem value="BOB" className="text-white focus:bg-[#44C6D1] focus:text-[#111827]">
                            BOB - Bolivianos
                          </SelectItem>
                          <SelectItem value="USD" className="text-white focus:bg-[#44C6D1] focus:text-[#111827]">
                            USD - Dólares
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 3: Dates */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="issueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Fecha de emisión</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          className="border-[#44C6D1]/30 bg-[#111827]/50 text-white [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-80"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Fecha de vencimiento</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          className="border-[#44C6D1]/30 bg-[#111827]/50 text-white [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-80"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Conditions Section */}
          <Card className="border-[#1A587F]/30 bg-[#1F2933]/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl text-[#44C6D1]">Condiciones y notas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Notas</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Observaciones adicionales..."
                        className="border-[#44C6D1]/30 bg-[#111827]/50 text-white placeholder:text-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="warranty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Garantía</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Términos de garantía..."
                        className="border-[#44C6D1]/30 bg-[#111827]/50 text-white placeholder:text-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Términos de pago</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Forma de pago, plazos, etc..."
                        className="border-[#44C6D1]/30 bg-[#111827]/50 text-white placeholder:text-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryPlace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Lugar de entrega</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Dirección de entrega..."
                        className="border-[#44C6D1]/30 bg-[#111827]/50 text-white placeholder:text-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Items Section */}
          <Card className="border-[#1A587F]/30 bg-[#1F2933]/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl text-[#44C6D1]">Ítems de la proforma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 rounded-lg border border-[#1A587F]/20 bg-[#111827]/30 p-4">
                  {/* Item Description */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.itemDescription`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Descripción del ítem</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Descripción del producto o servicio..."
                            className="border-[#44C6D1]/30 bg-[#111827]/50 text-white placeholder:text-gray-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Quantity, Cost, Margin */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Cantidad</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              placeholder="0"
                              className="border-[#44C6D1]/30 bg-[#111827]/50 text-white placeholder:text-gray-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.costUnit`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Costo unitario</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              placeholder="0"
                              className="border-[#44C6D1]/30 bg-[#111827]/50 text-white placeholder:text-gray-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.marginPercent`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Margen %</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              placeholder="0"
                              className="border-[#44C6D1]/30 bg-[#111827]/50 text-white placeholder:text-gray-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Calculated Fields (Read-only) */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="text-sm font-medium text-gray-400">Precio unitario</label>
                      <div className="mt-1 rounded border border-[#1A587F]/20 bg-[#0F172A]/50 px-3 py-2 text-white">
                        {(
                          (Number(items[index]?.costUnit) || 0) *
                          (1 + (Number(items[index]?.marginPercent) || 0) / 100)
                        ).toFixed(2)}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-400">Costo total</label>
                      <div className="mt-1 rounded border border-[#1A587F]/20 bg-[#0F172A]/50 px-3 py-2 text-white">
                        {((Number(items[index]?.costUnit) || 0) * (Number(items[index]?.quantity) || 0)).toFixed(2)}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-400">Venta total</label>
                      <div className="mt-1 rounded border border-[#1A587F]/20 bg-[#0F172A]/50 px-3 py-2 text-[#44C6D1]">
                        {(
                          (Number(items[index]?.costUnit) || 0) *
                          (1 + (Number(items[index]?.marginPercent) || 0) / 100) *
                          (Number(items[index]?.quantity) || 0)
                        ).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add Item Button */}
              <Button
                type="button"
                onClick={() =>
                  append({
                    itemDescription: "",
                    quantity: 1,
                    costUnit: 0,
                    marginPercent: 0,
                  })
                }
                variant="outline"
                className="w-full bg-[#44C6D1] border-[#44C6D1]/50 text-[#111827] hover:bg-[#44C6D1]/10 cursor-pointer hover:text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar ítem
              </Button>

              {form.formState.errors.items && (
                <p className="text-sm text-red-400">{form.formState.errors.items.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Summary Section */}
          <Card className="border-[#44C6D1]/30 bg-gradient-to-br from-[#1A587F]/20 to-[#44C6D1]/10 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg text-[#44C6D1]">Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-white">
                <span>Subtotal:</span>
                <span>{summary.subtotal.toFixed(2)}</span>
              </div>
              <Separator className="bg-[#1A587F]/20" />
              <div className="flex justify-between text-xl font-bold text-[#44C6D1]">
                <span>Total estimado:</span>
                <span>{summary.subtotal.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex gap-3">
            <Button
              type="submit"
              variant="outline"
              disabled={isLoading}
              className="flex-1 bg-[#44C6D1] text-[#111827] hover:bg-[#44C6D1]/10 cursor-pointer hover:text-white border-[#44C6D1]/50" 
            >
              {isLoading ? "Guardando..." : "Guardar proforma"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              className="border-[#44C6D1]/30 text-white/80 hover:bg-[#44C6D1]/10 hover:text-white cursor-pointer bg-[#f28f3b]"
            >
              Limpiar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
