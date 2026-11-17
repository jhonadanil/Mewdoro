import { useState } from 'react'
import { ArrowDownToLine, ChevronLeft, ChevronRight, Pin, PinOff } from 'lucide-react'
import AddTask from '../components/AddTask'
import TaskItem from '../components/TaskItem'
import type { TaskChanges } from '../hooks/useTasks'
import type { Task } from '../types'
import { formatDayLabel, formatShortDay, shiftDateKey, todayKey } from '../utils/tasks'

interface TasksProps {
  tasks: Task[]
  isPinned: boolean
  onTogglePin: () => void
  onAdd: (text: string, date: string) => void
  onUpdate: (id: string, changes: TaskChanges) => void
  onDelete: (id: string) => void
  onMove: (ids: string[], date: string) => void
  onDeleteMany: (ids: string[]) => void
}

export default function Tasks({ tasks, isPinned, onTogglePin, onAdd, onUpdate, onDelete, onMove, onDeleteMany }: TasksProps) {
  const today = todayKey()
  const [day, setDay] = useState(today)

  const dayTasks = tasks.filter((task) => task.date === day)
  const doneTasks = dayTasks.filter((task) => task.done)
  const progress = dayTasks.length ? doneTasks.length / dayTasks.length : 0

  // En "Hoy" se ven también las tareas sin terminar de días anteriores
  const overdue = day === today ? tasks.filter((task) => task.date < today && !task.done) : []

  return (
    <section className="page page--compact">
      <div className="page__header">
        <h2 className="page__title">Tareas</h2>
        <button type="button" className="btn" onClick={onTogglePin}>
          {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
          {isPinned ? 'Quitar de inicio' : 'Fijar en inicio'}
        </button>
      </div>

      {/* Selector de día */}
      <div className="tasks-day">
        <button type="button" className="icon-btn" onClick={() => setDay(shiftDateKey(day, -1))} aria-label="Día anterior">
          <ChevronLeft size={18} />
        </button>
        <span className="tasks-day__label">{formatDayLabel(day)}</span>
        <button type="button" className="icon-btn" onClick={() => setDay(shiftDateKey(day, 1))} aria-label="Día siguiente">
          <ChevronRight size={18} />
        </button>
        {day !== today && (
          <button type="button" className="btn btn--ghost" onClick={() => setDay(today)}>
            Volver a hoy
          </button>
        )}
      </div>

      {dayTasks.length > 0 && (
        <div className="tasks-progress">
          <div className="pomodoro__progress">
            <div className="pomodoro__progress-bar" style={{ width: `${progress * 100}%` }} />
          </div>
          <span>
            {doneTasks.length} de {dayTasks.length}
          </span>
        </div>
      )}

      <div className="task-list">
        {dayTasks.map((task) => (
          <TaskItem key={`${task.id}-${task.text}`} task={task} onUpdate={onUpdate} onDelete={onDelete} />
        ))}
        <AddTask onAdd={(text) => onAdd(text, day)} />
      </div>

      {doneTasks.length > 0 && (
        <button type="button" className="btn btn--ghost tasks-clear" onClick={() => onDeleteMany(doneTasks.map((task) => task.id))}>
          Borrar completadas
        </button>
      )}

      {overdue.length > 0 && (
        <div className="tasks-overdue">
          <div className="tasks-overdue__header">
            <h3 className="settings__section">Pendientes de días anteriores</h3>
            <button type="button" className="btn btn--ghost" onClick={() => onMove(overdue.map((task) => task.id), today)}>
              <ArrowDownToLine size={16} />
              Pasar todas a hoy
            </button>
          </div>
          <div className="task-list">
            {overdue.map((task) => (
              <TaskItem
                key={`${task.id}-${task.text}`}
                task={task}
                onUpdate={onUpdate}
                onDelete={onDelete}
                meta={formatShortDay(task.date)}
                actions={
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => onMove([task.id], today)}
                    aria-label="Pasar a hoy"
                    title="Pasar a hoy"
                  >
                    <ArrowDownToLine size={14} />
                  </button>
                }
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
