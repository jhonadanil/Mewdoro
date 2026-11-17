import { useEffect, useState } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../db'
import type { Pinned, Settings } from '../types'
import { getSavedTheme } from '../utils/theme'
import { persist, reloadAction, showError } from '../utils/toast'

export const DEFAULT_SETTINGS: Settings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  autoStart: false,
  sound: true,
  theme: 'dark',
  defaultNoteType: 'text',
}

const DEFAULT_PINNED: Pinned = { pomodoro: false, calendar: false, tasks: false }

// Ajustes y elementos fijados, guardados en el documento users/{uid}
export function useUserData(uid: string) {
  const [settings, setSettings] = useState<Settings>(() => ({ ...DEFAULT_SETTINGS, theme: getSavedTheme() }))
  const [pinned, setPinned] = useState<Pinned>(DEFAULT_PINNED)
  // Hasta la primera respuesta, los fijados por defecto (todo false) no son los reales
  const [loaded, setLoaded] = useState(false)

  useEffect(
    () =>
      onSnapshot(
        doc(db, 'users', uid),
        (snapshot) => {
          const data = snapshot.data()
          setSettings({ ...DEFAULT_SETTINGS, theme: getSavedTheme(), ...data?.settings })
          setPinned({ ...DEFAULT_PINNED, ...data?.pinned })
          setLoaded(true)
        },
        (error) => {
          setLoaded(true)
          showError('No se pudieron cargar los ajustes', error, reloadAction)
        },
      ),
    [uid],
  )

  // merge: solo se sobrescriben los campos que cambian
  const save = (data: { settings?: Partial<Settings>; pinned?: Partial<Pinned> }) => {
    persist('No se pudieron guardar los ajustes', () => setDoc(doc(db, 'users', uid), data, { merge: true }))
  }

  return {
    settings,
    pinned,
    loaded,
    updateSettings: (changes: Partial<Settings>) => save({ settings: changes }),
    updatePinned: (changes: Partial<Pinned>) => save({ pinned: changes }),
  }
}
