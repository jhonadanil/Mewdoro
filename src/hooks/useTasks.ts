import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc, updateDoc, writeBatch } from 'firebase/firestore'
import { db } from '../db'
import type { Task } from '../types'
import { persist, reloadAction, showError } from '../utils/toast'

export type TaskChanges = Partial<Pick<Task, 'text' | 'done' | 'date'>>

const tasksCollection = (uid: string) => collection(db, 'users', uid, 'tasks')

// Tareas del usuario en users/{uid}/tasks; cada una pertenece a un día
export function useTasks(uid: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  // Hasta la primera respuesta de Firestore no se sabe si hay tareas o no
  const [loaded, setLoaded] = useState(false)

  useEffect(
    () =>
      onSnapshot(
        query(tasksCollection(uid), orderBy('createdAt')),
        (snapshot) => {
          setTasks(snapshot.docs.map((item) => item.data() as Task))
          setLoaded(true)
        },
        (error) => {
          setLoaded(true)
          showError('No se pudieron cargar las tareas', error, reloadAction)
        },
      ),
    [uid],
  )

  const addTask = (text: string, date: string) => {
    const task: Task = { id: crypto.randomUUID(), text, done: false, date, createdAt: new Date().toISOString() }
    persist('No se pudo crear la tarea', () => setDoc(doc(tasksCollection(uid), task.id), task))
  }

  const updateTask = (id: string, changes: TaskChanges) => {
    persist('No se pudo guardar la tarea', () => updateDoc(doc(tasksCollection(uid), id), changes))
  }

  const deleteTask = (id: string) => {
    persist('No se pudo eliminar la tarea', () => deleteDoc(doc(tasksCollection(uid), id)))
  }

  // Varias tareas a la vez (pasar pendientes a hoy, borrar completadas)
  const updateMany = (ids: string[], changes: TaskChanges | null) => {
    // Un lote solo se puede enviar una vez: al reintentar se crea de nuevo
    persist('No se pudieron guardar las tareas', () => {
      const batch = writeBatch(db)
      for (const id of ids) {
        if (changes) batch.update(doc(tasksCollection(uid), id), changes)
        else batch.delete(doc(tasksCollection(uid), id))
      }
      return batch.commit()
    })
  }

  return {
    tasks,
    loaded,
    addTask,
    updateTask,
    deleteTask,
    moveTasks: (ids: string[], date: string) => updateMany(ids, { date }),
    deleteTasks: (ids: string[]) => updateMany(ids, null),
  }
}
