import { useState } from 'react'
import type { FormEvent } from 'react'
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
    <div className="emoji-picker">
      <button
        type="button"
        className="emoji-picker__button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Cambiar icono"
        title="Cambiar icono"
      >
        {value}
      </button>

      {isOpen && (
        <>
          {/* Capa transparente: un clic fuera cierra el selector */}
          <div className="emoji-picker__backdrop" onClick={() => setIsOpen(false)} />
          <div className="emoji-picker__panel">
            <form className="emoji-picker__custom" onSubmit={handleCustomSubmit}>
              <input
                className="input"
                placeholder="Pega o escribe un emoji (Win + .)"
                value={custom}
                onChange={(event) => setCustom(event.target.value)}
                autoFocus
              />
              <button type="submit" className="btn" disabled={!firstEmoji(custom)}>
                Usar
              </button>
            </form>

            <div className="emoji-picker__groups">
              {FOLDER_ICON_GROUPS.map((group) => (
                <div key={group.name}>
                  <p className="emoji-picker__group-name">{group.name}</p>
                  <div className="emoji-picker__grid">
                    {group.icons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        className={`emoji-picker__option ${icon === value ? 'emoji-picker__option--active' : ''}`}
                        onClick={() => choose(icon)}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
