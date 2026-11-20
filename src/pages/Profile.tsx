import type { User } from 'firebase/auth'
import { CheckIcon, FlameIcon, LockSimpleIcon, TrophyIcon } from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { Page, PageTitle } from '../components/Page'
import type { Routine } from '../types'
import { WEEK_DAYS_LONG } from '../utils/calendar'
import {
  XP_PER_LOG,
  bestStreak,
  getAchievements,
  lastDays,
  levelInfo,
  nextMilestone,
  perfectDays,
  perfectStreak,
  rankFor,
  totalDone,
} from '../utils/profile'
import type { DayStat } from '../utils/profile'
import { currentStreak, weekdayOf } from '../utils/routines'
import { todayKey } from '../utils/tasks'

interface ProfileProps {
  user: User
  routines: Routine[]
  logs: Set<string>
  onOpenRoutines: () => void
}

// Mensaje que acompaña a la racha global
function cheer(streak: number, hasRoutines: boolean) {
  if (!hasRoutines) return 'Crea tu primera rutina para empezar la aventura.'
  if (streak === 0) return 'Hoy es un buen día para empezar una racha.'
  if (streak < 3) return '¡Buen comienzo! Un día más y se enciende.'
  if (streak < 7) return '¡Vas en llamas! No rompas la cadena.'
  if (streak < 30) return '¡Imparable! Esto ya es un hábito.'
  return '¡Leyenda! Nada te detiene.'
}

const STATUS_STYLE: Record<DayStat['status'], string> = {
  perfect: 'border-brand bg-brand text-primary-foreground',
  partial: 'border-brand/50 bg-brand/20',
  missed: 'border-destructive/40 bg-destructive/10',
  pending: 'border-dashed border-foreground/40',
  rest: 'border-transparent bg-muted/50',
}

const STATUS_LABEL: Record<DayStat['status'], string> = {
  perfect: 'todas hechas',
  partial: 'algunas hechas',
  missed: 'ninguna hecha',
  pending: 'pendiente',
  rest: 'sin rutinas',
}

