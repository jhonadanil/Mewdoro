import MiniCalendar from '../components/MiniCalendar'
import MiniPomodoro from '../components/MiniPomodoro'
import MiniTasks from '../components/MiniTasks'
import NoteCard from '../components/NoteCard'
import { Page, PageText, PageTitle } from '../components/Page'
import type { Pomodoro } from '../hooks/usePomodoro'
import type { TaskChanges } from '../hooks/useTasks'
import type { Folder, Note, Page as PageName, Task } from '../types'
import { getNoteFolder } from '../utils/notes'

// Tarjetas pequeñas de Inicio
const GRID = 'mt-4 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] items-start gap-2.5'

interface HomeProps {
  notes: Note[]
  folders: Folder[]
  query: string
  searchResults: Note[]
  pomodoro: Pomodoro
  isPomodoroPinned: boolean
  onUnpinPomodoro: () => void
  isCalendarPinned: boolean
  onUnpinCalendar: () => void
  tasks: Task[]
  isTasksPinned: boolean
  onUnpinTasks: () => void
  onAddTask: (text: string, date: string) => void
  onUpdateTask: (id: string, changes: TaskChanges) => void
  onNavigate: (page: PageName) => void
  onOpenNote: (id: string) => void
  onTogglePinNote: (id: string) => void
}

export default function Home({
  notes,
  folders,
  query,
  searchResults,
  pomodoro,
  isPomodoroPinned,
  onUnpinPomodoro,
  isCalendarPinned,
  onUnpinCalendar,
  tasks,
  isTasksPinned,
  onUnpinTasks,
  onAddTask,
  onUpdateTask,
  onNavigate,
  onOpenNote,
  onTogglePinNote,
}: HomeProps) {
  const renderNote = (note: Note) => (
    <NoteCard
      key={note.id}
      note={note}
      folder={getNoteFolder(note, folders)}
      onOpen={onOpenNote}
      onTogglePin={onTogglePinNote}
      compact
    />
  )

  // Mientras se busca, Inicio muestra los resultados
  if (query.trim()) {
    return (
      <Page>
        <PageTitle>Resultados</PageTitle>
        {searchResults.length === 0 ? (
          <PageText>No hay notas que coincidan con "{query.trim()}".</PageText>
        ) : (
          <div className={GRID}>{searchResults.map(renderNote)}</div>
        )}
      </Page>
    )
  }

  const pinnedNotes = notes.filter((note) => note.pinned)
  const hasPinned = isPomodoroPinned || isCalendarPinned || isTasksPinned || pinnedNotes.length > 0

  // La bienvenida solo se muestra mientras no haya nada fijado
  if (!hasPinned) {
    return (
      <Page>
        <PageTitle>Bienvenido</PageTitle>
        <PageText>
          Organiza tus ideas y mantén la concentración con el temporizador Pomodoro.
          Fija una nota, tus tareas, el Pomodoro o el calendario para tenerlos a mano aquí.
        </PageText>
      </Page>
    )
  }

  return (
    <Page>
      <PageTitle>Fijados</PageTitle>
      <div className={GRID}>
        {isPomodoroPinned && (
          <MiniPomodoro pomodoro={pomodoro} onOpen={() => onNavigate('pomodoro')} onUnpin={onUnpinPomodoro} />
        )}
        {isTasksPinned && (
          <MiniTasks
            tasks={tasks}
            onOpen={() => onNavigate('tasks')}
            onUnpin={onUnpinTasks}
            onAdd={onAddTask}
            onUpdate={onUpdateTask}
          />
        )}
        {isCalendarPinned && <MiniCalendar onOpen={() => onNavigate('calendar')} onUnpin={onUnpinCalendar} />}
        {pinnedNotes.map(renderNote)}
      </div>
    </Page>
  )
}
