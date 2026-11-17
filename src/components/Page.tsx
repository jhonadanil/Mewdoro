import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageProps {
  children: ReactNode
  // Contenido más estrecho (calendario, ajustes, tareas) con el mismo borde izquierdo
  narrow?: boolean
  className?: string
}

// Contenedor común de todas las páginas
export function Page({ children, narrow = false, className }: PageProps) {
  return (
    <section className={cn('mx-auto w-full max-w-[960px] px-6 pb-12 pt-2.5 sm:px-12', className)}>
      {narrow ? <div className="max-w-[760px]">{children}</div> : children}
    </section>
  )
}

// Título de la página con las acciones a la derecha
export function PageHeader({ children, actions }: { children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {children}
      {actions && <div className="flex items-center gap-1.5">{actions}</div>}
    </div>
  )
}

export function PageTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h1 className={cn('text-3xl font-bold tracking-tight', className)}>{children}</h1>
}

export function PageText({ children }: { children: ReactNode }) {
  return <p className="mb-6 mt-2 leading-relaxed text-muted-foreground">{children}</p>
}
