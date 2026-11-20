import { useLayoutEffect, useRef } from 'react'
import type { KeyboardEvent, Ref } from 'react'
import { PlusIcon, XIcon } from '@phosphor-icons/react'
import { IconButton } from '@/components/IconButton'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { parseChecklist, serializeChecklist } from '../utils/checklist'
import type { ChecklistItem } from '../utils/checklist'

interface ChecklistEditorProps {
  value: string
  onChange: (value: string) => void
  // Para que Enter en el título salte a la primera casilla
  firstInputRef?: Ref<HTMLInputElement>
}

// Lista de casillas: Enter añade otra debajo, Retroceso en una vacía la quita y las flechas cambian de casilla
export default function ChecklistEditor({ value, onChange, firstInputRef }: ChecklistEditorProps) {
  const parsed = parseChecklist(value)
  // Una nota nueva muestra una casilla vacía lista para escribir
  const rows: ChecklistItem[] = parsed.length ? parsed : [{ text: '', done: false }]
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  const pendingFocus = useRef<number | null>(null)

  // Tras añadir o quitar una casilla, el foco va a la que toca cuando ya está pintada
  useLayoutEffect(() => {
    if (pendingFocus.current === null) return
    inputs.current[pendingFocus.current]?.focus()
    pendingFocus.current = null
  })

  const save = (next: ChecklistItem[]) => onChange(serializeChecklist(next))

  const edit = (index: number, changes: Partial<ChecklistItem>) =>
    save(rows.map((row, i) => (i === index ? { ...row, ...changes } : row)))

  const addAfter = (index: number) => {
    pendingFocus.current = index + 1
    save([...rows.slice(0, index + 1), { text: '', done: false }, ...rows.slice(index + 1)])
  }

  const remove = (index: number) => {
    if (rows.length === 1) {
      save([{ text: '', done: false }])
      inputs.current[0]?.focus()
      return
    }
    pendingFocus.current = Math.max(0, index - 1)
    save(rows.filter((_, i) => i !== index))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addAfter(index)
    } else if (event.key === 'Backspace' && !rows[index].text) {
      event.preventDefault()
      remove(index)
    } else if (event.key === 'ArrowUp' && index > 0) {
      event.preventDefault()
      inputs.current[index - 1]?.focus()
    } else if (event.key === 'ArrowDown' && index < rows.length - 1) {
      event.preventDefault()
      inputs.current[index + 1]?.focus()
    }
  }

  const doneCount = rows.filter((row) => row.done).length

  return (
    <div>
      {rows.length > 1 || rows[0].text ? (
        <p className="mb-3 text-xs text-muted-foreground">
          {doneCount} de {rows.length} hechas
        </p>
      ) : null}

      <ul className="flex flex-col">
        {rows.map((row, index) => (
          <li key={index} className="group flex items-center gap-3 py-1.5">
            <Checkbox
              checked={row.done}
              onCheckedChange={(checked) => edit(index, { done: checked === true })}
              aria-label={`Marcar «${row.text || 'casilla vacía'}»`}
            />
            <input
              ref={(element) => {
                inputs.current[index] = element
                if (index === 0 && firstInputRef) {
                  if (typeof firstInputRef === 'function') firstInputRef(element)
                  else (firstInputRef as { current: HTMLInputElement | null }).current = element
                }
              }}
              className={cn(
                'min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground',
                row.done && 'text-muted-foreground line-through'
              )}
              type="text"
              placeholder="Escribe un elemento…"
              value={row.text}
              onChange={(event) => edit(index, { text: event.target.value })}
              onKeyDown={(event) => handleKeyDown(event, index)}
            />
            <IconButton
              label="Quitar casilla"
              size="icon-xs"
              className="md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100"
              onClick={() => remove(index)}
            >
              <XIcon />
            </IconButton>
          </li>
        ))}
      </ul>

      <Button variant="ghost" size="sm" className="-ml-2 mt-2 text-muted-foreground" onClick={() => addAfter(rows.length - 1)}>
        <PlusIcon />
        Añadir casilla
      </Button>
    </div>
  )
}
