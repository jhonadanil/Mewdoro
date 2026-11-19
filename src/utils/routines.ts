import type { Routine } from '../types'
import { toDateKey } from './notes'
import { fromDateKey, shiftDateKey } from './tasks'

// 0 = lunes … 6 = domingo, para una fecha "AAAA-MM-DD"
export const weekdayOf = (key: string) => (fromDateKey(key).getDay() + 6) % 7

export const isScheduled = (routine: Routine, key: string) => routine.days.includes(weekdayOf(key))

export const hasLog = (logs: Set<string>, routine: Routine, key: string) => logs.has(`${routine.id}_${key}`)

// Día (en hora local) en que se creó la rutina. createdAt está en UTC: cortarlo a 10 caracteres
// daba "mañana" para quien crea una rutina de noche, y hoy no se podía marcar
export const createdDay = (routine: Routine) => toDateKey(new Date(routine.createdAt))

// Una rutina solo cuenta desde el día en que se creó
export const startedBy = (routine: Routine, key: string) => key >= createdDay(routine)

// Un día "cuenta" para una rutina si tocaba ese día o si ya tiene una marca (por ejemplo, de antes de
// cambiar los días): así lo marcado nunca desaparece ni deja de poder desmarcarse
export const countsOn = (routine: Routine, logs: Set<string>, key: string) =>
  (isScheduled(routine, key) && startedBy(routine, key)) || hasLog(logs, routine, key)

// Lunes de la semana que contiene la fecha
export function weekStartKey(key: string) {
  return shiftDateKey(key, -weekdayOf(key))
}

export function weekKeys(key: string) {
  const start = weekStartKey(key)
  return Array.from({ length: 7 }, (_, index) => shiftDateKey(start, index))
}

// "17 – 23 nov"
export function formatWeekRange(key: string) {
  const days = weekKeys(key)
  const first = fromDateKey(days[0])
  const last = fromDateKey(days[6])
  const month = (date: Date) => date.toLocaleDateString('es', { month: 'short' }).replace('.', '')
  if (first.getMonth() === last.getMonth()) return `${first.getDate()} – ${last.getDate()} ${month(last)}`
  return `${first.getDate()} ${month(first)} – ${last.getDate()} ${month(last)}`
}

// Días seguidos en que se cumplió la rutina, contando hacia atrás desde hoy.
// Solo cuentan los días en que tocaba. Un hoy todavía pendiente no rompe la racha, y se perdona
// un día fallado por semana (de lunes a domingo): el segundo fallo de esa semana sí la rompe.
export function currentStreak(routine: Routine, logs: Set<string>, today: string) {
  if (routine.days.length === 0) return 0
  let streak = 0
  let key = today
  const forgivenWeeks = new Set<string>()
  // Tope de un año para no recorrer indefinidamente
  for (let step = 0; step < 366 && key >= createdDay(routine); step++) {
    if (isScheduled(routine, key)) {
      if (hasLog(logs, routine, key)) streak++
      else if (key !== today) {
        const week = weekStartKey(key)
        if (forgivenWeeks.has(week)) break
        forgivenWeeks.add(week)
      }
    }
    key = shiftDateKey(key, -1)
  }
  return streak
}

// Porcentaje cumplido de los días que contaban entre dos fechas (ambas incluidas); null si no contó ninguno
export function adherence(routine: Routine, logs: Set<string>, from: string, to: string) {
  const start = from < createdDay(routine) ? createdDay(routine) : from
  let due = 0
  let done = 0
  for (let key = start; key <= to; key = shiftDateKey(key, 1)) {
    if (!countsOn(routine, logs, key)) continue
    due++
    if (hasLog(logs, routine, key)) done++
  }
  return due === 0 ? null : Math.round((done / due) * 100)
}

// Cuántas rutinas contaban un día y cuántas se hicieron
export function dayProgress(routines: Routine[], logs: Set<string>, key: string) {
  const due = routines.filter((routine) => countsOn(routine, logs, key))
  const done = due.filter((routine) => hasLog(logs, routine, key)).length
  return { due: due.length, done }
}

// Cuántas veces tocaba una rutina en la semana hasta hoy y cuántas se cumplieron
export function weekProgress(routine: Routine, logs: Set<string>, anchor: string, today: string) {
  const days = weekKeys(anchor).filter((day) => day <= today && countsOn(routine, logs, day))
  return { due: days.length, done: days.filter((day) => hasLog(logs, routine, day)).length }
}
