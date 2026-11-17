import { useState } from 'react'
import type { FormEvent, Ref } from 'react'
import { PlusIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface AddTaskProps {
  onAdd: (text: string) => void
  placeholder?: string
  compact?: boolean
  inputRef?: Ref<HTMLInputElement>
  // Atajo que enfoca el campo, para aria-keyshortcuts (por ejemplo "Alt+N")
  shortcut?: string
}

// Campo para añadir tareas: Enter la crea y el cursor se queda para escribir la siguiente
export default function AddTask({ onAdd, placeholder = 'Añadir una tarea', compact = false, inputRef, shortcut }: AddTaskProps) {
  const [text, setText] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setText('')
  }

  return (
    <form
      // El campo no tiene borde: el anillo de foco va en toda la fila
      className={cn(
        'flex items-center gap-2.5 rounded-md text-muted-foreground has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/50',
        compact ? '-mx-1 min-h-7 px-1 text-[13px]' : 'min-h-9 px-1.5'
      )}
      onSubmit={handleSubmit}
    >
      <PlusIcon className="size-4 shrink-0" />
      <input
        className={cn(
          'min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground',
          compact ? 'py-1' : 'py-1.5 text-[15px]'
        )}
        placeholder={placeholder}
        ref={inputRef}
        aria-keyshortcuts={shortcut}
        value={text}
        onChange={(event) => setText(event.target.value)}
        aria-label="Nueva tarea"
      />
    </form>
  )
}
