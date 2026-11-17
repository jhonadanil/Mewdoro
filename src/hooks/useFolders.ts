import { useEffect, useState } from 'react'
import { collection, doc, getDocFromServer, onSnapshot, orderBy, query, setDoc, updateDoc, writeBatch } from 'firebase/firestore'
import { db } from '../db'
import type { Folder } from '../types'

// Iconos para las carpetas, agrupados como en el selector de Notion
export const FOLDER_ICON_GROUPS: { name: string; icons: string[] }[] = [
  {
    name: 'Trabajo',
    icons: ['📁', '📂', '💼', '📋', '📌', '📎', '📅', '📆', '📈', '📊', '📉', '🗂️', '🗃️', '🗄️', '📇', '🧾', '✉️', '📨', '📞', '🏢'],
  },
  {
    name: 'Código',
    icons: ['💻', '🖥️', '⌨️', '🖱️', '🧑‍💻', '🐍', '☕', '🦀', '🐳', '🐧', '⚙️', '🛠️', '🔧', '🔩', '🧩', '🧪', '🐛', '🔌', '💾', '🌐'],
  },
  {
    name: 'Tareas y proyectos',
    icons: ['✅', '☑️', '✔️', '📝', '✏️', '🖊️', '🎯', '🚀', '🏁', '⏰', '⏳', '🔔', '🔥', '⚡', '💡', '🧠', '🏆', '🥇', '📣', '🗓️'],
  },
  {
    name: 'Estudio y personal',
    icons: ['📚', '📖', '📓', '📒', '🎓', '🏫', '🔬', '🧮', '🏠', '🛒', '🍳', '🏋️', '🧘', '✈️', '🌍', '🎵', '🎮', '🎬', '📷', '🎨'],
  },
  {
    name: 'Símbolos',
    icons: ['⭐', '🌟', '✨', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '💎', '🍀'],
  },
]

// Carpetas con las que empieza cada cuenta; ids fijos para no duplicarlas
const DEFAULT_FOLDERS = [
  { id: 'trabajo', name: 'Trabajo', icon: '💼' },
  { id: 'codigo', name: 'Código', icon: '💻' },
  { id: 'tareas', name: 'Tareas', icon: '✅' },
  { id: 'proyectos', name: 'Proyectos', icon: '🚀' },
]

const foldersCollection = (uid: string) => collection(db, 'users', uid, 'folders')

// Solo la primera vez: si el usuario borra las carpetas, no vuelven a aparecer
async function createDefaultFolders(uid: string) {
  const userRef = doc(db, 'users', uid)
  const userDoc = await getDocFromServer(userRef)
  if (userDoc.data()?.foldersCreated) return

  const batch = writeBatch(db)
  const now = Date.now()
  DEFAULT_FOLDERS.forEach((folder, index) => {
    batch.set(doc(foldersCollection(uid), folder.id), {
      ...folder,
      createdAt: new Date(now + index).toISOString(),
    })
  })
  batch.set(userRef, { foldersCreated: true }, { merge: true })
  await batch.commit()
}

// Carpetas del usuario en users/{uid}/folders
export function useFolders(uid: string) {
  const [folders, setFolders] = useState<Folder[]>([])

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(foldersCollection(uid), orderBy('createdAt')),
      (snapshot) => setFolders(snapshot.docs.map((item) => item.data() as Folder)),
      (error) => console.error('No se pudieron cargar las carpetas', error),
    )
    createDefaultFolders(uid).catch((error) => console.error('No se pudieron crear las carpetas iniciales', error))
    return unsubscribe
  }, [uid])

  const createFolder = () => {
    const folder: Folder = { id: crypto.randomUUID(), name: '', icon: '📁', createdAt: new Date().toISOString() }
    setDoc(doc(foldersCollection(uid), folder.id), folder).catch((error) =>
      console.error('No se pudo crear la carpeta', error),
    )
    return folder
  }

  const updateFolder = (id: string, changes: Partial<Pick<Folder, 'name' | 'icon'>>) => {
    updateDoc(doc(foldersCollection(uid), id), changes).catch((error) =>
      console.error('No se pudo guardar la carpeta', error),
    )
  }

  // Las notas de la carpeta no se borran: pasan a "Sin carpeta"
  const deleteFolder = (id: string, noteIds: string[]) => {
    const batch = writeBatch(db)
    batch.delete(doc(foldersCollection(uid), id))
    for (const noteId of noteIds) {
      batch.update(doc(db, 'users', uid, 'notes', noteId), { folderId: null })
    }
    batch.commit().catch((error) => console.error('No se pudo eliminar la carpeta', error))
  }

  return { folders, createFolder, updateFolder, deleteFolder }
}
