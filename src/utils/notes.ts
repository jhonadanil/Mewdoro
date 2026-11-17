import type { Folder, FolderView, Note, NoteType } from '../types'

export const NOTE_TYPES: { value: NoteType; label: string }[] = [
  { value: 'text', label: 'Texto' },
  { value: 'bash', label: 'Bash' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'json', label: 'JSON' },
  { value: 'sql', label: 'SQL' },
  { value: 'markdown', label: 'Markdown' },
]

export function getNoteTypeLabel(type: NoteType) {
  return NOTE_TYPES.find((item) => item.value === type)?.label ?? 'Texto'
}

export function isCodeNote(note: Note) {
  return note.type !== 'text'
}

export function createNote(type: NoteType = 'text', folderId: string | null = null): Note {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    title: '',
    content: '',
    type,
    pinned: false,
    folderId,
    createdAt: now,
    updatedAt: now,
  }
}

export function isEmptyNote(note: Note) {
  return !note.title.trim() && !note.content.trim()
}

// Busca en el título, el contenido y el tipo de la nota
export function filterNotes(notes: Note[], query: string) {
  const search = query.trim().toLowerCase()
  if (!search) return notes

  return notes.filter((note) =>
    [note.title, note.content, getNoteTypeLabel(note.type)].some((text) =>
      text.toLowerCase().includes(search),
    ),
  )
}

// La carpeta de una nota; si se borró, la nota cuenta como "sin carpeta"
export function getNoteFolder(note: Note, folders: Folder[]) {
  return folders.find((folder) => folder.id === note.folderId)
}

export function filterByFolder(notes: Note[], folders: Folder[], view: FolderView) {
  if (view === 'all') return notes
  if (view === 'none') return notes.filter((note) => !getNoteFolder(note, folders))
  return notes.filter((note) => note.folderId === view)
}

// Clave "AAAA-MM-DD" en hora local, para agrupar notas por día
export function toDateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

// "ahora", "hace 5 min", "hace 3 h" o la fecha corta si es más antiguo
export function formatRelative(iso: string) {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (minutes < 1) return 'ahora'
  if (minutes < 60) return `hace ${minutes} min`
  if (minutes < 60 * 24) return `hace ${Math.floor(minutes / 60)} h`
  return new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'short' })
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
