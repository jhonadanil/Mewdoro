import { useState } from 'react'
import { ChevronLeft, ChevronRight, Pin, PinOff } from 'lucide-react'
import { IconButton } from '@/components/IconButton'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Page, PageHeader, PageTitle } from '../components/Page'
import { WEEK_DAYS, formatMonth, getMonthCells, getMonthStart } from '../utils/calendar'
import { toDateKey } from '../utils/notes'

interface CalendarProps {
  isPinned: boolean
  onTogglePin: () => void
}

// Calendario mensual
export default function Calendar({ isPinned, onTogglePin }: CalendarProps) {
  const [viewDate, setViewDate] = useState(() => getMonthStart(new Date()))

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const todayKey = toDateKey(new Date())
  const cells = getMonthCells(viewDate)

  const changeMonth = (delta: number) => setViewDate(new Date(year, month + delta, 1))

  return (
    <Page narrow>
      <PageHeader
        actions={
          <>
            <IconButton label="Mes anterior" onClick={() => changeMonth(-1)}>
              <ChevronLeft />
            </IconButton>
            <Button variant="outline" onClick={() => setViewDate(getMonthStart(new Date()))}>
              Hoy
            </Button>
            <IconButton label="Mes siguiente" onClick={() => changeMonth(1)}>
              <ChevronRight />
            </IconButton>
            <Button variant="outline" onClick={onTogglePin}>
              {isPinned ? <PinOff /> : <Pin />}
              {isPinned ? 'Quitar de inicio' : 'Fijar en inicio'}
            </Button>
          </>
        }
      >
        <PageTitle className="first-letter:uppercase">{formatMonth(viewDate)}</PageTitle>
      </PageHeader>

      <div className="mt-6 grid grid-cols-7 border-l border-t">
        {WEEK_DAYS.map((day) => (
          <span key={day} className="border-b border-r p-2 text-right text-xs text-muted-foreground">
            {day}
          </span>
        ))}

        {cells.map((day, index) => {
          if (day === null) return <div key={`empty-${index}`} className="min-h-[72px] border-b border-r bg-muted/50" />

          const key = toDateKey(new Date(year, month, day))

          return (
            <div key={key} className="flex min-h-[72px] flex-col border-b border-r p-1.5">
              <span
                className={cn(
                  'min-w-6 self-end rounded-full px-1.5 py-0.5 text-center text-[13px] text-muted-foreground',
                  key === todayKey && 'bg-primary font-bold text-primary-foreground'
                )}
              >
                {day}
              </span>
            </div>
          )
        })}
      </div>
    </Page>
  )
}
