// Avisos pequeños abajo de la pantalla: errores al guardar y "Deshacer" tras quitar algo de Inicio.
// Vive fuera de React para que los hooks de Firestore puedan avisar sin recibir nada por props.

export interface ToastData {
  id: number
  message: string
  tone: 'default' | 'error'
  action?: { label: string; onClick: () => void }
}

type Listener = (toasts: ToastData[]) => void

// Como mucho dos a la vez: así un error no tapa el "Deshacer" que acaba de salir
const MAX_TOASTS = 2

let current: ToastData[] = []
let nextId = 1
const listeners = new Set<Listener>()

function emit(toasts: ToastData[]) {
  current = toasts
  listeners.forEach((listener) => listener(toasts))
}

export function showToast(message: string, options: { action?: ToastData['action']; tone?: ToastData['tone'] } = {}) {
  const toast: ToastData = { id: nextId++, message, tone: options.tone ?? 'default', action: options.action }
  emit([...current, toast].slice(-MAX_TOASTS))
}

// Los fallos de Firestore se registran en consola y además se le dicen al usuario.
// Con `action`, el aviso ofrece repetir lo que falló (Reintentar) o recargar (Recargar)
export function showError(message: string, error: unknown, action?: ToastData['action']) {
  console.error(message, error)
  showToast(`${message}. Revisa tu conexión e inténtalo de nuevo.`, { tone: 'error', action })
}

// Guarda en Firestore y, si falla, avisa con un botón que vuelve a intentar exactamente lo mismo
export function persist(message: string, write: () => Promise<unknown>) {
  write().catch((error) => showError(message, error, { label: 'Reintentar', onClick: () => persist(message, write) }))
}

// Para fallos al cargar datos: la suscripción se rehace recargando la página
export const reloadAction: ToastData['action'] = { label: 'Recargar', onClick: () => window.location.reload() }

export function dismissToast(id: number) {
  if (current.some((toast) => toast.id === id)) emit(current.filter((toast) => toast.id !== id))
}

export function subscribeToast(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const getToasts = () => current
