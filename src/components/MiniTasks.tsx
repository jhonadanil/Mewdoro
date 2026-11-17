import { useEffect, useRef, useState } from 'react'
import { ArrowLineDownIcon } from '@phosphor-icons/react'
import { IconButton } from '@/components/IconButton'
import { MiniCard } from '@/components/MiniCard'
import { cn } from '@/lib/utils'
import AddTask from './AddTask'
import { TaskCheckbox } from './TaskItem'
import type { TaskChanges } from '../hooks/useTasks'
import type { Task } from '../types'
import { formatShortDay, todayKey } from '../utils/tasks'

const MAX_VISIBLE = 6

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
  // "+N más" despliega la lista aquí mismo en vez de llevar a la página de Tareas
  const [expanded, setExpanded] = useState(false)
  const today = todayKey()
  const todayTasks = tasks.filter((task) => task.date === today)
  // Pendientes de días anteriores, como en la página de Tareas
  const overdue = tasks.filter((task) => task.date < today && !task.done)
  const done = todayTasks.filter((task) => task.done).length

  // Si caben todas, se quedan en su orden: así una tarea no salta bajo el cursor al marcarla.
  // Si no caben, primero las pendientes, para que se vea lo que falta
  const all = [...overdue, ...todayTasks]
  const fits = expanded || all.length <= MAX_VISIBLE
  const visible = fits ? all : [...overdue, ...[...todayTasks].sort((a, b) => Number(a.done) - Number(b.done))].slice(0, MAX_VISIBLE)
  const hidden = all.length - visible.length

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

  // Las atrasadas ya se cuentan en la línea de estado de Inicio y se ven marcadas en la lista
  const label = `Tareas · Hoy${todayTasks.length > 0 ? ` ${done}/${todayTasks.length}` : ''}`

  return (
    <MiniCard label={label} onOpen={onOpen} openLabel="Abrir Tareas" onUnpin={onUnpin} className={className}>
      <div className="flex flex-col gap-1.5">
        {visible.length === 0 && <p className="text-[13px] text-muted-foreground">No hay tareas para hoy.</p>}
        {visible.map((task) => {
          const isOverdue = task.date < today
          return (
            <div key={task.id} className="group flex min-w-0 items-center gap-2 text-[13px]">
              <TaskCheckbox checked={task.done} text={task.text} onChange={() => onUpdate(task.id, { done: !task.done })} />
              <span title={task.text} className={cn('min-w-0 flex-1 truncate', task.done && 'text-muted-foreground line-through')}>
                {task.text}
              </span>
              {isOverdue && (
                <>
                  <span className="whitespace-nowrap text-xs text-muted-foreground">{formatShortDay(task.date)}</span>
                  <IconButton
                    label="Pasar a hoy"
                    size="icon-xs"
                    className="-my-1 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
                    onClick={() => onUpdate(task.id, { date: today })}
                  >
                    <ArrowLineDownIcon />
                  </IconButton>
                </>
              )}
            </div>
          )
        })}
        {(hidden > 0 || (expanded && all.length > MAX_VISIBLE)) && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            className="self-start rounded-sm text-xs text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {expanded ? 'Ver menos' : `+${hidden} más`}
          </button>
        )}
      </div>

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
