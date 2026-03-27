import { format, parseISO } from "date-fns"
import { ru } from "date-fns/locale"

/** Форматирование даты в русской локали */
export function formatDate(date: string | null) {
  if (!date) return "—"
  return format(parseISO(date), "dd.MM.yyyy HH:mm", { locale: ru })
}

/** Форматирование денег в тенге */
export function formatMoney(amount: number | string) {
  const num = typeof amount === "string" ? parseFloat(amount) : amount
  if (isNaN(num)) return "0 ₸"
  return `${num.toLocaleString("ru-RU")} ₸`
}
