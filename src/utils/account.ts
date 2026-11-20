import {
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { collection, deleteDoc, doc, getDocs, writeBatch } from 'firebase/firestore'
import { db } from '../db'
import { googleProvider } from '../firebase'

const SUBCOLLECTIONS = ['notes', 'folders', 'tasks', 'routines', 'routineLogs']

// Un lote de Firestore admite 500 operaciones
async function deleteCollection(uid: string, name: string) {
  const snapshot = await getDocs(collection(db, 'users', uid, name))
  for (let start = 0; start < snapshot.docs.length; start += 400) {
    const batch = writeBatch(db)
    snapshot.docs.slice(start, start + 400).forEach((item) => batch.delete(item.ref))
    await batch.commit()
  }
}

export const hasPasswordLogin = (user: User) => user.providerData.some((provider) => provider.providerId === 'password')

// Borra la cuenta y todos sus datos. Primero se confirma la identidad (Firebase lo exige para
// borrar una cuenta) y solo después se borran los datos, para no dejar la cuenta a medias.
export async function deleteAccount(user: User, password?: string) {
  if (hasPasswordLogin(user) && user.email) {
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password ?? ''))
  } else {
    await reauthenticateWithPopup(user, googleProvider)
  }

  for (const name of SUBCOLLECTIONS) await deleteCollection(user.uid, name)
  await deleteDoc(doc(db, 'users', user.uid))
  await deleteUser(user)
}

export function accountErrorMessage(error: unknown) {
  const code = (error as { code?: string })?.code
  if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') return 'La contraseña no es correcta.'
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return 'Cancelaste la confirmación.'
  if (code === 'auth/too-many-requests') return 'Demasiados intentos. Prueba de nuevo en unos minutos.'
  return 'No se pudo eliminar la cuenta. Inténtalo de nuevo.'
}
