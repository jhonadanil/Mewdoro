import { useState } from 'react'
import { CaretRightIcon, CheckIcon, FlameIcon } from '@phosphor-icons/react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import AddTask from '../components/AddTask'
import { useClock } from '../hooks/useClock'
import type { TaskChanges } from '../hooks/useTasks'
import type { Note, Page, Routine, Task } from '../types'
import { toDateKey } from '../utils/notes'
import { perfectStreak } from '../utils/profile'
import { countsOn, currentStreak, hasLog } from '../utils/routines'

interface HomeMobileProps {
  loaded: boolean
  notes: Note[]
  tasks: Task[]
  routines: Routine[]
  routineLogs: Set<string>
  onAddTask: (text: string, date: string) => void
  onUpdateTask: (id: string, changes: TaskChanges) => void
  onSetRoutineDone: (routineId: string, date: string, done: boolean) => void
  onNavigate: (page: Page) => void
  onOpenNote: (id: string) => void
}

type Section = 'tasks' | 'routines'
const STORAGE_KEY = 'mewdoro-home-section'

function greeting(now: Date) {
  const hour = now.getHours()
  if (hour >= 6 && hour < 13) return 'Buenos días'
  if (hour >= 13 && hour < 20) return 'Buenas tardes'
  return 'Buenas noches'
}

function readSection(): Section {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'routines' ? 'routines' : 'tasks'
  } catch {
    return 'tasks'
  }
}

// Fila grande para tocar con el pulgar: círculo que se llena al marcarla
function CheckRow({ done, label, onToggle, children }: { done: boolean; label: string; onToggle: () => void; children: React.ReactNode }) {
  return (
    <li>
      <button
        type="button"
        aria-pressed={done}
        aria-label={label}
        onClick={onToggle}
        className="flex min-h-14 w-full items-center gap-4 rounded-2xl px-3 text-left transition-colors active:bg-muted/70 focus-visible:outline-2 focus-visible:-outline-offset-2"
      >
        <span
          aria-hidden="true"
          className={cn(
            'flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
            done ? 'border-brand bg-brand text-primary-foreground' : 'border-muted-foreground/50',
          )}
        >
          {done && <CheckIcon weight="bold" className="size-4" />}
        </span>
        {children}
      </button>
    </li>
  )
}

