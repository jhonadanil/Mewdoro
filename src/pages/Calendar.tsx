import { useState } from 'react'
import { CaretLeftIcon, CaretRightIcon, CheckIcon, PushPinIcon, PushPinSlashIcon } from '@phosphor-icons/react'
import { IconButton } from '@/components/IconButton'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Page, PageHeader, PageTitle } from '../components/Page'
import type { Routine, Task } from '../types'
import { WEEK_DAYS, WEEK_DAYS_LONG, formatMonth, getMonthCells, getMonthStart } from '../utils/calendar'
import { toDateKey } from '../utils/notes'
import { countsOn, dayProgress, formatWeekRange, hasLog, weekKeys, weekStartKey } from '../utils/routines'
import { formatLongDay, fromDateKey, shiftDateKey, todayKey } from '../utils/tasks'

interface CalendarProps {
  isPinned: boolean
  onTogglePin: () => void
  tasks: Task[]
  routines: Routine[]
  logs: Set<string>
}

type View = 'week' | 'month'

// Calendario con vista semanal y mensual: cada día muestra sus tareas flash y sus rutinas
export default function Calendar({ isPinned, onTogglePin, tasks, routines, logs }: CalendarProps) {
  const today = todayKey()
  const [view, setView] = useState<View>('week')
  const [anchor, setAnchor] = useState(today)

  const monthDate = getMonthStart(fromDateKey(anchor))
  const todayDate = fromDateKey(today)
  const isCurrent =
    view === 'week'
      ? weekStartKey(anchor) === weekStartKey(today)
      : monthDate.getFullYear() === todayDate.getFullYear() && monthDate.getMonth() === todayDate.getMonth()

  const shift = (delta: number) => {
    if (view === 'week') setAnchor(shiftDateKey(anchor, delta * 7))
    else setAnchor(toDateKey(new Date(monthDate.getFullYear(), monthDate.getMonth() + delta, 1)))
  }

  const title = view === 'week' ? formatWeekRange(anchor) : formatMonth(monthDate)
  const unit = view === 'week' ? 'semana' : 'mes'

  return (
    <Page>
      <PageHeader
        actions={
          <Button variant="outline" onClick={onTogglePin}>
            {isPinned ? <PushPinSlashIcon /> : <PushPinIcon />}
            {isPinned ? 'Quitar de inicio' : 'Fijar en inicio'}
          </Button>
        }
      >
        <PageTitle>Calendario</PageTitle>
      </PageHeader>

      <div className="mb-4 mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <IconButton label={`${view === 'week' ? 'Semana' : 'Mes'} anterior`} onClick={() => shift(-1)}>
            <CaretLeftIcon />
          </IconButton>
          {/* aria-live: al cambiar de periodo, el lector de pantalla anuncia el nuevo */}
          <span aria-live="polite" className="min-w-[140px] text-center text-lg font-semibold first-letter:uppercase">
            {title}
          </span>
          <IconButton label={`${view === 'week' ? 'Semana' : 'Mes'} siguiente`} onClick={() => shift(1)}>
            <CaretRightIcon />
          </IconButton>
          <Button variant="ghost" className="text-muted-foreground" disabled={isCurrent} onClick={() => setAnchor(today)}>
            Hoy
          </Button>
        </div>

        <div role="group" aria-label="Vista del calendario" className="flex rounded-full border p-0.5">
          {(['week', 'month'] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={view === option}
              onClick={() => setView(option)}
              className={cn(
                'rounded-full px-4 py-1 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
                view === option ? 'bg-secondary font-medium text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {option === 'week' ? 'Semana' : 'Mes'}
            </button>
          ))}
        </div>
      </div>
      <p className="sr-only">Vista de {unit}</p>

      {view === 'week' ? (
        <WeekView anchor={anchor} today={today} tasks={tasks} routines={routines} logs={logs} />
      ) : (
        <MonthView
          monthDate={monthDate}
          today={today}
          tasks={tasks}
          routines={routines}
          logs={logs}
          onPick={(day) => {
            setAnchor(day)
            setView('week')
          }}
        />
      )}
    </Page>
  )
}

interface ViewProps {
  today: string
  tasks: Task[]
  routines: Routine[]
  logs: Set<string>
}

function WeekView({ anchor, today, tasks, routines, logs }: ViewProps & { anchor: string }) {
  return (
    <ol className="grid gap-2 sm:grid-cols-7">
      {weekKeys(anchor).map((day, index) => {
        const isToday = day === today
        const dayTasks = tasks.filter((task) => task.date === day)
        const dayRoutines = routines.filter((routine) => countsOn(routine, logs, day))
        const empty = dayTasks.length === 0 && dayRoutines.length === 0
        return (
          <li
            key={day}
            aria-current={isToday ? 'date' : undefined}
            className={cn('flex min-h-[220px] flex-col gap-3 rounded-2xl border p-3 sm:min-h-[320px]', isToday && 'border-foreground/40 bg-muted/60')}
          >
            <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-start sm:gap-1">
              <span className="text-xs text-muted-foreground">
                <span className="sm:hidden">{WEEK_DAYS_LONG[index]}</span>
                <span className="hidden sm:inline">{WEEK_DAYS[index]}</span>
              </span>
              <span
                className={cn(
                  'flex size-7 items-center justify-center rounded-full text-sm font-semibold tabular-nums',
                  isToday && 'bg-foreground text-background',
                )}
              >
                {fromDateKey(day).getDate()}
              </span>
            </div>

            {empty && <p className="text-xs text-muted-foreground">Libre</p>}

            {dayTasks.length > 0 && (
              <ul className="flex flex-col gap-1">
                {dayTasks.map((task) => (
                  <li key={task.id} title={task.text} className={cn('truncate rounded-lg bg-secondary px-2 py-1 text-xs', task.done && 'text-muted-foreground line-through')}>
                    {task.text}
                  </li>
                ))}
              </ul>
            )}

            {dayRoutines.length > 0 && (
              <ul className="mt-auto flex flex-col gap-1 border-t pt-2">
                {dayRoutines.map((routine) => {
                  const done = hasLog(logs, routine, day)
                  return (
                    <li key={routine.id} title={routine.name} className="flex items-center gap-1.5 text-xs">
                      <span
                        aria-hidden="true"
                        className={cn('flex size-4 shrink-0 items-center justify-center rounded-full border', done && 'border-brand bg-brand text-primary-foreground')}
                      >
                        {done && <CheckIcon weight="bold" className="size-2.5" />}
                      </span>
                      <span className="sr-only">{done ? 'Hecha: ' : 'Pendiente: '}</span>
                      <span className={cn('truncate', done && 'text-muted-foreground')}>
                        {routine.icon} {routine.name}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </li>
        )
      })}
    </ol>
  )
}

function MonthView({ monthDate, today, tasks, routines, logs, onPick }: ViewProps & { monthDate: Date; onPick: (day: string) => void }) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()

  // Se completa la última semana con huecos para que la cuadrícula cierre en un rectángulo
  const cells = getMonthCells(monthDate)
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks = Array.from({ length: cells.length / 7 }, (_, index) => cells.slice(index * 7, index * 7 + 7))

  return (
    <div className="overflow-hidden rounded-2xl border">
      <table className="w-full table-fixed border-collapse">
        <caption className="sr-only">{formatMonth(monthDate)}</caption>
        <thead>
          <tr>
            {WEEK_DAYS.map((day, index) => (
              <th key={day} scope="col" abbr={WEEK_DAYS_LONG[index]} className="border-b border-r p-2 text-left text-xs font-normal text-muted-foreground last:border-r-0">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex} className="[&:last-child>td]:border-b-0">
              {week.map((day, dayIndex) => {
                if (day === null) return <td key={`empty-${dayIndex}`} className="h-24 border-b border-r bg-muted/40 last:border-r-0" />

                const key = toDateKey(new Date(year, month, day))
                const isToday = key === today
                const taskCount = tasks.filter((task) => task.date === key).length
                const { due, done } = dayProgress(routines, logs, key)

                return (
                  <td key={key} aria-current={isToday ? 'date' : undefined} className="h-24 border-b border-r p-0 align-top last:border-r-0">
                    <button
                      type="button"
                      aria-label={`${formatLongDay(key)}: ver semana`}
                      onClick={() => onPick(key)}
                      className="flex size-full flex-col items-start gap-1 p-2 text-left transition-colors hover:bg-muted/60 focus-visible:outline-2 focus-visible:-outline-offset-2"
                    >
                      <span
                        className={cn(
                          'flex size-6 items-center justify-center rounded-full text-[13px] tabular-nums text-muted-foreground',
                          isToday && 'bg-foreground font-bold text-background',
                        )}
                      >
                        {day}
                      </span>
                      {taskCount > 0 && (
                        <span className="max-w-full truncate rounded-full bg-secondary px-2 text-xs text-secondary-foreground">
                          {taskCount} {taskCount === 1 ? 'tarea' : 'tareas'}
                        </span>
                      )}
                      {due > 0 && (
                        <span
                          className={cn(
                            'max-w-full truncate rounded-full px-2 text-xs tabular-nums',
                            done === due ? 'bg-brand text-primary-foreground' : 'border text-muted-foreground',
                          )}
                        >
                          {done}/{due} rutinas
                        </span>
                      )}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
