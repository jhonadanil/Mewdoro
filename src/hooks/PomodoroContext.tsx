import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { usePomodoro } from './usePomodoro'
import type { Pomodoro, PomodoroSettings } from './usePomodoro'

const PomodoroContext = createContext<Pomodoro | null>(null)

// El temporizador vive aquí y no en Workspace: con el Pomodoro en marcha, cada segundo solo se
// vuelven a dibujar los componentes que lo leen (mini-tarjeta, línea de estado, página Pomodoro),
// no la barra lateral ni el resto de la app.
export function PomodoroProvider({ settings, children }: { settings: PomodoroSettings; children: ReactNode }) {
  const pomodoro = usePomodoro(settings)
  return <PomodoroContext.Provider value={pomodoro}>{children}</PomodoroContext.Provider>
}

export function usePomodoroContext() {
  const pomodoro = useContext(PomodoroContext)
  if (!pomodoro) throw new Error('usePomodoroContext necesita un PomodoroProvider por encima')
  return pomodoro
}
