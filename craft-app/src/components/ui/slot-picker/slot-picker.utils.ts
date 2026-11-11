// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
const pad = (n: number) => String(n).padStart(2, '0')

export const minutes = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3))

/** Shift an "HH:MM" time by whole hours, wrapping around midnight. */
export const shift = (t: string, hours: number) => {
  const m = (minutes(t) + hours * 60 + 1440) % 1440
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`
}

export const dayDate = (day: string) => new Date(`${day}T00:00:00`)

export const weekday = (day: string) =>
  dayDate(day).toLocaleDateString('en-US', { weekday: 'short' })

export const dayLabel = (day: string) =>
  dayDate(day).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
