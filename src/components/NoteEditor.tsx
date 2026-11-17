import { useLayoutEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { ArrowLeft, Check, Copy, Pin, PinOff, Trash2 } from 'lucide-react'
import { IconButton } from '@/components/IconButton'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import CodeEditor from './CodeEditor'
import Dropdown from './Dropdown'
import type { Folder, Note, NoteType } from '../types'
import { NOTE_TYPES, formatDate, formatRelative, getNoteFolder, getNoteTypeLabel, isCodeNote } from '../utils/notes'

export type NoteChanges = Partial<Pick<Note, 'title' | 'content' | 'type' | 'folderId'>>

interface NoteEditorProps {
  note: Note
  folders: Folder[]
  onChange: (changes: NoteChanges) => void
  onClose: () => void
  onDelete: () => void
  onTogglePin: () => void
}

// Editor a página completa, al estilo Notion: barra fina arriba, título grande y el contenido debajo
export default function NoteEditor({ note, folders, onChange, onClose, onDelete, onTogglePin }: NoteEditorProps) {
  const folder = getNoteFolder(note, folders)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const [isCopied, setIsCopied] = useState(false)
  const isCode = isCodeNote(note)

  // El área de texto de las notas de texto crece con el contenido (el de código crece solo)
  useLayoutEffect(() => {
    const textarea = contentRef.current
    if (!textarea || isCode) return
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [note.content, isCode])

  // Enter en el título salta al contenido, como en Notion
  const handleTitleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    contentRef.current?.focus()
  }

  const changeContent = (content: string) => onChange({ content })

  const copyContent = () => {
    navigator.clipboard
      .writeText(note.content)
      .then(() => {
        setIsCopied(true)
        window.setTimeout(() => setIsCopied(false), 1500)
      })
      .catch((error) => console.error('No se pudo copiar', error))
  }

  const folderOptions = [
    { value: '', label: '📄 Sin carpeta' },
    ...folders.map((item) => ({ value: item.id, label: `${item.icon} ${item.name || 'Sin título'}` })),
  ]

  return (
    <div>
      {/* Barra superior: ruta a la izquierda, propiedades pequeñas a la derecha */}
      <div className="mb-12 flex min-h-8 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-1">
          <IconButton label="Volver a las notas" onClick={onClose}>
            <ArrowLeft />
          </IconButton>
          <Dropdown
            label="Mover a carpeta"
            value={folder?.id ?? ''}
            options={folderOptions}
            onChange={(folderId) => onChange({ folderId: folderId || null })}
          />
          <span className="text-[13px] text-muted-foreground">/</span>
          <span className="truncate px-1 text-[13px]">{note.title || 'Sin título'}</span>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="mr-1 whitespace-nowrap text-xs text-muted-foreground">
                Editado {formatRelative(note.updatedAt)}
              </span>
            </TooltipTrigger>
            <TooltipContent>{formatDate(note.updatedAt)}</TooltipContent>
          </Tooltip>
          <Dropdown
            label="Tipo de nota"
            value={note.type}
            options={NOTE_TYPES}
            onChange={(type: NoteType) => onChange({ type })}
            align="end"
          />
          <IconButton
            label={note.pinned ? 'Quitar de inicio' : 'Fijar en inicio'}
            className={cn(note.pinned && 'text-foreground')}
            onClick={onTogglePin}
          >
            {note.pinned ? <PinOff /> : <Pin />}
          </IconButton>
          <IconButton label="Eliminar nota" onClick={onDelete}>
            <Trash2 />
          </IconButton>
        </div>
      </div>

      {/* Columna de lectura centrada, con el ancho de Notion */}
      <div className="mx-auto max-w-[708px]">
        <input
          className="mb-3 w-full bg-transparent text-[40px] font-bold leading-tight outline-none placeholder:text-muted-foreground/30"
          type="text"
          placeholder="Sin título"
          value={note.title}
          onChange={(event) => onChange({ title: event.target.value })}
          onKeyDown={handleTitleKeyDown}
          autoFocus={!note.title && !note.content}
        />

        {isCode ? (
          // Bloque de código como en VS Code: lenguaje y botón de copiar en la cabecera
          <div className="overflow-hidden rounded-md border bg-(--code-bg)">
            <div className="flex items-center justify-between border-b border-(--code-border) py-1 pl-3.5 pr-1.5 text-xs text-(--code-gutter)">
              <span>{getNoteTypeLabel(note.type)}</span>
              <Button
                variant="ghost"
                size="xs"
                className="font-normal text-(--code-gutter) hover:bg-(--code-active-line) hover:text-(--code-text)"
                onClick={copyContent}
                disabled={!note.content}
              >
                {isCopied ? <Check /> : <Copy />}
                {isCopied ? 'Copiado' : 'Copiar'}
              </Button>
            </div>
            <CodeEditor
              value={note.content}
              type={note.type}
              placeholder={`Escribe tu código ${getNoteTypeLabel(note.type)}...`}
              onChange={changeContent}
              inputRef={contentRef}
            />
          </div>
        ) : (
          <textarea
            ref={contentRef}
            className="min-h-60 w-full resize-none overflow-hidden bg-transparent text-base leading-relaxed outline-none placeholder:text-muted-foreground"
            placeholder="Escribe algo..."
            value={note.content}
            onChange={(event) => onChange({ content: event.target.value })}
            rows={4}
          />
        )}
      </div>
    </div>
  )
}
