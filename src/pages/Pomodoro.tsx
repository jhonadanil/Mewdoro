import { Pin, PinOff } from 'lucide-react'
import PomodoroTimer from '../components/PomodoroTimer'
import type { Pomodoro as PomodoroState } from '../hooks/usePomodoro'
import type { Settings } from '../types'

interface PomodoroProps {
  pomodoro: PomodoroState
  settings: Settings
  isPinned: boolean
  onTogglePin: () => void
}

export default function Pomodoro({ pomodoro, settings, isPinned, onTogglePin }: PomodoroProps) {
  return (
    <section className="page">
      <div className="page__header">
        <h2 className="page__title">Pomodoro</h2>
        <button type="button" className="btn" onClick={onTogglePin}>
          {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
          {isPinned ? 'Quitar de inicio' : 'Fijar en inicio'}
        </button>
      </div>
      <p className="page__text">
        Concéntrate {settings.workMinutes} minutos y descansa {settings.shortBreakMinutes}. Cada{' '}
        {settings.longBreakInterval} pomodoros toca un descanso largo de {settings.longBreakMinutes} minutos.
        Puedes cambiarlo en Ajustes.
      </p>
      <PomodoroTimer pomodoro={pomodoro} />
    </section>
  )
}
