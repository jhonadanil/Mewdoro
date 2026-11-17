import { Pause, Play } from 'lucide-react'
import { IconButton } from '@/components/IconButton'
import { MiniCard } from '@/components/MiniCard'
import { Progress } from '@/components/ui/progress'
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
    <MiniCard label={`Pomodoro · ${MODE_LABELS[mode]}`} onOpen={onOpen} onUnpin={onUnpin}>
      <div className="flex items-center justify-between">
        <button type="button" onClick={onOpen} className="text-[28px] font-bold tabular-nums">
          {formatTime(secondsLeft)}
        </button>
        <IconButton
          label={isRunning ? 'Pausar' : 'Iniciar'}
          variant="default"
          size="icon"
          className="text-primary-foreground hover:text-primary-foreground"
          onClick={toggle}
        >
          {isRunning ? <Pause /> : <Play />}
        </IconButton>
      </div>
      <Progress value={progress * 100} />
    </MiniCard>
  )
}
