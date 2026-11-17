import { Fragment, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { KeyboardIcon } from '@phosphor-icons/react'
import { IconButton } from '@/components/IconButton'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { IS_MAC } from '../utils/platform'

const MOD = IS_MAC ? '⌘' : 'Ctrl'

const GROUPS: { title: string; items: { keys: string[]; label: ReactNode }[] }[] = [
  {
    title: 'General',
    items: [
      { keys: [MOD, 'K'], label: 'Buscar notas' },
      { keys: [MOD, '.'], label: 'Abrir o cerrar la barra lateral' },
      { keys: ['Esc'], label: 'Vaciar la búsqueda' },
      { keys: ['?'], label: 'Ver estos atajos' },
    ],
  },
  {
    title: 'Ir a',
    items: [
      { keys: ['Alt', '1'], label: 'Inicio' },
      { keys: ['Alt', '2'], label: 'Notas' },
      { keys: ['Alt', '3'], label: 'Pomodoro' },
      { keys: ['Alt', '4'], label: 'Tareas' },
      { keys: ['Alt', '5'], label: 'Calendario' },
      { keys: ['Alt', '6'], label: 'Ajustes' },
    ],
  },
  {
    title: 'Inicio',
    items: [
      { keys: ['Alt', 'N'], label: 'Añadir tarea' },
      { keys: ['Alt', 'P'], label: 'Iniciar o pausar el Pomodoro' },
    ],
  },
  {
    title: 'Editor de notas',
    items: [
      { keys: ['Enter'], label: 'Del título al texto' },
      { keys: [MOD, '/'], label: 'Comentar código' },
      { keys: ['Tab'], label: 'Sangría (Shift + Tab la quita)' },
    ],
  },
]

// No se abre con "?" mientras se escribe: ahí "?" es un carácter más
function isTyping(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
}

// Botón con la lista de atajos de teclado; "?" la abre desde cualquier sitio
export function ShortcutsHelp({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '?' && !event.ctrlKey && !event.metaKey && !event.altKey && !isTyping(event.target)) {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <IconButton label="Atajos de teclado" shortcut={<Kbd>?</Kbd>} size="icon" className={className}>
          <KeyboardIcon />
        </IconButton>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 gap-3 p-3.5">
        <h2 className="text-sm font-semibold">Atajos de teclado</h2>
        {GROUPS.map((group) => (
          <section key={group.title} aria-label={group.title} className="flex flex-col gap-1.5">
            <h3 className="text-xs font-medium text-muted-foreground">{group.title}</h3>
            <dl className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5">
              {group.items.map((item) => (
                <Fragment key={item.keys.join('+')}>
                  <dt className="text-[13px]">{item.label}</dt>
                  <dd>
                    <KbdGroup>
                      {item.keys.map((key) => (
                        <Kbd key={key}>{key}</Kbd>
                      ))}
                    </KbdGroup>
                  </dd>
                </Fragment>
              ))}
            </dl>
          </section>
        ))}
      </PopoverContent>
    </Popover>
  )
}
