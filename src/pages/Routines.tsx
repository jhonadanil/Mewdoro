import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { CaretLeftIcon, CaretRightIcon, FlameIcon, PencilSimpleIcon, PlusIcon, PushPinIcon, PushPinSlashIcon, TrashIcon } from '@phosphor-icons/react'
import { IconButton } from '@/components/IconButton'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { Page, PageHeader, PageTitle } from '../components/Page'
import { DayCheck, RoutineDayList } from '../components/RoutineDayList'
import RoutineForm from '../components/RoutineForm'
import type { RoutineChanges } from '../hooks/useRoutines'
import type { Routine } from '../types'
import { WEEK_DAYS, WEEK_DAYS_LONG, formatMonth, getMonthCells, getMonthStart } from '../utils/calendar'
import { toDateKey } from '../utils/notes'
import { adherence, currentStreak, dayProgress, formatWeekRange, hasLog, weekKeys, weekProgress, weekStartKey } from '../utils/routines'
import { formatLongDay, fromDateKey, shiftDateKey, todayKey } from '../utils/tasks'
import { showToast } from '../utils/toast'

interface RoutinesProps {
  routines: Routine[]
  logs: Set<string>
  loaded: boolean
  isPinned: boolean
  onTogglePin: () => void
  onAdd: (name: string, icon: string, days: number[]) => void
  onUpdate: (id: string, changes: RoutineChanges) => void
  onDelete: (routine: Routine) => string[]
  onRestore: (routine: Routine, dates: string[]) => void
  onSetDone: (routineId: string, date: string, done: boolean) => void
}

type View = 'week' | 'month'

const ARROWS: Record<string, [number, number]> = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }

// Flechas dentro de la tabla: pasan a la casilla vecina que se pueda marcar, saltando los días en que no toca
function moveBetweenCells(event: KeyboardEvent<HTMLTableSectionElement>) {
  const step = ARROWS[event.key]
  const cell = (event.target as HTMLElement).closest('td')
  const row = cell?.parentElement as HTMLTableRowElement | null | undefined
  if (!step || !cell || !row) return
  const rows = Array.from(event.currentTarget.rows)
  let r = rows.indexOf(row)
  let c = cell.cellIndex
  for (;;) {
    r += step[0]
    c += step[1]
    const next = rows[r]?.cells[c]
    if (!next) return
    const button = next.querySelector<HTMLButtonElement>('button:not(:disabled)')
    if (button) {
      event.preventDefault()
      button.focus()
      return
    }
  }
}

// "Hoy" se marca con el color de texto invertido, no con el mauve: el mauve queda para lo hecho
const TODAY_MARK = 'bg-foreground font-bold text-background'

