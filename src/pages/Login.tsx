import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
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
    <div className="login">
      <div className="login__card">
        <h1 className="login__brand">
          <img src="/favicon.svg" alt="" width={36} height={36} />
          SnapNote
        </h1>
        <p className="login__subtitle">
          {isRegister ? 'Crea una cuenta para guardar tus notas y ajustes.' : 'Inicia sesión para ver tus notas.'}
        </p>

        <form className="login__form" onSubmit={handleSubmit}>
          <input
            className="input"
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Contraseña"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <p className="login__error">{error}</p>}
          {info && <p className="login__info">{info}</p>}

          <button type="submit" className="btn btn--primary btn--block" disabled={isLoading}>
            {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
          </button>
        </form>

        {!isRegister && (
          <button type="button" className="login__link" onClick={resetPassword} disabled={isLoading}>
            ¿Olvidaste tu contraseña?
          </button>
        )}

        <div className="login__divider">o</div>

        <button
          type="button"
          className="btn btn--block"
          onClick={() => run(() => signInWithPopup(auth, googleProvider))}
          disabled={isLoading}
        >
          Continuar con Google
        </button>

        <p className="login__switch">
          {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
          <button
            type="button"
            className="login__link"
            onClick={() => {
              setMode(isRegister ? 'login' : 'register')
              setError('')
              setInfo('')
            }}
          >
            {isRegister ? 'Inicia sesión' : 'Crea una'}
          </button>
        </p>
      </div>
    </div>
  )
}
