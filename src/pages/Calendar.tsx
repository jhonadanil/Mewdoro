import { useState } from 'react'
import { CaretLeftIcon, CaretRightIcon, PushPinIcon, PushPinSlashIcon } from '@phosphor-icons/react'
import { IconButton } from '@/components/IconButton'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Page, PageHeader, PageTitle } from '../components/Page'
import { WEEK_DAYS, WEEK_DAYS_LONG, formatMonth, getMonthCells, getMonthStart } from '../utils/calendar'
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
  const today = new Date()
  const todayKey = toDateKey(today)
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth()

  // Se completa la última semana con huecos para que la cuadrícula cierre en un rectángulo
  const cells = getMonthCells(viewDate)
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks = Array.from({ length: cells.length / 7 }, (_, index) => cells.slice(index * 7, index * 7 + 7))

  const changeMonth = (delta: number) => setViewDate(new Date(year, month + delta, 1))

  return (
    <Page narrow>
      <PageHeader
        actions={
          <>
            <IconButton label="Mes anterior" onClick={() => changeMonth(-1)}>
              <CaretLeftIcon />
            </IconButton>
            <Button variant="outline" disabled={isCurrentMonth} onClick={() => setViewDate(getMonthStart(new Date()))}>
              Hoy
            </Button>
            <IconButton label="Mes siguiente" onClick={() => changeMonth(1)}>
              <CaretRightIcon />
            </IconButton>
            <Button variant="outline" onClick={onTogglePin}>
              {isPinned ? <PushPinSlashIcon /> : <PushPinIcon />}
              {isPinned ? 'Quitar de inicio' : 'Fijar en inicio'}
            </Button>
          </>
        }
      >
        {/* aria-live: al cambiar de mes, el lector de pantalla anuncia el nuevo */}
        <PageTitle className="first-letter:uppercase">
          <span aria-live="polite">{formatMonth(viewDate)}</span>
        </PageTitle>
      </PageHeader>

      <div className="mt-6 overflow-hidden rounded-lg border">
        <table className="w-full table-fixed border-collapse">
          <caption className="sr-only">{formatMonth(viewDate)}</caption>
          <thead>
            <tr>
              {WEEK_DAYS.map((day, index) => (
                <th
                  key={day}
                  scope="col"
                  abbr={WEEK_DAYS_LONG[index]}
                  className="border-b border-r p-2 text-right text-xs font-normal text-muted-foreground last:border-r-0"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, weekIndex) => (
              <tr key={weekIndex} className="[&:last-child>td]:border-b-0">
                {week.map((day, dayIndex) => {
                  if (day === null) {
                    return <td key={`empty-${dayIndex}`} className="h-[72px] border-b border-r bg-muted/50 last:border-r-0" />
                  }

                  const key = toDateKey(new Date(year, month, day))
                  const isToday = key === todayKey

                  return (
                    <td
                      key={key}
                      aria-current={isToday ? 'date' : undefined}
                      className="h-[72px] border-b border-r p-1.5 align-top last:border-r-0"
                    >
                      <span
                        className={cn(
                          'float-right min-w-6 rounded-full px-1.5 py-0.5 text-center text-[13px] tabular-nums text-muted-foreground',
                          isToday && 'bg-primary font-bold text-primary-foreground'
                        )}
                      >
                        {day}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  )
}
