import type { RadialSeries } from '@/components/ui/radial-dots'

export const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Runs by hour: scheduled jobs overnight, people during the working day.
const curve = (h: number, peak: number, width: number, height: number) =>
  height * Math.exp(-((h - peak) ** 2) / (2 * width ** 2))

export const HOURLY: RadialSeries[] = [
  {
    id: 'people',
    label: 'Started by people',
    values: HOURS.map((_, h) => Math.round(curve(h, 13, 3, 140))),
  },
  {
    id: 'scheduled',
    label: 'Scheduled',
    values: HOURS.map((_, h) =>
      Math.round(curve(h, 3, 1.4, 60) + curve(h, 21, 1.2, 70) + 4),
    ),
  },
  {
    id: 'retries',
    label: 'Retries',
    values: HOURS.map((_, h) => Math.round(curve(h, 14, 2.5, 30) + 2)),
  },
]

export const DAILY: RadialSeries[] = [
  { id: 'bot', label: 'Solved by bot', values: [820, 910, 880, 860, 740, 310, 260] },
  { id: 'human', label: 'Handed off', values: [140, 160, 150, 170, 120, 40, 30] },
  { id: 'spam', label: 'Spam', values: [60, 70, 55, 80, 90, 120, 110] },
]
