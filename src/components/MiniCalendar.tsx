import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IconButton } from '@/components/IconButton'
import { MiniCard } from '@/components/MiniCard'
import { cn } from '@/lib/utils'
import { WEEK_DAYS_SHORT, formatMonth, getMonthCells, getMonthStart } from '../utils/calendar'
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

  return (
    <MiniCard label="Calendario" onUnpin={onUnpin}>
      <div className="flex items-center justify-between">
        <button type="button" onClick={onOpen} className="whitespace-nowrap text-sm font-semibold first-letter:uppercase">
          {formatMonth(viewDate, true)}
        </button>
        <div className="flex">
          <IconButton label="Mes anterior" size="icon-xs" onClick={() => changeMonth(-1)}>
            <ChevronLeft />
          </IconButton>
          <IconButton label="Mes siguiente" size="icon-xs" onClick={() => changeMonth(1)}>
            <ChevronRight />
          </IconButton>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center">
        {WEEK_DAYS_SHORT.map((day, index) => (
          <span key={index} className="py-0.5 text-xs text-muted-foreground">
            {day}
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
            </span>
          )
        })}
      </div>
    </MiniCard>
  )
}
