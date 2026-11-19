import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc, updateDoc, writeBatch } from 'firebase/firestore'
import { db } from '../db'
import type { Routine, RoutineLog } from '../types'
import { persist, reloadAction, showError } from '../utils/toast'

export type RoutineChanges = Partial<Pick<Routine, 'name' | 'icon' | 'days'>>

const routinesCollection = (uid: string) => collection(db, 'users', uid, 'routines')
const logsCollection = (uid: string) => collection(db, 'users', uid, 'routineLogs')

export const logKey = (routineId: string, date: string) => `${routineId}_${date}`

// Rutinas en users/{uid}/routines y los días que se hicieron en users/{uid}/routineLogs
export function useRoutines(uid: string) {
  const [routines, setRoutines] = useState<Routine[]>([])
  const [logs, setLogs] = useState<Set<string>>(new Set())
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let routinesReady = false
    let logsReady = false
    const markLoaded = () => {
      if (routinesReady && logsReady) setLoaded(true)
    }
    const fail = (message: string) => (error: unknown) => {
      setLoaded(true)
      showError(message, error, reloadAction)
    }

    const stopRoutines = onSnapshot(
      query(routinesCollection(uid), orderBy('createdAt')),
      (snapshot) => {
        setRoutines(snapshot.docs.map((item) => item.data() as Routine))
        routinesReady = true
        markLoaded()
      },
      fail('No se pudieron cargar las rutinas'),
    )
    const stopLogs = onSnapshot(
      logsCollection(uid),
      (snapshot) => {
        setLogs(new Set(snapshot.docs.map((item) => item.id)))
        logsReady = true
        markLoaded()
      },
      fail('No se pudo cargar el seguimiento de rutinas'),
    )
    return () => {
      stopRoutines()
      stopLogs()
    }
  }, [uid])

  const addRoutine = (name: string, icon: string, days: number[]) => {
    const routine: Routine = { id: crypto.randomUUID(), name, icon, days, createdAt: new Date().toISOString() }
    persist('No se pudo crear la rutina', () => setDoc(doc(routinesCollection(uid), routine.id), routine))
  }

  const updateRoutine = (id: string, changes: RoutineChanges) => {
    persist('No se pudo guardar la rutina', () => updateDoc(doc(routinesCollection(uid), id), changes))
  }

  // Borra la rutina y todo su seguimiento; devuelve los días borrados para poder deshacerlo
  const deleteRoutine = (routine: Routine) => {
    const prefix = `${routine.id}_`
    const keys = [...logs].filter((key) => key.startsWith(prefix))
    persist('No se pudo eliminar la rutina', () => {
      const batch = writeBatch(db)
      batch.delete(doc(routinesCollection(uid), routine.id))
      for (const key of keys) batch.delete(doc(logsCollection(uid), key))
      return batch.commit()
    })
    return keys.map((key) => key.slice(prefix.length))
  }

  const restoreRoutine = (routine: Routine, dates: string[]) => {
    persist('No se pudo restaurar la rutina', () => {
      const batch = writeBatch(db)
      batch.set(doc(routinesCollection(uid), routine.id), routine)
      for (const date of dates) {
        const log: RoutineLog = { id: logKey(routine.id, date), routineId: routine.id, date }
        batch.set(doc(logsCollection(uid), log.id), log)
      }
      return batch.commit()
    })
  }

  const setDone = (routineId: string, date: string, done: boolean) => {
    const id = logKey(routineId, date)
    if (done) {
      const log: RoutineLog = { id, routineId, date }
      persist('No se pudo guardar el seguimiento', () => setDoc(doc(logsCollection(uid), id), log))
    } else {
      persist('No se pudo guardar el seguimiento', () => deleteDoc(doc(logsCollection(uid), id)))
    }
  }

  return { routines, logs, loaded, addRoutine, updateRoutine, deleteRoutine, restoreRoutine, setDone }
}
