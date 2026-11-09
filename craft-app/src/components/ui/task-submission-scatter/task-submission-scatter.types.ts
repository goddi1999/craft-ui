export type SubmissionStatus = 'early' | 'onTime' | 'late' | 'missing'

export type Submission = {
  /** Row label, e.g. `Group 1`. Must be unique. */
  group: string
  /** Local ISO timestamp, e.g. `2026-03-19T14:23:00`. `null` when nothing was handed in. */
  submittedAt: string | null
}

/** A submission resolved against the due date and plotted on the time axis. */
export type PlottedSubmission = Submission & {
  status: SubmissionStatus
  /** Horizontal position in percent of the plot width. */
  x: number
}
