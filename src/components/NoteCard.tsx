import type { Note } from '../types'

interface NoteCardProps {
  note: Note
  onDelete: (id: string) => void
}

export default function NoteCard({ note, onDelete }: NoteCardProps) {
  return (
    <article className="note-card">
      <div className="note-card__header">
        <h3 className="note-card__title">{note.title || 'Sin título'}</h3>
        <button
          type="button"
          className="note-card__delete"
          onClick={() => onDelete(note.id)}
          aria-label="Eliminar nota"
        >
          Eliminar
        </button>
      </div>
      {note.content && <p className="note-card__content">{note.content}</p>}
    </article>
  )
}
