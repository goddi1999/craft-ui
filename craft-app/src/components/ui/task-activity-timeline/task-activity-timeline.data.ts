import type { ActivityDay, ActivityGroup } from './task-activity-timeline.types'

export const TASK_ACTIVITY_GROUPS: ActivityGroup[] = [
  { key: 'g1', label: 'Group 1', color: '#378ADD' },
  { key: 'g2', label: 'Group 2', color: '#1D9E75' },
  { key: 'g3', label: 'Group 3', color: '#EF9F27' },
  { key: 'g4', label: 'Group 4', color: '#D4537E' },
  { key: 'g5', label: 'Group 5', color: '#7F77DD' },
  { key: 'g6', label: 'Group 6', color: '#D85A30' },
  { key: 'g7', label: 'Group 7', color: '#639922' },
  { key: 'g8', label: 'Group 8', color: '#B4B2A9' },
]

export const TASK_ACTIVITY_DAYS: ActivityDay[] = [
  { label: 'Mon', sessions: { g1: [9, 10, 20], g2: [19, 20, 21], g4: [10, 15] } },
  { label: 'Tue', sessions: { g1: [20, 21], g2: [10, 15, 16], g5: [19, 20] } },
  {
    label: 'Wed',
    sessions: { g2: [16, 17], g3: [20, 21, 22], g4: [9, 20, 21], g6: [19, 20] },
  },
  {
    label: 'Thu',
    sessions: {
      g1: [19, 20, 21],
      g2: [11, 20, 21, 22],
      g5: [14, 19, 20],
      g7: [16, 17],
    },
  },
  {
    label: 'Fri',
    sessions: {
      g1: [18, 19, 20, 21],
      g2: [19, 20, 21, 22],
      g3: [20, 21, 22],
      g4: [15, 16, 19, 20],
      g6: [10, 20, 21],
      g7: [19, 20, 21, 22],
    },
  },
  {
    label: 'Sat',
    sessions: {
      g1: [10, 11, 19, 20, 21],
      g4: [14, 15, 16, 19, 20, 21],
      g5: [10, 11, 19, 20],
      g7: [11, 14, 19, 20, 21],
    },
  },
  {
    label: 'Sun',
    sessions: {
      g1: [19, 20, 21],
      g2: [9, 10, 11, 19, 20, 21, 22, 23],
      g3: [20, 21, 22, 23],
      g4: [18, 19, 20, 21, 22],
      g5: [19, 20, 21, 22],
      g6: [16, 19, 20, 21],
      g7: [19, 20, 21],
    },
  },
]
