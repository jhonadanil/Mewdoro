import { useState } from 'react'
import { Input } from '@/components/ui/input'

export interface NumberFieldProps {
  value: number
  min: number
  max: number
  label: string
  onChange: (value: number) => void
}

// Se guarda al salir del campo, para poder borrar y escribir otro número
export default function NumberField({ value, min, max, label, onChange }: NumberFieldProps) {
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
    <Input
      className="w-20 shrink-0"
      type="number"
      min={min}
      max={max}
      aria-label={label}
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => event.key === 'Enter' && event.currentTarget.blur()}
    />
  )
}
