"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BatteryCharging,
  Wallet,
  Zap,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Панель", icon: LayoutDashboard },
  { href: "/rentals", label: "Аренды", icon: BatteryCharging },
  { href: "/payouts", label: "Выплаты", icon: Wallet },
]

interface MobileSidebarProps {
  open: boolean
  onClose: () => void
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const pathname = usePathname()

  if (!open) return null

  return (
    <>
      {/* Оверлей */}
      <div
        className="fixed inset-0 z-40 bg-black/50 md:hidden"
        onClick={onClose}
      />

      {/* Сайдбар */}
      <aside className="fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-sidebar text-sidebar-foreground md:hidden">
        {/* Шапка */}
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand">
              <Zap className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold tracking-tight text-white">
                KAZ<span className="text-brand">Power</span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-sidebar-foreground/40">
                Partner Portal
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-foreground/40 hover:bg-sidebar-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-4 h-px bg-sidebar-border" />

        {/* Навигация */}
        <nav className="flex-1 space-y-0.5 px-3 pt-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-sidebar-foreground/30">
            Меню
          </p>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-brand text-white shadow-[0_2px_8px_rgba(59,181,74,0.3)]"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-sidebar-foreground/40 group-hover:text-brand"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
