import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider, getAuth } from 'firebase/auth'

// Los valores salen de .env.local (ver .env.example)
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId && config.appId)

// Sin configuración se usa un valor de relleno para que la app pueda mostrar el aviso
export const app = initializeApp(isFirebaseConfigured ? config : { apiKey: 'missing', projectId: 'missing', appId: 'missing' })

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// Firestore vive en db.ts: solo lo carga la app con sesión iniciada, no la pantalla de login
