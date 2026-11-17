import { MiniCard } from '@/components/MiniCard'
import { cn } from '@/lib/utils'
import AddTask from './AddTask'
import { TaskCheckbox } from './TaskItem'
import type { TaskChanges } from '../hooks/useTasks'
import type { Task } from '../types'
import { todayKey } from '../utils/tasks'

const MAX_VISIBLE = 6

interface MiniTasksProps {
  tasks: Task[]
  onOpen: () => void
  onUnpin: () => void
  onAdd: (text: string, date: string) => void
  onUpdate: (id: string, changes: TaskChanges) => void
}

// Versión pequeña de las tareas de hoy para fijarla en Inicio
export default function MiniTasks({ tasks, onOpen, onUnpin, onAdd, onUpdate }: MiniTasksProps) {
  const today = todayKey()
  const todayTasks = tasks.filter((task) => task.date === today)
  const done = todayTasks.filter((task) => task.done).length
  // Primero las pendientes, para que se vea lo que falta
  const visible = [...todayTasks].sort((a, b) => Number(a.done) - Number(b.done)).slice(0, MAX_VISIBLE)
  const hidden = todayTasks.length - visible.length

  return (
    <MiniCard
      label={`Tareas · Hoy ${todayTasks.length > 0 ? `${done}/${todayTasks.length}` : ''}`}
      onOpen={onOpen}
      onUnpin={onUnpin}
    >
      <div className="flex flex-col gap-1.5">
        {visible.length === 0 && <p className="text-[13px] text-muted-foreground">No hay tareas para hoy.</p>}
        {visible.map((task) => (
          <div key={task.id} className="flex min-w-0 items-center gap-2 text-[13px]">
            <TaskCheckbox checked={task.done} onChange={() => onUpdate(task.id, { done: !task.done })} />
            <span title={task.text} className={cn('truncate', task.done && 'text-muted-foreground line-through')}>
              {task.text}
            </span>
          </div>
        ))}
        {hidden > 0 && (
          <button type="button" onClick={onOpen} className="self-start text-xs text-muted-foreground hover:text-foreground">
            +{hidden} más
          </button>
        )}
      </div>

      <AddTask onAdd={(text) => onAdd(text, today)} placeholder="Añadir tarea" compact />
    </MiniCard>
  )
}
