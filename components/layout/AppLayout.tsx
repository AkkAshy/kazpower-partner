"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AuthProvider, useAuth } from "@/lib/auth"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { MobileSidebar } from "./MobileSidebar"

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isLoginPage = pathname === "/"

  /* Если не авторизован и не на странице логина — редирект */
  useEffect(() => {
    if (!isLoading && !token && !isLoginPage) {
      router.push("/")
    }
  }, [isLoading, token, isLoginPage, router])

  /* Если авторизован и на странице логина — на дашборд */
  useEffect(() => {
    if (!isLoading && token && isLoginPage) {
      router.push("/dashboard")
    }
  }, [isLoading, token, isLoginPage, router])

  /* Загрузка */
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1a1a2e]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    )
  }

  /* Страница логина — без лейаута */
  if (isLoginPage) {
    return <>{children}</>
  }

  /* Не авторизован — ничего не показываем (будет редирект) */
  if (!token) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Десктоп сайдбар */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Мобильный сайдбар */}
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Основной контент */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuToggle={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1400px] p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 15000,
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LayoutContent>{children}</LayoutContent>
      </AuthProvider>
    </QueryClientProvider>
  )
}
