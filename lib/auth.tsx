"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { Partner } from "./types"

interface AuthContextType {
  token: string | null
  partner: Partner | null
  isLoading: boolean
  login: (token: string, partner: Partner) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  partner: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [partner, setPartner] = useState<Partner | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  /* Восстанавливаем сессию из localStorage */
  useEffect(() => {
    const savedToken = localStorage.getItem("partner_token")
    const savedPartner = localStorage.getItem("partner_data")

    if (savedToken && savedPartner) {
      setToken(savedToken)
      try {
        setPartner(JSON.parse(savedPartner))
      } catch {
        localStorage.removeItem("partner_data")
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(
    (newToken: string, newPartner: Partner) => {
      localStorage.setItem("partner_token", newToken)
      localStorage.setItem("partner_data", JSON.stringify(newPartner))
      setToken(newToken)
      setPartner(newPartner)
      router.push("/dashboard")
    },
    [router]
  )

  const logout = useCallback(() => {
    localStorage.removeItem("partner_token")
    localStorage.removeItem("partner_data")
    setToken(null)
    setPartner(null)
    router.push("/")
  }, [router])

  return (
    <AuthContext.Provider value={{ token, partner, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
