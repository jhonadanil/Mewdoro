import { cn } from '@/lib/utils'
import { DayCheck } from '../RoutineDayList'
import type { Routine } from '../../types'
import { WEEK_DAYS, WEEK_DAYS_LONG } from '../../utils/calendar'
import { dayProgress, hasLog, weekKeys } from '../../utils/routines'
import { fromDateKey, todayKey } from '../../utils/tasks'

interface DemoWeekProps {
  routines: Routine[]
  logs: Set<string>
  onToggle: (routineId: string, day: string) => void
}

// La semana de Rutinas con datos de ejemplo; comparte estado con la tarjeta de Rutinas de arriba
export default function DemoWeek({ routines, logs, onToggle }: DemoWeekProps) {
  const today = todayKey()
  const week = weekKeys(today)

  return (
    <div className="overflow-x-auto rounded-2xl border">
      <table className="w-full min-w-[520px] border-collapse">
        <caption className="sr-only">Semana de ejemplo de seguimiento de rutinas</caption>
        <thead>
          <tr>
            <th scope="col" className="w-[190px] border-b p-3 text-left text-xs font-normal text-muted-foreground">
              Rutina
            </th>
            {week.map((day, index) => (
              <th key={day} scope="col" abbr={WEEK_DAYS_LONG[index]} aria-current={day === today ? 'date' : undefined} className="border-b p-2 text-center text-xs font-normal text-muted-foreground">
                <div>{WEEK_DAYS[index]}</div>
                <div className={cn('mx-auto mt-1 flex size-6 items-center justify-center rounded-full text-[13px] tabular-nums', day === today && 'bg-foreground font-bold text-background')}>
                  {fromDateKey(day).getDate()}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {routines.map((routine) => (
            <tr key={routine.id} className="border-b">
              <th scope="row" className="p-3 text-left font-normal">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span className="text-lg">{routine.icon}</span>
                  <span className="truncate">{routine.name}</span>
                </span>
              </th>
              {week.map((day) => (
                <td key={day} className={cn('p-1 text-center', day === today && 'bg-muted/60')}>
                  <div className="flex h-9 items-center justify-center">
                    <DayCheck routine={routine} day={day} today={today} done={hasLog(logs, routine, day)} onToggle={() => onToggle(routine.id, day)} />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" className="p-3 text-left text-xs font-normal text-muted-foreground">
              Rutinas hechas
            </th>
            {week.map((day) => {
              const { due, done } = dayProgress(routines, logs, day)
              return (
                <td key={day} className={cn('p-2 text-center text-xs tabular-nums text-muted-foreground', day === today && 'bg-muted/60')}>
                  {due === 0 ? '–' : `${done}/${due}`}
                </td>
              )
            })}
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
