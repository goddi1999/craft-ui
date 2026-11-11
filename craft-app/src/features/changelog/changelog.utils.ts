import type { ChangelogEntry, ChangelogMonth } from './changelog.types'

const monthFormat = new Intl.DateTimeFormat('en', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})
const shortFormat = new Intl.DateTimeFormat('en', {
  month: 'short',
  timeZone: 'UTC',
})
const dayFormat = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})

const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`)

/** `2026-11-11` → `Nov 11` */
export const formatDay = (iso: string) => dayFormat.format(toDate(iso))

export const countComponents = (entries: ChangelogEntry[]) =>
  entries.reduce((sum, entry) => sum + entry.components.length, 0)

/** Groups newest-first entries into newest-first months. */
export function groupByMonth(entries: ChangelogEntry[]): ChangelogMonth[] {
  const months = new Map<string, ChangelogEntry[]>()
  for (const entry of entries) {
    const key = entry.date.slice(0, 7)
    months.set(key, [...(months.get(key) ?? []), entry])
  }
  return [...months].map(([key, list]) => {
    const date = toDate(`${key}-01`)
    return {
      key,
      label: monthFormat.format(date),
      short: shortFormat.format(date),
      entries: list,
      count: countComponents(list),
    }
  })
}
