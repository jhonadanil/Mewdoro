import { Pin, PinOff, Trash2 } from 'lucide-react'
import type { Folder, Note } from '../types'
import { highlightCode } from '../utils/code'
import { isCodeNote } from '../utils/notes'

interface NoteCardProps {
  note: Note
  // Se muestra la carpeta cuando se ven notas de varias carpetas
  folder?: Folder
  onOpen: (id: string) => void
  onTogglePin: (id: string) => void
  onDelete?: (id: string) => void
  compact?: boolean
}

export default function NoteCard({ note, folder, onOpen, onTogglePin, onDelete, compact = false }: NoteCardProps) {
  const pinLabel = note.pinned ? 'Quitar de inicio' : 'Fijar en inicio'

  return (
    <article className={`note-card ${compact ? 'note-card--compact' : ''}`}>
      {folder && (
        <div className="note-card__tags">
          <span className="note-tag">{folder.icon} {folder.name || 'Sin título'}</span>
        </div>
      )}

      {/* Fijar y borrar flotan arriba a la derecha y aparecen al pasar el ratón */}
      <div className="note-card__actions">
        <button
          type="button"
          className={`icon-btn ${note.pinned ? 'icon-btn--active' : ''}`}
          onClick={() => onTogglePin(note.id)}
          aria-label={pinLabel}
          title={pinLabel}
        >
          {note.pinned ? <PinOff size={15} /> : <Pin size={15} />}
        </button>
        {onDelete && (
          <button
            type="button"
            className="icon-btn"
            onClick={() => onDelete(note.id)}
            aria-label="Eliminar nota"
            title="Eliminar nota"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      <button type="button" className="note-card__body" onClick={() => onOpen(note.id)}>
        <span className="note-card__title">{note.title || 'Sin título'}</span>
        {note.content &&
          (isCodeNote(note) ? (
            <span
              className="note-card__code code-tokens"
              dangerouslySetInnerHTML={{ __html: highlightCode(note.content, note.type) }}
            />
          ) : (
            <span className="note-card__content">{note.content}</span>
          ))}
      </button>
    </article>
  )
}
