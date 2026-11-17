import MiniCalendar from '../components/MiniCalendar'
import MiniPomodoro from '../components/MiniPomodoro'
import MiniTasks from '../components/MiniTasks'
import NoteCard from '../components/NoteCard'
import type { Pomodoro } from '../hooks/usePomodoro'
import type { TaskChanges } from '../hooks/useTasks'
import type { Folder, Note, Page, Task } from '../types'
import { getNoteFolder } from '../utils/notes'

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
  onNavigate: (page: Page) => void
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
  // Mientras se busca, Inicio muestra los resultados
  if (query.trim()) {
    return (
      <section className="page">
        <h2 className="page__title">Resultados</h2>
        {searchResults.length === 0 ? (
          <p className="page__text">No hay notas que coincidan con "{query.trim()}".</p>
        ) : (
          <div className="pinned-grid">
            {searchResults.map((note) => (
              <NoteCard key={note.id} note={note} folder={getNoteFolder(note, folders)} onOpen={onOpenNote} onTogglePin={onTogglePinNote} compact />
            ))}
          </div>
        )}
      </section>
    )
  }

  const pinnedNotes = notes.filter((note) => note.pinned)
  const hasPinned = isPomodoroPinned || isCalendarPinned || isTasksPinned || pinnedNotes.length > 0

  // La bienvenida solo se muestra mientras no haya nada fijado
  if (!hasPinned) {
    return (
      <section className="page">
        <h2 className="page__title">Bienvenido</h2>
        <p className="page__text">
          Organiza tus ideas y mantén la concentración con el temporizador Pomodoro.
          Fija una nota, tus tareas, el Pomodoro o el calendario para tenerlos a mano aquí.
        </p>
      </section>
    )
  }

  return (
    <section className="page">
      <h2 className="page__title">Fijados</h2>
      <div className="pinned-grid">
        {isPomodoroPinned && (
          <MiniPomodoro
            pomodoro={pomodoro}
            onOpen={() => onNavigate('pomodoro')}
            onUnpin={onUnpinPomodoro}
          />
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
        {isCalendarPinned && (
          <MiniCalendar onOpen={() => onNavigate('calendar')} onUnpin={onUnpinCalendar} />
        )}
        {pinnedNotes.map((note) => (
          <NoteCard key={note.id} note={note} folder={getNoteFolder(note, folders)} onOpen={onOpenNote} onTogglePin={onTogglePinNote} compact />
        ))}
      </div>
    </section>
  )
}
