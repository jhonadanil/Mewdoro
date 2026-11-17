import { useState } from 'react'
import { ChevronLeft, ChevronRight, Pin, PinOff } from 'lucide-react'
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
    <section className="page page--compact">
      <div className="page__header">
        <h2 className="page__title calendar__month">{formatMonth(viewDate)}</h2>

        <div className="calendar__nav">
          <button type="button" className="icon-btn" onClick={() => changeMonth(-1)} aria-label="Mes anterior">
            <ChevronLeft size={18} />
          </button>
          <button type="button" className="btn" onClick={() => setViewDate(getMonthStart(new Date()))}>
            Hoy
          </button>
          <button type="button" className="icon-btn" onClick={() => changeMonth(1)} aria-label="Mes siguiente">
            <ChevronRight size={18} />
          </button>
          <button type="button" className="btn" onClick={onTogglePin}>
            {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
            {isPinned ? 'Quitar de inicio' : 'Fijar en inicio'}
          </button>
        </div>
      </div>

      <div className="calendar">
        {WEEK_DAYS.map((day) => (
          <span key={day} className="calendar__weekday">
            {day}
          </span>
        ))}

        {cells.map((day, index) => {
          if (day === null) return <div key={`empty-${index}`} className="calendar__cell calendar__cell--empty" />

          const key = toDateKey(new Date(year, month, day))

          return (
            <div key={key} className="calendar__cell">
              <span className={`calendar__day ${key === todayKey ? 'calendar__day--today' : ''}`}>{day}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
