import type { EditingHeatmapDay } from './task-editing-heatmap.types'

/** One week of edits on the task "Wundheilung Phasen". */
export const TASK_EDITING_SAMPLE: EditingHeatmapDay[] = [
  { label: 'Mon', edits: { 9: 1, 10: 1, 19: 2, 20: 3 } },
  { label: 'Tue', edits: { 10: 1, 15: 2, 20: 4, 21: 3 } },
  { label: 'Wed', edits: { 9: 1, 16: 2, 17: 3, 20: 5, 21: 4, 22: 2 } },
  { label: 'Thu', edits: { 11: 1, 14: 1, 19: 3, 20: 6, 21: 5, 22: 3 } },
  {
    label: 'Fri',
    edits: { 10: 1, 15: 2, 16: 3, 18: 4, 19: 8, 20: 10, 21: 8, 22: 5 },
  },
  {
    label: 'Sat',
    edits: { 10: 3, 11: 4, 14: 2, 15: 3, 16: 4, 19: 7, 20: 9, 21: 6 },
  },
  {
    label: 'Sun',
    edits: {
      9: 2,
      10: 3,
      11: 2,
      14: 1,
      16: 2,
      18: 4,
      19: 14,
      20: 16,
      21: 12,
      22: 7,
      23: 3,
    },
  },
]
