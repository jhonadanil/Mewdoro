import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TooltipProvider } from '@/components/ui/tooltip'
import { applyTheme, getSavedTheme } from './utils/theme'

// Aplica el último tema usado antes de pintar nada, también en la pantalla de login
applyTheme(getSavedTheme())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider delayDuration={400}>
      <App />
    </TooltipProvider>
  </StrictMode>,
)
