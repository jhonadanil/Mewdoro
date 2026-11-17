import type { ComponentProps, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface IconButtonProps extends ComponentProps<typeof Button> {
  // Texto del tooltip y de aria-label
  label: string
  // Atajo de teclado que se muestra en el tooltip
  shortcut?: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
}

// Botón de icono con tooltip que nombra la acción (y su atajo, si lo tiene)
export function IconButton({
  label,
  shortcut,
  side = 'bottom',
  variant = 'ghost',
  size = 'icon-sm',
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          aria-label={label}
          className={cn('text-muted-foreground hover:text-foreground', className)}
          {...props}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side={side}>
        {label}
        {shortcut}
      </TooltipContent>
    </Tooltip>
  )
}
