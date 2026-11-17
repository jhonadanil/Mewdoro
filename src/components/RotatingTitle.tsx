import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface RotatingTitleProps {
  // Frases en orden; la última es la que se queda fija y la que oye el lector de pantalla
  phrases: string[]
  // Milisegundos que se queda cada frase antes de pasar a la siguiente
  interval?: number
  className?: string
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Título que recorre sus frases una sola vez al entrar y se queda en la última.
// La frase que sale sube y se desenfoca; la nueva entra desde abajo.
export function RotatingTitle({ phrases, interval = 2400, className }: RotatingTitleProps) {
  const count = phrases.length
  const last = Math.max(count - 1, 0)
  // Con movimiento reducido se muestra directamente la frase final, sin recorrido
  const [{ current, previous }, setState] = useState<{ current: number; previous: number | null }>(() => ({
    current: prefersReducedMotion() ? last : 0,
    previous: null,
  }))

  useEffect(() => {
    if (current >= last) return
    let timer: number | undefined

    const schedule = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        setState(({ current }) => ({ current: Math.min(current + 1, last), previous: current }))
      }, interval)
    }
    // Con la pestaña oculta se espera a que vuelva, para que el recorrido no pase sin verse
    const onVisibilityChange = () => (document.hidden ? window.clearTimeout(timer) : schedule())

    if (!document.hidden) schedule()
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [current, last, interval])

  const index = Math.min(current, last)

  return (
    <h1 className={cn('text-3xl font-bold tracking-tight', className)}>
      <span className="sr-only">{phrases[last]}</span>
      <span aria-hidden="true" className="rotating-title">
        {previous !== null && previous !== index && (
          <span key={`out-${previous}`} className="rotating-title__phrase rotating-title__phrase--out">
            {phrases[previous]}
          </span>
        )}
        <span key={`in-${index}`} className={cn('rotating-title__phrase', previous !== null && 'rotating-title__phrase--in')}>
          {phrases[index]}
        </span>
      </span>
    </h1>
  )
}
