"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Banknote,
  CalendarDays,
  TrendingUp,
  Wifi,
  WifiOff,
  Loader2,
  Filter,
} from "lucide-react"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth"
import { formatMoney } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import type { DashboardData } from "@/lib/types"

/* === Пресеты периодов === */
type PresetKey = "today" | "week" | "month" | "all" | "custom"

interface Preset {
  key: PresetKey
  label: string
  /** Возвращает [date_from, date_to] в формате YYYY-MM-DD, или null для "всё время" */
  range: () => [string, string] | null
}

function fmt(d: Date) {
  return d.toISOString().slice(0, 10)
}

const presets: Preset[] = [
  {
    key: "today",
    label: "Сегодня",
    range: () => {
      const t = fmt(new Date())
      return [t, t]
    },
  },
  {
    key: "week",
    label: "Неделя",
    range: () => {
      const now = new Date()
      const from = new Date(now)
      from.setDate(now.getDate() - 6)
      return [fmt(from), fmt(now)]
    },
  },
  {
    key: "month",
    label: "Месяц",
    range: () => {
      const now = new Date()
      const from = new Date(now.getFullYear(), now.getMonth(), 1)
      return [fmt(from), fmt(now)]
    },
  },
  { key: "all", label: "Всё время", range: () => null },
  { key: "custom", label: "Период", range: () => null },
]

