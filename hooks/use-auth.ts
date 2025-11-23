"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { AuthUser } from "@/types/api.types"
import { api } from "@/lib/api"

const STORAGE_KEY = "auth_token"
const USER_STORAGE_KEY = "auth_user"

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Initialize from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem(STORAGE_KEY)
    const savedUser = localStorage.getItem(USER_STORAGE_KEY)

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true)
      try {
        const { user: newUser, access_token } = await api.login(email, password)
        setUser(newUser)
        setToken(access_token)
        localStorage.setItem(STORAGE_KEY, access_token)
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser))
        router.push("/quotations")
      } finally {
        setIsLoading(false)
      }
    },
    [router],
  )

  const register = useCallback(
    async (email: string, password: string, name: string, lastname: string) => {
      setIsLoading(true)
      try {
        const { user: newUser, access_token } = await api.register(email, password, name, lastname)
        setUser(newUser)
        setToken(access_token)
        localStorage.setItem(STORAGE_KEY, access_token)
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser))
        router.push("/quotations")
      } finally {
        setIsLoading(false)
      }
    },
    [router],
  )

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    router.push("/login")
  }, [router])

  return { user, token, isLoading, login, register, logout, isAuthenticated: !!token }
}
