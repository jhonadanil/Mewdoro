import { useEffect, useState } from 'react'

// Sin sesión hay tres pantallas, elegidas con el hash de la URL para que el botón Atrás funcione:
// landing (sin hash), #entrar y #registro
export type AuthRoute = 'landing' | 'login' | 'register'

const HASHES: Record<AuthRoute, string> = { landing: '', login: '#entrar', register: '#registro' }

function readRoute(): AuthRoute {
  if (window.location.hash === HASHES.login) return 'login'
  if (window.location.hash === HASHES.register) return 'register'
  return 'landing'
}

export function goToAuthRoute(route: AuthRoute) {
  window.location.hash = HASHES[route]
}

export function useAuthRoute() {
  const [route, setRoute] = useState<AuthRoute>(readRoute)

  useEffect(() => {
    const onChange = () => {
      setRoute(readRoute())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}
