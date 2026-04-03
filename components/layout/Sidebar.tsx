"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BatteryCharging,
  Wallet,
  Zap,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Панель", icon: LayoutDashboard },
  { href: "/rentals", label: "Аренды", icon: BatteryCharging },
  { href: "/payouts", label: "Выплаты", icon: Wallet },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "hidden md:flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out shrink-0",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      {/* Логотип */}
      <div
        className={cn(
          "flex h-16 items-center gap-2.5 transition-all duration-300",
          collapsed ? "justify-center px-0" : "px-5"
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand">
          <Zap className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="text-[15px] font-bold tracking-tight text-white whitespace-nowrap">
              KAZ <span className="text-brand">Power</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-sidebar-foreground/40 whitespace-nowrap">
              Partner Portal
            </span>
          </div>
        )}
      </div>

      {/* Разделитель */}
      <div
        className={cn("h-px bg-sidebar-border", collapsed ? "mx-2" : "mx-4")}
      />

      {/* Навигация */}
      <nav
        className={cn("flex-1 space-y-0.5 pt-4", collapsed ? "px-1.5" : "px-3")}
      >
        {!collapsed && (
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-sidebar-foreground/30">
            Меню
          </p>
        )}
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group flex items-center rounded-xl text-[13px] font-medium transition-all duration-200",
                collapsed
                  ? "justify-center px-0 py-2.5"
                  : "gap-3 px-3 py-2.5",
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
              {!collapsed && (
                <>
                  <span className="flex-1 whitespace-nowrap overflow-hidden">
                    {item.label}
                  </span>
                  {isActive && (
                    <ChevronRight className="h-3.5 w-3.5 text-white/60" />
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Нижняя часть */}
      <div
        className={cn("h-px bg-sidebar-border", collapsed ? "mx-2" : "mx-4")}
      />

      <div
        className={cn(
          "flex items-center py-3 transition-all duration-300",
          collapsed ? "flex-col gap-2 px-0" : "justify-between px-5"
        )}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-brand animate-pulse" />
            <span className="text-[11px] text-sidebar-foreground/40">
              Система активна
            </span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-foreground/40 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          title={collapsed ? "Развернуть" : "Свернуть"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  )
}
