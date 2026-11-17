import { useEffect, useState } from 'react'

// Hora actual con precisión de minutos: vuelve a dibujar al empezar cada minuto,
// así la fecha, el saludo y "hoy" cambian solos a medianoche aunque nada más se mueva.
// Al volver a la pestaña (o al despertar el portátil) se actualiza enseguida.
export function useClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let timer: number | undefined

    const schedule = () => {
      window.clearTimeout(timer)
      const msToNextMinute = 60_000 - (Date.now() % 60_000) + 50
      timer = window.setTimeout(() => {
        setNow(new Date())
        schedule()
      }, msToNextMinute)
    }
    const onVisibilityChange = () => {
      if (document.hidden) return
      setNow(new Date())
      schedule()
    }

    schedule()
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return now
}
