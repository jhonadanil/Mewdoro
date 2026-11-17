import { PinOff } from 'lucide-react'
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
    <article className="mini-card">
      <div className="mini-card__header">
        <button type="button" className="note-tag mini-tasks__title" onClick={onOpen}>
          Tareas · Hoy {todayTasks.length > 0 && `${done}/${todayTasks.length}`}
        </button>
        <button type="button" className="icon-btn" onClick={onUnpin} aria-label="Quitar de inicio" title="Quitar de inicio">
          <PinOff size={15} />
        </button>
      </div>

      <div className="mini-tasks">
        {visible.length === 0 && <p className="mini-tasks__empty">No hay tareas para hoy.</p>}
        {visible.map((task) => (
          <div key={task.id} className={`mini-tasks__item ${task.done ? 'mini-tasks__item--done' : ''}`}>
            <TaskCheckbox checked={task.done} onChange={() => onUpdate(task.id, { done: !task.done })} />
            <span title={task.text}>{task.text}</span>
          </div>
        ))}
        {hidden > 0 && (
          <button type="button" className="mini-tasks__more" onClick={onOpen}>
            +{hidden} más
          </button>
        )}
      </div>

      <AddTask onAdd={(text) => onAdd(text, today)} placeholder="Añadir tarea" />
    </article>
  )
}
