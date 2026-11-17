import { useEffect, useReducer, useRef } from 'react'
import type { PomodoroMode, Settings } from '../types'

export type PomodoroSettings = Pick<
  Settings,
  'workMinutes' | 'shortBreakMinutes' | 'longBreakMinutes' | 'longBreakInterval' | 'autoStart' | 'sound'
>

export const MODE_LABELS: Record<PomodoroMode, string> = {
  work: 'Trabajo',
  shortBreak: 'Descanso',
  longBreak: 'Descanso largo',
}

export function getDuration(mode: PomodoroMode, settings: PomodoroSettings) {
  const minutes = {
    work: settings.workMinutes,
    shortBreak: settings.shortBreakMinutes,
    longBreak: settings.longBreakMinutes,
  }[mode]
  return minutes * 60
}

export function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

// Dos pitidos cortos al terminar un bloque
function playBeep() {
  try {
    const context = new AudioContext()
    for (const start of [0, 0.35]) {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.frequency.value = 880
      gain.gain.setValueAtTime(0.2, context.currentTime + start)
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + start + 0.3)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start(context.currentTime + start)
      oscillator.stop(context.currentTime + start + 0.3)
    }
    window.setTimeout(() => context.close(), 1000)
  } catch {
    // Sin audio disponible, simplemente no suena
  }
}

interface PomodoroState {
  mode: PomodoroMode
  secondsLeft: number
  // Duración total del bloque actual, para la barra de progreso
  duration: number
  isRunning: boolean
  completedWork: number
  finishedBlocks: number
}

type PomodoroAction =
  | { type: 'tick'; settings: PomodoroSettings }
  | { type: 'toggle' }
  | { type: 'reset'; settings: PomodoroSettings }
  | { type: 'changeMode'; mode: PomodoroMode; settings: PomodoroSettings }
  | { type: 'syncSettings'; settings: PomodoroSettings }

function createInitialState(settings: PomodoroSettings): PomodoroState {
  const duration = getDuration('work', settings)
  return { mode: 'work', secondsLeft: duration, duration, isRunning: false, completedWork: 0, finishedBlocks: 0 }
}

function reducer(state: PomodoroState, action: PomodoroAction): PomodoroState {
  switch (action.type) {
    case 'tick': {
      if (state.secondsLeft > 0) return { ...state, secondsLeft: state.secondsLeft - 1 }

      // Al terminar, pasa al siguiente bloque; cada N pomodoros el descanso es largo
      const completedWork = state.mode === 'work' ? state.completedWork + 1 : state.completedWork
      const nextMode: PomodoroMode =
        state.mode !== 'work'
          ? 'work'
          : completedWork % action.settings.longBreakInterval === 0
            ? 'longBreak'
            : 'shortBreak'
      const duration = getDuration(nextMode, action.settings)

      return {
        mode: nextMode,
        secondsLeft: duration,
        duration,
        isRunning: action.settings.autoStart,
        completedWork,
        finishedBlocks: state.finishedBlocks + 1,
      }
    }
    case 'toggle':
      return { ...state, isRunning: !state.isRunning }
    case 'reset': {
      const duration = getDuration(state.mode, action.settings)
      return { ...state, isRunning: false, secondsLeft: duration, duration }
    }
    case 'changeMode': {
      const duration = getDuration(action.mode, action.settings)
      return { ...state, mode: action.mode, secondsLeft: duration, duration, isRunning: false }
    }
    case 'syncSettings': {
      // Si el bloque no ha empezado, toma la nueva duración; si ya empezó, solo se recorta
      const duration = getDuration(state.mode, action.settings)
      if (duration === state.duration) return state
      const notStarted = state.secondsLeft === state.duration
      return {
        ...state,
        duration,
        secondsLeft: notStarted ? duration : Math.min(state.secondsLeft, duration),
      }
    }
  }
}

// Vive en Workspace para que el temporizador siga corriendo al cambiar de página
export function usePomodoro(settings: PomodoroSettings) {
  const [state, dispatch] = useReducer(reducer, settings, createInitialState)
  const settingsRef = useRef(settings)
  const lastFinished = useRef(0)

  useEffect(() => {
    settingsRef.current = settings
  })

  useEffect(() => {
    if (!state.isRunning) return

    const id = window.setInterval(() => dispatch({ type: 'tick', settings: settingsRef.current }), 1000)
    return () => window.clearInterval(id)
  }, [state.isRunning])

  // Al cambiar las duraciones en Ajustes
  useEffect(() => {
    dispatch({ type: 'syncSettings', settings: settingsRef.current })
  }, [settings.workMinutes, settings.shortBreakMinutes, settings.longBreakMinutes])

  useEffect(() => {
    if (state.finishedBlocks === lastFinished.current) return
    lastFinished.current = state.finishedBlocks
    if (settings.sound) playBeep()
  }, [state.finishedBlocks, settings.sound])

  return {
    ...state,
    toggle: () => dispatch({ type: 'toggle' }),
    reset: () => dispatch({ type: 'reset', settings }),
    changeMode: (mode: PomodoroMode) => dispatch({ type: 'changeMode', mode, settings }),
  }
}

export type Pomodoro = ReturnType<typeof usePomodoro>
