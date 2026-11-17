import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc, updateDoc, writeBatch } from 'firebase/firestore'
import { db } from '../firebase'
import type { Task } from '../types'

export type TaskChanges = Partial<Pick<Task, 'text' | 'done' | 'date'>>

const tasksCollection = (uid: string) => collection(db, 'users', uid, 'tasks')

// Tareas del usuario en users/{uid}/tasks; cada una pertenece a un día
export function useTasks(uid: string) {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(
    () =>
      onSnapshot(
        query(tasksCollection(uid), orderBy('createdAt')),
        (snapshot) => setTasks(snapshot.docs.map((item) => item.data() as Task)),
        (error) => console.error('No se pudieron cargar las tareas', error),
      ),
    [uid],
  )

  const addTask = (text: string, date: string) => {
    const task: Task = { id: crypto.randomUUID(), text, done: false, date, createdAt: new Date().toISOString() }
    setDoc(doc(tasksCollection(uid), task.id), task).catch((error) => console.error('No se pudo crear la tarea', error))
  }

  const updateTask = (id: string, changes: TaskChanges) => {
    updateDoc(doc(tasksCollection(uid), id), changes).catch((error) =>
      console.error('No se pudo guardar la tarea', error),
    )
  }

  const deleteTask = (id: string) => {
    deleteDoc(doc(tasksCollection(uid), id)).catch((error) => console.error('No se pudo eliminar la tarea', error))
  }

  // Varias tareas a la vez (pasar pendientes a hoy, borrar completadas)
  const updateMany = (ids: string[], changes: TaskChanges | null) => {
    const batch = writeBatch(db)
    for (const id of ids) {
      if (changes) batch.update(doc(tasksCollection(uid), id), changes)
      else batch.delete(doc(tasksCollection(uid), id))
    }
    batch.commit().catch((error) => console.error('No se pudieron guardar las tareas', error))
  }

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTasks: (ids: string[], date: string) => updateMany(ids, { date }),
    deleteTasks: (ids: string[]) => updateMany(ids, null),
  }
}
