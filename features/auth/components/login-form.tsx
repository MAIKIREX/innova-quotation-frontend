"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { LoginCredentials } from "@/types/api.types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { AlertCircle } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Por favor ingresa un email válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

type LoginFormProps = {
  onSubmit: (values: LoginCredentials) => Promise<void> | void
  isLoading?: boolean
  errorMessage?: string | null
}

export function LoginForm({ onSubmit, isLoading = false, errorMessage = null }: LoginFormProps) {
  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  return (
    <Card className="w-full max-w-sm space-y-6 border-0 bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-2xl">
      {/* Logo Placeholder */}
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#44C6D1] text-2xl font-bold text-[#020617]">
          <img
            src="/images/logo.svg"
            alt="Logo"
            className="h-10 w-10 object-contain"
            onError={(e) => {
              // Fallback if logo doesn't exist
              ;(e.target as HTMLImageElement).style.display = "none"
            }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-white">Iniciar sesión</h1>
        <p className="text-sm text-slate-300">Accede a tu cuenta para gestionar proformas.</p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="flex gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
          <p className="text-sm text-red-300">{errorMessage}</p>
        </div>
      )}

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-200">Email</FormLabel>
                <Input
                  {...field}
                  type="email"
                  placeholder="tu@email.com"
                  disabled={isLoading}
                  className="border-slate-600 bg-slate-800 text-white placeholder:text-slate-500 focus-visible:border-[#44C6D1] focus-visible:ring-[#44C6D1]/30"
                />
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-200">Contraseña</FormLabel>
                <Input
                  {...field}
                  type="password"
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="border-slate-600 bg-slate-800 text-white placeholder:text-slate-500 focus-visible:border-[#44C6D1] focus-visible:ring-[#44C6D1]/30"
                />
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#44C6D1] text-[#020617] font-semibold hover:bg-[#2bb5bf] disabled:opacity-50"
          >
            {isLoading ? "Ingresando…" : "Iniciar sesión"}
          </Button>
        </form>
      </Form>

      {/* Footer */}
      <p className="text-center text-xs text-slate-400">
        ¿Aún no tienes cuenta?{" "}
        <a href="/register" className="font-medium text-[#44C6D1] hover:text-[#2bb5bf]">
          Regístrate aquí
        </a>
      </p>
    </Card>
  )
}
