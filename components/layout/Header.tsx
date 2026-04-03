"use client"

import { LogOut, Menu, Zap } from "lucide-react"
import { useAuth } from "@/lib/auth"

interface HeaderProps {
  onMenuToggle: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { partner, logout } = useAuth()

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        {/* Кнопка мобильного меню */}
        <button
          onClick={onMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Логотип для мобилки */}
        <div className="flex items-center gap-2 md:hidden">
          <img src="/logo.jpg" alt="KAZ Power" className="h-7 w-7 rounded-lg object-cover" />
          <span className="text-sm font-bold text-foreground">
            KAZ <span className="text-brand">Power</span>
          </span>
        </div>

        {/* Имя партнёра (десктоп) */}
        <div className="hidden md:block">
          <p className="text-sm font-medium text-foreground">
            {partner?.name || "Партнёр"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-xs text-gray-400 sm:block">
          {partner?.contact_person}
        </span>
        <button
          onClick={logout}
          className="flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Выйти</span>
        </button>
      </div>
    </header>
  )
}
