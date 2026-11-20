import { PushPinIcon, PushPinSlashIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Page, PageHeader, PageText, PageTitle } from '../components/Page'
import PomodoroTimer from '../components/PomodoroTimer'
import { usePomodoroContext } from '../hooks/PomodoroContext'
import type { PomodoroMode, Settings } from '../types'

interface PomodoroProps {
  settings: Settings
  onChangeSettings: (changes: Partial<Settings>) => void
  isPinned: boolean
  onTogglePin: () => void
}

const MINUTES_KEY = { work: 'workMinutes', shortBreak: 'shortBreakMinutes', longBreak: 'longBreakMinutes' } as const
const MAX_MINUTES: Record<PomodoroMode, number> = { work: 120, shortBreak: 60, longBreak: 90 }

export default function Pomodoro({ settings, onChangeSettings, isPinned, onTogglePin }: PomodoroProps) {
  const pomodoro = usePomodoroContext()

  const changeMinutes = (minutes: number) => {
    pomodoro.setDuration(minutes)
    onChangeSettings({ [MINUTES_KEY[pomodoro.mode]]: minutes })
  }

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
        Cada {settings.longBreakInterval} pomodoros toca un descanso largo. Pulsa el tiempo para cambiar los minutos del
        bloque; más opciones en Ajustes.
      </PageText>
      <PomodoroTimer pomodoro={pomodoro} maxMinutes={MAX_MINUTES[pomodoro.mode]} onChangeMinutes={changeMinutes} />
    </Page>
  )
}
