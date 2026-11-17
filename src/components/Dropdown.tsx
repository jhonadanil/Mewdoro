import { useState } from 'react'
import type { ReactNode } from 'react'
import { Check, ChevronDown } from 'lucide-react'

interface DropdownOption<T extends string> {
  value: T
  label: string
}

interface DropdownProps<T extends string> {
  value: T
  options: DropdownOption<T>[]
  onChange: (value: T) => void
  label: string
  // Contenido del botón; por defecto, la etiqueta de la opción elegida
  children?: ReactNode
  align?: 'left' | 'right'
}

// Menú pequeño al estilo Notion: un botón discreto que abre una lista con la opción marcada
export default function Dropdown<T extends string>({
  value,
  options,
  onChange,
  label,
  children,
  align = 'left',
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const selected = options.find((option) => option.value === value)

  return (
    <div className="dropdown">
      <button
        type="button"
        className="dropdown__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={label}
        aria-expanded={isOpen}
        title={label}
      >
        {children ?? selected?.label}
        <ChevronDown size={13} />
      </button>

      {isOpen && (
        <>
          {/* Capa transparente: un clic fuera cierra el menú */}
          <div className="dropdown__backdrop" onClick={() => setIsOpen(false)} />
          <div className={`dropdown__menu dropdown__menu--${align}`} role="listbox" aria-label={label}>
            <p className="dropdown__title">{label}</p>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === value}
                className="dropdown__option"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
              >
                <span>{option.label}</span>
                {option.value === value && <Check size={14} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
