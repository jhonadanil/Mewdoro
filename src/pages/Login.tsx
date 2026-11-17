import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { auth, googleProvider } from '../firebase'

type Mode = 'login' | 'register'

const ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'Email o contraseña incorrectos.',
  'auth/invalid-email': 'El email no es válido.',
  'auth/missing-password': 'Escribe tu contraseña.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese email.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/too-many-requests': 'Demasiados intentos. Espera un momento y vuelve a probar.',
  'auth/network-request-failed': 'No hay conexión. Revisa tu internet.',
  'auth/operation-not-allowed': 'Este método de inicio de sesión no está activado en Firebase.',
  'auth/popup-blocked': 'El navegador bloqueó la ventana de Google. Permite las ventanas emergentes.',
}

function getErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) return ERROR_MESSAGES[error.code] ?? `Algo salió mal (${error.code}).`
  return 'Algo salió mal. Inténtalo de nuevo.'
}

export default function Login() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const isRegister = mode === 'register'

  const run = async (action: () => Promise<unknown>) => {
    setError('')
    setInfo('')
    setIsLoading(true)
    try {
      await action()
    } catch (err) {
      // Cerrar la ventana de Google no es un error
      if (!(err instanceof FirebaseError && err.code === 'auth/popup-closed-by-user')) {
        setError(getErrorMessage(err))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    run(() =>
      isRegister
        ? createUserWithEmailAndPassword(auth, email.trim(), password)
        : signInWithEmailAndPassword(auth, email.trim(), password),
    )
  }

  const resetPassword = () => {
    if (!email.trim()) {
      setError('Escribe tu email para enviarte el enlace.')
      return
    }
    run(async () => {
      await sendPasswordResetEmail(auth, email.trim())
      setInfo('Te enviamos un email para cambiar la contraseña.')
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm gap-3.5 px-7 py-8">
        <h1 className="flex items-center gap-3 text-2xl font-bold">
          <img src="/favicon.svg" alt="" width={36} height={36} />
          SnapNote
        </h1>
        <p className="mb-1 text-sm text-muted-foreground">
          {isRegister ? 'Crea una cuenta para guardar tus notas y ajustes.' : 'Inicia sesión para ver tus notas.'}
        </p>

        <form className="flex flex-col gap-2.5" onSubmit={handleSubmit}>
          <Input
            className="h-9 bg-background"
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Input
            className="h-9 bg-background"
            type="password"
            placeholder="Contraseña"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <p className="text-[13px] text-destructive">{error}</p>}
          {info && <p className="text-[13px]">{info}</p>}

          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
          </Button>
        </form>

        {!isRegister && (
          <Button variant="link" size="sm" className="self-center text-[13px]" onClick={resetPassword} disabled={isLoading}>
            ¿Olvidaste tu contraseña?
          </Button>
        )}

        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
          <Separator className="flex-1" />o<Separator className="flex-1" />
        </div>

        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => run(() => signInWithPopup(auth, googleProvider))}
          disabled={isLoading}
        >
          Continuar con Google
        </Button>

        <p className="mt-1 text-center text-[13px] text-muted-foreground">
          {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-[13px] text-foreground"
            onClick={() => {
              setMode(isRegister ? 'login' : 'register')
              setError('')
              setInfo('')
            }}
          >
            {isRegister ? 'Inicia sesión' : 'Crea una'}
          </Button>
        </p>
      </Card>
    </div>
  )
}
