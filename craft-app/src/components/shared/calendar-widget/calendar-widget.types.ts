export type CalendarEvent = {
  title: string
  time: string
}

/** Events keyed by local date, `YYYY-MM-DD`. */
export type CalendarEventMap = Record<string, CalendarEvent[]>

export type CalendarWidgetSize = 'sm' | 'default'

export type CalendarWidgetProps = {
  events: CalendarEventMap
  /** First day of the strip, `YYYY-MM-DD`. */
  startDate: string
  /** How many days the strip holds. */
  dayCount?: number
  /** Initially selected day, `YYYY-MM-DD`. Falls back to `startDate`. */
  defaultSelectedDate?: string
  size?: CalendarWidgetSize
  onSelectDate?: (date: string) => void
  className?: string
}

export type CalendarDay = {
  /** Local date key, `YYYY-MM-DD`. */
  key: string
  dayOfMonth: number
  weekdayLabel: string
  monthLabel: string
}
