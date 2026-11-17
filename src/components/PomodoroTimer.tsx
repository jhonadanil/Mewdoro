import { Pause, Play, RotateCcw } from 'lucide-react'
import { MODE_LABELS, formatTime } from '../hooks/usePomodoro'
import type { Pomodoro } from '../hooks/usePomodoro'
import type { PomodoroMode } from '../types'

const MODES: PomodoroMode[] = ['work', 'shortBreak', 'longBreak']

interface PomodoroTimerProps {
  pomodoro: Pomodoro
}

export default function PomodoroTimer({ pomodoro }: PomodoroTimerProps) {
  const { mode, secondsLeft, duration, isRunning, completedWork, toggle, reset, changeMode } = pomodoro
  const progress = 1 - secondsLeft / duration

  return (
    <div className="pomodoro">
      <div className="pomodoro__modes">
        {MODES.map((item) => (
          <button
            key={item}
            type="button"
            className={`pomodoro__mode ${mode === item ? 'pomodoro__mode--active' : ''}`}
            onClick={() => changeMode(item)}
          >
            {MODE_LABELS[item]}
          </button>
        ))}
      </div>

      <p className="pomodoro__time">{formatTime(secondsLeft)}</p>

      <div className="pomodoro__progress">
        <div className="pomodoro__progress-bar" style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="pomodoro__actions">
        <button type="button" className="btn btn--primary" onClick={toggle}>
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
          {isRunning ? 'Pausar' : 'Iniciar'}
        </button>
        <button type="button" className="btn" onClick={reset}>
          <RotateCcw size={16} />
          Reiniciar
        </button>
      </div>

      <p className="pomodoro__count">Pomodoros completados: {completedWork}</p>
    </div>
  )
}
