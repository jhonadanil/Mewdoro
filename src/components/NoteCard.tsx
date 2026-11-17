import { Pin, PinOff, Trash2 } from 'lucide-react'
import { IconButton } from '@/components/IconButton'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
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
  return (
    <Card
      size={compact ? 'sm' : 'default'}
      className={cn('group relative px-(--card-spacing) transition-shadow hover:ring-foreground/25', compact && 'gap-2')}
    >
      {folder && (
        <div>
          <Badge variant="secondary">
            {folder.icon} {folder.name || 'Sin título'}
          </Badge>
        </div>
      )}

      {/* Fijar y borrar flotan arriba a la derecha y aparecen al pasar el ratón (en táctil, siempre) */}
      <div className="absolute right-2 top-2 flex gap-0.5 rounded-md bg-card opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100">
        <IconButton
          label={note.pinned ? 'Quitar de inicio' : 'Fijar en inicio'}
          size="icon-xs"
          className={cn(note.pinned && 'text-foreground')}
          onClick={() => onTogglePin(note.id)}
        >
          {note.pinned ? <PinOff /> : <Pin />}
        </IconButton>
        {onDelete && (
          <IconButton label="Eliminar nota" size="icon-xs" onClick={() => onDelete(note.id)}>
            <Trash2 />
          </IconButton>
        )}
      </div>

      <button type="button" className="flex w-full flex-col gap-2 text-left" onClick={() => onOpen(note.id)}>
        <span className={cn('pr-14 font-semibold', compact ? 'text-sm' : 'text-base')}>{note.title || 'Sin título'}</span>
        {note.content &&
          (isCodeNote(note) ? (
            <span
              className={cn(
                'code-tokens overflow-hidden whitespace-pre-wrap break-words rounded-md border border-(--code-border) bg-(--code-bg) px-2.5 py-2 font-mono leading-normal text-(--code-text)',
                compact ? 'line-clamp-3 text-xs' : 'line-clamp-6 text-[13px]'
              )}
              dangerouslySetInnerHTML={{ __html: highlightCode(note.content, note.type) }}
            />
          ) : (
            <span
              className={cn(
                'whitespace-pre-wrap break-words leading-normal text-muted-foreground',
                compact ? 'line-clamp-3 text-xs' : 'line-clamp-6 text-sm'
              )}
            >
              {note.content}
            </span>
          ))}
      </button>
    </Card>
  )
}
