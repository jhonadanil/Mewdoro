import { useEffect, useState } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import type { Pinned, Settings } from '../types'
import { getSavedTheme } from '../utils/theme'

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

  useEffect(
    () =>
      onSnapshot(
        doc(db, 'users', uid),
        (snapshot) => {
          const data = snapshot.data()
          setSettings({ ...DEFAULT_SETTINGS, theme: getSavedTheme(), ...data?.settings })
          setPinned({ ...DEFAULT_PINNED, ...data?.pinned })
        },
        (error) => console.error('No se pudieron cargar los ajustes', error),
      ),
    [uid],
  )

  // merge: solo se sobrescriben los campos que cambian
  const save = (data: { settings?: Partial<Settings>; pinned?: Partial<Pinned> }) => {
    setDoc(doc(db, 'users', uid), data, { merge: true }).catch((error) =>
      console.error('No se pudieron guardar los ajustes', error),
    )
  }

  return {
    settings,
    pinned,
    updateSettings: (changes: Partial<Settings>) => save({ settings: changes }),
    updatePinned: (changes: Partial<Pinned>) => save({ pinned: changes }),
  }
}
