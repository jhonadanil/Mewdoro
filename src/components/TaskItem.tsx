import { useState } from 'react'
import type { ReactNode } from 'react'
import { Check, Trash2 } from 'lucide-react'
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

export function TaskCheckbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={checked ? 'Marcar como pendiente' : 'Marcar como hecha'}
      className={`task-checkbox ${checked ? 'task-checkbox--checked' : ''}`}
      onClick={onChange}
    >
      {checked && <Check size={12} strokeWidth={3} />}
    </button>
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
    <div className={`task-item ${task.done ? 'task-item--done' : ''}`}>
      <TaskCheckbox checked={task.done} onChange={() => onUpdate(task.id, { done: !task.done })} />
      <input
        className="task-item__text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => event.key === 'Enter' && event.currentTarget.blur()}
        aria-label="Texto de la tarea"
      />
      {meta && <span className="task-item__meta">{meta}</span>}
      <div className="task-item__actions">
        {actions}
        <button
          type="button"
          className="icon-btn"
          onClick={() => onDelete(task.id)}
          aria-label="Eliminar tarea"
          title="Eliminar tarea"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
