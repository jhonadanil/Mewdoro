import type { Routine } from '../types'
import { countsOn, createdDay, currentStreak, hasLog, isScheduled } from './routines'
import { shiftDateKey } from './tasks'

// Cada rutina hecha da 10 puntos de experiencia
export const XP_PER_LOG = 10

// Nivel n empieza en 50·(n-1)² puntos: sube rápido al principio y cada vez cuesta un poco más
export function levelInfo(xp: number) {
  const level = Math.floor(Math.sqrt(xp / 50)) + 1
  const base = 50 * (level - 1) ** 2
  const next = 50 * level ** 2
  return { level, into: xp - base, needed: next - base, progress: (xp - base) / (next - base) }
}

const RANKS: { from: number; name: string; icon: string }[] = [
  { from: 1, name: 'Novato', icon: '🌱' },
  { from: 2, name: 'Aprendiz', icon: '🪵' },
  { from: 3, name: 'Constante', icon: '⚔️' },
  { from: 5, name: 'Disciplinado', icon: '🛡️' },
  { from: 8, name: 'Veterano', icon: '🏅' },
  { from: 12, name: 'Maestro', icon: '👑' },
  { from: 20, name: 'Leyenda', icon: '🐉' },
]

export const rankFor = (level: number) => [...RANKS].reverse().find((rank) => level >= rank.from) ?? RANKS[0]

// Hitos de racha de cada rutina
export const MILESTONES = [3, 7, 14, 30, 60, 100, 365]

export const nextMilestone = (streak: number) => MILESTONES.find((milestone) => milestone > streak) ?? null

// Mejor racha de la rutina en su historia (sin perdonar días); nunca menor que la actual
export function bestStreak(routine: Routine, logs: Set<string>, today: string) {
  const earliest = shiftDateKey(today, -799)
  let key = createdDay(routine) > earliest ? createdDay(routine) : earliest
  let best = 0
  let run = 0
  for (; key <= today; key = shiftDateKey(key, 1)) {
    if (!isScheduled(routine, key)) continue
    if (hasLog(logs, routine, key)) {
      run++
      best = Math.max(best, run)
    } else if (key !== today) {
      run = 0
    }
  }
  return Math.max(best, currentStreak(routine, logs, today))
}

// Rutinas hechas en total (solo de rutinas que existen)
export function totalDone(routines: Routine[], logs: Set<string>) {
  const ids = new Set(routines.map((routine) => routine.id))
  let total = 0
  for (const id of logs) if (ids.has(id.slice(0, id.lastIndexOf('_')))) total++
  return total
}

export interface DayStat {
  key: string
  status: 'perfect' | 'partial' | 'missed' | 'pending' | 'rest'
}

// Estado de un día: perfecto (todas hechas), parcial, fallado, pendiente (hoy) o libre (no tocaba ninguna)
function dayStatus(routines: Routine[], logs: Set<string>, key: string, today: string): DayStat['status'] {
  const due = routines.filter((routine) => countsOn(routine, logs, key))
  if (due.length === 0) return 'rest'
  const done = due.filter((routine) => hasLog(logs, routine, key)).length
  if (done === due.length) return 'perfect'
  if (key === today) return 'pending'
  return done > 0 ? 'partial' : 'missed'
}

export function lastDays(routines: Routine[], logs: Set<string>, today: string, count: number): DayStat[] {
  return Array.from({ length: count }, (_, index) => {
    const key = shiftDateKey(today, index - (count - 1))
    return { key, status: dayStatus(routines, logs, key, today) }
  })
}

// Racha global: días seguidos con todas las rutinas hechas. Los días libres no la rompen y un hoy pendiente tampoco
export function perfectStreak(routines: Routine[], logs: Set<string>, today: string) {
  let streak = 0
  for (let step = 0; step < 366; step++) {
    const status = dayStatus(routines, logs, shiftDateKey(today, -step), today)
    if (status === 'perfect') streak++
    else if (status === 'partial' || status === 'missed') break
  }
  return streak
}

export function perfectDays(routines: Routine[], logs: Set<string>, today: string) {
  let count = 0
  for (let step = 0; step < 366; step++) {
    if (dayStatus(routines, logs, shiftDateKey(today, -step), today) === 'perfect') count++
  }
  return count
}

export interface Achievement {
  id: string
  icon: string
  title: string
  description: string
  value: number
  goal: number
}

export function getAchievements(stats: { total: number; best: number; perfect: number; routines: number }): Achievement[] {
  return [
    { id: 'first', icon: '👣', title: 'Primer paso', description: 'Completa tu primera rutina', value: stats.total, goal: 1 },
    { id: 'streak3', icon: '🔥', title: 'Chispa', description: 'Racha de 3 días en una rutina', value: stats.best, goal: 3 },
    { id: 'streak7', icon: '☄️', title: 'Semana de fuego', description: 'Racha de 7 días en una rutina', value: stats.best, goal: 7 },
    { id: 'streak30', icon: '🌋', title: 'Imparable', description: 'Racha de 30 días en una rutina', value: stats.best, goal: 30 },
    { id: 'perfect1', icon: '⭐', title: 'Día perfecto', description: 'Haz todas las rutinas de un día', value: stats.perfect, goal: 1 },
    { id: 'perfect7', icon: '🌟', title: 'Semana redonda', description: '7 días perfectos', value: stats.perfect, goal: 7 },
    { id: 'total50', icon: '💪', title: 'Medio centenar', description: 'Completa 50 rutinas', value: stats.total, goal: 50 },
    { id: 'total100', icon: '🏆', title: 'Centenario', description: 'Completa 100 rutinas', value: stats.total, goal: 100 },
    { id: 'collector', icon: '🗂️', title: 'Coleccionista', description: 'Ten 5 rutinas a la vez', value: stats.routines, goal: 5 },
  ]
}
