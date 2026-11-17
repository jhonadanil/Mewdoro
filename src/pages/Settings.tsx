import { useState } from 'react'
import type { ReactNode } from 'react'
import { LogOut } from 'lucide-react'
import { DEFAULT_SETTINGS } from '../hooks/useUserData'
import type { NoteType, Settings as SettingsType, Theme } from '../types'
import { NOTE_TYPES } from '../utils/notes'

interface SettingsProps {
  settings: SettingsType
  email: string | null
  onChange: (changes: Partial<SettingsType>) => void
  onSignOut: () => void
}

interface RowProps {
  label: string
  hint?: string
  children: ReactNode
}

function SettingRow({ label, hint, children }: RowProps) {
  return (
    <div className="settings__row">
      <div>
        <p className="settings__label">{label}</p>
        {hint && <p className="settings__hint">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

interface NumberFieldProps {
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}

// Se guarda al salir del campo, para poder borrar y escribir otro número
function NumberField({ value, min, max, onChange }: NumberFieldProps) {
  const [draft, setDraft] = useState(String(value))

  const commit = () => {
    const number = Number(draft)
    if (Number.isInteger(number) && number >= min && number <= max) {
      if (number !== value) onChange(number)
    } else {
      setDraft(String(value))
    }
  }

  return (
    <input
      className="input settings__number"
      type="number"
      min={min}
      max={max}
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => event.key === 'Enter' && event.currentTarget.blur()}
    />
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`toggle ${checked ? 'toggle--on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle__thumb" />
    </button>
  )
}

export default function Settings({ settings, email, onChange, onSignOut }: SettingsProps) {
  return (
    <section className="page page--compact">
      <h2 className="page__title">Ajustes</h2>
      <p className="page__text">Los cambios se guardan en tu cuenta automáticamente.</p>

      <h3 className="settings__section">Pomodoro</h3>
      <SettingRow label="Trabajo" hint="Minutos de cada pomodoro">
        <NumberField
          key={settings.workMinutes}
          value={settings.workMinutes}
          min={1}
          max={120}
          onChange={(value) => onChange({ workMinutes: value })}
        />
      </SettingRow>
      <SettingRow label="Descanso corto" hint="Minutos">
        <NumberField
          key={settings.shortBreakMinutes}
          value={settings.shortBreakMinutes}
          min={1}
          max={60}
          onChange={(value) => onChange({ shortBreakMinutes: value })}
        />
      </SettingRow>
      <SettingRow label="Descanso largo" hint="Minutos">
        <NumberField
          key={settings.longBreakMinutes}
          value={settings.longBreakMinutes}
          min={1}
          max={90}
          onChange={(value) => onChange({ longBreakMinutes: value })}
        />
      </SettingRow>
      <SettingRow label="Descanso largo cada" hint="Número de pomodoros">
        <NumberField
          key={settings.longBreakInterval}
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
      <SettingRow label="Restablecer" hint="Vuelve a 25 / 5 / 15 minutos">
        <button
          type="button"
          className="btn"
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
        </button>
      </SettingRow>

      <h3 className="settings__section">Notas</h3>
      <SettingRow label="Tipo de nota por defecto" hint="El tipo con el que se crean las notas nuevas">
        <select
          className="editor__select"
          value={settings.defaultNoteType}
          onChange={(event) => onChange({ defaultNoteType: event.target.value as NoteType })}
        >
          {NOTE_TYPES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </SettingRow>

      <h3 className="settings__section">Apariencia</h3>
      <SettingRow label="Tema">
        <select
          className="editor__select"
          value={settings.theme}
          onChange={(event) => onChange({ theme: event.target.value as Theme })}
        >
          <option value="dark">Oscuro</option>
          <option value="light">Claro</option>
        </select>
      </SettingRow>

      <h3 className="settings__section">Cuenta</h3>
      <SettingRow label="Sesión iniciada como" hint={email ?? undefined}>
        <button type="button" className="btn" onClick={onSignOut}>
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </SettingRow>
    </section>
  )
}
