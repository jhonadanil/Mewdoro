import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { accountErrorMessage } from '../utils/account'

interface DeleteAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  // Si la cuenta usa contraseña, hay que escribirla; con Google se confirma en una ventana de Google
  needsPassword: boolean
  onConfirm: (password?: string) => Promise<void>
}

const CONFIRM_WORD = 'ELIMINAR'

export default function DeleteAccountDialog({ open, onOpenChange, needsPassword, onConfirm }: DeleteAccountDialogProps) {
  const [word, setWord] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const reset = () => {
    setWord('')
    setPassword('')
    setError('')
  }

  const canDelete = word.trim().toUpperCase() === CONFIRM_WORD && (!needsPassword || password.length > 0) && !isLoading

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canDelete) return
    setIsLoading(true)
    setError('')
    try {
      await onConfirm(needsPassword ? password : undefined)
    } catch (caught) {
      setError(accountErrorMessage(caught))
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (isLoading) return
        if (!next) reset()
        onOpenChange(next)
      }}
    >
      <AlertDialogContent>
        <form onSubmit={handleSubmit} className="contents">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar tu cuenta?</AlertDialogTitle>
            <AlertDialogDescription>
              Se borrarán para siempre tu cuenta y todos tus datos: notas, carpetas, tareas, rutinas y ajustes. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5 text-sm">
              Escribe {CONFIRM_WORD} para confirmar
              <Input value={word} onChange={(event) => setWord(event.target.value)} autoComplete="off" autoFocus />
            </label>
            {needsPassword ? (
              <label className="flex flex-col gap-1.5 text-sm">
                Tu contraseña
                <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
              </label>
            ) : (
              <p className="text-xs text-muted-foreground">Se abrirá una ventana de Google para confirmar que eres tú.</p>
            )}
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <Button type="submit" variant="destructive" disabled={!canDelete}>
              {isLoading ? 'Eliminando…' : 'Eliminar cuenta'}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