export default function Profile({ user, routines, logs, onOpenRoutines }: ProfileProps) {
  const today = todayKey()
  const name = user.displayName ?? user.email?.split('@')[0] ?? 'Tú'

  const total = totalDone(routines, logs)
  const xp = total * XP_PER_LOG
  const { level, into, needed, progress } = levelInfo(xp)
  const rank = rankFor(level)

  const streak = perfectStreak(routines, logs, today)
  const perfect = perfectDays(routines, logs, today)
  const perRoutine = routines.map((routine) => ({
    routine,
    streak: currentStreak(routine, logs, today),
    best: bestStreak(routine, logs, today),
  }))
  const best = perRoutine.reduce((max, item) => Math.max(max, item.best), 0)
  const week = lastDays(routines, logs, today, 7)
  const achievements = getAchievements({ total, best, perfect, routines: routines.length })
  const unlocked = achievements.filter((item) => item.value >= item.goal).length

  return (
    <Page narrow>
      <PageTitle className="sr-only">Perfil</PageTitle>

      {/* Personaje: avatar, nivel y experiencia */}
      <Card className="mt-2 gap-4 px-5 py-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="size-16">
              <AvatarImage src={user.photoURL ?? undefined} alt="" referrerPolicy="no-referrer" />
              <AvatarFallback className="text-2xl font-semibold">{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-2 border-card bg-brand text-xs font-bold text-primary-foreground">
              {level}
            </span>
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold tracking-tight">{name}</h1>
            <p className="text-sm text-muted-foreground">
              {rank.icon} {rank.name} · Nivel {level}
            </p>
          </div>
        </div>
        <div>
          <div className="mb-1.5 flex justify-between text-xs text-muted-foreground tabular-nums">
            <span>Experiencia</span>
            <span>
              {into} / {needed} XP
            </span>
          </div>
          <Progress value={progress * 100} className="h-2.5" aria-label={`Progreso al nivel ${level + 1}`} />
          <p className="mt-1.5 text-xs text-muted-foreground">Cada rutina completada suma {XP_PER_LOG} XP.</p>
        </div>
      </Card>

      {/* Racha global */}
      <Card className="mt-4 items-center gap-1 px-5 py-6 text-center">
        <FlameIcon
          aria-hidden="true"
          weight={streak > 0 ? 'fill' : 'regular'}
          className={cn('size-14', streak > 0 ? 'text-brand motion-safe:animate-pulse' : 'text-muted-foreground')}
        />
        <p className="text-5xl font-bold tabular-nums">{streak}</p>
        <p className="text-sm font-medium">{streak === 1 ? 'día de racha perfecta' : 'días de racha perfecta'}</p>
        <p className="mt-1 text-sm text-muted-foreground">{cheer(streak, routines.length > 0)}</p>

        {/* Los últimos 7 días */}
        <ol className="mt-4 flex gap-2" aria-label="Últimos 7 días">
          {week.map((day) => {
            const index = weekdayOf(day.key)
            return (
              <li key={day.key} className="flex flex-col items-center gap-1" title={`${WEEK_DAYS_LONG[index]}: ${STATUS_LABEL[day.status]}`}>
                <span
                  className={cn(
                    'flex size-9 items-center justify-center rounded-full border text-xs',
                    STATUS_STYLE[day.status],
                    day.key === today && 'ring-2 ring-foreground/30 ring-offset-2 ring-offset-card',
                  )}
                >
                  {day.status === 'perfect' && <CheckIcon weight="bold" className="size-4" />}
                  <span className="sr-only">
                    {WEEK_DAYS_LONG[index]}: {STATUS_LABEL[day.status]}
                  </span>
                </span>
                <span aria-hidden="true" className="text-[11px] uppercase text-muted-foreground">
                  {WEEK_DAYS_LONG[index].charAt(0)}
                </span>
              </li>
            )
          })}
        </ol>
      </Card>

      {/* Estadísticas */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <Stat label="Mejor racha" value={best} unit={best === 1 ? 'día' : 'días'} />
        <Stat label="Rutinas hechas" value={total} />
        <Stat label="Días perfectos" value={perfect} />
      </div>

      {/* Rachas por rutina */}
      <h2 className="mb-3 mt-8 text-sm font-semibold text-muted-foreground">Rachas de tus rutinas</h2>
      {routines.length === 0 ? (
        <Card className="items-start gap-2 px-5 py-5">
          <p className="text-sm text-muted-foreground">Todavía no tienes rutinas. Crea una y empieza tu primera racha.</p>
          <button type="button" onClick={onOpenRoutines} className="text-sm font-medium underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2">
            Ir a Rutinas
          </button>
        </Card>
      ) : (
        <ul className="flex flex-col gap-2">
          {perRoutine.map(({ routine, streak: current, best: record }) => {
            const goal = nextMilestone(current)
            return (
              <li key={routine.id}>
                <Card size="sm" className="gap-2 px-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate text-sm font-medium">
                      {routine.icon} {routine.name}
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-sm font-semibold tabular-nums">
                      <FlameIcon aria-hidden="true" weight={current > 0 ? 'fill' : 'regular'} className={cn('size-4', current > 0 ? 'text-brand' : 'text-muted-foreground')} />
                      {current}
                      <span className="sr-only"> {current === 1 ? 'día' : 'días'} de racha</span>
                    </span>
                  </div>
                  {goal !== null ? (
                    <>
                      <Progress value={(current / goal) * 100} className="h-1.5" aria-label={`Hacia la racha de ${goal} días`} />
                      <p className="text-xs text-muted-foreground tabular-nums">
                        Próximo hito: {goal} días · te faltan {goal - current} · récord {record}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">¡Todos los hitos conseguidos! Récord: {record} días</p>
                  )}
                </Card>
              </li>
            )
          })}
        </ul>
      )}

      {/* Logros */}
      <h2 className="mb-3 mt-8 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <TrophyIcon aria-hidden="true" className="size-4" />
        Logros · {unlocked}/{achievements.length}
      </h2>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {achievements.map((item) => {
          const done = item.value >= item.goal
          return (
            <li key={item.id}>
              <Card size="sm" className={cn('h-full items-center gap-1 px-3 text-center', !done && 'opacity-60')}>
                <span aria-hidden="true" className={cn('text-3xl', !done && 'grayscale')}>
                  {done ? item.icon : <LockSimpleIcon className="mx-auto size-8 text-muted-foreground" />}
                </span>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
                {done ? (
                  <span className="mt-1 text-xs font-medium text-brand">Conseguido</span>
                ) : (
                  <span className="mt-1 text-xs tabular-nums text-muted-foreground">
                    {Math.min(item.value, item.goal)}/{item.goal}
                  </span>
                )}
              </Card>
            </li>
          )
        })}
      </ul>
    </Page>
  )
}

function Stat({ label, value, unit }: { label: string; value: number; unit?: string }) {
  return (
    <Card size="sm" className="items-center gap-0.5 px-2 text-center">
      <p className="text-2xl font-bold tabular-nums">
        {value}
        {unit && <span className="ml-1 text-xs font-normal text-muted-foreground">{unit}</span>}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </Card>
  )
}
