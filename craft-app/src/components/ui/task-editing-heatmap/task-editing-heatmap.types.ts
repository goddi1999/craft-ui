/** One weekday column: edit counts keyed by hour of day (0–23). Missing hours count as zero. */
export type EditingHeatmapDay = {
  /** Column label, e.g. `Mon`. */
  label: string
  /** Edits per hour, e.g. `{ 19: 14, 20: 16 }`. */
  edits: Partial<Record<number, number>>
}

export type EditingHeatmapCell = {
  day: string
  hour: number
  value: number
}