export default function Routines({ routines, logs, loaded, isPinned, onTogglePin, onAdd, onUpdate, onDelete, onRestore, onSetDone }: RoutinesProps) {
  const today = todayKey()
  const [view, setView] = useState<View>('week')
  const [anchor, setAnchor] = useState(today)
  const [selectedDay, setSelectedDay] = useState(today)
  const [editing, setEditing] = useState<Routine | 'new' | null>(null)
  const formRef = useRef<HTMLDivElement>(null)

  // Al editar una rutina de una lista larga, el formulario (arriba) se trae a la vista
  useEffect(() => {
    if (editing) formRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [editing])

  const toggle = (routine: Routine, day: string) => onSetDone(routine.id, day, !hasLog(logs, routine, day))

  const todayStats = dayProgress(routines, logs, today)
  const week = weekKeys(anchor)
  const isCurrentWeek = weekStartKey(anchor) === weekStartKey(today)

  const monthDate = getMonthStart(fromDateKey(anchor))
  const todayDate = fromDateKey(today)
  const isCurrentMonth = monthDate.getFullYear() === todayDate.getFullYear() && monthDate.getMonth() === todayDate.getMonth()

  const shift = (delta: number) => {
    if (view === 'week') {
      setAnchor(shiftDateKey(anchor, delta * 7))
      setSelectedDay(shiftDateKey(selectedDay, delta * 7))
    } else {
      const next = new Date(monthDate.getFullYear(), monthDate.getMonth() + delta, 1)
      setAnchor(toDateKey(next))
      // El día elegido sigue siempre dentro del mes que se ve
      const isTodayMonth = next.getFullYear() === todayDate.getFullYear() && next.getMonth() === todayDate.getMonth()
      setSelectedDay(isTodayMonth ? today : toDateKey(next))
    }
  }
  // Al pasar a Mes, el día elegido debe caer dentro del mes que se ve
  const changeView = (next: View) => {
    if (next === 'month' && selectedDay.slice(0, 7) !== anchor.slice(0, 7)) setSelectedDay(anchor)
    setView(next)
  }
  const goToday = () => {
    setAnchor(today)
    setSelectedDay(today)
  }

  const removeRoutine = (routine: Routine) => {
    const dates = onDelete(routine)
    if (editing !== 'new' && editing?.id === routine.id) setEditing(null)
    showToast(`Rutina «${routine.name}» eliminada`, { action: { label: 'Deshacer', onClick: () => onRestore(routine, dates) } })
  }

  const title = view === 'week' ? formatWeekRange(anchor) : formatMonth(monthDate)
  const last30From = shiftDateKey(today, -29)

  return (
    <Page narrow>
      <PageHeader
        actions={
          <>
            <Button variant="outline" onClick={onTogglePin}>
              {isPinned ? <PushPinSlashIcon /> : <PushPinIcon />}
              {isPinned ? 'Quitar de inicio' : 'Fijar en inicio'}
            </Button>
            <Button variant="outline" onClick={() => setEditing('new')} disabled={editing === 'new'}>
              <PlusIcon />
              Nueva rutina
            </Button>
          </>
        }
      >
        <PageTitle>Rutinas</PageTitle>
      </PageHeader>

      {!loaded && <span aria-busy="true" className="mt-3 block h-4 w-56 rounded bg-foreground/[0.06] motion-safe:animate-pulse" />}

      {loaded && routines.length > 0 && (
        <p className="mt-2 text-muted-foreground">
          {todayStats.due === 0
            ? 'Hoy no toca ninguna rutina.'
            : todayStats.done === todayStats.due
              ? 'Rutinas de hoy terminadas.'
              : `${todayStats.done} de ${todayStats.due} rutinas hechas hoy.`}
        </p>
      )}

      {editing && (
        <div ref={formRef} className="mt-5">
          <RoutineForm
            key={editing === 'new' ? 'new' : editing.id}
            initial={editing === 'new' ? undefined : editing}
            submitLabel={editing === 'new' ? 'Añadir rutina' : 'Guardar cambios'}
            onCancel={() => setEditing(null)}
            onSubmit={(name, icon, days) => {
              if (editing === 'new') onAdd(name, icon, days)
              else onUpdate(editing.id, { name, icon, days })
              setEditing(null)
            }}
          />
        </div>
      )}

      {loaded && routines.length === 0 && !editing && (
        <div className="mt-8 rounded-2xl border border-dashed p-10 text-center">
          <p className="font-medium">Aún no tienes rutinas</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Añade hábitos que repites cada semana (leer, entrenar, estudiar inglés) y marca cada día lo que cumples para ver tu racha.
          </p>
          <Button className="mt-4" onClick={() => setEditing('new')}>
            <PlusIcon />
            Crear la primera rutina
          </Button>
        </div>
      )}

      {routines.length > 0 && (
        <>
          {/* Lo más repetido, a mano: marcar hoy. En pantallas estrechas lo hace la franja de la semana */}
          <section aria-labelledby="routines-today" className="mt-6 hidden md:block">
            <h2 id="routines-today" className="mb-2 text-sm font-semibold text-muted-foreground">
              Hoy
            </h2>
            <RoutineDayList routines={routines} logs={logs} day={today} today={today} onToggle={toggle} emptyText="Hoy no toca ninguna rutina." />
          </section>

          {/* Navegación y vista */}
          <div className="mb-3 mt-8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <IconButton label={view === 'week' ? 'Semana anterior' : 'Mes anterior'} onClick={() => shift(-1)}>
                <CaretLeftIcon />
              </IconButton>
              <span aria-live="polite" className="min-w-[120px] text-center text-lg font-semibold first-letter:uppercase">
                {title}
              </span>
              <IconButton label={view === 'week' ? 'Semana siguiente' : 'Mes siguiente'} onClick={() => shift(1)}>
                <CaretRightIcon />
              </IconButton>
              <Button variant="ghost" className="text-muted-foreground" disabled={view === 'week' ? isCurrentWeek : isCurrentMonth} onClick={goToday}>
                Hoy
              </Button>
            </div>
            <div role="group" aria-label="Vista" className="flex rounded-full border p-0.5">
              {(['week', 'month'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={view === option}
                  onClick={() => changeView(option)}
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

          {view === 'week' ? (
            <>
              {/* Pantallas anchas: la tabla con todas las rutinas y los siete días */}
              <div className="hidden overflow-x-auto rounded-2xl border md:block">
                <table className="w-full border-collapse">
                  <caption className="sr-only">Seguimiento de rutinas, semana del {formatWeekRange(anchor)}</caption>
                  <thead>
                    <tr>
                      <th scope="col" className="w-[220px] border-b p-3 text-left text-xs font-normal text-muted-foreground">
                        Rutina
                      </th>
                      {week.map((day, index) => (
                        <th
                          key={day}
                          scope="col"
                          abbr={WEEK_DAYS_LONG[index]}
                          aria-current={day === today ? 'date' : undefined}
                          className="border-b p-2 text-center text-xs font-normal text-muted-foreground"
                        >
                          <div>{WEEK_DAYS[index]}</div>
                          <div className={cn('mx-auto mt-1 flex size-6 items-center justify-center rounded-full text-[13px] tabular-nums', day === today && TODAY_MARK)}>
                            {fromDateKey(day).getDate()}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody onKeyDown={moveBetweenCells}>
                    {routines.map((routine) => (
                      <tr key={routine.id} className="group/row border-b last:border-b-0">
                        <th scope="row" className="p-3 text-left font-normal">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{routine.icon}</span>
                            <span title={routine.name} className="min-w-0 flex-1 truncate text-sm font-medium">
                              {routine.name}
                            </span>
                            <span className="flex shrink-0 opacity-0 transition-opacity focus-within:opacity-100 group-hover/row:opacity-100">
                              <IconButton label="Editar rutina" size="icon-xs" onClick={() => setEditing(routine)}>
                                <PencilSimpleIcon />
                              </IconButton>
                              <IconButton label="Eliminar rutina" size="icon-xs" onClick={() => removeRoutine(routine)}>
                                <TrashIcon />
                              </IconButton>
                            </span>
                          </div>
                        </th>
                        {week.map((day) => (
                          <td key={day} className={cn('p-1 text-center', day === today && 'bg-muted/60')}>
                            <div className="flex h-9 items-center justify-center">
                              <DayCheck routine={routine} day={day} today={today} done={hasLog(logs, routine, day)} onToggle={() => toggle(routine, day)} />
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t">
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

              {/* Pantallas estrechas: una franja con los días y la lista del día elegido */}
              <div className="md:hidden">
                <div role="group" aria-label="Días de la semana" className="grid grid-cols-7 gap-1">
                  {week.map((day, index) => {
                    const { due, done } = dayProgress(routines, logs, day)
                    const isSelected = day === selectedDay
                    return (
                      <button
                        key={day}
                        type="button"
                        aria-pressed={isSelected}
                        aria-current={day === today ? 'date' : undefined}
                        aria-label={`${formatLongDay(day)}${due ? `: ${done} de ${due} rutinas hechas` : ''}`}
                        onClick={() => setSelectedDay(day)}
                        className={cn(
                          'flex flex-col items-center gap-1 rounded-2xl border px-1 py-2 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
                          isSelected ? 'border-foreground/40 bg-secondary' : 'text-muted-foreground hover:bg-muted',
                        )}
                      >
                        <span>{WEEK_DAYS[index]}</span>
                        <span className={cn('flex size-6 items-center justify-center rounded-full text-[13px] tabular-nums', day === today && TODAY_MARK)}>
                          {fromDateKey(day).getDate()}
                        </span>
                        <span className="tabular-nums">{due === 0 ? '–' : `${done}/${due}`}</span>
                      </button>
                    )
                  })}
                </div>
                <h2 className="mb-2 mt-4 text-sm font-semibold first-letter:uppercase">{formatLongDay(selectedDay)}</h2>
                <RoutineDayList routines={routines} logs={logs} day={selectedDay} today={today} onToggle={toggle} large />
              </div>
            </>
          ) : (
            <MonthView monthDate={monthDate} routines={routines} logs={logs} today={today} selectedDay={selectedDay} onSelect={setSelectedDay} onToggle={toggle} />
          )}

          {/* Seguimiento por rutina; aquí también se editan y se eliminan, sin depender del ratón */}
          <h2 className="mb-3 mt-10 text-sm font-semibold text-muted-foreground">Seguimiento</h2>
          <ul className="flex flex-col gap-2">
            {routines.map((routine) => {
              const streak = currentStreak(routine, logs, today)
              const { due: weekDue, done: weekDone } = weekProgress(routine, logs, anchor, today)
              const percent = adherence(routine, logs, last30From, today)
              return (
                <li key={routine.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border px-4 py-3">
                  <div className="flex min-w-[160px] flex-1 items-center gap-2">
                    <span className="text-lg">{routine.icon}</span>
                    <span className="break-words text-sm font-medium">{routine.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm tabular-nums">
                    <FlameIcon aria-hidden="true" weight={streak > 0 ? 'fill' : 'regular'} className={cn('size-4', streak > 0 ? 'text-brand' : 'text-muted-foreground')} />
                    {streak > 0 ? (
                      <span>
                        {streak} {streak === 1 ? 'día' : 'días'} de racha
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Sin racha todavía</span>
                    )}
                  </div>
                  <div className="text-sm tabular-nums text-muted-foreground">{weekDue === 0 ? 'Esta semana: –' : `Esta semana: ${weekDone} de ${weekDue}`}</div>
                  <div className="flex w-[150px] items-center gap-2 text-[13px] tabular-nums text-muted-foreground">
                    <Progress value={percent ?? 0} className="h-1.5" aria-label={`Cumplimiento de ${routine.name} en 30 días`} />
                    <span className="w-9 text-right">{percent === null ? '–' : `${percent}%`}</span>
                  </div>
                  <div className="flex">
                    <IconButton label="Editar rutina" size="icon-sm" onClick={() => setEditing(routine)}>
                      <PencilSimpleIcon />
                    </IconButton>
                    <IconButton label="Eliminar rutina" size="icon-sm" onClick={() => removeRoutine(routine)}>
                      <TrashIcon />
                    </IconButton>
                  </div>
                </li>
              )
            })}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">
            La racha cuenta los días seguidos en que tocaba la rutina y perdona un día fallado por semana. El porcentaje es de los últimos 30 días.
          </p>
        </>
      )}
    </Page>
  )
}

interface MonthViewProps {
  monthDate: Date
  routines: Routine[]
  logs: Set<string>
  today: string
  selectedDay: string
  onSelect: (day: string) => void
  onToggle: (routine: Routine, day: string) => void
}

// Calendario mensual: cada día muestra cuántas rutinas se cumplieron; al elegir uno se marcan abajo
function MonthView({ monthDate, routines, logs, today, selectedDay, onSelect, onToggle }: MonthViewProps) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const cells = getMonthCells(monthDate)
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks = Array.from({ length: cells.length / 7 }, (_, index) => cells.slice(index * 7, index * 7 + 7))

  return (
    <>
      <div className="overflow-hidden rounded-2xl border">
        <table className="w-full table-fixed border-collapse">
          <caption className="sr-only">Seguimiento de rutinas, {formatMonth(monthDate)}</caption>
          <thead>
            <tr>
              {WEEK_DAYS.map((day, index) => (
                <th key={day} scope="col" abbr={WEEK_DAYS_LONG[index]} className="border-b border-r p-2 text-right text-xs font-normal text-muted-foreground last:border-r-0">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((row, rowIndex) => (
              <tr key={rowIndex} className="[&:last-child>td]:border-b-0">
                {row.map((day, dayIndex) => {
                  if (day === null) return <td key={`empty-${dayIndex}`} className="h-[72px] border-b border-r bg-muted/50 last:border-r-0" />
                  const key = toDateKey(new Date(year, month, day))
                  const { due, done } = dayProgress(routines, logs, key)
                  const isToday = key === today
                  const isSelected = key === selectedDay
                  return (
                    <td key={key} aria-current={isToday ? 'date' : undefined} className="h-[72px] border-b border-r p-0 align-top last:border-r-0">
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        aria-label={`${formatLongDay(key)}${due ? `: ${done} de ${due} rutinas hechas` : ''}`}
                        onClick={() => onSelect(key)}
                        className={cn(
                          'flex size-full flex-col items-end gap-1 p-1.5 text-right transition-colors hover:bg-muted/60 focus-visible:outline-2 focus-visible:-outline-offset-2',
                          isSelected && 'bg-muted',
                        )}
                      >
                        <span className={cn('min-w-6 rounded-full px-1.5 py-0.5 text-center text-[13px] tabular-nums text-muted-foreground', isToday && TODAY_MARK)}>{day}</span>
                        {due > 0 && (
                          <span className={cn('rounded-full px-1.5 text-xs tabular-nums', done === due ? 'bg-brand text-primary-foreground' : 'text-muted-foreground')}>
                            {done}/{due}
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

      <h2 className="mb-2 mt-6 text-sm font-semibold first-letter:uppercase">{formatLongDay(selectedDay)}</h2>
      <RoutineDayList routines={routines} logs={logs} day={selectedDay} today={today} onToggle={onToggle} />
    </>
  )
}
