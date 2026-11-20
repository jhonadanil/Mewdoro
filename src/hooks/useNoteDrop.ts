import { useState } from 'react'
import type { DragEvent } from 'react'

export const NOTE_DRAG = 'application/x-mewdoro-note'

// Se llama al empezar a arrastrar algo (una nota, una herramienta de Inicio…)
export function startDrag(event: DragEvent, id: string, mime: string) {
  event.dataTransfer.setData(mime, id)
  event.dataTransfer.effectAllowed = 'move'
}

export const startNoteDrag = (event: DragEvent, noteId: string) => startDrag(event, noteId, NOTE_DRAG)

// Convierte un elemento en destino donde soltar; isOver sirve para resaltarlo mientras se arrastra encima
export function useDrop(onDrop: (id: string) => void, mime: string) {
  const [isOver, setIsOver] = useState(false)

  const props = {
    onDragOver: (event: DragEvent) => {
      if (!event.dataTransfer.types.includes(mime)) return
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
      setIsOver(true)
    },
    onDragLeave: (event: DragEvent) => {
      // Moverse entre los hijos del destino no cuenta como salir
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsOver(false)
    },
    onDrop: (event: DragEvent) => {
      const id = event.dataTransfer.getData(mime)
      setIsOver(false)
      if (!id) return
      event.preventDefault()
      onDrop(id)
    },
  }

  return { isOver, props }
}

// Destino donde soltar notas
export const useNoteDrop = (onDrop: (noteId: string) => void) => useDrop(onDrop, NOTE_DRAG)
