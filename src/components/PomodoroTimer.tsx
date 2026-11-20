import { useState } from 'react'
import { ArrowCounterClockwiseIcon, PauseIcon, PlayIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MODE_LABELS, formatTime } from '../hooks/usePomodoro'
import type { Pomodoro } from '../hooks/usePomodoro'
import type { PomodoroMode } from '../types'

const MODES: PomodoroMode[] = ['work', 'shortBreak', 'longBreak']

interface PomodoroTimerProps {
  pomodoro: Pomodoro
  maxMinutes: number
  onChangeMinutes: (minutes: number) => void
}

// El tiempo es un botón: al pulsarlo se escribe una duración nueva en minutos (Enter guarda, Esc cancela)
function EditableTime({ pomodoro, maxMinutes, onChangeMinutes }: PomodoroTimerProps) {
  const [draft, setDraft] = useState<string | null>(null)

  const commit = () => {
    const minutes = Number(draft)
    if (draft !== null && Number.isInteger(minutes) && minutes >= 1 && minutes <= maxMinutes && minutes * 60 !== pomodoro.duration) {
      onChangeMinutes(minutes)
    }
    setDraft(null)
  }

  if (draft === null) {
    return (
      <button
        type="button"
        title="Cambiar los minutos"
        aria-label={`${formatTime(pomodoro.secondsLeft)}, pulsa para cambiar los minutos`}
        onClick={() => setDraft(String(Math.round(pomodoro.duration / 60)))}
        className="rounded-xl px-2 text-7xl font-bold tabular-nums hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {formatTime(pomodoro.secondsLeft)}
      </button>
    )
  }

  const current = Number(draft)
  const valid = Number.isInteger(current) && current >= 1 && current <= maxMinutes
  const step = (delta: number) => setDraft(String(Math.min(maxMinutes, Math.max(1, (valid ? current : 1) + delta))))
  const presets = [5, 10, 15, 25, 30, 45, 60].filter((minutes) => minutes <= maxMinutes)
  const stepButton = 'flex size-9 items-center justify-center rounded-full border text-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2'

  return (
    <div
      className="flex w-full flex-col items-center gap-3 rounded-2xl bg-muted/60 px-4 py-4"
      // Al salir del editor (clic fuera o Tab) se guarda
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) commit()
      }}
    >
      <div className="flex items-center gap-3">
        <button type="button" aria-label="Un minuto menos" className={stepButton} onClick={() => step(-1)}>
          −
        </button>
        <div className="flex items-baseline gap-1.5">
          <input
            autoFocus
            type="number"
            min={1}
            max={maxMinutes}
            aria-label="Minutos del bloque"
            aria-invalid={!valid}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onFocus={(event) => event.currentTarget.select()}
            onKeyDown={(event) => {
              if (event.key === 'Enter') commit()
              else if (event.key === 'Escape') setDraft(null)
            }}
            className="w-24 appearance-none bg-transparent text-center text-6xl font-bold tabular-nums outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span className="text-base text-muted-foreground">min</span>
        </div>
        <button type="button" aria-label="Un minuto más" className={stepButton} onClick={() => step(1)}>
          +
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5" role="group" aria-label="Duraciones habituales">
        {presets.map((minutes) => (
          <button
            key={minutes}
            type="button"
            onClick={() => setDraft(String(minutes))}
            className={`rounded-full border px-3 py-1 text-xs tabular-nums transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 ${
              current === minutes ? 'border-foreground/40 bg-background font-medium' : 'text-muted-foreground'
            }`}
          >
            {minutes}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" disabled={!valid} onClick={commit}>
          Guardar
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setDraft(null)}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}

export default function PomodoroTimer({ pomodoro, maxMinutes, onChangeMinutes }: PomodoroTimerProps) {
  const { mode, secondsLeft, duration, isRunning, completedWork, toggle, reset, changeMode } = pomodoro
  const progress = 1 - secondsLeft / duration

  return (
    <Card className="mx-auto mt-6 max-w-[420px] items-center gap-5 px-8 py-8">
      <Tabs value={mode} onValueChange={(value) => changeMode(value as PomodoroMode)}>
        <TabsList>
          {MODES.map((item) => (
            <TabsTrigger key={item} value={item} className="px-3">
              {MODE_LABELS[item]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <EditableTime pomodoro={pomodoro} maxMinutes={maxMinutes} onChangeMinutes={onChangeMinutes} />

      <Progress value={progress * 100} className="h-1.5 bg-background" />

      <div className="flex gap-2.5">
        <Button size="lg" onClick={toggle}>
          {isRunning ? <PauseIcon /> : <PlayIcon />}
          {isRunning ? 'Pausar' : 'Iniciar'}
        </Button>
        <Button size="lg" variant="outline" onClick={reset}>
          <ArrowCounterClockwiseIcon />
          Reiniciar
        </Button>
      </div>

      <p className="text-[13px] text-muted-foreground">Pomodoros completados: {completedWork}</p>
    </Card>
  )
}
