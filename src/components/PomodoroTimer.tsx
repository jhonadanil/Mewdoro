import { useEffect, useState } from 'react'

const WORK_MINUTES = 25
const BREAK_MINUTES = 5

type Mode = 'work' | 'break'

export default function PomodoroTimer() {
  const [mode, setMode] = useState<Mode>('work')
  const [secondsLeft, setSecondsLeft] = useState(WORK_MINUTES * 60)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return

    const id = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current > 0) return current - 1

        const nextMode: Mode = mode === 'work' ? 'break' : 'work'
        setMode(nextMode)
        return (nextMode === 'work' ? WORK_MINUTES : BREAK_MINUTES) * 60
      })
    }, 1000)

    return () => window.clearInterval(id)
  }, [isRunning, mode])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  const reset = () => {
    setIsRunning(false)
    setMode('work')
    setSecondsLeft(WORK_MINUTES * 60)
  }

  return (
    <div className="pomodoro">
      <p className="pomodoro__mode">{mode === 'work' ? 'Trabajo' : 'Descanso'}</p>
      <p className="pomodoro__time">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </p>
      <div className="pomodoro__actions">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setIsRunning((v) => !v)}
        >
          {isRunning ? 'Pausar' : 'Iniciar'}
        </button>
        <button type="button" className="btn" onClick={reset}>
          Reiniciar
        </button>
      </div>
    </div>
  )
}
