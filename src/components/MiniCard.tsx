import type { ReactNode } from 'react'
import { ArrowUpRightIcon, PushPinSlashIcon } from '@phosphor-icons/react'
import { IconButton } from '@/components/IconButton'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MiniCardProps {
  label: ReactNode
  // Si se indica, la etiqueta abre la página completa
  onOpen?: () => void
  // Texto del tooltip de la etiqueta, por ejemplo "Abrir Tareas"
  openLabel?: string
  onUnpin: () => void
  className?: string
  children: ReactNode
}

// Tarjeta pequeña de los elementos fijados en Inicio
export function MiniCard({ label, onOpen, openLabel, onUnpin, className, children }: MiniCardProps) {
  return (
    // Mismo realce al pasar el ratón que las tarjetas de nota
    <Card size="sm" className={cn('gap-2.5 px-3 transition-shadow hover:border-foreground/30', className)}>
      <div className="flex items-center justify-between gap-2">
        {/* La etiqueta es el encabezado de la tarjeta, así se puede saltar entre tarjetas con un lector de pantalla */}
        <h2 className="flex min-w-0">
          {onOpen ? (
            <button
              type="button"
              onClick={onOpen}
              title={openLabel}
              className="group/chip min-w-0 rounded-4xl focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {/* La flecha indica que el chip abre la página completa, sin tener que pasar el ratón */}
              <Badge variant="secondary" className="max-w-full gap-1 group-hover/chip:ring-1 group-hover/chip:ring-foreground/20">
                <span className="min-w-0 truncate">{label}</span>
                <ArrowUpRightIcon aria-hidden="true" className="size-3 shrink-0 opacity-60 group-hover/chip:opacity-100" />
              </Badge>
            </button>
          ) : (
            <Badge variant="secondary" className="max-w-full truncate">
              {label}
            </Badge>
          )}
        </h2>
        <IconButton label="Quitar de inicio" size="icon-xs" onClick={onUnpin}>
          <PushPinSlashIcon />
        </IconButton>
      </div>
      {children}
    </Card>
  )
}
