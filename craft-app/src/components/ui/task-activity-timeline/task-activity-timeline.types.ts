/** A group that can appear in the timeline. */
export type ActivityGroup = {
  /** Stable id referenced by `ActivityDay.sessions`. */
  key: string
  /** Name shown on the row and in the legend. */
  label: string
  /** Any CSS colour for the group's blocks and legend swatch. */
  color: string
}

/** One day: the hours (0–23) each group was editing. Groups without an entry were idle. */
export type ActivityDay = {
  /** Day label, e.g. `Mon`. */
  label: string
  sessions: Partial<Record<string, number[]>>
}

/** A run of consecutive hours, drawn as one block. `end` is exclusive. */
export type HourRun = { start: number; end: number }
