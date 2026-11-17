import { useState } from 'react'
import type { ReactNode } from 'react'
import { Trash2 } from 'lucide-react'
import { IconButton } from '@/components/IconButton'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import type { TaskChanges } from '../hooks/useTasks'
import type { Task } from '../types'

interface TaskItemProps {
  task: Task
  onUpdate: (id: string, changes: TaskChanges) => void
  onDelete: (id: string) => void
  // Texto pequeño junto a la tarea, por ejemplo la fecha de una pendiente
  meta?: ReactNode
  // Botones extra que aparecen al pasar el ratón
  actions?: ReactNode
}

// Casilla de shadcn con el azul de Notion al marcarla
export function TaskCheckbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={onChange}
      aria-label={checked ? 'Marcar como pendiente' : 'Marcar como hecha'}
      className="size-[18px] rounded-[4px] border-muted-foreground/60 data-checked:border-brand data-checked:bg-brand data-checked:text-white dark:data-checked:bg-brand"
    />
  )
}

// Una tarea como las to-do de Notion: casilla, texto editable en el sitio y borrar al pasar el ratón
export default function TaskItem({ task, onUpdate, onDelete, meta, actions }: TaskItemProps) {
  const [text, setText] = useState(task.text)

  // Se guarda al salir del campo; si se queda vacía, se borra
  const commit = () => {
    const trimmed = text.trim()
    if (!trimmed) onDelete(task.id)
    else if (trimmed !== task.text) onUpdate(task.id, { text: trimmed })
  }

  return (
    <div className="group flex min-h-9 items-center gap-2.5 rounded-md px-1.5 hover:bg-muted/70">
      <TaskCheckbox checked={task.done} onChange={() => onUpdate(task.id, { done: !task.done })} />
      <input
        className={cn(
          'min-w-0 flex-1 bg-transparent py-1.5 text-[15px] outline-none',
          task.done && 'text-muted-foreground line-through'
        )}
        value={text}
        onChange={(event) => setText(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => event.key === 'Enter' && event.currentTarget.blur()}
        aria-label="Texto de la tarea"
      />
      {meta && <span className="whitespace-nowrap text-xs text-muted-foreground">{meta}</span>}
      <div className="flex gap-0.5 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
        {actions}
        <IconButton label="Eliminar tarea" size="icon-xs" onClick={() => onDelete(task.id)}>
          <Trash2 />
        </IconButton>
      </div>
    </div>
  )
}
