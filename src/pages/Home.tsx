import type { ReactNode } from 'react'
import { CalendarDotsIcon, ListChecksIcon, NotebookIcon, PlusIcon, RepeatIcon, TimerIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import MiniCalendar from '../components/MiniCalendar'
import MiniRoutines from '../components/MiniRoutines'
import MiniPomodoro from '../components/MiniPomodoro'
import MiniTasks from '../components/MiniTasks'
import NoteCard from '../components/NoteCard'
import type { NoteCardVariant } from '../components/NoteCard'
import { Page, PageText, PageTitle } from '../components/Page'
import { RotatingTitle } from '../components/RotatingTitle'
import { usePomodoroContext } from '../hooks/PomodoroContext'
import type { Pomodoro } from '../hooks/usePomodoro'
import { useClock } from '../hooks/useClock'
import type { TaskChanges } from '../hooks/useTasks'
import type { Folder, Note, Page as PageName, Pinned, Routine, Task } from '../types'
import { getNoteFolder, toDateKey } from '../utils/notes'

function greeting(now: Date) {
  const hour = now.getHours()
  if (hour >= 6 && hour < 13) return 'Buenos días'
  if (hour >= 13 && hour < 20) return 'Buenas tardes'
  return 'Buenas noches'
}

// "Martes, 17 de noviembre": el título de Inicio termina en el día de hoy
function todayTitle(now: Date) {
  const text = now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
  return text.charAt(0).toUpperCase() + text.slice(1)
}

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`

// Solo si hay un bloque en curso o en pausa
function pomodoroStatus(pomodoro: Pomodoro) {
  const minutesLeft = Math.ceil(pomodoro.secondsLeft / 60)
  const left = `${minutesLeft === 1 ? 'queda' : 'quedan'} ${minutesLeft} min`
  const block = pomodoro.mode === 'work' ? 'Trabajo' : 'Descanso'
  if (pomodoro.isRunning) return `${block} en marcha, ${left}`
  if (pomodoro.secondsLeft < pomodoro.duration) return `${block} en pausa, ${left}`
  return null
}

// Resultados de búsqueda: tarjetas pequeñas que se reparten solas
const RESULTS_GRID = 'grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] items-start gap-3'
// Notas fijadas: tarjetas grandes, una columna en estrecho y dos en cuanto caben (container query),
// para que se lea el contenido y no solo el título. Columnas que fluyen, sin huecos entre tarjetas de distinta altura
const PINNED_GRID = 'columns-1 gap-4 @xl:columns-2 *:mb-4 *:break-inside-avoid'
// Herramientas: columnas según el ancho real del contenido (container queries), no de la ventana
const TOOLS_GRID = 'grid grid-cols-1 items-start gap-3 @md:grid-cols-2 @3xl:grid-cols-3'
// Tareas es lo principal del día: ocupa dos columnas para que su lista no se corte
const TASKS_SPAN = '@md:col-span-2'
const STATUS = 'mt-1.5 text-sm text-muted-foreground tabular-nums'
interface DayStatusProps {
  tasks: Task[]
  today: string
}

// Línea bajo la fecha con el estado real del día. Es el único trozo de Inicio que lee el Pomodoro
// cada segundo, así el resto de la página no se vuelve a dibujar mientras corre.
function DayStatus({ tasks, today }: DayStatusProps) {
  const pomodoro = usePomodoroContext()
  const todayTasks = tasks.filter((task) => task.date === today)
  const done = todayTasks.filter((task) => task.done).length
  const parts: ReactNode[] = []

  if (todayTasks.length === 0) parts.push('Sin tareas flash para hoy')
  else if (done === todayTasks.length) parts.push('Tareas flash de hoy terminadas')
  else parts.push(`${done} de ${todayTasks.length} tareas flash hechas`)

  const timer = pomodoroStatus(pomodoro)
  if (timer) parts.push(timer)
  else if (pomodoro.completedWork > 0) parts.push(plural(pomodoro.completedWork, 'pomodoro hecho', 'pomodoros hechos'))

  return (
    <p className={STATUS}>
      {parts.map((part, index) => (
        <span key={index}>
          {index > 0 && ' · '}
          {part}
        </span>
      ))}
    </p>
  )
}

// Encima de los resultados de búsqueda, para no perder de vista un bloque en curso
function PomodoroLine() {
  const timer = pomodoroStatus(usePomodoroContext())
  return timer ? <p className={STATUS}>{timer}</p> : null
}

interface HomeProps {
  // Hasta que llegan notas, tareas y fijados no se sabe qué mostrar
  loaded: boolean
  notes: Note[]
  folders: Folder[]
  query: string
  searchResults: Note[]
  isPomodoroPinned: boolean
  onUnpinPomodoro: () => void
  isCalendarPinned: boolean
  onUnpinCalendar: () => void
  tasks: Task[]
  isTasksPinned: boolean
  onUnpinTasks: () => void
  routines: Routine[]
  routineLogs: Set<string>
  isRoutinesPinned: boolean
  onUnpinRoutines: () => void
  onSetRoutineDone: (routineId: string, date: string, done: boolean) => void
  onAddTask: (text: string, date: string) => void
  onUpdateTask: (id: string, changes: TaskChanges) => void
  onNavigate: (page: PageName) => void
  onOpenNote: (id: string) => void
  onTogglePinNote: (id: string) => void
  onPinToHome: (key: keyof Pinned) => void
  onCreateNote: () => void
  onCreateNoteTitled: (title: string) => void
}

export default function Home({
  loaded,
  notes,
  folders,
  query,
  searchResults,
  isPomodoroPinned,
  onUnpinPomodoro,
  isCalendarPinned,
  onUnpinCalendar,
  tasks,
  isTasksPinned,
  onUnpinTasks,
  routines,
  routineLogs,
  isRoutinesPinned,
  onUnpinRoutines,
  onSetRoutineDone,
  onAddTask,
  onUpdateTask,
  onNavigate,
  onOpenNote,
  onTogglePinNote,
  onPinToHome,
  onCreateNote,
  onCreateNoteTitled,
}: HomeProps) {
  // Cambia cada minuto: la fecha, el saludo y "hoy" se actualizan solos, también a medianoche
  const now = useClock()
  const today = toDateKey(now)

  const renderNote = (note: Note, variant: NoteCardVariant) => (
    <NoteCard
      key={note.id}
      note={note}
      folder={getNoteFolder(note, folders)}
      onOpen={onOpenNote}
      onTogglePin={onTogglePinNote}
      variant={variant}
    />
  )

  // Mientras se busca, Inicio muestra los resultados
  const search = query.trim()
  if (search) {
    return (
      <Page>
        <PageTitle>Resultados</PageTitle>
        {isPomodoroPinned && <PomodoroLine />}
        {searchResults.length === 0 ? (
          <>
            <PageText>No hay notas que coincidan con «{search}».</PageText>
            {/* La búsqueda vacía ofrece el siguiente paso: crear la nota que se buscaba */}
            <Button onClick={() => onCreateNoteTitled(search)} className="max-w-full">
              <PlusIcon />
              <span className="truncate">Crear nota «{search}»</span>
            </Button>
          </>
        ) : (
          <div className={cn(RESULTS_GRID, 'mt-5')}>{searchResults.map((note) => renderNote(note, 'compact'))}</div>
        )}
      </Page>
    )
  }

  // Mientras carga se ven tarjetas vacías en vez de la bienvenida, que solo es para quien no tiene nada fijado
  if (!loaded) return <HomeSkeleton />

  const pinnedNotes = notes.filter((note) => note.pinned)
  const hasTools = isTasksPinned || isPomodoroPinned || isCalendarPinned || isRoutinesPinned

  // Sin nada fijado: una frase y los botones para fijar o crear desde aquí mismo
  if (!hasTools && pinnedNotes.length === 0) {
    return (
      <Page>
        <RotatingTitle key="welcome" phrases={[greeting(now)]} />
        <PageText>Fija aquí lo que usas cada día para tenerlo a mano al abrir Mewdoro.</PageText>
        <div className="flex flex-wrap gap-2">
          <Button onClick={onCreateNote}>
            <NotebookIcon />
            Nueva nota
          </Button>
          <Button variant="outline" onClick={() => onPinToHome('tasks')}>
            <ListChecksIcon />
            Fijar Tareas
          </Button>
          <Button variant="outline" onClick={() => onPinToHome('routines')}>
            <RepeatIcon />
            Fijar Rutinas
          </Button>
          <Button variant="outline" onClick={() => onPinToHome('pomodoro')}>
            <TimerIcon />
            Fijar Pomodoro
          </Button>
          <Button variant="outline" onClick={() => onPinToHome('calendar')}>
            <CalendarDotsIcon />
            Fijar Calendario
          </Button>
        </div>
      </Page>
    )
  }

  // Orden de lectura: el día (fecha y estado), las herramientas y, aparte, las notas fijadas
  return (
    <Page>
      <RotatingTitle key="pinned" phrases={[greeting(now), todayTitle(now)]} />
      <DayStatus tasks={tasks} today={today} />

      {hasTools && (
        <div className="@container mt-6">
          <div className={TOOLS_GRID}>
            {isTasksPinned && (
              <MiniTasks
                tasks={tasks}
                onOpen={() => onNavigate('tasks')}
                onUnpin={onUnpinTasks}
                onAdd={onAddTask}
                onUpdate={onUpdateTask}
                className={TASKS_SPAN}
              />
            )}
            {isRoutinesPinned && (
              <MiniRoutines
                routines={routines}
                logs={routineLogs}
                onOpen={() => onNavigate('routines')}
                onUnpin={onUnpinRoutines}
                onSetDone={onSetRoutineDone}
              />
            )}
            {isPomodoroPinned && <MiniPomodoro onOpen={() => onNavigate('pomodoro')} onUnpin={onUnpinPomodoro} />}
            {isCalendarPinned && <MiniCalendar onOpen={() => onNavigate('calendar')} onUnpin={onUnpinCalendar} />}
          </div>
        </div>
      )}

      {pinnedNotes.length > 0 && (
        <section aria-labelledby="pinned-notes" className={cn('@container', hasTools ? 'mt-10' : 'mt-6')}>
          <h2 id="pinned-notes" className="mb-3 text-sm font-semibold text-muted-foreground">
            Notas fijadas
          </h2>
          <div className={PINNED_GRID}>{pinnedNotes.map((note) => renderNote(note, 'large'))}</div>
        </section>
      )}
    </Page>
  )
}

// Esqueleto de Inicio: misma rejilla y tamaño de tarjetas, sin contenido
function HomeSkeleton() {
  return (
    <Page>
      <div aria-busy="true">
        <PageTitle>
          <span className="sr-only">Cargando Inicio</span>
          <span aria-hidden="true" className="block h-9 w-56 rounded-lg bg-foreground/[0.06] motion-safe:animate-pulse" />
        </PageTitle>
        <span aria-hidden="true" className="mt-2.5 block h-4 w-72 max-w-full rounded bg-foreground/[0.06] motion-safe:animate-pulse" />
        <div className="@container mt-6" aria-hidden="true">
          <div className={TOOLS_GRID}>
            {[0, 1, 2].map((item) => (
              <Card key={item} size="sm" className={cn('h-36 gap-3 px-3', item === 0 && TASKS_SPAN)}>
                <span className="h-5 w-24 rounded-full bg-foreground/[0.06] motion-safe:animate-pulse" />
                <span className="h-4 w-3/4 rounded bg-foreground/[0.06] motion-safe:animate-pulse" />
                <span className="h-4 w-1/2 rounded bg-foreground/[0.06] motion-safe:animate-pulse" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Page>
  )
}
