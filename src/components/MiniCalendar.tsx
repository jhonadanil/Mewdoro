import { useState } from 'react'
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import { IconButton } from '@/components/IconButton'
import { MiniCard } from '@/components/MiniCard'
import { cn } from '@/lib/utils'
import { WEEK_DAYS_LONG, WEEK_DAYS_SHORT, formatMonth, getMonthCells, getMonthStart } from '../utils/calendar'
import { toDateKey } from '../utils/notes'

interface MiniCalendarProps {
  onOpen: () => void
  onUnpin: () => void
}

// Versión pequeña del calendario para fijarla en Inicio
export default function MiniCalendar({ onOpen, onUnpin }: MiniCalendarProps) {
  const [viewDate, setViewDate] = useState(() => getMonthStart(new Date()))

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const todayKey = toDateKey(new Date())

  const changeMonth = (delta: number) => setViewDate(new Date(year, month + delta, 1))
  const today = new Date()
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth()

  return (
    <MiniCard label="Calendario" onOpen={onOpen} openLabel="Abrir Calendario" onUnpin={onUnpin}>
      <div className="flex items-center justify-between">
        {/* El chip ya abre la página con el teclado; el mes es un atajo extra para el ratón */}
        <button
          type="button"
          onClick={onOpen}
          tabIndex={-1}
          className="whitespace-nowrap text-sm font-semibold first-letter:uppercase"
        >
          {formatMonth(viewDate, true)}
        </button>
        <div className="flex items-center">
          {/* Volver al mes actual tras pasar meses */}
          {!isCurrentMonth && (
            <button
              type="button"
              onClick={() => setViewDate(getMonthStart(new Date()))}
              className="mr-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Hoy
            </button>
          )}
          <IconButton label="Mes anterior" size="icon-xs" onClick={() => changeMonth(-1)}>
            <CaretLeftIcon />
          </IconButton>
          <IconButton label="Mes siguiente" size="icon-xs" onClick={() => changeMonth(1)}>
            <CaretRightIcon />
          </IconButton>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center">
        {/* Letra a la vista; el lector de pantalla oye el nombre completo del día */}
        {WEEK_DAYS_SHORT.map((day, index) => (
          <span key={index} className="py-0.5 text-xs text-muted-foreground">
            <span aria-hidden="true">{day}</span>
            <span className="sr-only">{WEEK_DAYS_LONG[index]}</span>
          </span>
        ))}

        {getMonthCells(viewDate).map((day, index) => {
          if (day === null) return <span key={`empty-${index}`} />

          const key = toDateKey(new Date(year, month, day))
          return (
            <span
              key={key}
              className={cn(
                'rounded py-[3px] text-xs text-muted-foreground',
                key === todayKey && 'bg-primary font-bold text-primary-foreground'
              )}
            >
              {day}
              {key === todayKey && <span className="sr-only"> (hoy)</span>}
            </span>
          )
        })}
      </div>
    </MiniCard>
  )
}
