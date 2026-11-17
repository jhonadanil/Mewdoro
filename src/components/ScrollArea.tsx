import { useEffect, useRef, useState } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  // Recalcula el difuminado cuando cambia el contenido (texto de la nota, número de tareas…)
  watch: unknown
  // Si este número crece (p. ej. al añadir una tarea), baja hasta el final para que se vea lo nuevo
  scrollToEndWhenGrows?: number
  children: ReactNode
}

// Zona con altura máxima (la pone quien la usa) que se desplaza por dentro con la rueda.
// Mientras queda contenido por debajo, el borde inferior se difumina: así se ve que hay más
// sin tener que pasar el ratón. overscroll-contain: al llegar al final, la rueda no mueve la página.
export function ScrollArea({ watch, scrollToEndWhenGrows, className, children, onScroll, ...props }: ScrollAreaProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [hasMore, setHasMore] = useState(false)
  const lastCount = useRef(scrollToEndWhenGrows)

  const update = () => {
    const el = ref.current
    if (el) setHasMore(el.scrollHeight - el.scrollTop - el.clientHeight > 2)
  }

  useEffect(() => {
    update()
    const observer = new ResizeObserver(update)
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [watch])

  useEffect(() => {
    const previous = lastCount.current
    lastCount.current = scrollToEndWhenGrows
    if (previous !== undefined && scrollToEndWhenGrows !== undefined && scrollToEndWhenGrows > previous) {
      ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: 'smooth' })
    }
  }, [scrollToEndWhenGrows])

  return (
    <div
      ref={ref}
      onScroll={(event) => {
        update()
        onScroll?.(event)
      }}
      className={cn(
        'scroll-area overflow-y-auto overscroll-contain',
        hasMore && '[mask-image:linear-gradient(to_bottom,black_calc(100%-2.5rem),transparent)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
