import { useState } from 'react'
import type { FormEvent } from 'react'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { EMOJI_GROUPS, searchEmojis } from '../utils/emojis'

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
  const [search, setSearch] = useState('')
  const results = searchEmojis(search)

  const choose = (icon: string) => {
    onChange(icon)
    setIsOpen(false)
    setCustom('')
    setSearch('')
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
        <div className="relative">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-8 pl-8 text-[13px] focus-visible:border-foreground/25 focus-visible:ring-0"
            placeholder="Buscar emoji (casa, perro, fuego…)"
            aria-label="Buscar emoji"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            autoFocus
          />
        </div>

        <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
          {search.trim() ? (
            results.length > 0 ? (
              <div className="grid grid-cols-10 gap-0.5">
                {results.map((item) => (
                  <EmojiButton key={item.emoji} emoji={item.emoji} selected={item.emoji === value} onChoose={choose} />
                ))}
              </div>
            ) : (
              <p className="px-1 py-3 text-center text-[13px] text-muted-foreground">Sin resultados para «{search.trim()}»</p>
            )
          ) : (
            EMOJI_GROUPS.map((group) => (
              <div key={group.name}>
                <p className="mx-1 mb-1 mt-1.5 text-xs font-semibold text-muted-foreground">{group.name}</p>
                <div className="grid grid-cols-10 gap-0.5">
                  {group.items.map((item) => (
                    <EmojiButton key={item.emoji} emoji={item.emoji} selected={item.emoji === value} onChoose={choose} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <form className="flex gap-1.5 border-t pt-2" onSubmit={handleCustomSubmit}>
          <Input
            className="h-8 text-[13px] focus-visible:border-foreground/25 focus-visible:ring-0"
            placeholder="O pega uno (Win + .)"
            aria-label="Pegar un emoji"
            value={custom}
            onChange={(event) => setCustom(event.target.value)}
          />
          <Button type="submit" variant="outline" disabled={!firstEmoji(custom)}>
            Usar
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  )
}

function EmojiButton({ emoji, selected, onChoose }: { emoji: string; selected: boolean; onChoose: (emoji: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChoose(emoji)}
      className={cn('aspect-square rounded-md text-lg hover:bg-accent', selected && 'bg-accent')}
    >
      {emoji}
    </button>
  )
}
