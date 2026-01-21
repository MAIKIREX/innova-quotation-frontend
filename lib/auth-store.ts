import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { AuthUser } from "@/types/api.types"
import { api } from "@/lib/api"

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, lastname: string) => Promise<void>
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false, // Initially false, handled by actions or hydration

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await api.login(email, password)
          console.log("Login response:", response)
          const { user, access_token } = response

          // Persist token for middleware/edge checks
          try {
            document.cookie = `auth_token=${access_token}; path=/; sameSite=lax`
          } catch (cookieError) {
            console.error("Failed to set auth cookie:", cookieError)
          }

          // Manual backup to ensure persistence
          try {
            const state = { state: { user, token: access_token, isAuthenticated: true, isLoading: false }, version: 0 }
            localStorage.setItem("auth-storage", JSON.stringify(state))
          } catch (e) {
            console.error("Manual persistence failed:", e)
          }

          set({ user, token: access_token, isAuthenticated: true, isLoading: false })
        } catch (error) {
          console.error("Login error:", error)
          set({ isLoading: false })
          throw error
        }
      },

      register: async (email: string, password: string, name: string, lastname: string) => {
        set({ isLoading: true })
        try {
          const { user, access_token } = await api.register(email, password, name, lastname)
          set({ user, token: access_token, isAuthenticated: true, isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        try {
          document.cookie = "auth_token=; path=/; max-age=0; sameSite=lax"
        } catch (cookieError) {
          console.error("Failed to clear auth cookie:", cookieError)
        }
        set({ user: null, token: null, isAuthenticated: false })
      },
      
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => () => {
        // Optional: logic after rehydration
      },
    }
  )
)
