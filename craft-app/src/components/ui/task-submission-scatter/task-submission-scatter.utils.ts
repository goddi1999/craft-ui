import type {
  PlottedSubmission,
  Submission,
  SubmissionStatus,
} from './task-submission-scatter.types'

const HOUR = 3_600_000
const DAY = 24 * HOUR
/** Inset, in percent, so markers at the domain edges are not clipped. */
const EDGE = 3

export const STATUS_META: Record<
  SubmissionStatus,
  { label: string; color: string }
> = {
  early: { label: 'Early', color: '#1D9E75' },
  onTime: { label: 'On time', color: '#EF9F27' },
  late: { label: 'Late', color: '#E24B4A' },
  missing: { label: 'Not submitted', color: '#B4B2A9' },
}

export const STATUS_ORDER: SubmissionStatus[] = [
  'early',
  'onTime',
  'late',
  'missing',
]

const startOfDay = (time: number) => {
  const date = new Date(time)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

export function getStatus(
  submittedAt: string | null,
  due: number,
  earlyWindowHours: number,
): SubmissionStatus {
  if (submittedAt === null) return 'missing'
  const lead = due - new Date(submittedAt).getTime()
  if (lead > earlyWindowHours * HOUR) return 'early'
  if (lead >= 0) return 'onTime'
  return 'late'
}

/** Whole days that cover every submission and the due date. */
export function getDomain(submissions: Submission[], due: number) {
  const times = submissions
    .flatMap((item) => (item.submittedAt ? [new Date(item.submittedAt)] : []))
    .map((date) => date.getTime())
    .concat(due)
  return {
    start: startOfDay(Math.min(...times)),
    end: startOfDay(Math.max(...times)) + DAY,
  }
}

export function toX(time: number, start: number, end: number) {
  return EDGE + ((time - start) / (end - start)) * (100 - EDGE * 2)
}

/** Midnight of every day inside the domain. */
export function getDayTicks(start: number, end: number) {
  const ticks: number[] = []
  for (let time = start; time <= end; time += DAY) ticks.push(time)
  return ticks
}

export function plot(
  submissions: Submission[],
  due: number,
  earlyWindowHours: number,
): { points: PlottedSubmission[]; start: number; end: number } {
  const { start, end } = getDomain(submissions, due)
  const points = submissions.map((item) => ({
    ...item,
    status: getStatus(item.submittedAt, due, earlyWindowHours),
    x: item.submittedAt
      ? toX(new Date(item.submittedAt).getTime(), start, end)
      : toX(start, start, end),
  }))
  return { points, start, end }
}
