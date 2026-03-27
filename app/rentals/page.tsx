"use client"

import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { formatDate, formatMoney } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import type { PartnerRental, PaginatedResponse } from "@/lib/types"

/** Конфиг для цветных бейджей статусов */
const statusStyles: Record<string, { bg: string; dot: string }> = {
  pending_payment: { bg: "bg-amber-50 text-amber-700", dot: "bg-amber-400" },
  active: { bg: "bg-brand-50 text-brand-700", dot: "bg-brand" },
  overdue: { bg: "bg-red-50 text-red-700", dot: "bg-red-500" },
  returned: { bg: "bg-sky-50 text-sky-700", dot: "bg-sky-500" },
  completed: { bg: "bg-slate-50 text-slate-600", dot: "bg-slate-400" },
  cancelled: { bg: "bg-slate-50 text-slate-400", dot: "bg-slate-300" },
}

export default function RentalsPage() {
  const { data, isLoading, error } = useQuery<PaginatedResponse<PartnerRental>>({
    queryKey: ["partner-rentals"],
    queryFn: () => api.get("/rentals/").then((r) => r.data),
  })

  const rentals = data?.results ?? (Array.isArray(data) ? (data as PartnerRental[]) : [])

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Аренды</h1>
        <p className="mt-1 text-sm text-gray-500">
          История аренд на ваших станциях
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Десктоп таблица */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  #
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Станция
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Статус
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Тип
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 text-right">
                  Доход
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Начало
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Конец
                </th>
              </tr>
            </thead>
            <tbody>
              {rentals.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-400">
                    Нет аренд
                  </td>
                </tr>
              )}
              {rentals.map((rental) => {
                const style = statusStyles[rental.status] || statusStyles.completed
                return (
                  <tr
                    key={rental.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-3 text-gray-400">{rental.id}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-foreground">
                        {rental.station_name || rental.station_device_id}
                      </p>
                      <p className="text-xs text-gray-400">
                        {rental.station_device_id}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                          style.bg
                        )}
                      >
                        <span
                          className={cn("h-1.5 w-1.5 rounded-full", style.dot)}
                        />
                        {rental.status_display}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs">
                      {rental.is_free ? (
                        <span className="rounded-full bg-purple-50 px-2 py-0.5 text-purple-600 font-medium">
                          Бесплатная
                        </span>
                      ) : (
                        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-brand-700 font-medium">
                          Платная
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right font-medium">
                      {formatMoney(rental.partner_earning)}
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500">
                      {formatDate(rental.started_at)}
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500">
                      {formatDate(rental.ended_at)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Мобильные карточки */}
        <div className="md:hidden divide-y divide-gray-100">
          {rentals.length === 0 && (
            <div className="px-5 py-8 text-center text-gray-400">
              Нет аренд
            </div>
          )}
          {rentals.map((rental) => {
            const style = statusStyles[rental.status] || statusStyles.completed
            return (
              <div key={rental.id} className="px-4 py-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      #{rental.id} {rental.station_name || rental.station_device_id}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(rental.started_at)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      style.bg
                    )}
                  >
                    <span
                      className={cn("h-1.5 w-1.5 rounded-full", style.dot)}
                    />
                    {rental.status_display}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">
                    {rental.is_free ? "Бесплатная" : "Платная"}
                  </span>
                  <span className="font-semibold text-foreground">
                    {formatMoney(rental.partner_earning)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
