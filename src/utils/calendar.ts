export const WEEK_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
export const WEEK_DAYS_SHORT = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
// Nombres completos para lectores de pantalla
export const WEEK_DAYS_LONG = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']

export function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

// "noviembre de 2026", o "noviembre 2026" en formato corto
export function formatMonth(date: Date, short = false) {
  if (short) return `${date.toLocaleDateString('es', { month: 'long' })} ${date.getFullYear()}`
  return date.toLocaleDateString('es', { month: 'long', year: 'numeric' })
}

// Días del mes con huecos al principio; la semana empieza en lunes
export function getMonthCells(viewDate: Date) {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const offset = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  return [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]
}
