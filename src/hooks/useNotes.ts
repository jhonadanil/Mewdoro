import { useCallback, useEffect, useRef, useState } from 'react'
import {
  collection,
  deleteDoc,
  doc,
  getDocsFromServer,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase'
import type { Note } from '../types'

export type NoteChanges = Partial<Pick<Note, 'title' | 'content' | 'type' | 'pinned' | 'folderId'>>

// Espera tras la última tecla antes de guardar, para no escribir en cada pulsación
const SAVE_DELAY = 600

const notesCollection = (uid: string) => collection(db, 'users', uid, 'notes')

// Si el usuario tenía notas guardadas solo en el navegador, se suben la primera vez que entra
async function importLocalNotes(uid: string) {
  let localNotes: Note[]
  try {
    localNotes = JSON.parse(localStorage.getItem('notes') ?? '[]')
  } catch {
    return
  }
  if (!Array.isArray(localNotes) || localNotes.length === 0) return

  const existing = await getDocsFromServer(query(notesCollection(uid), limit(1)))
  if (!existing.empty) return

  const batch = writeBatch(db)
  for (const note of localNotes) {
    // Las notas más antiguas no tenían tipo ni fijado
    batch.set(doc(notesCollection(uid), note.id), { ...note, type: note.type ?? 'text', pinned: note.pinned ?? false })
  }
  await batch.commit()
  localStorage.removeItem('notes')
}

// Notas del usuario en users/{uid}/notes, sincronizadas en tiempo real
export function useNotes(uid: string) {
  const [savedNotes, setSavedNotes] = useState<Note[]>([])
  // Cambios escritos pero todavía sin guardar; se muestran encima de los guardados
  const [pending, setPending] = useState<Record<string, NoteChanges & { updatedAt: string }>>({})
  const pendingRef = useRef(pending)
  const timers = useRef(new Map<string, number>())

  useEffect(() => {
    pendingRef.current = pending
  }, [pending])

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(notesCollection(uid), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const saved = snapshot.docs.map((item) => item.data() as Note)
        setSavedNotes(saved)

        // Un cambio pendiente solo se quita cuando Firestore ya tiene esa misma versión.
        // Si se quitara antes, el editor mostraría un instante el texto viejo y el cursor saltaría al final
        setPending((current) => {
          let next = current
          for (const note of saved) {
            const changes = current[note.id]
            if (changes && !timers.current.has(note.id) && changes.updatedAt === note.updatedAt) {
              if (next === current) next = { ...current }
              delete next[note.id]
            }
          }
          return next
        })
      },
      (error) => console.error('No se pudieron cargar las notas', error),
    )
    importLocalNotes(uid).catch((error) => console.error('No se pudieron importar las notas locales', error))
    return unsubscribe
  }, [uid])

  const notes = savedNotes.map((note) => (pending[note.id] ? { ...note, ...pending[note.id] } : note))

  const flush = useCallback(
    (id: string) => {
      // Sin temporizador, no hay nada nuevo que enviar (ya se envió y falta la confirmación)
      if (!timers.current.has(id)) return
      window.clearTimeout(timers.current.get(id))
      timers.current.delete(id)

      const changes = pendingRef.current[id]
      if (!changes) return

      // El cambio pendiente se quita en onSnapshot, cuando Firestore devuelve esta versión
      updateDoc(doc(notesCollection(uid), id), changes).catch((error) =>
        console.error('No se pudo guardar la nota', error),
      )
    },
    [uid],
  )

  const flushAll = useCallback(() => Object.keys(pendingRef.current).forEach(flush), [flush])

  // Guarda lo pendiente al salir de la app
  useEffect(() => {
    window.addEventListener('beforeunload', flushAll)
    return () => {
      window.removeEventListener('beforeunload', flushAll)
      flushAll()
    }
  }, [flushAll])

  const createNote = (note: Note) => {
    setDoc(doc(notesCollection(uid), note.id), note).catch((error) =>
      console.error('No se pudo crear la nota', error),
    )
  }

  const updateNote = (id: string, changes: NoteChanges) => {
    const updated = { ...pendingRef.current[id], ...changes, updatedAt: new Date().toISOString() }
    pendingRef.current = { ...pendingRef.current, [id]: updated }
    setPending(pendingRef.current)

    window.clearTimeout(timers.current.get(id))
    timers.current.set(id, window.setTimeout(() => flush(id), SAVE_DELAY))
  }

  const deleteNote = (id: string) => {
    window.clearTimeout(timers.current.get(id))
    timers.current.delete(id)
    setPending((current) => {
      const rest = { ...current }
      delete rest[id]
      return rest
    })
    deleteDoc(doc(notesCollection(uid), id)).catch((error) => console.error('No se pudo eliminar la nota', error))
  }

  // Fijar no cambia la fecha de edición, así que se guarda directamente
  const togglePin = (id: string) => {
    const note = notes.find((item) => item.id === id)
    if (!note) return
    updateDoc(doc(notesCollection(uid), id), { pinned: !note.pinned }).catch((error) =>
      console.error('No se pudo fijar la nota', error),
    )
  }

  return { notes, createNote, updateNote, deleteNote, togglePin, flush, flushAll }
}
