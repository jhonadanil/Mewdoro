import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { CaretLeftIcon, CheckIcon, EyeIcon, EyeSlashIcon, GoogleLogoIcon } from '@phosphor-icons/react'
import { IconButton } from '@/components/IconButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { auth, googleProvider } from '../firebase'
import { goToAuthRoute } from '../hooks/useAuthRoute'

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

const BENEFITS = [
  'Notas con código y los colores de VS Code',
  'Tareas flash y rutinas con racha',
  'Pomodoro y calendario semanal o mensual',
  'Todo se guarda en tu cuenta y funciona sin conexión',
]

interface LoginProps {
  // La pantalla (iniciar sesión o crear cuenta) la elige la URL: #entrar o #registro
  mode: 'login' | 'register'
}

export default function Login({ mode }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const ids = { email: useId(), password: useId(), hint: useId() }

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

  const switchMode = () => {
    setError('')
    setInfo('')
    goToAuthRoute(isRegister ? 'login' : 'register')
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Columna de apoyo: solo en pantallas anchas, para no estorbar al formulario en móvil */}
      <aside className="hidden flex-col justify-between border-r bg-sidebar p-12 md:flex">
        <a href="#" className="flex w-fit items-center gap-2.5 rounded-full text-lg font-bold focus-visible:outline-2 focus-visible:outline-offset-4">
          <img src="/favicon.svg" alt="" width={28} height={28} />
          SnapNote
        </a>
        <div>
          <p className="max-w-[16ch] text-4xl font-bold leading-[1.1] tracking-tight text-balance">Tu día entero, en una sola pantalla.</p>
          <ul className="mt-8 flex flex-col gap-3 text-sm text-muted-foreground">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-center gap-2.5">
                <CheckIcon aria-hidden="true" weight="bold" className="size-4 shrink-0 text-brand" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[13px] text-muted-foreground">Notas, tareas, rutinas y foco en un solo sitio.</p>
      </aside>

      <main className="flex flex-col p-4 sm:p-8">
        <div>
          <Button variant="ghost" className="-ml-2 text-muted-foreground" onClick={() => goToAuthRoute('landing')}>
            <CaretLeftIcon />
            Volver
          </Button>
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center pb-12">
          <h1 className="text-3xl font-bold tracking-tight">{isRegister ? 'Crea tu cuenta' : 'Inicia sesión'}</h1>
          <p className="mb-6 mt-2 text-sm text-muted-foreground">
            {isRegister ? 'Guarda tus notas, tareas y rutinas, y llévalas a cualquier dispositivo.' : 'Entra para seguir con tu día.'}
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={ids.email} className="text-sm font-medium">
                Email
              </label>
              <Input
                id={ids.email}
                type="email"
                placeholder="tu@email.com"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor={ids.password} className="text-sm font-medium">
                  Contraseña
                </label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={resetPassword}
                    disabled={isLoading}
                    className="rounded-sm text-[13px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </div>
              <div className="relative">
                <Input
                  id={ids.password}
                  className="pr-11"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  aria-describedby={isRegister ? ids.hint : undefined}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <IconButton
                  label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  size="icon-xs"
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </IconButton>
              </div>
              {isRegister && (
                <p id={ids.hint} className="text-[13px] text-muted-foreground">
                  Mínimo 6 caracteres.
                </p>
              )}
            </div>

            <div aria-live="polite">
              {error && (
                <p role="alert" className="text-[13px] text-destructive">
                  {error}
                </p>
              )}
              {info && (
                <p role="status" className="text-[13px]">
                  {info}
                </p>
              )}
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (isRegister ? 'Creando cuenta…' : 'Entrando…') : isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-2.5 text-xs text-muted-foreground">
            <Separator className="flex-1" />o<Separator className="flex-1" />
          </div>

          <Button variant="outline" size="lg" className="w-full" onClick={() => run(() => signInWithPopup(auth, googleProvider))} disabled={isLoading}>
            <GoogleLogoIcon weight="bold" />
            Continuar con Google
          </Button>

          <p className="mt-6 text-center text-[13px] text-muted-foreground">
            {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
            <button
              type="button"
              onClick={switchMode}
              className="rounded-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {isRegister ? 'Inicia sesión' : 'Crea una'}
            </button>
          </p>
        </div>
      </main>
    </div>
  )
}
