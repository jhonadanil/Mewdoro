import { useState } from 'react'
import { ChevronLeft, ChevronRight, PinOff } from 'lucide-react'
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
    <article className="mini-card">
      <div className="mini-card__header">
        <span className="note-tag">Calendario</span>
        <button
          type="button"
          className="icon-btn"
          onClick={onUnpin}
          aria-label="Quitar de inicio"
          title="Quitar de inicio"
        >
          <PinOff size={15} />
        </button>
      </div>

      <div className="mini-calendar__header">
        <button type="button" className="mini-calendar__month" onClick={onOpen}>
          {formatMonth(viewDate, true)}
        </button>
        <div className="calendar__nav">
          <button type="button" className="icon-btn" onClick={() => changeMonth(-1)} aria-label="Mes anterior">
            <ChevronLeft size={15} />
          </button>
          <button type="button" className="icon-btn" onClick={() => changeMonth(1)} aria-label="Mes siguiente">
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="mini-calendar__grid">
        {WEEK_DAYS_SHORT.map((day, index) => (
          <span key={index} className="mini-calendar__weekday">
            {day}
          </span>
        ))}

        {getMonthCells(viewDate).map((day, index) => {
          if (day === null) return <span key={`empty-${index}`} />

          const key = toDateKey(new Date(year, month, day))
          return (
            <span key={key} className={`mini-calendar__day ${key === todayKey ? 'mini-calendar__day--today' : ''}`}>
              {day}
            </span>
          )
        })}
      </div>
    </article>
  )
}
