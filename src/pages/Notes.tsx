import { useState } from 'react'
import { FolderPlus, Plus, Trash2 } from 'lucide-react'
import EmojiPicker from '../components/EmojiPicker'
import NoteCard from '../components/NoteCard'
import NoteEditor from '../components/NoteEditor'
import type { NoteChanges } from '../components/NoteEditor'
import type { Folder, FolderView, Note } from '../types'
import { getNoteFolder } from '../utils/notes'

interface NotesProps {
  notes: Note[]
  folders: Folder[]
  view: FolderView
  hasNotesWithoutFolder: boolean
  query: string
  openNote: Note | undefined
  onChangeView: (view: FolderView) => void
  onCreate: () => void
  onOpen: (id: string) => void
  onClose: () => void
  onUpdate: (id: string, changes: NoteChanges) => void
  onDelete: (id: string) => void
  onTogglePin: (id: string) => void
  onCreateFolder: () => void
  onUpdateFolder: (id: string, changes: Partial<Pick<Folder, 'name' | 'icon'>>) => void
  onDeleteFolder: (id: string) => void
}

// Título de la carpeta editable en el sitio, como en Notion; se guarda al salir del campo
function FolderTitle({ folder, onRename }: { folder: Folder; onRename: (name: string) => void }) {
  const [name, setName] = useState(folder.name)

  const commit = () => {
    if (name.trim() !== folder.name) onRename(name.trim())
  }

  return (
    <input
      className="folder-title"
      placeholder="Sin título"
      value={name}
      onChange={(event) => setName(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => event.key === 'Enter' && event.currentTarget.blur()}
      autoFocus={!folder.name}
    />
  )
}

export default function Notes({
  notes,
  folders,
  view,
  hasNotesWithoutFolder,
  query,
  openNote,
  onChangeView,
  onCreate,
  onOpen,
  onClose,
  onUpdate,
  onDelete,
  onTogglePin,
  onCreateFolder,
  onUpdateFolder,
  onDeleteFolder,
}: NotesProps) {
  if (openNote) {
    return (
      <section className="page">
        <NoteEditor
          note={openNote}
          folders={folders}
          onChange={(changes) => onUpdate(openNote.id, changes)}
          onClose={onClose}
          onDelete={() => onDelete(openNote.id)}
          onTogglePin={() => onTogglePin(openNote.id)}
        />
      </section>
    )
  }

  const currentFolder = folders.find((folder) => folder.id === view)

  const deleteCurrentFolder = () => {
    if (!currentFolder) return
    const name = currentFolder.name || 'Sin título'
    if (window.confirm(`¿Eliminar la carpeta "${name}"? Sus notas pasarán a "Sin carpeta".`)) {
      onDeleteFolder(currentFolder.id)
    }
  }

  const emptyText = query.trim()
    ? `No hay notas que coincidan con "${query.trim()}".`
    : currentFolder
      ? 'Esta carpeta está vacía. Crea una nota para empezar.'
      : 'Todavía no tienes notas.'

  return (
    <section className="page">
      <div className="page__header">
        {currentFolder ? (
          <div className="folder-header">
            <EmojiPicker value={currentFolder.icon} onChange={(icon) => onUpdateFolder(currentFolder.id, { icon })} />
            <FolderTitle
              key={currentFolder.id}
              folder={currentFolder}
              onRename={(name) => onUpdateFolder(currentFolder.id, { name })}
            />
          </div>
        ) : (
          <h2 className="page__title">{view === 'none' ? 'Sin carpeta' : 'Todas las notas'}</h2>
        )}

        <div className="page__actions">
          {currentFolder && (
            <button type="button" className="btn btn--ghost" onClick={deleteCurrentFolder}>
              <Trash2 size={16} />
              Eliminar carpeta
            </button>
          )}
          <button type="button" className="btn btn--primary" onClick={onCreate}>
            <Plus size={16} />
            Nueva nota
          </button>
        </div>
      </div>

      {/* Pestañas de carpetas */}
      <div className="folder-tabs">
        <button
          type="button"
          className={`folder-tab ${view === 'all' ? 'folder-tab--active' : ''}`}
          onClick={() => onChangeView('all')}
        >
          Todas
        </button>
        {folders.map((folder) => (
          <button
            key={folder.id}
            type="button"
            className={`folder-tab ${view === folder.id ? 'folder-tab--active' : ''}`}
            onClick={() => onChangeView(folder.id)}
          >
            {folder.icon} {folder.name || 'Sin título'}
          </button>
        ))}
        {/* Filtro para las notas que no están en ninguna carpeta; solo si hay alguna */}
        {(hasNotesWithoutFolder || view === 'none') && (
          <button
            type="button"
            className={`folder-tab ${view === 'none' ? 'folder-tab--active' : ''}`}
            onClick={() => onChangeView('none')}
          >
            Sin carpeta
          </button>
        )}
        <button type="button" className="folder-tab folder-tab--add" onClick={onCreateFolder}>
          <FolderPlus size={14} />
          Nueva carpeta
        </button>
      </div>

      {notes.length === 0 ? (
        <p className="page__text">{emptyText}</p>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              folder={view === 'all' ? getNoteFolder(note, folders) : undefined}
              onOpen={onOpen}
              onTogglePin={onTogglePin}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  )
}
