import { useState } from 'react'
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import { IconButton } from '@/components/IconButton'
import { MiniCard } from '@/components/MiniCard'
import { cn } from '@/lib/utils'
import { WEEK_DAYS_LONG, WEEK_DAYS_SHORT, formatMonth, getMonthCells, getMonthStart } from '../utils/calendar'
import type { CalendarView, Routine, Task } from '../types'
import { toDateKey } from '../utils/notes'
import { countsOn, formatWeekRange, hasLog, weekKeys, weekStartKey } from '../utils/routines'
import { fromDateKey, shiftDateKey } from '../utils/tasks'

interface MiniCalendarProps {
  view: CalendarView
  tasks: Task[]
  routines: Routine[]
  logs: Set<string>
  onOpen: () => void
  onUnpin: () => void
}

// Versión pequeña del calendario para fijarla en Inicio
export default function MiniCalendar(props: MiniCalendarProps) {
  return props.view === 'week' ? <MiniWeek {...props} /> : <MiniMonth {...props} />
}

// Semana fijada: los siete días con sus tareas y rutinas
function MiniWeek({ tasks, routines, logs, onOpen, onUnpin }: MiniCalendarProps) {
  const today = toDateKey(new Date())
  const [anchor, setAnchor] = useState(today)
  const isCurrent = weekStartKey(anchor) === weekStartKey(today)

  return (
    <MiniCard label="Calendario · Semana" onOpen={onOpen} openLabel="Abrir Calendario" onUnpin={onUnpin}>
      <div className="flex items-center justify-between">
        <span aria-live="polite" className="whitespace-nowrap text-sm font-semibold">
          {formatWeekRange(anchor)}
        </span>
        <div className="flex items-center">
          {!isCurrent && (
            <button
              type="button"
              onClick={() => setAnchor(today)}
              className="mr-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Hoy
            </button>
          )}
          <IconButton label="Semana anterior" size="icon-xs" onClick={() => setAnchor(shiftDateKey(anchor, -7))}>
            <CaretLeftIcon />
          </IconButton>
          <IconButton label="Semana siguiente" size="icon-xs" onClick={() => setAnchor(shiftDateKey(anchor, 7))}>
            <CaretRightIcon />
          </IconButton>
        </div>
      </div>

      <ol className="grid grid-cols-7 gap-1">
        {weekKeys(anchor).map((day, index) => {
          const isToday = day === today
          const dayTasks = tasks.filter((task) => task.date === day)
          const dayRoutines = routines.filter((routine) => countsOn(routine, logs, day))
          const doneRoutines = dayRoutines.filter((routine) => hasLog(logs, routine, day)).length
          return (
            <li
              key={day}
              aria-current={isToday ? 'date' : undefined}
              className={cn('flex min-h-24 min-w-0 flex-col items-center gap-1 rounded-lg border p-1', isToday && 'border-foreground/40 bg-muted/60')}
            >
              <span className="text-xs text-muted-foreground">
                <span aria-hidden="true">{WEEK_DAYS_SHORT[index]}</span>
                <span className="sr-only">{WEEK_DAYS_LONG[index]}</span>
              </span>
              <span
                className={cn(
                  'flex size-6 items-center justify-center rounded-full text-xs font-semibold tabular-nums',
                  isToday && 'bg-primary text-primary-foreground',
                )}
              >
                {fromDateKey(day).getDate()}
              </span>
              {dayTasks.length > 0 && (
                <span className="max-w-full truncate rounded-full bg-secondary px-1.5 text-[11px] tabular-nums">
                  {dayTasks.length}
                  <span className="sr-only"> {dayTasks.length === 1 ? 'tarea' : 'tareas'}</span>
                </span>
              )}
              {dayRoutines.length > 0 && (
                <span
                  className={cn(
                    'max-w-full truncate rounded-full px-1.5 text-[11px] tabular-nums',
                    doneRoutines === dayRoutines.length ? 'bg-brand text-primary-foreground' : 'border text-muted-foreground',
                  )}
                >
                  {doneRoutines}/{dayRoutines.length}
                  <span className="sr-only"> rutinas</span>
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </MiniCard>
  )
}

function MiniMonth({ onOpen, onUnpin }: MiniCalendarProps) {
  const [viewDate, setViewDate] = useState(() => getMonthStart(new Date()))

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const todayKey = toDateKey(new Date())

  const changeMonth = (delta: number) => setViewDate(new Date(year, month + delta, 1))
  const today = new Date()
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth()

  return (
    <MiniCard label="Calendario" onOpen={onOpen} openLabel="Abrir Calendario" onUnpin={onUnpin}>
      <div className="flex items-center justify-between">
        {/* El chip ya abre la página con el teclado; el mes es un atajo extra para el ratón */}
        <button
          type="button"
          onClick={onOpen}
          tabIndex={-1}
          className="whitespace-nowrap text-sm font-semibold first-letter:uppercase"
        >
          {formatMonth(viewDate, true)}
        </button>
        <div className="flex items-center">
          {/* Volver al mes actual tras pasar meses */}
          {!isCurrentMonth && (
            <button
              type="button"
              onClick={() => setViewDate(getMonthStart(new Date()))}
              className="mr-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Hoy
            </button>
          )}
          <IconButton label="Mes anterior" size="icon-xs" onClick={() => changeMonth(-1)}>
            <CaretLeftIcon />
          </IconButton>
          <IconButton label="Mes siguiente" size="icon-xs" onClick={() => changeMonth(1)}>
            <CaretRightIcon />
          </IconButton>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center">
        {/* Letra a la vista; el lector de pantalla oye el nombre completo del día */}
        {WEEK_DAYS_SHORT.map((day, index) => (
          <span key={index} className="py-0.5 text-xs text-muted-foreground">
            <span aria-hidden="true">{day}</span>
            <span className="sr-only">{WEEK_DAYS_LONG[index]}</span>
          </span>
        ))}

        {getMonthCells(viewDate).map((day, index) => {
          if (day === null) return <span key={`empty-${index}`} />

          const key = toDateKey(new Date(year, month, day))
          return (
            <span
              key={key}
              className={cn(
                'rounded py-[3px] text-xs text-muted-foreground',
                key === todayKey && 'bg-primary font-bold text-primary-foreground'
              )}
            >
              {day}
              {key === todayKey && <span className="sr-only"> (hoy)</span>}
            </span>
          )
        })}
      </div>
    </MiniCard>
  )
}
