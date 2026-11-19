import { useState } from 'react'
import { TrashIcon } from '@phosphor-icons/react'
import { IconButton } from '@/components/IconButton'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import type { TaskChanges } from '../hooks/useTasks'
import type { Task } from '../types'

interface TaskItemProps {
  task: Task
  onUpdate: (id: string, changes: TaskChanges) => void
  onDelete: (id: string) => void
}

// Casilla que se llena de Mauve al marcarla.
// Con el texto de la tarea, el lector de pantalla dice cuál se marca
export function TaskCheckbox({ checked, onChange, text }: { checked: boolean; onChange: () => void; text?: string }) {
  const action = checked ? 'Marcar como pendiente' : 'Marcar como hecha'
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={onChange}
      aria-label={text ? `${action}: ${text}` : action}
      className="size-[18px] rounded-[4px] border-muted-foreground/80 data-checked:border-brand data-checked:bg-brand data-checked:text-primary-foreground dark:data-checked:bg-brand"
    />
  )
}

// Una tarea: casilla, texto editable en el sitio y borrar al pasar el ratón
export default function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [text, setText] = useState(task.text)

  // Se guarda al salir del campo; si se queda vacía, se borra
  const commit = () => {
    const trimmed = text.trim()
    if (!trimmed) onDelete(task.id)
    else if (trimmed !== task.text) onUpdate(task.id, { text: trimmed })
  }

  return (
    // Al editar el texto la fila se resalta, así se ve dónde está el foco
    <div className="group flex min-h-9 items-center gap-2.5 rounded-md px-1.5 hover:bg-muted/70 has-[input:focus-visible]:bg-muted/70 has-[input:focus-visible]:ring-1 has-[input:focus-visible]:ring-ring/50">
      <TaskCheckbox checked={task.done} text={task.text} onChange={() => onUpdate(task.id, { done: !task.done })} />
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
      <div className="flex gap-0.5 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
        <IconButton label="Eliminar tarea" size="icon-xs" onClick={() => onDelete(task.id)}>
          <TrashIcon />
        </IconButton>
      </div>
    </div>
  )
}
