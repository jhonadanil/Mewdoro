import { useState } from 'react'
import type { ReactNode } from 'react'
import { SignOutIcon, TrashIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import DeleteAccountDialog from '../components/DeleteAccountDialog'
import SignOutDialog from '../components/SignOutDialog'
import NumberField from '../components/NumberField'
import { Page, PageText, PageTitle } from '../components/Page'
import { DEFAULT_SETTINGS } from '../hooks/useUserData'
import type { CalendarView, NoteType, Settings as SettingsType, Theme } from '../types'
import { NOTE_TYPES } from '../utils/notes'

interface SettingsProps {
  settings: SettingsType
  email: string | null
  onChange: (changes: Partial<SettingsType>) => void
  onSignOut: () => void
  hasPassword: boolean
  onDeleteAccount: (password?: string) => Promise<void>
}

function Section({ children }: { children: ReactNode }) {
  return <h3 className="mb-1 mt-8 border-b pb-2 text-sm font-semibold">{children}</h3>
}

interface RowProps {
  label: string
  hint?: string
  children: ReactNode
}

function SettingRow({ label, hint, children }: RowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

// Interruptor con el azul de Notion cuando está activado
function Toggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) {
  return <Switch checked={checked} onCheckedChange={onChange} aria-label={label} className="data-[state=checked]:bg-brand" />
}

export default function Settings({ settings, email, onChange, onSignOut, hasPassword, onDeleteAccount }: SettingsProps) {
  const [confirmSignOut, setConfirmSignOut] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <Page narrow>
      <PageTitle>Ajustes</PageTitle>
      <PageText>Los cambios se guardan en tu cuenta automáticamente.</PageText>

      <Section>Pomodoro</Section>
      <SettingRow label="Trabajo" hint="Minutos de cada pomodoro">
        <NumberField
          key={settings.workMinutes}
          label="Minutos de trabajo"
          value={settings.workMinutes}
          min={1}
          max={120}
          onChange={(value) => onChange({ workMinutes: value })}
        />
      </SettingRow>
      <SettingRow label="Descanso corto" hint="Minutos">
        <NumberField
          key={settings.shortBreakMinutes}
          label="Minutos de descanso corto"
          value={settings.shortBreakMinutes}
          min={1}
          max={60}
          onChange={(value) => onChange({ shortBreakMinutes: value })}
        />
      </SettingRow>
      <SettingRow label="Descanso largo" hint="Minutos">
        <NumberField
          key={settings.longBreakMinutes}
          label="Minutos de descanso largo"
          value={settings.longBreakMinutes}
          min={1}
          max={90}
          onChange={(value) => onChange({ longBreakMinutes: value })}
        />
      </SettingRow>
      <SettingRow label="Descanso largo cada" hint="Número de pomodoros">
        <NumberField
          key={settings.longBreakInterval}
          label="Pomodoros entre descansos largos"
          value={settings.longBreakInterval}
          min={2}
          max={10}
          onChange={(value) => onChange({ longBreakInterval: value })}
        />
      </SettingRow>
      <SettingRow label="Empezar el siguiente bloque solo" hint="Al terminar un bloque, el siguiente arranca sin pulsar Iniciar">
        <Toggle label="Empezar solo" checked={settings.autoStart} onChange={(value) => onChange({ autoStart: value })} />
      </SettingRow>
      <SettingRow label="Sonido al terminar">
        <Toggle label="Sonido" checked={settings.sound} onChange={(value) => onChange({ sound: value })} />
      </SettingRow>
      <SettingRow label="Tiempo en la pestaña" hint="Muestra el tiempo que queda en el título de la pestaña del navegador">
        <Toggle label="Tiempo en la pestaña" checked={settings.timerInTitle} onChange={(value) => onChange({ timerInTitle: value })} />
      </SettingRow>
      <SettingRow label="Avisar al terminar" hint="Notificación del navegador al acabar un bloque (te pedirá permiso)">
        <Toggle
          label="Notificación"
          checked={settings.notify}
          onChange={async (value) => {
            if (value && 'Notification' in window && Notification.permission !== 'granted') {
              const permission = await Notification.requestPermission()
              if (permission !== 'granted') return
            }
            onChange({ notify: value })
          }}
        />
      </SettingRow>
      <SettingRow label="Restablecer" hint="Vuelve a 25 / 5 / 15 minutos">
        <Button
          variant="outline"
          onClick={() =>
            onChange({
              workMinutes: DEFAULT_SETTINGS.workMinutes,
              shortBreakMinutes: DEFAULT_SETTINGS.shortBreakMinutes,
              longBreakMinutes: DEFAULT_SETTINGS.longBreakMinutes,
              longBreakInterval: DEFAULT_SETTINGS.longBreakInterval,
            })
          }
        >
          Restablecer
        </Button>
      </SettingRow>

      <Section>Notas</Section>
      <SettingRow label="Tipo de nota por defecto" hint="El tipo con el que se crean las notas nuevas">
        <Select value={settings.defaultNoteType} onValueChange={(value) => onChange({ defaultNoteType: value as NoteType })}>
          <SelectTrigger className="w-36" aria-label="Tipo de nota por defecto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NOTE_TYPES.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingRow>

      <Section>Calendario</Section>
      <SettingRow label="Vista al abrirlo" hint="Semana o mes">
        <Select value={settings.calendarView} onValueChange={(value) => onChange({ calendarView: value as CalendarView })}>
          <SelectTrigger className="w-36" aria-label="Vista del calendario">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Semana</SelectItem>
            <SelectItem value="month">Mes</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      <Section>Apariencia</Section>
      <SettingRow label="Tema">
        <Select value={settings.theme} onValueChange={(value) => onChange({ theme: value as Theme })}>
          <SelectTrigger className="w-36" aria-label="Tema">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dark">Oscuro</SelectItem>
            <SelectItem value="light">Claro</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      <Section>Cuenta</Section>
      <SettingRow label="Sesión iniciada como" hint={email ?? undefined}>
        <Button variant="outline" onClick={() => setConfirmSignOut(true)}>
          <SignOutIcon />
          Cerrar sesión
        </Button>
      </SettingRow>
      <SettingRow label="Eliminar cuenta" hint="Borra tu cuenta y todos tus datos para siempre">
        <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
          <TrashIcon />
          Eliminar cuenta
        </Button>
      </SettingRow>

      <SignOutDialog open={confirmSignOut} onOpenChange={setConfirmSignOut} onConfirm={onSignOut} />
      <DeleteAccountDialog open={confirmDelete} onOpenChange={setConfirmDelete} needsPassword={hasPassword} onConfirm={onDeleteAccount} />
    </Page>
  )
}
