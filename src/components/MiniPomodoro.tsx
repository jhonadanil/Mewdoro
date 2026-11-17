import { Pause, Play, PinOff } from 'lucide-react'
import { MODE_LABELS, formatTime } from '../hooks/usePomodoro'
import type { Pomodoro } from '../hooks/usePomodoro'

interface MiniPomodoroProps {
  pomodoro: Pomodoro
  onOpen: () => void
  onUnpin: () => void
}

// Versión pequeña del temporizador para fijarla en Inicio
export default function MiniPomodoro({ pomodoro, onOpen, onUnpin }: MiniPomodoroProps) {
  const { mode, secondsLeft, duration, isRunning, toggle } = pomodoro
  const progress = 1 - secondsLeft / duration

  return (
    <article className="mini-card">
      <div className="mini-card__header">
        <span className="note-tag">Pomodoro · {MODE_LABELS[mode]}</span>
        <button
          type="button"
          className="icon-btn"
          onClick={onUnpin}
          aria-label="Quitar de inicio"
          title="Quitar de inicio"
        >
          <PinOff size={15} />
        </button>
      </div>

      <div className="mini-pomodoro">
        <button type="button" className="mini-pomodoro__time" onClick={onOpen}>
          {formatTime(secondsLeft)}
        </button>
        <button
          type="button"
          className="icon-btn icon-btn--filled"
          onClick={toggle}
          aria-label={isRunning ? 'Pausar' : 'Iniciar'}
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
        </button>
      </div>

      <div className="pomodoro__progress pomodoro__progress--small">
        <div className="pomodoro__progress-bar" style={{ width: `${progress * 100}%` }} />
      </div>
    </article>
  )
}
