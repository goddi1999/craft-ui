import type { Slot } from '@/components/ui/slot-picker'

const DAY_COUNT = 5
const TIMES = ['09:30', '11:00', '14:30', '16:00']

const pad = (n: number) => String(n).padStart(2, '0')
const day = (d: number) => `2026-11-${pad(9 + d)}`
const end = (t: string) => {
  const m = Number(t.slice(0, 2)) * 60 + Number(t.slice(3)) + 30
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`
}

// Mon to Fri, four 30-minute slots a day, a few already taken.
const BUSY = new Set(['0-0', '1-2', '2-1', '2-3', '3-0', '4-2'])

export const SLOTS: Slot[] = Array.from({ length: DAY_COUNT }, (_, d) =>
  TIMES.map((t, i) => ({
    id: `${d}-${i}`,
    day: day(d),
    start: t,
    end: end(t),
    busy: BUSY.has(`${d}-${i}`),
    suggested: `${d}-${i}` === '1-3',
  })),
).flat()

export const TIME_ZONE = { label: 'Lisbon (UTC+0)', offset: 0 }
export const ATTENDEE_ZONE = { label: 'New York (UTC−5)', offset: -5 }
