import type { ActivityDay, HourRun } from './task-activity-timeline.types'

export const HOURS = Array.from({ length: 24 }, (_, hour) => hour)
export const AXIS_TICKS = [0, 6, 12, 18, 24]

/** How much of the heat colour each level mixes into the muted base. Level 0 is the base itself. */
const LEVEL_MIX = [0, 22, 40, 58, 78, 100] as const
export const LEVEL_COUNT = LEVEL_MIX.length - 1

export const formatHour = (hour: number) =>
  `${String(hour).padStart(2, '0')}:00`

export function toLevel(value: number, max: number) {
  if (value <= 0 || max <= 0) return 0
  return Math.min(LEVEL_COUNT, Math.ceil((value / max) * LEVEL_COUNT))
}

/** Mixes against `--muted`, so the ramp reads light→dark in light mode and dim→bright in dark mode. */
export function levelColor(level: number) {
  if (level === 0) return 'var(--muted)'
  return `color-mix(in oklab, var(--heat) ${LEVEL_MIX[level]}%, var(--muted))`
}

/** Number of groups active in a given day and hour. */
export function countActive(day: ActivityDay, hour: number) {
  return Object.values(day.sessions).filter((hours) => hours?.includes(hour))
    .length
}

/** Collapse hours like [19, 20, 21, 23] into runs [19–22), [23–24). */
export function toRuns(hours: number[]): HourRun[] {
  const sorted = [...new Set(hours)].sort((a, b) => a - b)
  return sorted.reduce<HourRun[]>((runs, hour) => {
    const last = runs.at(-1)
    if (last && last.end === hour) {
      last.end = hour + 1
      return runs
    }
    runs.push({ start: hour, end: hour + 1 })
    return runs
  }, [])
}

export const formatRun = (run: HourRun) =>
  `${formatHour(run.start)}–${formatHour(run.end)}`
