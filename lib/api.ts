import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://whats.saribek.uz"

/** Axios-инстанс для партнёрского API */
export const api = axios.create({
  baseURL: `${API_URL}/api/partners`,
})

/* Интерцептор: добавляем Bearer токен к каждому запросу */
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("partner_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

/* Интерцептор: при 401 — редирект на логин */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("partner_token")
      localStorage.removeItem("partner_data")
      window.location.href = "/"
    }
    return Promise.reject(error)
  }
)
