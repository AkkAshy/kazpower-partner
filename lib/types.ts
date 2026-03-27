/** Данные партнёра из API */
export interface Partner {
  id: number
  name: string
  contact_person: string
  phone: string
  address: string
}

/** Ответ на логин */
export interface LoginResponse {
  token: string
  partner: Partner
  user: {
    id: number
    username: string
  }
}

/** Станция партнёра */
export interface PartnerStation {
  id: number
  device_id: string
  name: string
  address: string
  is_online: boolean
  total_slots: number
  available_slots: number
  earnings_today: number
  earnings_month: number
}

/** Статистика дашборда */
export interface DashboardData {
  partner: Partner
  earnings_today: number
  earnings_month: number
  earnings_total: number
  stations: PartnerStation[]
}

/** Статус аренды */
export type RentalStatus =
  | "pending_payment"
  | "active"
  | "overdue"
  | "returned"
  | "completed"
  | "cancelled"

/** Аренда партнёра */
export interface PartnerRental {
  id: number
  station_name: string
  station_device_id: string
  status: RentalStatus
  status_display: string
  is_free: boolean
  partner_earning: number
  started_at: string | null
  ended_at: string | null
  created_at: string
}

/** Статус выплаты */
export type PayoutStatus = "pending" | "paid" | "cancelled"

/** Выплата партнёру */
export interface Payout {
  id: number
  period: string
  amount: number
  status: PayoutStatus
  status_display: string
  paid_at: string | null
  note: string
  created_at: string
}

/** Пагинация */
export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
