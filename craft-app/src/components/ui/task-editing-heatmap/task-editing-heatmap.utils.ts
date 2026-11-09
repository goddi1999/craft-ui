import type {
  EditingHeatmapCell,
  EditingHeatmapDay,
} from './task-editing-heatmap.types'

export const HOURS = Array.from({ length: 24 }, (_, hour) => hour)

/** How much of the heat colour each level mixes into the muted base. Level 0 is the base itself. */
const LEVEL_MIX = [0, 28, 50, 74, 100] as const
export const LEVEL_COUNT = LEVEL_MIX.length - 1

export const formatHour = (hour: number) =>
  `${String(hour).padStart(2, '0')}:00`

/** Quantise a value into 0…LEVEL_COUNT, so the legend and the cells share the same steps. */
export function toLevel(value: number, max: number) {
  if (value <= 0 || max <= 0) return 0
  return Math.min(LEVEL_COUNT, Math.ceil((value / max) * LEVEL_COUNT))
}

/** Mixes against `--muted`, so the ramp reads light→dark in light mode and dim→bright in dark mode. */
export function levelColor(level: number) {
  if (level === 0) return 'var(--muted)'
  return `color-mix(in oklab, var(--heat) ${LEVEL_MIX[level]}%, var(--muted))`
}

export function toCells(days: EditingHeatmapDay[]): EditingHeatmapCell[] {
  return days.flatMap((day) =>
    HOURS.map((hour) => ({
      day: day.label,
      hour,
      value: day.edits[hour] ?? 0,
    })),
  )
}

export function findPeak(cells: EditingHeatmapCell[]) {
  return cells.reduce<EditingHeatmapCell | null>(
    (peak, cell) => (cell.value > (peak?.value ?? 0) ? cell : peak),
    null,
  )
}
