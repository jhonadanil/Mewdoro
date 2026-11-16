export type Page = 'home' | 'notes' | 'pomodoro'

export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}
