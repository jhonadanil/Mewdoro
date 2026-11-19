export interface ChecklistItem {
  text: string
  done: boolean
}

// Las casillas se guardan como texto, una por línea: "- [ ] tarea" o "- [x] tarea".
// Así no cambia el modelo de datos, se puede buscar y también se lee bien como Markdown.
const ITEM_PATTERN = /^- \[([ xX])\] ?(.*)$/

export function parseChecklist(content: string): ChecklistItem[] {
  return content
    .split('\n')
    .map((line): ChecklistItem | null => {
      const match = ITEM_PATTERN.exec(line)
      if (match) return { done: match[1] !== ' ', text: match[2] }
      // Una línea suelta (por ejemplo al cambiar una nota de texto a casillas) cuenta como casilla sin marcar
      return line.trim() ? { done: false, text: line.trim() } : null
    })
    .filter((item): item is ChecklistItem => item !== null)
}

export function serializeChecklist(items: ChecklistItem[]) {
  return items.map((item) => `- [${item.done ? 'x' : ' '}] ${item.text}`).join('\n')
}

// Texto para las tarjetas: ☐ pendiente, ☑ hecha
export function checklistPreview(content: string) {
  return parseChecklist(content)
    .filter((item) => item.text.trim())
    .map((item) => `${item.done ? '☑' : '☐'} ${item.text}`)
    .join('\n')
}

// Una nota de casillas con solo casillas vacías cuenta como vacía
export function isChecklistEmpty(content: string) {
  return parseChecklist(content).every((item) => !item.text.trim())
}
