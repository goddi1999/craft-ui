export type BarrelTimePeriod = 'AM' | 'PM'

export type BarrelTimeValue = {
  /** 1–12 */
  hours: number
  /** 0–59 */
  minutes: number
  period: BarrelTimePeriod
}

/** Faces on each barrel — every column shares one ring geometry. */
export const TOTAL = 60
/** Height of one row in the visor, in px. */
export const LINE = 34
/** Perspective applied to each column, in px. */
export const PERSPECTIVE = 60
/** Gap between the front face and the visor plane, in px. */
export const FRONT_OFFSET = 4

export const STEP_DEG = 360 / TOTAL
const STEP_RAD = (STEP_DEG * Math.PI) / 180
export const RADIUS = LINE / Math.sin(STEP_RAD)

export const PERIODS: readonly BarrelTimePeriod[] = ['AM', 'PM']

export const mod = (n: number, m: number) => ((n % m) + m) % m
export const pad2 = (n: number) => String(n).padStart(2, '0')

export const hourFromIndex = (index: number) => mod(index, 12) || 12
export const minuteFromIndex = (index: number) => mod(index, TOTAL)
export const periodFromIndex = (index: number): BarrelTimePeriod =>
  index >= 1 ? 'PM' : 'AM'
export const periodIndex = (period: BarrelTimePeriod) => (period === 'PM' ? 1 : 0)

/** The index closest to `from` that lands on `base` modulo `cycle`. */
export function nearestIndex(from: number, base: number, cycle: number) {
  const anchor = Math.round(from)
  const offset = mod(base - anchor, cycle)
  return offset > cycle / 2 ? anchor + offset - cycle : anchor + offset
}

/** Labels for an infinite barrel: one per face plus a wrap-around duplicate. */
export function ringLabels(format: (index: number) => string) {
  return Array.from({ length: TOTAL + 1 }, (_, index) => format(index))
}

export const HOUR_LABELS = ringLabels((index) => pad2(hourFromIndex(index)))
export const MINUTE_LABELS = ringLabels((index) => pad2(minuteFromIndex(index)))

/** Vertical screen offset of the face `steps` rows away from the visor. */
function projectedOffset(steps: number) {
  const angle = steps * STEP_RAD
  const depth = FRONT_OFFSET + RADIUS * (1 - Math.cos(angle))
  return (RADIUS * Math.sin(angle) * PERSPECTIVE) / (PERSPECTIVE + depth)
}

const TAP_STEPS = Array.from({ length: 11 }, (_, index) => index - 5)

/** Which row (relative to the visor) a tap at `offset` px landed on. */
export function stepsFromOffset(offset: number) {
  let best = 0
  let bestDistance = Infinity
  for (const steps of TAP_STEPS) {
    const distance = Math.abs(projectedOffset(steps) - offset)
    if (distance < bestDistance) {
      best = steps
      bestDistance = distance
    }
  }
  return best
}

export const isSameTime = (a: BarrelTimeValue, b: BarrelTimeValue) =>
  a.hours === b.hours && a.minutes === b.minutes && a.period === b.period

/** `HH:MM` in 24-hour time, the format native time inputs submit. */
export function toTimeString({ hours, minutes, period }: BarrelTimeValue) {
  const hour24 = (hours % 12) + (period === 'PM' ? 12 : 0)
  return `${pad2(hour24)}:${pad2(minutes)}`
}
