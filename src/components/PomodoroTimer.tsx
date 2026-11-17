import { Pause, Play, RotateCcw } from 'lucide-react'
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
}

export default function PomodoroTimer({ pomodoro }: PomodoroTimerProps) {
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

      <p className="text-7xl font-bold tabular-nums">{formatTime(secondsLeft)}</p>

      <Progress value={progress * 100} className="h-1.5 bg-background" />

      <div className="flex gap-2.5">
        <Button size="lg" onClick={toggle}>
          {isRunning ? <Pause /> : <Play />}
          {isRunning ? 'Pausar' : 'Iniciar'}
        </Button>
        <Button size="lg" variant="outline" onClick={reset}>
          <RotateCcw />
          Reiniciar
        </Button>
      </div>

      <p className="text-[13px] text-muted-foreground">Pomodoros completados: {completedWork}</p>
    </Card>
  )
}
