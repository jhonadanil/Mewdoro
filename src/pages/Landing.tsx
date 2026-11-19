import { lazy, Suspense, useState } from 'react'
import { MoonIcon, SunIcon } from '@phosphor-icons/react'
import { IconButton } from '@/components/IconButton'
import { Button } from '@/components/ui/button'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import DemoCockpit from '../components/landing/DemoCockpit'
import DemoWeek from '../components/landing/DemoWeek'
import { useDemoRoutines } from '../components/landing/demoData'
import { goToAuthRoute } from '../hooks/useAuthRoute'
import type { Theme } from '../types'
import { applyTheme, getSavedTheme } from '../utils/theme'

// El editor (Prism) se descarga aparte: no hace falta para el primer vistazo
const DemoCode = lazy(() => import('../components/landing/DemoCode'))

const SECTION = 'mx-auto w-full max-w-[960px] px-6 sm:px-12'

// Texto a un lado y un fragmento del producto, vivo, al otro
function Feature({ title, children, demo, reverse = false, stack = false }: { title: string; children: string; demo: React.ReactNode; reverse?: boolean; stack?: boolean }) {
  if (stack) {
    // Fragmentos anchos (la tabla de la semana): el texto arriba y el producto a todo el ancho debajo
    return (
      <section className={`${SECTION} py-14`}>
        <h2 className="text-2xl font-bold tracking-tight text-balance">{title}</h2>
        <p className="mb-8 mt-3 max-w-xl leading-relaxed text-muted-foreground">{children}</p>
        {demo}
      </section>
    )
  }
  return (
    <section className={`${SECTION} grid grid-cols-[minmax(0,1fr)] items-center gap-8 py-14 md:grid-cols-2 md:gap-12`}>
      <div className={reverse ? 'md:order-2' : undefined}>
        <h2 className="text-2xl font-bold tracking-tight text-balance">{title}</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">{children}</p>
      </div>
      <div className={reverse ? 'md:order-1' : undefined}>{demo}</div>
    </section>
  )
}

export default function Landing() {
  const [theme, setTheme] = useState<Theme>(getSavedTheme)
  const demo = useDemoRoutines()

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
  }

  return (
    <div className="min-h-screen">
      <header className={`${SECTION} flex items-center justify-between py-4`}>
        <a href="#" className="flex items-center gap-2.5 rounded-full text-lg font-bold focus-visible:outline-2 focus-visible:outline-offset-4">
          <img src="/favicon.svg" alt="" width={28} height={28} />
          Mewdoro
        </a>
        <nav aria-label="Cuenta" className="flex items-center gap-1.5">
          <IconButton label={theme === 'dark' ? 'Tema claro' : 'Tema oscuro'} onClick={toggleTheme}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </IconButton>
          <Button variant="ghost" onClick={() => goToAuthRoute('login')}>
            Entrar
          </Button>
          <Button onClick={() => goToAuthRoute('register')}>Crear cuenta</Button>
        </nav>
      </header>

      <main>
        {/* El primer vistazo: el titular, la acción y Inicio funcionando */}
        <section className={`${SECTION} pb-14 pt-10 sm:pt-16`}>
          <h1 className="max-w-[16ch] text-4xl font-bold leading-[1.1] tracking-tight text-balance sm:text-6xl">Tu día entero, en una sola pantalla.</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Notas con código, tareas flash, rutinas, calendario y Pomodoro, juntos. Para estudiar y programar sin saltar de una app a otra.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            <Button size="lg" onClick={() => goToAuthRoute('register')}>
              Crear cuenta
            </Button>
            <Button size="lg" variant="outline" onClick={() => goToAuthRoute('login')}>
              Ya tengo cuenta
            </Button>
          </div>

          <div className="mt-12">
            <p className="mb-3 text-[13px] text-muted-foreground">Demo con datos de ejemplo. Pruébala: nada se guarda.</p>
            <DemoCockpit routines={demo.routines} logs={demo.logs} onToggle={demo.toggle} />
          </div>
        </section>

        <Feature
          title="Notas que también son código"
          demo={
            <Suspense fallback={<div className="h-[150px] rounded-md border bg-(--code-bg)" aria-hidden="true" />}>
              <DemoCode />
            </Suspense>
          }
        >
          Cada nota puede ser Python, Bash, SQL, TypeScript, Markdown y más, con los colores de VS Code, corchetes por nivel, cierre automático, Tab para indentar y Ctrl + / para comentar. Escribe en el ejemplo: es el editor de verdad.
        </Feature>

        <Feature
          stack
          title="Rutinas que se ven crecer"
          demo={<DemoWeek routines={demo.routines} logs={demo.logs} onToggle={demo.toggle} />}
        >
          Elige qué días toca cada hábito y marca cada día lo que cumples. Mira la semana o el mes, la racha (que perdona un día fallado por semana) y el porcentaje de los últimos 30 días. Marca una rutina arriba y la semana se actualiza.
        </Feature>

        <section className={`${SECTION} py-14`}>
          <h2 className="max-w-[24ch] text-2xl font-bold tracking-tight text-balance">Pensado para no despegar las manos del teclado</h2>
          <ul className="mt-6 grid gap-x-12 gap-y-4 text-sm sm:grid-cols-2">
            <li className="flex items-center justify-between gap-4 border-b pb-3">
              <span>Ir a Inicio, Notas, Tareas, Calendario…</span>
              <KbdGroup>
                <Kbd>Alt</Kbd>
                <Kbd>1…7</Kbd>
              </KbdGroup>
            </li>
            <li className="flex items-center justify-between gap-4 border-b pb-3">
              <span>Buscar en todas tus notas</span>
              <KbdGroup>
                <Kbd>Ctrl</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </li>
            <li className="flex items-center justify-between gap-4 border-b pb-3">
              <span>Marcar la siguiente rutina de hoy</span>
              <KbdGroup>
                <Kbd>Alt</Kbd>
                <Kbd>R</Kbd>
              </KbdGroup>
            </li>
            <li className="flex items-center justify-between gap-4 border-b pb-3">
              <span>Iniciar o pausar el Pomodoro</span>
              <KbdGroup>
                <Kbd>Alt</Kbd>
                <Kbd>P</Kbd>
              </KbdGroup>
            </li>
          </ul>
          <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
            Tus notas, tareas y rutinas se guardan en tu cuenta y funcionan sin conexión. Tema claro y oscuro, y una barra lateral que se esconde con Ctrl + .
          </p>
        </section>

        <section className={`${SECTION} py-16`}>
          <div className="rounded-2xl border p-8 sm:p-12">
            <h2 className="max-w-[20ch] text-3xl font-bold tracking-tight text-balance">Empieza tu día en Mewdoro</h2>
            <p className="mt-3 max-w-md text-muted-foreground">Crea una cuenta con tu email o con Google y fija en Inicio lo que usas cada día.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button size="lg" onClick={() => goToAuthRoute('register')}>
                Crear cuenta
              </Button>
              <Button size="lg" variant="outline" onClick={() => goToAuthRoute('login')}>
                Ya tengo cuenta
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className={SECTION}>
        <p className="border-t py-6 text-[13px] text-muted-foreground">Mewdoro</p>
      </footer>
    </div>
  )
}
