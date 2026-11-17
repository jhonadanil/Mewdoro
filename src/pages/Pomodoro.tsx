import { PushPinIcon, PushPinSlashIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Page, PageHeader, PageText, PageTitle } from '../components/Page'
import PomodoroTimer from '../components/PomodoroTimer'
import { usePomodoroContext } from '../hooks/PomodoroContext'
import type { Settings } from '../types'

interface PomodoroProps {
  settings: Settings
  isPinned: boolean
  onTogglePin: () => void
}

export default function Pomodoro({ settings, isPinned, onTogglePin }: PomodoroProps) {
  const pomodoro = usePomodoroContext()
  return (
    <Page>
      <PageHeader
        actions={
          <Button variant="outline" onClick={onTogglePin}>
            {isPinned ? <PushPinSlashIcon /> : <PushPinIcon />}
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
