import { useEffect, useRef } from 'react'
import { PauseIcon, PlayIcon } from '@phosphor-icons/react'
import { IconButton } from '@/components/IconButton'
import { MiniCard } from '@/components/MiniCard'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { MODE_LABELS, formatTime } from '../hooks/usePomodoro'
import { usePomodoroContext } from '../hooks/PomodoroContext'

interface MiniPomodoroProps {
  onOpen: () => void
  onUnpin: () => void
}

// Versión pequeña del temporizador para fijarla en Inicio
export default function MiniPomodoro({ onOpen, onUnpin }: MiniPomodoroProps) {
  const { mode, secondsLeft, duration, isRunning, toggle } = usePomodoroContext()
  const progress = 1 - secondsLeft / duration
  const minutesLeft = Math.ceil(secondsLeft / 60)
  const remainingLabel = `${minutesLeft === 1 ? 'queda' : 'quedan'} ${minutesLeft} min${isRunning ? '' : ', en pausa'}`
  const toggleRef = useRef(toggle)

  useEffect(() => {
    toggleRef.current = toggle
  })

  // Alt + P inicia o pausa el bloque sin soltar el teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && !event.ctrlKey && !event.metaKey && event.code === 'KeyP') {
        event.preventDefault()
        toggleRef.current()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <MiniCard
      label={`Pomodoro · ${MODE_LABELS[mode]}`}
      onOpen={onOpen}
      openLabel="Abrir Pomodoro"
      onUnpin={onUnpin}
      // En marcha, la tarjeta se enciende con un borde lavanda (Lit-When-Done)
      className={cn('transition-shadow duration-300', isRunning && 'ring-brand/50 hover:ring-brand/70')}
    >
      <div className="flex items-center justify-between">
        {/* El chip ya abre la página con el teclado; la hora es un atajo extra para el ratón.
            El lector oye el tiempo en minutos (cambia una vez por minuto, no cada segundo) */}
        <button
          type="button"
          onClick={onOpen}
          tabIndex={-1}
          aria-label={`Abrir Pomodoro, ${remainingLabel}`}
          className="rounded-md text-[28px] font-bold tabular-nums"
        >
          {formatTime(secondsLeft)}
        </button>
        <IconButton
          label={isRunning ? 'Pausar' : 'Iniciar'}
          shortcut={
            <KbdGroup>
              <Kbd>Alt</Kbd>
              <Kbd>P</Kbd>
            </KbdGroup>
          }
          aria-keyshortcuts="Alt+P"
          variant="default"
          size="icon"
          className="text-primary-foreground hover:text-primary-foreground"
          onClick={toggle}
        >
          {isRunning ? <PauseIcon /> : <PlayIcon />}
        </IconButton>
      </div>
      <Progress value={progress * 100} aria-label={`Progreso del bloque de ${MODE_LABELS[mode].toLowerCase()}`} />
    </MiniCard>
  )
}
