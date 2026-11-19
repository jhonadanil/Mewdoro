import { useState } from 'react'
import type { Routine } from '../../types'
import { weekdayOf } from '../../utils/routines'
import { shiftDateKey, todayKey } from '../../utils/tasks'

// Datos de ejemplo de la demo de la landing: nada de esto se guarda en ningún sitio.
// Las fechas son relativas a hoy para que la racha y la semana siempre tengan sentido.

const created = shiftDateKey(todayKey(), -30)
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6]

export const DEMO_ROUTINES: Routine[] = [
  { id: 'demo-leer', name: 'Leer 20 minutos', icon: '📖', days: ALL_DAYS, createdAt: `${created}T12:00:00.000Z` },
  { id: 'demo-ingles', name: 'Inglés: 15 min de práctica', icon: '🇬🇧', days: ALL_DAYS, createdAt: `${created}T12:00:00.000Z` },
  { id: 'demo-entrenar', name: 'Entrenar', icon: '🏃', days: [0, 2, 4], createdAt: `${created}T12:00:00.000Z` },
]

// Cuántos días seguidos, hasta ayer, ya van hechos de cada rutina
const DONE_BEFORE_TODAY: Record<string, number> = { 'demo-leer': 4, 'demo-ingles': 2, 'demo-entrenar': 0 }

function seedLogs() {
  const today = todayKey()
  const logs = new Set<string>()
  for (const routine of DEMO_ROUTINES) {
    const streak = DONE_BEFORE_TODAY[routine.id] ?? 0
    for (let back = 1; back <= streak; back++) logs.add(`${routine.id}_${shiftDateKey(today, -back)}`)
  }
  // Entrenar: los lunes, miércoles y viernes anteriores de esta semana
  for (let back = 1; back <= 6; back++) {
    const key = shiftDateKey(today, -back)
    if ([0, 2, 4].includes(weekdayOf(key))) logs.add(`demo-entrenar_${key}`)
  }
  return logs
}

// Estado compartido por las rutinas de la cabina y la semana: marcar en una se ve en la otra
export function useDemoRoutines() {
  const [logs, setLogs] = useState(seedLogs)
  const toggle = (routineId: string, day: string) =>
    setLogs((current) => {
      const next = new Set(current)
      const key = `${routineId}_${day}`
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  return { routines: DEMO_ROUTINES, logs, toggle }
}

export const DEMO_TASKS = [
  { id: 'a', text: 'Entregar el informe de redes', done: true },
  { id: 'b', text: 'Repasar apuntes de SQL', done: false },
  { id: 'c', text: 'Subir la práctica a GitHub', done: false },
  { id: 'd', text: 'Preparar la exposición del jueves', done: false },
  { id: 'e', text: 'Escribir el resumen del capítulo 4', done: false },
  { id: 'f', text: 'Pedir cita con el tutor', done: true },
]

export const DEMO_CODE = `def pomodoros(minutos, bloque=25):
    # Bloques de foco en tu tarde
    return minutos // bloque

print(pomodoros(180))
`
