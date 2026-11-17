import { useState } from 'react'
import type { ReactNode } from 'react'
import { FolderPlus, Plus, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import EmojiPicker from '../components/EmojiPicker'
import NoteCard from '../components/NoteCard'
import NoteEditor from '../components/NoteEditor'
import type { NoteChanges } from '../components/NoteEditor'
import { Page, PageHeader, PageText, PageTitle } from '../components/Page'
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
      className="min-w-0 flex-1 bg-transparent text-3xl font-bold tracking-tight outline-none placeholder:text-muted-foreground/30"
      placeholder="Sin título"
      value={name}
      onChange={(event) => setName(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => event.key === 'Enter' && event.currentTarget.blur()}
      autoFocus={!folder.name}
    />
  )
}

// Pestaña de carpeta (filtro) con forma de píldora
function FolderTab({ isActive, onClick, children }: { isActive: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <Button size="sm" variant={isActive ? 'default' : 'outline'} className="rounded-full font-normal" onClick={onClick}>
      {children}
    </Button>
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
      <Page>
        <NoteEditor
          note={openNote}
          folders={folders}
          onChange={(changes) => onUpdate(openNote.id, changes)}
          onClose={onClose}
          onDelete={() => onDelete(openNote.id)}
          onTogglePin={() => onTogglePin(openNote.id)}
        />
      </Page>
    )
  }

  const currentFolder = folders.find((folder) => folder.id === view)

  const emptyText = query.trim()
    ? `No hay notas que coincidan con "${query.trim()}".`
    : currentFolder
      ? 'Esta carpeta está vacía. Crea una nota para empezar.'
      : 'Todavía no tienes notas.'

  return (
    <Page>
      <PageHeader
        actions={
          <>
            {currentFolder && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" className="text-muted-foreground">
                    <Trash2 />
                    Eliminar carpeta
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      ¿Eliminar la carpeta "{currentFolder.name || 'Sin título'}"?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Las notas no se borran: pasarán a "Sin carpeta".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={() => onDeleteFolder(currentFolder.id)}>
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button onClick={onCreate}>
              <Plus />
              Nueva nota
            </Button>
          </>
        }
      >
        {currentFolder ? (
          <div className="flex min-w-52 flex-1 items-center gap-2">
            <EmojiPicker value={currentFolder.icon} onChange={(icon) => onUpdateFolder(currentFolder.id, { icon })} />
            <FolderTitle
              key={currentFolder.id}
              folder={currentFolder}
              onRename={(name) => onUpdateFolder(currentFolder.id, { name })}
            />
          </div>
        ) : (
          <PageTitle>{view === 'none' ? 'Sin carpeta' : 'Todas las notas'}</PageTitle>
        )}
      </PageHeader>

      {/* Pestañas de carpetas */}
      <div className="mt-5 flex flex-wrap gap-1.5">
        <FolderTab isActive={view === 'all'} onClick={() => onChangeView('all')}>
          Todas
        </FolderTab>
        {folders.map((folder) => (
          <FolderTab key={folder.id} isActive={view === folder.id} onClick={() => onChangeView(folder.id)}>
            {folder.icon} {folder.name || 'Sin título'}
          </FolderTab>
        ))}
        {/* Filtro para las notas que no están en ninguna carpeta; solo si hay alguna */}
        {(hasNotesWithoutFolder || view === 'none') && (
          <FolderTab isActive={view === 'none'} onClick={() => onChangeView('none')}>
            Sin carpeta
          </FolderTab>
        )}
        <Button size="sm" variant="ghost" className="rounded-full border border-dashed font-normal text-muted-foreground" onClick={onCreateFolder}>
          <FolderPlus />
          Nueva carpeta
        </Button>
      </div>

      {notes.length === 0 ? (
        <div className="mt-6">
          <PageText>{emptyText}</PageText>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] items-start gap-3">
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
    </Page>
  )
}
