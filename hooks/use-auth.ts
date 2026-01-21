"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"

export function useAuth() {
  const router = useRouter()
  const { user, token, isAuthenticated, login, register, logout, isLoading } = useAuthStore()
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    const markHydrated = () => setHasHydrated(true)
    const unsubscribeHydrate = useAuthStore.persist?.onHydrate?.(() => setHasHydrated(false))
    const unsubscribeFinishHydration = useAuthStore.persist?.onFinishHydration?.(markHydrated)

    if (useAuthStore.persist?.hasHydrated?.()) {
      queueMicrotask(markHydrated)
    }

    return () => {
      unsubscribeHydrate?.()
      unsubscribeFinishHydration?.()
    }
  }, [])

  const handleLogin = async (email: string, password: string) => {
    await login(email, password)
    router.push("/dashboard")
  }

  const handleRegister = async (email: string, password: string, name: string, lastname: string) => {
    await register(email, password, name, lastname)
    router.push("/dashboard")
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return {
    user,
    token,
    // Keep loading and avoid redirects until zustand has finished rehydrating from storage
    isLoading: isLoading || !hasHydrated,
    isAuthenticated: hasHydrated && (!!token || isAuthenticated),
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  }
}
