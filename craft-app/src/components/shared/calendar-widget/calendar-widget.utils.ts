import type { CalendarDay } from './calendar-widget.types'

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const

const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat(undefined, {
  month: 'long',
  year: 'numeric',
})

/**
 * `YYYY-MM-DD` in the viewer's own timezone. `toISOString()` would report the
 * UTC day, which lands on the wrong date west of Greenwich.
 */
export function formatDateKey(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const dayOfMonth = `${date.getDate()}`.padStart(2, '0')
  return `${date.getFullYear()}-${month}-${dayOfMonth}`
}

/** Parses `YYYY-MM-DD` as a local date rather than a UTC instant. */
export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function buildCalendarDays(
  startDate: string,
  dayCount: number,
): CalendarDay[] {
  const start = parseDateKey(startDate)

  return Array.from({ length: dayCount }, (_, offset) => {
    const date = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + offset,
    )

    return {
      key: formatDateKey(date),
      dayOfMonth: date.getDate(),
      weekdayLabel: WEEKDAY_LABELS[date.getDay()],
      monthLabel: MONTH_LABEL_FORMATTER.format(date),
    }
  })
}
