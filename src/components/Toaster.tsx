import { useEffect, useSyncExternalStore } from 'react'
import { XIcon } from '@phosphor-icons/react'
import { IconButton } from '@/components/IconButton'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { dismissToast, getToasts, subscribeToast } from '../utils/toast'
import type { ToastData } from '../utils/toast'

// Tiempo que se ve un aviso; los errores se quedan un poco más
const DURATION = 5000
const ERROR_DURATION = 8000

function Toast({ toast }: { toast: ToastData }) {
  // Cada aviso lleva su propio temporizador, así el segundo no reinicia el primero
  useEffect(() => {
    const id = window.setTimeout(() => dismissToast(toast.id), toast.tone === 'error' ? ERROR_DURATION : DURATION)
    return () => window.clearTimeout(id)
  }, [toast])

  return (
    <div
      role={toast.tone === 'error' ? 'alert' : undefined}
      className={cn(
        'pointer-events-auto flex max-w-md items-center gap-1 floating rounded-2xl bg-popover py-1.5 pl-3.5 pr-1.5 text-sm text-popover-foreground shadow-md border border-border animate-in fade-in-0 slide-in-from-bottom-2 duration-200',
        toast.tone === 'error' && 'text-destructive'
      )}
    >
      <span className="py-1 pr-2">{toast.message}</span>
      {toast.action && (
        <Button
          variant="ghost"
          size="sm"
          className="font-semibold"
          onClick={() => {
            toast.action?.onClick()
            dismissToast(toast.id)
          }}
        >
          {toast.action.label}
        </Button>
      )}
      <IconButton label="Cerrar aviso" size="icon-xs" side="top" onClick={() => dismissToast(toast.id)}>
        <XIcon />
      </IconButton>
    </div>
  )
}

// Avisos abajo en el centro, apilados (como mucho dos; el más nuevo abajo)
export default function Toaster() {
  const toasts = useSyncExternalStore(subscribeToast, getToasts)

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-50 max-md:bottom-20 flex flex-col items-center gap-2"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
