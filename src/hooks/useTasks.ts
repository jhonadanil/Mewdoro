import { useEffect, useRef, useState } from 'react'
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc, updateDoc, writeBatch } from 'firebase/firestore'
import { db } from '../db'
import { useClock } from './useClock'
import type { Task } from '../types'
import { toDateKey } from '../utils/notes'
import { persist, reloadAction, showError } from '../utils/toast'

export type TaskChanges = Partial<Pick<Task, 'text' | 'done' | 'date'>>

const tasksCollection = (uid: string) => collection(db, 'users', uid, 'tasks')

// Tareas flash del usuario en users/{uid}/tasks: se borran al completarse y terminar el día; las pendientes pasan a hoy
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

  // Al empezar un día nuevo, las tareas completadas de días anteriores se borran
  // y las que quedaron pendientes pasan solas a hoy
  const today = toDateKey(useClock())
  const handled = useRef(new Set<string>())
  useEffect(() => {
    if (!loaded) return
    const stale = tasks.filter((task) => task.date < today && !handled.current.has(task.id))
    if (stale.length === 0) return
    stale.forEach((task) => handled.current.add(task.id))
    persist('No se pudieron actualizar las tareas del día anterior', () => {
      const batch = writeBatch(db)
      for (const task of stale) {
        if (task.done) batch.delete(doc(tasksCollection(uid), task.id))
        else batch.update(doc(tasksCollection(uid), task.id), { date: today })
      }
      return batch.commit()
    })
  }, [tasks, loaded, today, uid])

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

  // Varias tareas a la vez (borrar completadas)
  const deleteMany = (ids: string[]) => {
    // Un lote solo se puede enviar una vez: al reintentar se crea de nuevo
    persist('No se pudieron guardar las tareas', () => {
      const batch = writeBatch(db)
      for (const id of ids) batch.delete(doc(tasksCollection(uid), id))
      return batch.commit()
    })
  }

  return {
    tasks,
    loaded,
    addTask,
    updateTask,
    deleteTask,
    deleteTasks: deleteMany,
  }
}
