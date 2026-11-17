import type { Theme } from '../types'

// El tema también se guarda en el navegador para aplicarlo antes de cargar la cuenta
export function getSavedTheme(): Theme {
  try {
    return localStorage.getItem('theme') === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  try {
    localStorage.setItem('theme', theme)
  } catch {
    // Sin acceso a localStorage el tema se aplica igual
  }
}
