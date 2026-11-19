import { CheckIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { Routine } from '../types'
import { countsOn, hasLog, isScheduled } from '../utils/routines'
import { formatLongDay } from '../utils/tasks'

interface DayCheckProps {
  routine: Routine
  day: string
  done: boolean
  today: string
  onToggle: () => void
  // Casilla más grande para tocar con el dedo
  large?: boolean
}

// Casilla redonda de una rutina en un día. No se puede marcar el futuro ni un día en que no toca,
// pero lo ya marcado se ve siempre y se puede desmarcar
export function DayCheck({ routine, day, done, today, onToggle, large = false }: DayCheckProps) {
  if (!done && !isScheduled(routine, day)) {
    return (
      <span className="block size-1.5 rounded-full bg-border">
        <span className="sr-only">No toca</span>
      </span>
    )
  }
  const future = day > today
  return (
    <button
      type="button"
      aria-pressed={done}
      aria-label={`${routine.name}, ${formatLongDay(day)}`}
      disabled={future}
      onClick={onToggle}
      className={cn(
        'flex items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50',
        large ? 'size-11' : 'size-7',
        done ? 'border-brand bg-brand text-primary-foreground' : 'border-muted-foreground/80 hover:bg-muted',
      )}
    >
      {done && <CheckIcon weight="bold" className={large ? 'size-5' : 'size-3.5'} />}
    </button>
  )
}

interface RoutineDayListProps {
  routines: Routine[]
  logs: Set<string>
  day: string
  today: string
  onToggle: (routine: Routine, day: string) => void
  large?: boolean
  emptyText?: string
  // 'plain' son filas sin borde, para dentro de una tarjeta (nunca tarjetas dentro de tarjetas)
  variant?: 'cards' | 'plain'
}

// Las rutinas de un día con su casilla: la lista que se usa para "marcar hoy" y para cualquier otro día
export function RoutineDayList({ routines, logs, day, today, onToggle, large = false, emptyText = 'Ese día no toca ninguna rutina.', variant = 'cards' }: RoutineDayListProps) {
  const due = routines.filter((routine) => countsOn(routine, logs, day))
  if (due.length === 0) return <p className="text-sm text-muted-foreground">{emptyText}</p>

  return (
    <ul className={cn('flex flex-col', variant === 'plain' ? 'gap-2' : 'gap-1.5')}>
      {due.map((routine) => (
        <li
          key={routine.id}
          className={cn('flex items-center', variant === 'plain' ? 'gap-2.5 text-[13px]' : cn('gap-3 rounded-2xl border px-4', large ? 'py-2' : 'py-1.5'))}
        >
          <DayCheck routine={routine} day={day} today={today} done={hasLog(logs, routine, day)} onToggle={() => onToggle(routine, day)} large={large} />
          <span className={variant === 'plain' ? 'text-base' : 'text-lg'}>{routine.icon}</span>
          <span className={cn('min-w-0 break-words', variant === 'plain' ? 'text-[13px]' : 'text-sm')}>{routine.name}</span>
        </li>
      ))}
    </ul>
  )
}
