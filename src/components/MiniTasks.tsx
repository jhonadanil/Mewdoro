import { useEffect, useRef } from 'react'
import { MiniCard } from '@/components/MiniCard'
import { ScrollArea } from '@/components/ScrollArea'
import { cn } from '@/lib/utils'
import AddTask from './AddTask'
import { TaskCheckbox } from './TaskItem'
import type { TaskChanges } from '../hooks/useTasks'
import type { Task } from '../types'
import { todayKey } from '../utils/tasks'

interface MiniTasksProps {
  tasks: Task[]
  onOpen: () => void
  onUnpin: () => void
  onAdd: (text: string, date: string) => void
  onUpdate: (id: string, changes: TaskChanges) => void
  className?: string
}

// Versión pequeña de las tareas de hoy para fijarla en Inicio
export default function MiniTasks({ tasks, onOpen, onUnpin, onAdd, onUpdate, className }: MiniTasksProps) {
  const addInput = useRef<HTMLInputElement>(null)
  const today = todayKey()
  const todayTasks = tasks.filter((task) => task.date === today)
  const done = todayTasks.filter((task) => task.done).length

  // Siempre en su orden: así una tarea no salta bajo el cursor al marcarla.
  // Todas están en la lista; si no caben, se baja con la rueda
  const visible = todayTasks

  // Alt + N enfoca "Añadir tarea" desde cualquier sitio de Inicio
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && !event.ctrlKey && !event.metaKey && event.code === 'KeyN') {
        event.preventDefault()
        addInput.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const label = `Tareas flash · Hoy${todayTasks.length > 0 ? ` ${done}/${todayTasks.length}` : ''}`

  return (
    <MiniCard label={label} onOpen={onOpen} openLabel="Abrir Tareas flash" onUnpin={onUnpin} className={className}>
      {/* Unas 7 filas a la vista; el relleno (compensado con margen negativo) deja sitio a los
          anillos de foco y a los botones, que si no quedarían recortados por el desplazamiento */}
      <ScrollArea
        watch={visible.length}
        scrollToEndWhenGrows={todayTasks.length}
        className="-mx-1 -my-1 flex max-h-52 flex-col gap-1.5 px-1 py-1"
      >
        {visible.length === 0 && <p className="text-[13px] text-muted-foreground">No hay tareas flash para hoy.</p>}
        {visible.map((task) => (
          <div key={task.id} className="flex min-w-0 items-center gap-2 text-[13px]">
            <TaskCheckbox checked={task.done} text={task.text} onChange={() => onUpdate(task.id, { done: !task.done })} />
            <span title={task.text} className={cn('min-w-0 flex-1 truncate', task.done && 'text-muted-foreground line-through')}>
              {task.text}
            </span>
          </div>
        ))}
      </ScrollArea>

      <AddTask
        onAdd={(text) => onAdd(text, today)}
        placeholder="Añadir tarea (Alt + N)"
        inputRef={addInput}
        shortcut="Alt+N"
        compact
      />
    </MiniCard>
  )
}
