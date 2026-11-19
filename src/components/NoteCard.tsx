import { PushPinIcon, PushPinSlashIcon, TrashIcon } from '@phosphor-icons/react'
import { IconButton } from '@/components/IconButton'
import { ScrollArea } from '@/components/ScrollArea'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Folder, Note } from '../types'
import { highlightCode } from '../utils/code'
import { isCodeNote } from '../utils/notes'

// default: extracto recortado · compact: resultados de búsqueda · large: notas fijadas en Inicio y página de Notas,
// grandes, sin adornos y con el contenido desplazable para que se lea entero
export type NoteCardVariant = 'default' | 'compact' | 'large'

interface NoteCardProps {
  note: Note
  // Se muestra la carpeta cuando se ven notas de varias carpetas
  folder?: Folder
  onOpen: (id: string) => void
  onTogglePin: (id: string) => void
  onDelete?: (id: string) => void
  variant?: NoteCardVariant
}

// Tamaños de las tarjetas que muestran un extracto recortado (las grandes se desplazan, ver abajo)
const TITLE = { default: 'text-base', compact: 'text-sm' }
const CODE = { default: 'line-clamp-6 text-[13px]', compact: 'line-clamp-3 text-xs' }
const TEXT = { default: 'line-clamp-6 text-sm', compact: 'line-clamp-3 text-xs' }

export default function NoteCard({ note, folder, onOpen, onTogglePin, onDelete, variant = 'default' }: NoteCardProps) {
  const large = variant === 'large'

  return (
    <Card
      size={variant === 'compact' ? 'sm' : 'default'}
      className={cn(
        'group relative px-(--card-spacing) transition-shadow hover:border-foreground/30',
        variant === 'compact' && 'gap-2',
        // Sin borde en reposo: el panel translúcido basta; el anillo aparece al pasar el ratón
        large && 'gap-3 px-5 py-5 ring-transparent'
      )}
    >
      {folder &&
        (large ? (
          // En las tarjetas grandes la carpeta es una línea discreta, no un chip
          <span className="-mb-1 truncate pr-14 text-xs text-muted-foreground">
            {folder.icon} {folder.name || 'Sin título'}
          </span>
        ) : (
          <div>
            <Badge variant="secondary">
              {folder.icon} {folder.name || 'Sin título'}
            </Badge>
          </div>
        ))}

      {/* Fijar y borrar flotan arriba a la derecha y aparecen al pasar el ratón (en táctil, siempre) */}
      <div className="absolute right-2 top-2 flex gap-0.5 floating rounded-md bg-popover opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100">
        <IconButton
          label={note.pinned ? 'Quitar de inicio' : 'Fijar en inicio'}
          size="icon-xs"
          className={cn(note.pinned && 'text-foreground')}
          onClick={() => onTogglePin(note.id)}
        >
          {note.pinned ? <PushPinSlashIcon /> : <PushPinIcon />}
        </IconButton>
        {onDelete && (
          <IconButton label="Eliminar nota" size="icon-xs" onClick={() => onDelete(note.id)}>
            <TrashIcon />
          </IconButton>
        )}
      </div>

      {large ? (
        <LargeNoteBody note={note} onOpen={onOpen} />
      ) : (
        <ExcerptBody note={note} onOpen={onOpen} size={variant} />
      )}
    </Card>
  )
}

// Extracto: toda la tarjeta es un botón y el contenido se recorta
function ExcerptBody({ note, onOpen, size }: { note: Note; onOpen: (id: string) => void; size: 'default' | 'compact' }) {
  return (
    <button type="button" className="flex w-full flex-col gap-2 text-left" onClick={() => onOpen(note.id)}>
      <span className={cn('line-clamp-2 break-words pr-14 font-semibold', TITLE[size])}>{note.title || 'Sin título'}</span>
      {note.content &&
        (isCodeNote(note) ? (
          // El recorte va en un span interior sin relleno: si fuera en el mismo que lleva el padding,
          // la línea siguiente asomaba cortada por debajo
          <span className="block rounded-md border border-(--code-border) bg-(--code-bg) px-2.5 py-2">
            <span
              className={cn(
                'code-tokens overflow-hidden whitespace-pre-wrap break-words font-mono leading-normal text-(--code-text)',
                CODE[size]
              )}
              dangerouslySetInnerHTML={{ __html: highlightCode(note.content, note.type) }}
            />
          </span>
        ) : (
          <span className={cn('whitespace-pre-wrap break-words leading-normal text-muted-foreground', TEXT[size])}>
            {note.content}
          </span>
        ))}
    </button>
  )
}

// Tarjeta grande (Inicio y Notas): el título abre la nota y el contenido tiene altura fija y se desplaza con
// la rueda (o con las flechas, tras enfocarlo con Tab) para leerla entera sin abrirla.
function LargeNoteBody({ note, onOpen }: { note: Note; onOpen: (id: string) => void }) {
  const title = note.title || 'Sin título'
  const content = {
    watch: note.content,
    tabIndex: 0,
    role: 'region',
    'aria-label': `Contenido de ${title}`,
    // Un clic en el contenido también abre la nota; si se arrastra para seleccionar texto, no
    onClick: () => !window.getSelection()?.toString() && onOpen(note.id),
  }
  const focusRing = 'cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2'

  return (
    <div className="flex flex-col gap-2.5">
      <button
        type="button"
        onClick={() => onOpen(note.id)}
        className="line-clamp-2 break-words rounded-sm pr-14 text-left text-base font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {title}
      </button>
      {note.content &&
        (isCodeNote(note) ? (
          // El borde va fuera de la zona que se desplaza, así el difuminado no se come el borde
          <div className="rounded-md border border-(--code-border) bg-(--code-bg) py-2.5 pl-3 pr-1">
            <ScrollArea {...content} className={cn(focusRing, 'max-h-56 pr-2')}>
              <div
                className="code-tokens whitespace-pre-wrap break-words font-mono text-[13px] leading-normal text-(--code-text)"
                dangerouslySetInnerHTML={{ __html: highlightCode(note.content, note.type) }}
              />
            </ScrollArea>
          </div>
        ) : (
          <ScrollArea
            {...content}
            className={cn(
              focusRing,
              '-mr-2 max-h-48 whitespace-pre-wrap break-words pr-2 text-sm leading-relaxed text-foreground/80'
            )}
          >
            {note.content}
          </ScrollArea>
        ))}
    </div>
  )
}
