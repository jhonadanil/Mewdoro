import { useState } from 'react'
import type { DragEvent } from 'react'

const NOTE_DRAG = 'application/x-mewdoro-note'

// Se llama al empezar a arrastrar una nota (tarjeta o fila de la barra lateral)
export function startNoteDrag(event: DragEvent, noteId: string) {
  event.dataTransfer.setData(NOTE_DRAG, noteId)
  event.dataTransfer.effectAllowed = 'move'
}

// Convierte un elemento en destino donde soltar notas; isOver sirve para resaltarlo mientras se arrastra encima
export function useNoteDrop(onDrop: (noteId: string) => void) {
  const [isOver, setIsOver] = useState(false)

  const props = {
    onDragOver: (event: DragEvent) => {
      if (!event.dataTransfer.types.includes(NOTE_DRAG)) return
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
      setIsOver(true)
    },
    onDragLeave: (event: DragEvent) => {
      // Moverse entre los hijos del destino no cuenta como salir
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsOver(false)
    },
    onDrop: (event: DragEvent) => {
      const noteId = event.dataTransfer.getData(NOTE_DRAG)
      setIsOver(false)
      if (!noteId) return
      event.preventDefault()
      onDrop(noteId)
    },
  }

  return { isOver, props }
}
