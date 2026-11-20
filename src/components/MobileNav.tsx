import { useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from 'firebase/auth'
import { Dialog } from 'radix-ui'
import {
  CalendarDotsIcon,
  DotsThreeIcon,
  GearSixIcon,
  HouseIcon,
  ListChecksIcon,
  NotebookIcon,
  RepeatIcon,
  TimerIcon,
  UserCircleIcon,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { Page } from '../types'

interface MobileNavProps {
  page: Page
  user: User
  onNavigate: (page: Page) => void
}

// Las cuatro secciones de siempre van abajo; el resto, en la hoja de "Más"
const TABS = [
  { page: 'home', label: 'Hoy', Icon: HouseIcon },
  { page: 'notes', label: 'Notas', Icon: NotebookIcon },
  { page: 'pomodoro', label: 'Pomodoro', Icon: TimerIcon },
] as const

const MORE = [
  { page: 'tasks', label: 'Tareas flash', Icon: ListChecksIcon },
  { page: 'routines', label: 'Rutinas', Icon: RepeatIcon },
  { page: 'calendar', label: 'Calendario', Icon: CalendarDotsIcon },
  { page: 'profile', label: 'Perfil y rachas', Icon: UserCircleIcon },
  { page: 'settings', label: 'Ajustes', Icon: GearSixIcon },
] as const

function Tab({ active, label, icon, onClick }: { active: boolean; label: string; icon: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 [&_svg]:size-6',
        active ? 'font-medium text-foreground' : 'text-muted-foreground',
      )}
    >
      {icon}
      {label}
    </button>
  )
}

// Barra de navegación inferior del móvil: pocas opciones, al alcance del pulgar
export default function MobileNav({ page, user, onNavigate }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const inMore = MORE.some((item) => item.page === page)

  const go = (next: Page) => {
    setOpen(false)
    onNavigate(next)
  }

  return (
    <>
      <nav
        aria-label="Navegación principal"
        className="fixed inset-x-0 bottom-0 z-30 flex border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        {TABS.map(({ page: tabPage, label, Icon }) => (
          <Tab key={tabPage} active={page === tabPage} label={label} icon={<Icon weight={page === tabPage ? 'fill' : 'regular'} />} onClick={() => go(tabPage)} />
        ))}
        <Tab active={inMore} label="Más" icon={<DotsThreeIcon weight={inMore ? 'fill' : 'bold'} />} onClick={() => setOpen(true)} />
      </nav>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 md:hidden" />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t bg-popover px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 text-popover-foreground outline-none data-open:animate-in data-open:slide-in-from-bottom data-closed:animate-out data-closed:slide-out-to-bottom md:hidden"
          >
            <span aria-hidden="true" className="mx-auto mb-3 block h-1 w-10 rounded-full bg-muted-foreground/30" />
            <Dialog.Title className="sr-only">Más secciones</Dialog.Title>
            <p className="mb-2 truncate px-3 text-xs text-muted-foreground">{user.displayName || user.email}</p>
            <ul className="flex flex-col">
              {MORE.map(({ page: itemPage, label, Icon }) => (
                <li key={itemPage}>
                  <button
                    type="button"
                    onClick={() => go(itemPage)}
                    aria-current={page === itemPage ? 'page' : undefined}
                    className={cn(
                      'flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-base focus-visible:outline-2 focus-visible:-outline-offset-2 [&_svg]:size-6',
                      page === itemPage ? 'bg-muted font-medium' : 'active:bg-muted/60',
                    )}
                  >
                    <Icon weight={page === itemPage ? 'fill' : 'regular'} className="text-muted-foreground" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
