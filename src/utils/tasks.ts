import { toDateKey } from './notes'

export const todayKey = () => toDateKey(new Date())

// Convierte "AAAA-MM-DD" en una fecha local (new Date("AAAA-MM-DD") la tomaría en UTC)
export function fromDateKey(key: string) {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function shiftDateKey(key: string, days: number) {
  const date = fromDateKey(key)
  date.setDate(date.getDate() + days)
  return toDateKey(date)
}

// "lunes, 17 de noviembre"
export function formatLongDay(key: string) {
  return fromDateKey(key).toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })
}

// "Hoy", "Mañana", "Ayer" o "lunes, 17 de noviembre"
export function formatDayLabel(key: string) {
  const today = todayKey()
  if (key === today) return 'Hoy'
  if (key === shiftDateKey(today, 1)) return 'Mañana'
  if (key === shiftDateKey(today, -1)) return 'Ayer'
  return formatLongDay(key)
}
