export type Page = 'home' | 'notes' | 'pomodoro' | 'tasks' | 'calendar' | 'settings'

export type NoteType =
  | 'text'
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
}

export interface Task {
  id: string
  text: string
  done: boolean
  // Día al que pertenece, "AAAA-MM-DD" en hora local
  date: string
  createdAt: string
}
