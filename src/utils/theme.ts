import type { Theme } from '../types'

// El tema también se guarda en el navegador para aplicarlo antes de cargar la cuenta
export function getSavedTheme(): Theme {
  try {
    return localStorage.getItem('theme') === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

// shadcn/ui activa el modo oscuro con la clase "dark" en <html>
export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  try {
    localStorage.setItem('theme', theme)
  } catch {
    // Sin acceso a localStorage el tema se aplica igual
  }
}