export default function DashboardPage() {
  const { partner } = useAuth()
  const [activePreset, setActivePreset] = useState<PresetKey>("today")
  const [customFrom, setCustomFrom] = useState("")
  const [customTo, setCustomTo] = useState("")

  // Вычисляем параметры запроса
  const queryParams = useMemo(() => {
    if (activePreset === "all") return {}
    if (activePreset === "custom") {
      if (customFrom && customTo) return { date_from: customFrom, date_to: customTo }
      return {}
    }
    const preset = presets.find((p) => p.key === activePreset)
    const range = preset?.range()
    if (!range) return {}
    return { date_from: range[0], date_to: range[1] }
  }, [activePreset, customFrom, customTo])

  const hasPeriod = !!queryParams.date_from

  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["partner-dashboard", queryParams],
    queryFn: () =>
      api.get("/dashboard/", { params: queryParams }).then((r) => {
        const d = r.data
        return {
          ...d,
          earnings_today: Number(d.partner?.daily_earnings ?? 0),
          earnings_month: Number(d.partner?.monthly_earnings ?? 0),
          earnings_total: Number(d.partner?.total_earnings ?? 0),
          period_earnings: Number(d.partner?.period_earnings ?? 0),
          stations: d.stations?.map((s: Record<string, unknown>) => ({
            ...s,
            earnings_today: Number(s.daily_earnings ?? 0),
            earnings_month: Number(s.monthly_earnings ?? 0),
            earnings_total: Number(s.total_earnings ?? 0),
            period_earnings: Number(s.period_earnings ?? 0),
          })),
        }
      }),
    refetchInterval: 30000,
  })

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-sm text-gray-500">Ошибка загрузки данных</p>
      </div>
    )
  }

  // Основная сумма — если выбран период, показываем period_earnings
  const mainEarnings =
    hasPeriod && data?.period_earnings !== undefined
      ? data.period_earnings
      : activePreset === "today"
        ? (data?.earnings_today ?? 0)
        : activePreset === "month"
          ? (data?.earnings_month ?? 0)
          : (data?.earnings_total ?? 0)

  const presetLabel = presets.find((p) => p.key === activePreset)?.label ?? ""

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-xl font-bold text-foreground">
          {partner?.name || data?.partner?.name || "Панель управления"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">Обзор доходов и станций</p>
      </div>

      {/* Фильтр периода */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-gray-400" />
          {presets.map((p) => (
            <button
              key={p.key}
              onClick={() => setActivePreset(p.key)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                activePreset === p.key
                  ? "bg-brand text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Кастомный диапазон */}
        {activePreset === "custom" && (
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
            <span className="text-gray-400 text-sm">—</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
        )}
      </div>

      {/* Карточки статистики */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard
          title={activePreset === "custom" ? "За период" : presetLabel}
          value={formatMoney(mainEarnings)}
          icon={Banknote}
          variant="brand"
        />
        <StatsCard
          title="За месяц"
          value={formatMoney(data?.earnings_month ?? 0)}
          icon={CalendarDays}
        />
        <StatsCard
          title="За всё время"
          value={formatMoney(data?.earnings_total ?? 0)}
          icon={TrendingUp}
        />
      </div>

      {/* Таблица станций */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">Ваши станции</h2>
        </div>

        {/* Десктоп таблица */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  ID устройства
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Название / Адрес
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Статус
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 text-right">
                  {hasPeriod ? "За период" : "Сегодня"}
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 text-right">
                  За месяц
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 text-right">
                  Всего
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.stations?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                    Нет станций
                  </td>
                </tr>
              )}
              {data?.stations?.map((station) => (
                <tr
                  key={station.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-3 font-mono text-xs text-gray-600">
                    {station.device_id}
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-foreground">
                      {station.name || "—"}
                    </p>
                    <p className="text-xs text-gray-400">{station.address || "—"}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                        station.is_online
                          ? "bg-brand-50 text-brand-700"
                          : "bg-gray-100 text-gray-400"
                      )}
                    >
                      {station.is_online ? (
                        <Wifi className="h-3 w-3" />
                      ) : (
                        <WifiOff className="h-3 w-3" />
                      )}
                      {station.is_online ? "Онлайн" : "Оффлайн"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-medium">
                    {formatMoney(
                      hasPeriod
                        ? (station.period_earnings ?? 0)
                        : station.earnings_today
                    )}
                  </td>
                  <td className="px-5 py-3 text-right font-medium">
                    {formatMoney(station.earnings_month)}
                  </td>
                  <td className="px-5 py-3 text-right font-medium">
                    {formatMoney(station.earnings_total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Мобильные карточки */}
        <div className="md:hidden divide-y divide-gray-100">
          {data?.stations?.length === 0 && (
            <div className="px-5 py-8 text-center text-gray-400">
              Нет станций
            </div>
          )}
          {data?.stations?.map((station) => (
            <div key={station.id} className="px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {station.name || station.device_id}
                  </p>
                  <p className="text-xs text-gray-400">
                    {station.address || station.device_id}
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    station.is_online
                      ? "bg-brand-50 text-brand-700"
                      : "bg-gray-100 text-gray-400"
                  )}
                >
                  {station.is_online ? (
                    <Wifi className="h-3 w-3" />
                  ) : (
                    <WifiOff className="h-3 w-3" />
                  )}
                  {station.is_online ? "Онлайн" : "Оффлайн"}
                </span>
              </div>
              <div className="flex gap-4 text-xs">
                <div>
                  <span className="text-gray-400">
                    {hasPeriod ? "Период: " : "Сегодня: "}
                  </span>
                  <span className="font-medium">
                    {formatMoney(
                      hasPeriod
                        ? (station.period_earnings ?? 0)
                        : station.earnings_today
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Месяц: </span>
                  <span className="font-medium">{formatMoney(station.earnings_month)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Всего: </span>
                  <span className="font-medium">{formatMoney(station.earnings_total)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* Компонент карточки статистики */
function StatsCard({
  title,
  value,
  icon: Icon,
  variant = "default",
}: {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  variant?: "default" | "brand"
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md p-5",
        variant === "brand"
          ? "border-0 bg-brand text-white"
          : "border-gray-200 bg-white"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p
            className={cn(
              "text-[12px] font-semibold uppercase tracking-wide",
              variant === "brand" ? "text-white/70" : "text-gray-400"
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              "text-[26px] font-bold leading-none tracking-tight",
              variant === "brand" ? "text-white" : "text-foreground"
            )}
          >
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            variant === "brand" ? "bg-white/15" : "bg-brand-50"
          )}
        >
          <Icon
            className={cn(
              "h-5 w-5",
              variant === "brand" ? "text-white" : "text-brand"
            )}
          />
        </div>
      </div>
    </div>
  )
}
