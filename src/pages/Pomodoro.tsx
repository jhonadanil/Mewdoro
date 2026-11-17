import { Pin, PinOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Page, PageHeader, PageText, PageTitle } from '../components/Page'
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
    <Page>
      <PageHeader
        actions={
          <Button variant="outline" onClick={onTogglePin}>
            {isPinned ? <PinOff /> : <Pin />}
            {isPinned ? 'Quitar de inicio' : 'Fijar en inicio'}
          </Button>
        }
      >
        <PageTitle>Pomodoro</PageTitle>
      </PageHeader>
      <PageText>
        Concéntrate {settings.workMinutes} minutos y descansa {settings.shortBreakMinutes}. Cada{' '}
        {settings.longBreakInterval} pomodoros toca un descanso largo de {settings.longBreakMinutes} minutos.
        Puedes cambiarlo en Ajustes.
      </PageText>
      <PomodoroTimer pomodoro={pomodoro} />
    </Page>
  )
}
