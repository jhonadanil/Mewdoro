import { useState } from 'react'
import { ArrowDownToLine, ChevronLeft, ChevronRight, Pin, PinOff } from 'lucide-react'
import { IconButton } from '@/components/IconButton'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import AddTask from '../components/AddTask'
import { Page, PageHeader, PageTitle } from '../components/Page'
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
    <Page narrow>
      <PageHeader
        actions={
          <Button variant="outline" onClick={onTogglePin}>
            {isPinned ? <PinOff /> : <Pin />}
            {isPinned ? 'Quitar de inicio' : 'Fijar en inicio'}
          </Button>
        }
      >
        <PageTitle>Tareas</PageTitle>
      </PageHeader>

      {/* Selector de día */}
      <div className="mb-3 mt-5 flex items-center gap-1">
        <IconButton label="Día anterior" onClick={() => setDay(shiftDateKey(day, -1))}>
          <ChevronLeft />
        </IconButton>
        <span className="min-w-[90px] text-center text-lg font-semibold first-letter:uppercase">{formatDayLabel(day)}</span>
        <IconButton label="Día siguiente" onClick={() => setDay(shiftDateKey(day, 1))}>
          <ChevronRight />
        </IconButton>
        {day !== today && (
          <Button variant="ghost" className="text-muted-foreground" onClick={() => setDay(today)}>
            Volver a hoy
          </Button>
        )}
      </div>

      {dayTasks.length > 0 && (
        <div className="mb-3 flex items-center gap-3 whitespace-nowrap text-[13px] text-muted-foreground">
          <Progress value={progress * 100} className="h-1.5 **:data-[slot=progress-indicator]:bg-brand" />
          <span>
            {doneTasks.length} de {dayTasks.length}
          </span>
        </div>
      )}

      <div className="flex flex-col">
        {dayTasks.map((task) => (
          <TaskItem key={`${task.id}-${task.text}`} task={task} onUpdate={onUpdate} onDelete={onDelete} />
        ))}
        <AddTask onAdd={(text) => onAdd(text, day)} />
      </div>

      {doneTasks.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 text-muted-foreground"
          onClick={() => onDeleteMany(doneTasks.map((task) => task.id))}
        >
          Borrar completadas
        </Button>
      )}

      {overdue.length > 0 && (
        <div className="mt-7">
          <div className="flex items-end justify-between gap-3 border-b pb-1">
            <h3 className="pb-1 text-sm font-semibold">Pendientes de días anteriores</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => onMove(overdue.map((task) => task.id), today)}
            >
              <ArrowDownToLine />
              Pasar todas a hoy
            </Button>
          </div>
          <div className="flex flex-col">
            {overdue.map((task) => (
              <TaskItem
                key={`${task.id}-${task.text}`}
                task={task}
                onUpdate={onUpdate}
                onDelete={onDelete}
                meta={formatShortDay(task.date)}
                actions={
                  <IconButton label="Pasar a hoy" size="icon-xs" onClick={() => onMove([task.id], today)}>
                    <ArrowDownToLine />
                  </IconButton>
                }
              />
            ))}
          </div>
        </div>
      )}
    </Page>
  )
}
