import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { FOLDER_ICON_GROUPS } from '../hooks/useFolders'

interface EmojiPickerProps {
  value: string
  onChange: (icon: string) => void
}

// Primer emoji completo del texto (algunos ocupan varios caracteres, como 🧑‍💻)
function firstEmoji(text: string) {
  const [first] = new Intl.Segmenter().segment(text.trim())
  return first?.segment ?? ''
}

// Botón con el icono de la carpeta; al pulsarlo se elige otro de la lista o se pega cualquiera
export default function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [custom, setCustom] = useState('')

  const choose = (icon: string) => {
    onChange(icon)
    setIsOpen(false)
    setCustom('')
  }

  const handleCustomSubmit = (event: FormEvent) => {
    event.preventDefault()
    const icon = firstEmoji(custom)
    if (icon) choose(icon)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="size-11 p-0 text-3xl" aria-label="Cambiar icono">
          {value}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[340px] gap-2 p-2.5">
        <form className="flex gap-1.5" onSubmit={handleCustomSubmit}>
          <Input
            className="h-8 text-[13px]"
            placeholder="Pega o escribe un emoji (Win + .)"
            value={custom}
            onChange={(event) => setCustom(event.target.value)}
            autoFocus
          />
          <Button type="submit" variant="outline" disabled={!firstEmoji(custom)}>
            Usar
          </Button>
        </form>

        <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
          {FOLDER_ICON_GROUPS.map((group) => (
            <div key={group.name}>
              <p className="mx-1 mb-1 mt-1.5 text-xs font-semibold text-muted-foreground">{group.name}</p>
              <div className="grid grid-cols-10 gap-0.5">
                {group.icons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => choose(icon)}
                    className={cn('aspect-square rounded-md text-lg hover:bg-accent', icon === value && 'bg-accent')}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
