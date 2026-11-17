import { useLayoutEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { ArrowLeft, Check, Copy, Pin, PinOff, Trash2 } from 'lucide-react'
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
    <div className="editor">
      {/* Barra superior: ruta a la izquierda, propiedades pequeñas a la derecha */}
      <div className="editor__topbar">
        <div className="editor__breadcrumb">
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Volver a las notas" title="Volver">
            <ArrowLeft size={16} />
          </button>
          <Dropdown
            label="Mover a carpeta"
            value={folder?.id ?? ''}
            options={folderOptions}
            onChange={(folderId) => onChange({ folderId: folderId || null })}
          />
          <span className="editor__breadcrumb-separator">/</span>
          <span className="editor__breadcrumb-title">{note.title || 'Sin título'}</span>
        </div>

        <div className="editor__topbar-actions">
          <span className="editor__edited" title={formatDate(note.updatedAt)}>
            Editado {formatRelative(note.updatedAt)}
          </span>
          <Dropdown
            label="Tipo de nota"
            value={note.type}
            options={NOTE_TYPES}
            onChange={(type: NoteType) => onChange({ type })}
            align="right"
          />
          <button
            type="button"
            className={`icon-btn ${note.pinned ? 'icon-btn--active' : ''}`}
            onClick={onTogglePin}
            aria-label={note.pinned ? 'Quitar de inicio' : 'Fijar en inicio'}
            title={note.pinned ? 'Quitar de inicio' : 'Fijar en inicio'}
          >
            {note.pinned ? <PinOff size={16} /> : <Pin size={16} />}
          </button>
          <button type="button" className="icon-btn" onClick={onDelete} aria-label="Eliminar nota" title="Eliminar nota">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="editor__page">
        <input
          className="editor__title"
          type="text"
          placeholder="Sin título"
          value={note.title}
          onChange={(event) => onChange({ title: event.target.value })}
          onKeyDown={handleTitleKeyDown}
          autoFocus={!note.title && !note.content}
        />

        {isCode ? (
          // Bloque de código como en Notion: lenguaje y botón de copiar en la cabecera
          <div className="code-block">
            <div className="code-block__header">
              <span>{getNoteTypeLabel(note.type)}</span>
              <button type="button" className="code-block__button" onClick={copyContent} disabled={!note.content}>
                {isCopied ? <Check size={13} /> : <Copy size={13} />}
                {isCopied ? 'Copiado' : 'Copiar'}
              </button>
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
            className="editor__content"
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
