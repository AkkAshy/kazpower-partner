"use client"

import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { formatDate, formatMoney } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import type { Payout, PaginatedResponse } from "@/lib/types"

/** Стили статусов выплат */
const payoutStatusStyles: Record<string, { bg: string; dot: string }> = {
  pending: { bg: "bg-amber-50 text-amber-700", dot: "bg-amber-400" },
  paid: { bg: "bg-brand-50 text-brand-700", dot: "bg-brand" },
  cancelled: { bg: "bg-red-50 text-red-600", dot: "bg-red-400" },
}

export default function PayoutsPage() {
  const { data, isLoading, error } = useQuery<PaginatedResponse<Payout>>({
    queryKey: ["partner-payouts"],
    queryFn: () => api.get("/payouts/").then((r) => r.data),
  })

  const payouts = data?.results ?? (Array.isArray(data) ? (data as Payout[]) : [])

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
        <h1 className="text-xl font-bold text-foreground">Выплаты</h1>
        <p className="mt-1 text-sm text-gray-500">
          История начислений и выплат
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
                  Период
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 text-right">
                  Сумма
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Статус
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Дата выплаты
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Примечание
                </th>
              </tr>
            </thead>
            <tbody>
              {payouts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                    Нет выплат
                  </td>
                </tr>
              )}
              {payouts.map((payout) => {
                const style =
                  payoutStatusStyles[payout.status] || payoutStatusStyles.pending
                return (
                  <tr
                    key={payout.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-3 text-gray-400">{payout.id}</td>
                    <td className="px-5 py-3 font-medium text-foreground">
                      {payout.period}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-foreground">
                      {formatMoney(payout.amount)}
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
                        {payout.status_display}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500">
                      {formatDate(payout.paid_at)}
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500 max-w-[200px] truncate">
                      {payout.note || "—"}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Мобильные карточки */}
        <div className="md:hidden divide-y divide-gray-100">
          {payouts.length === 0 && (
            <div className="px-5 py-8 text-center text-gray-400">
              Нет выплат
            </div>
          )}
          {payouts.map((payout) => {
            const style =
              payoutStatusStyles[payout.status] || payoutStatusStyles.pending
            return (
              <div key={payout.id} className="px-4 py-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {payout.period}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(payout.paid_at)}
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
                    {payout.status_display}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {payout.note || "—"}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {formatMoney(payout.amount)}
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
