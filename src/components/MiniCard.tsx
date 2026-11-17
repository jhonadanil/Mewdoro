import type { ReactNode } from 'react'
import { PinOff } from 'lucide-react'
import { IconButton } from '@/components/IconButton'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

interface MiniCardProps {
  label: ReactNode
  // Si se indica, la etiqueta abre la página completa
  onOpen?: () => void
  onUnpin: () => void
  children: ReactNode
}

// Tarjeta pequeña de los elementos fijados en Inicio
export function MiniCard({ label, onOpen, onUnpin, children }: MiniCardProps) {
  const badge = <Badge variant="secondary">{label}</Badge>

  return (
    <Card size="sm" className="gap-2.5 px-3">
      <div className="flex items-center justify-between gap-2">
        {onOpen ? (
          <button type="button" onClick={onOpen} className="rounded-md">
            {badge}
          </button>
        ) : (
          badge
        )}
        <IconButton label="Quitar de inicio" size="icon-xs" onClick={onUnpin}>
          <PinOff />
        </IconButton>
      </div>
      {children}
    </Card>
  )
}
