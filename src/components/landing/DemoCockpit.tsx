import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowCounterClockwiseIcon, FlameIcon, PauseIcon, PlayIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import AddTask from '../AddTask'
import { RoutineDayList } from '../RoutineDayList'
import { TaskCheckbox } from '../TaskItem'
import type { Routine } from '../../types'
import { currentStreak, dayProgress } from '../../utils/routines'
import { todayKey } from '../../utils/tasks'
import { DEMO_TASKS } from './demoData'

// Mismas tarjetas que las fijadas en Inicio, sin el botón de desfijar
function DemoCard({ label, className, children }: { label: ReactNode; className?: string; children: ReactNode }) {
  return (
    <Card size="sm" className={cn('gap-2.5 px-3 transition-shadow hover:border-foreground/30', className)}>
      <h2 className="flex min-w-0">
        <Badge variant="secondary" className="max-w-full truncate">
          {label}
        </Badge>
      </h2>
      {children}
    </Card>
  )
}

function DemoTasks({ className }: { className?: string }) {
  const [tasks, setTasks] = useState(DEMO_TASKS)
  const done = tasks.filter((task) => task.done).length

  return (
    <DemoCard label={`Tareas flash · Hoy ${done}/${tasks.length}`} className={className}>
      <div className="flex max-h-52 flex-col gap-1.5">
        {tasks.map((task) => (
          <div key={task.id} className="flex min-w-0 items-center gap-2 text-[13px]">
            <TaskCheckbox
              checked={task.done}
              text={task.text}
              onChange={() => setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, done: !item.done } : item)))}
            />
            <span className={cn('min-w-0 flex-1 truncate', task.done && 'text-muted-foreground line-through')}>{task.text}</span>
          </div>
        ))}
      </div>
      <AddTask
        compact
        placeholder="Añadir tarea"
        onAdd={(text) => setTasks((current) => [...current, { id: crypto.randomUUID(), text, done: false }])}
      />
    </DemoCard>
  )
}

const WORK_SECONDS = 25 * 60

function DemoPomodoro() {
  const [seconds, setSeconds] = useState(WORK_SECONDS)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          setRunning(false)
          return 0
        }
        return current - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [running])

  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0')
  const rest = String(seconds % 60).padStart(2, '0')

  return (
    <DemoCard label="Pomodoro · Trabajo" className={cn('transition-colors duration-300', running && 'border-brand/60 hover:border-brand')}>
      <p role="timer" aria-label={`Quedan ${minutes} minutos y ${rest} segundos`} className="text-[28px] font-bold tabular-nums">
        {minutes}:{rest}
      </p>
      <div className="flex gap-1.5">
        <Button size="sm" onClick={() => setRunning((value) => !value)} disabled={seconds === 0}>
          {running ? <PauseIcon /> : <PlayIcon />}
          {running ? 'Pausar' : 'Iniciar'}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-muted-foreground"
          onClick={() => {
            setRunning(false)
            setSeconds(WORK_SECONDS)
          }}
          disabled={!running && seconds === WORK_SECONDS}
        >
          <ArrowCounterClockwiseIcon />
          Reiniciar
        </Button>
      </div>
    </DemoCard>
  )
}

interface DemoRoutinesProps {
  routines: Routine[]
  logs: Set<string>
  onToggle: (routineId: string, day: string) => void
}

function DemoRoutines({ routines, logs, onToggle }: DemoRoutinesProps) {
  const today = todayKey()
  const { due, done } = dayProgress(routines, logs, today)
  const streak = Math.max(...routines.map((routine) => currentStreak(routine, logs, today)))

  return (
    <DemoCard label={`Rutinas · Hoy ${done}/${due}`}>
      <RoutineDayList variant="plain" routines={routines} logs={logs} day={today} today={today} onToggle={(routine, day) => onToggle(routine.id, day)} />
      <p className="flex items-center gap-1.5 text-[13px] tabular-nums text-muted-foreground">
        <FlameIcon aria-hidden="true" weight={streak > 0 ? 'fill' : 'regular'} className={cn('size-4', streak > 0 && 'text-brand')} />
        {streak > 0 ? `Racha de ${streak} ${streak === 1 ? 'día' : 'días'}` : 'Sin racha todavía'}
      </p>
    </DemoCard>
  )
}

// Inicio funcionando con datos de ejemplo: la misma rejilla y las mismas tarjetas que la app
export default function DemoCockpit({ routines, logs, onToggle }: DemoRoutinesProps) {
  return (
    <div className="@container">
      <div className="grid grid-cols-1 items-start gap-3 @md:grid-cols-2 @3xl:grid-cols-3">
        <DemoTasks className="landing-rise @md:col-span-2 @3xl:row-span-2" />
        <div className="landing-rise" style={{ '--i': 1 } as React.CSSProperties}>
          <DemoPomodoro />
        </div>
        <div className="landing-rise" style={{ '--i': 2 } as React.CSSProperties}>
          <DemoRoutines routines={routines} logs={logs} onToggle={onToggle} />
        </div>
      </div>
    </div>
  )
}
