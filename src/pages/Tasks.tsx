import { useState } from 'react'
import { CaretLeftIcon, CaretRightIcon, PushPinIcon, PushPinSlashIcon } from '@phosphor-icons/react'
import { IconButton } from '@/components/IconButton'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import AddTask from '../components/AddTask'
import { Page, PageHeader, PageTitle } from '../components/Page'
import TaskItem from '../components/TaskItem'
import type { TaskChanges } from '../hooks/useTasks'
import type { Task } from '../types'
import { formatDayLabel, shiftDateKey, todayKey } from '../utils/tasks'

interface TasksProps {
  tasks: Task[]
  isPinned: boolean
  onTogglePin: () => void
  onAdd: (text: string, date: string) => void
  onUpdate: (id: string, changes: TaskChanges) => void
  onDelete: (id: string) => void
  onDeleteMany: (ids: string[]) => void
}

export default function Tasks({ tasks, isPinned, onTogglePin, onAdd, onUpdate, onDelete, onDeleteMany }: TasksProps) {
  const today = todayKey()
  const [day, setDay] = useState(today)

  const dayTasks = tasks.filter((task) => task.date === day)
  const doneTasks = dayTasks.filter((task) => task.done)
  const progress = dayTasks.length ? doneTasks.length / dayTasks.length : 0

  return (
    <Page narrow>
      <PageHeader
        actions={
          <Button variant="outline" onClick={onTogglePin}>
            {isPinned ? <PushPinSlashIcon /> : <PushPinIcon />}
            {isPinned ? 'Quitar de inicio' : 'Fijar en inicio'}
          </Button>
        }
      >
        <PageTitle>Tareas flash</PageTitle>
      </PageHeader>

      <p className="mt-2 text-muted-foreground">Las completadas se borran solas al terminar el día; las que quedan pendientes pasan a hoy.</p>

      {/* Selector de día: solo hoy y lo que viene, porque lo de ayer ya se limpió */}
      <div className="mb-3 mt-5 flex items-center gap-1">
        <IconButton label="Día anterior" disabled={day <= today} onClick={() => setDay(shiftDateKey(day, -1))}>
          <CaretLeftIcon />
        </IconButton>
        <span className="min-w-[90px] text-center text-lg font-semibold first-letter:uppercase">{formatDayLabel(day)}</span>
        <IconButton label="Día siguiente" onClick={() => setDay(shiftDateKey(day, 1))}>
          <CaretRightIcon />
        </IconButton>
        {day !== today && (
          <Button variant="ghost" className="text-muted-foreground" onClick={() => setDay(today)}>
            Volver a hoy
          </Button>
        )}
      </div>

      {dayTasks.length > 0 && (
        <div className="mb-3 flex items-center gap-3 whitespace-nowrap text-[13px] text-muted-foreground">
          <Progress value={progress * 100} className="h-1.5" />
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

    </Page>
  )
}
