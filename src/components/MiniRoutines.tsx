import { MiniCard } from '@/components/MiniCard'
import { ScrollArea } from '@/components/ScrollArea'
import type { Routine } from '../types'
import { dayProgress } from '../utils/routines'
import { todayKey } from '../utils/tasks'
import { RoutineDayList } from './RoutineDayList'

interface MiniRoutinesProps {
  routines: Routine[]
  logs: Set<string>
  onOpen: () => void
  onUnpin: () => void
  onSetDone: (routineId: string, date: string, done: boolean) => void
  className?: string
}

// Las rutinas de hoy para marcar sin salir de Inicio
export default function MiniRoutines({ routines, logs, onOpen, onUnpin, onSetDone, className }: MiniRoutinesProps) {
  const today = todayKey()
  const { due, done } = dayProgress(routines, logs, today)
  const label = `Rutinas · Hoy${due > 0 ? ` ${done}/${due}` : ''}`

  return (
    <MiniCard label={label} onOpen={onOpen} openLabel="Abrir Rutinas" onUnpin={onUnpin} className={className}>
      <ScrollArea watch={due} className="-mx-1 -my-1 max-h-52 px-1 py-1">
        <RoutineDayList
          routines={routines}
          logs={logs}
          day={today}
          today={today}
          variant="plain"
          onToggle={(routine, day) => onSetDone(routine.id, day, !logs.has(`${routine.id}_${day}`))}
          emptyText={routines.length === 0 ? 'Aún no tienes rutinas.' : 'Hoy no toca ninguna rutina.'}
        />
      </ScrollArea>
    </MiniCard>
  )
}
