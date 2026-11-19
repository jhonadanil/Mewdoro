import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { WEEK_DAYS_LONG, WEEK_DAYS_SHORT } from '../utils/calendar'
import EmojiPicker from './EmojiPicker'

interface RoutineFormProps {
  initial?: { name: string; icon: string; days: number[] }
  submitLabel: string
  onSubmit: (name: string, icon: string, days: number[]) => void
  onCancel: () => void
}

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6]

// Alta y edición de una rutina: icono, nombre y los días de la semana en que toca
export default function RoutineForm({ initial, submitLabel, onSubmit, onCancel }: RoutineFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [icon, setIcon] = useState(initial?.icon ?? '🔁')
  const [days, setDays] = useState<number[]>(initial?.days ?? ALL_DAYS)

  const toggleDay = (day: number) =>
    setDays((current) => (current.includes(day) ? current.filter((item) => item !== day) : [...current, day].sort((a, b) => a - b)))

  const canSubmit = name.trim().length > 0 && days.length > 0

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (canSubmit) onSubmit(name.trim(), icon, days)
  }

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onCancel()
      }}
      className="flex flex-col gap-4 rounded-2xl border p-4">
      <div className="flex items-center gap-2">
        <EmojiPicker value={icon} onChange={setIcon} />
        <Input
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nombre de la rutina (leer 20 min, entrenar, inglés…)"
          aria-label="Nombre de la rutina"
          maxLength={80}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span id="routine-days-label" className="text-[13px] text-muted-foreground">
          Se repite
        </span>
        <div role="group" aria-labelledby="routine-days-label" className="flex gap-1.5">
          {ALL_DAYS.map((day) => {
            const selected = days.includes(day)
            return (
              <button
                key={day}
                type="button"
                aria-pressed={selected}
                aria-label={WEEK_DAYS_LONG[day]}
                onClick={() => toggleDay(day)}
                className={cn(
                  'size-8 rounded-full border text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
                  selected ? 'border-brand bg-brand text-primary-foreground' : 'text-muted-foreground hover:bg-muted',
                )}
              >
                {WEEK_DAYS_SHORT[day]}
              </button>
            )
          })}
        </div>
        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setDays(ALL_DAYS)}>
            Todos
          </Button>
          <Button type="button" variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setDays([0, 1, 2, 3, 4])}>
            Entre semana
          </Button>
          <Button type="button" variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setDays([5, 6])}>
            Fines de semana
          </Button>
        </div>
      </div>

      {initial && (
        <p className="text-[13px] text-muted-foreground">
          Si cambias los días, la racha y el porcentaje se recalculan. Lo que ya marcaste se conserva.
        </p>
      )}
      {days.length === 0 && <p className="text-[13px] text-destructive">Elige al menos un día de la semana.</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!canSubmit}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
