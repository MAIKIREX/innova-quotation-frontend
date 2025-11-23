"use client"

import React from "react"
import { LoginForm } from "@/features/auth/components/login-form"
import { useAuth } from "@/hooks/use-auth"
import type { LoginCredentials } from "@/types/api.types"

export function LoginPageClient() {
  const { login, isLoading } = useAuth()
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  async function handleLogin(values: LoginCredentials) {
    setErrorMessage(null)
    try {
      await login(values.email, values.password)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al iniciar sesión"
      setErrorMessage(message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-[#020617] via-[#1A587F] to-[#020617]">
      {/* Subtle decorative element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#44C6D1] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1A587F] opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Form container */}
      <div className="relative z-10 w-full max-w-sm">
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} errorMessage={errorMessage} />
      </div>
    </div>
  )
}
