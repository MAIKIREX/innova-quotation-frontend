"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { RegisterForm } from "@/features/auth/components/register-form"
import { useAuth } from "@/hooks/use-auth"
import type { CreateUserPayload } from "@/types/api.types"

export function RegisterPageClient() {
  const router = useRouter()
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (values: CreateUserPayload) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      // Simulated delay for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("[v0] Register attempt with payload:", values)
      console.log("[v0] Email:", values.email)
      console.log("[v0] Name:", values.profile.name)
      console.log("[v0] Lastname:", values.profile.lastname)

      // Replace with real API call using useAuth hook
      await register(values.email, values.password, values.profile.name, values.profile.lastname)
      router.push("/dashboard")
    } catch (error) {
      console.error("[v0] Registration error:", error)
      setErrorMessage(error instanceof Error ? error.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-12">
      {/* Decorative blur elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-96 -top-96 h-96 w-96 rounded-full bg-[#44C6D1]/10 blur-3xl" />
        <div className="absolute -right-96 -bottom-96 h-96 w-96 rounded-full bg-[#1A587F]/10 blur-3xl" />
      </div>

      <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} errorMessage={errorMessage} />
    </div>
  )
}
