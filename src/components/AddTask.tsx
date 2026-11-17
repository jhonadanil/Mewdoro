import { useState } from 'react'
import type { FormEvent } from 'react'
import { Plus } from 'lucide-react'

interface AddTaskProps {
  onAdd: (text: string) => void
  placeholder?: string
}

// Campo para añadir tareas: Enter la crea y el cursor se queda para escribir la siguiente
export default function AddTask({ onAdd, placeholder = 'Añadir una tarea' }: AddTaskProps) {
  const [text, setText] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setText('')
  }

  return (
    <form className="add-task" onSubmit={handleSubmit}>
      <Plus size={16} />
      <input
        className="add-task__input"
        placeholder={placeholder}
        value={text}
        onChange={(event) => setText(event.target.value)}
        aria-label="Nueva tarea"
      />
    </form>
  )
}
