import { useState } from 'react'
import type { FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AddTaskProps {
  onAdd: (text: string) => void
  placeholder?: string
  compact?: boolean
}

// Campo para añadir tareas: Enter la crea y el cursor se queda para escribir la siguiente
export default function AddTask({ onAdd, placeholder = 'Añadir una tarea', compact = false }: AddTaskProps) {
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
      className={cn('flex items-center gap-2.5 text-muted-foreground', compact ? 'min-h-7 text-[13px]' : 'min-h-9 px-1.5')}
      onSubmit={handleSubmit}
    >
      <Plus className="size-4 shrink-0" />
      <input
        className={cn(
          'min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground',
          compact ? 'py-1' : 'py-1.5 text-[15px]'
        )}
        placeholder={placeholder}
        value={text}
        onChange={(event) => setText(event.target.value)}
        aria-label="Nueva tarea"
      />
    </form>
  )
}