// Inicio del móvil: solo lo de hoy, una cosa a la vez (tareas o rutinas), sin tarjetas ni adornos
export default function HomeMobile({ loaded, notes, tasks, routines, routineLogs, onAddTask, onUpdateTask, onSetRoutineDone, onNavigate, onOpenNote }: HomeMobileProps) {
  const now = useClock()
  const today = toDateKey(now)
  const [section, setSection] = useState<Section>(readSection)

  const choose = (next: Section) => {
    setSection(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Sin almacenamiento, simplemente no se recuerda
    }
  }

  const todayTasks = tasks.filter((task) => task.date === today)
  const doneTasks = todayTasks.filter((task) => task.done).length
  const dueRoutines = routines.filter((routine) => countsOn(routine, routineLogs, today))
  const doneRoutines = dueRoutines.filter((routine) => hasLog(routineLogs, routine, today)).length
  const streak = perfectStreak(routines, routineLogs, today)
  const pinned = notes.filter((note) => note.pinned)

  const total = section === 'tasks' ? todayTasks.length : dueRoutines.length
  const done = section === 'tasks' ? doneTasks : doneRoutines

  const date = now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  const tabs: { id: Section; label: string; count: string }[] = [
    { id: 'tasks', label: 'Tareas', count: todayTasks.length > 0 ? `${doneTasks}/${todayTasks.length}` : '' },
    { id: 'routines', label: 'Rutinas', count: dueRoutines.length > 0 ? `${doneRoutines}/${dueRoutines.length}` : '' },
  ]

  return (
    <section className="mx-auto w-full max-w-xl px-5 pb-8 pt-2">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{greeting(now)}</h1>
          <p className="mt-1 text-sm capitalize text-muted-foreground">{date}</p>
        </div>
        {streak > 0 && (
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            aria-label={`Racha de ${streak} ${streak === 1 ? 'día' : 'días'}. Ver perfil`}
            className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-sm font-semibold tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <FlameIcon aria-hidden="true" weight="fill" className="size-4 text-brand" />
            {streak}
          </button>
        )}
      </header>

      {/* Tareas o rutinas: una sola lista a la vez */}
      <div role="tablist" aria-label="Qué ver" className="mt-6 flex rounded-full bg-muted p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={section === tab.id}
            onClick={() => choose(tab.id)}
            className={cn(
              'flex-1 rounded-full py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
              section === tab.id ? 'bg-background font-semibold shadow-sm' : 'text-muted-foreground',
            )}
          >
            {tab.label}
            {tab.count && <span className="ml-1.5 tabular-nums text-muted-foreground">{tab.count}</span>}
          </button>
        ))}
      </div>

      {total > 0 && (
        <Progress value={(done / total) * 100} className="mt-4 h-1.5" aria-label={done === total ? 'Todo hecho' : `${done} de ${total} hechas`} />
      )}

      {!loaded ? (
        <div aria-hidden="true" className="mt-4 flex flex-col gap-3">
          {[0, 1, 2].map((item) => (
            <span key={item} className="h-12 rounded-2xl bg-foreground/[0.06] motion-safe:animate-pulse" />
          ))}
        </div>
      ) : section === 'tasks' ? (
        <div className="mt-3">
          {todayTasks.length === 0 && <p className="px-3 py-4 text-muted-foreground">Nada pendiente. Añade lo que quieras hacer hoy.</p>}
          <ul className="flex flex-col">
            {todayTasks.map((task) => (
              <CheckRow key={task.id} done={task.done} label={`${task.done ? 'Marcar como pendiente' : 'Marcar como hecha'}: ${task.text}`} onToggle={() => onUpdateTask(task.id, { done: !task.done })}>
                <span className={cn('min-w-0 flex-1 break-words text-base', task.done && 'text-muted-foreground line-through')}>{task.text}</span>
              </CheckRow>
            ))}
          </ul>
          <div className="mt-1 px-1">
            <AddTask onAdd={(text) => onAddTask(text, today)} placeholder="Añadir una tarea" />
          </div>
        </div>
      ) : (
        <div className="mt-3">
          {dueRoutines.length === 0 && (
            <p className="px-3 py-4 text-muted-foreground">
              {routines.length === 0 ? 'Aún no tienes rutinas.' : 'Hoy no toca ninguna rutina.'}
            </p>
          )}
          <ul className="flex flex-col">
            {dueRoutines.map((routine) => {
              const isDone = hasLog(routineLogs, routine, today)
              const days = currentStreak(routine, routineLogs, today)
              return (
                <CheckRow key={routine.id} done={isDone} label={`${routine.name}: ${isDone ? 'desmarcar' : 'marcar como hecha'}`} onToggle={() => onSetRoutineDone(routine.id, today, !isDone)}>
                  <span aria-hidden="true" className="text-xl">
                    {routine.icon}
                  </span>
                  <span className={cn('min-w-0 flex-1 break-words text-base', isDone && 'text-muted-foreground')}>{routine.name}</span>
                  {days > 0 && (
                    <span className="flex shrink-0 items-center gap-0.5 text-sm tabular-nums text-muted-foreground">
                      <FlameIcon aria-hidden="true" weight="fill" className="size-4 text-brand" />
                      {days}
                      <span className="sr-only"> días de racha</span>
                    </span>
                  )}
                </CheckRow>
              )
            })}
          </ul>
        </div>
      )}

      {/* Notas fijadas: solo el título, para abrirlas de un toque */}
      {pinned.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-1 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notas fijadas</h2>
          <ul className="flex flex-col">
            {pinned.map((note) => (
              <li key={note.id}>
                <button
                  type="button"
                  onClick={() => onOpenNote(note.id)}
                  className="flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl px-3 text-left active:bg-muted/70 focus-visible:outline-2 focus-visible:-outline-offset-2"
                >
                  <span className="min-w-0 truncate text-base">{note.title || 'Sin título'}</span>
                  <CaretRightIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
