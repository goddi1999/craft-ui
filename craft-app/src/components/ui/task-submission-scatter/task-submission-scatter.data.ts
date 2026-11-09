import type { Submission } from './task-submission-scatter.types'

export const TASK_SUBMISSION_DUE = '2026-03-21T23:59:00'

export const TASK_SUBMISSION_SAMPLE: Submission[] = [
  { group: 'Group 1', submittedAt: '2026-03-19T14:23:00' },
  { group: 'Group 2', submittedAt: '2026-03-19T20:05:00' },
  { group: 'Group 3', submittedAt: '2026-03-20T09:41:00' },
  { group: 'Group 4', submittedAt: '2026-03-21T17:52:00' },
  { group: 'Group 5', submittedAt: '2026-03-21T22:31:00' },
  { group: 'Group 6', submittedAt: '2026-03-21T23:44:00' },
  { group: 'Group 7', submittedAt: '2026-03-22T01:18:00' },
  { group: 'Group 8', submittedAt: null },
]
