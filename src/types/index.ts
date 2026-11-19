export type Page = 'home' | 'notes' | 'pomodoro' | 'tasks' | 'calendar' | 'routines' | 'settings'

export type NoteType =
  | 'text'
  | 'checklist'
  | 'bash'
  | 'python'
  | 'html'
  | 'css'
  | 'javascript'
  | 'typescript'
  | 'json'
  | 'sql'
  | 'markdown'

export interface Note {
  id: string
  title: string
  content: string
  type: NoteType
  pinned: boolean
  // null (o sin definir en notas antiguas) = sin carpeta
  folderId?: string | null
  createdAt: string
  updatedAt: string
}

export interface Folder {
  id: string
  name: string
  icon: string
  createdAt: string
}

// Qué notas se ven: todas, las que no tienen carpeta o el id de una carpeta
export type FolderView = 'all' | 'none' | (string & {})

export type PomodoroMode = 'work' | 'shortBreak' | 'longBreak'

export type Theme = 'dark' | 'light'

export interface Settings {
  workMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  // Cada cuántos pomodoros toca el descanso largo
  longBreakInterval: number
  autoStart: boolean
  sound: boolean
  theme: Theme
  defaultNoteType: NoteType
}

export interface Pinned {
  pomodoro: boolean
  calendar: boolean
  tasks: boolean
  routines: boolean
}

export interface Task {
  id: string
  text: string
  done: boolean
  // Día al que pertenece, "AAAA-MM-DD" en hora local
  date: string
  createdAt: string
}

export interface Routine {
  id: string
  name: string
  icon: string
  // Días de la semana en que toca, 0 = lunes … 6 = domingo
  days: number[]
  createdAt: string
}

// Una rutina hecha en un día; su id es "{routineId}_{AAAA-MM-DD}" y que exista significa "hecha"
export interface RoutineLog {
  id: string
  routineId: string
  date: string
}

export interface Routine {
  id: string
  name: string
  icon: string
  // Días de la semana en que toca, 0 = lunes ... 6 = domingo
  days: number[]
  createdAt: string
}

// Una rutina hecha en un día; su id es "{routineId}_{AAAA-MM-DD}" y que exista significa "hecha"
export interface RoutineLog {
  id: string
  routineId: string
  date: string
}
